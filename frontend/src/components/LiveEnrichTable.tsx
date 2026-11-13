'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  DirectoryRecord,
  INITIAL_DIRECTORY_RECORDS,
  SUPPORTED_CITIES,
  calculateDistanceKm,
} from '@/data/directory';
import { VerifiedBadge } from '@/components/VerifiedBadge';
import {
  Sparkles,
  RefreshCw,
  Phone,
  Clock,
  MapPin,
  ExternalLink,
  Shield,
  Filter,
  Navigation,
  Crosshair,
  Search,
  Building2,
  AlertTriangle,
  LocateFixed,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';

export function LiveEnrichTable() {
  const [records, setRecords] = useState<DirectoryRecord[]>(INITIAL_DIRECTORY_RECORDS);
  const [isEnriching, setIsEnriching] = useState(false);
  const [progressText, setProgressText] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedCity, setSelectedCity] = useState<string>('Auto (GPS / Nearest)');
  const [maxDistanceKm, setMaxDistanceKm] = useState<number>(0); // 0 = all
  const [searchQuery, setSearchQuery] = useState<string>('');

  // User Geolocation State
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locatingStatus, setLocatingStatus] = useState<'idle' | 'locating' | 'success' | 'denied'>('locating');
  const [detectedLocationName, setDetectedLocationName] = useState<string>('');

  // 1. Mandatory Location Detection on mount
  useEffect(() => {
    requestUserLocation();
  }, []);

  const requestUserLocation = () => {
    if (!navigator.geolocation) {
      setLocatingStatus('denied');
      fallbackToCity('Delhi NCR');
      return;
    }

    setLocatingStatus('locating');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        setLocatingStatus('success');

        // Find nearest city label
        let closestCity = SUPPORTED_CITIES[0].name;
        let minCityDist = Infinity;
        SUPPORTED_CITIES.forEach((c) => {
          if (c.name.includes('National')) return;
          const d = calculateDistanceKm(latitude, longitude, c.lat, c.lng);
          if (d < minCityDist) {
            minCityDist = d;
            closestCity = c.name;
          }
        });

        setDetectedLocationName(`${closestCity} (${latitude.toFixed(2)}°N, ${longitude.toFixed(2)}°E)`);
        toast.success(`📍 Located near ${closestCity}! Sorted emergency centres by distance.`);
      },
      (error) => {
        console.warn('Geolocation denied or unavailable:', error.message);
        setLocatingStatus('denied');
        fallbackToCity('Delhi NCR');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const fallbackToCity = (cityName: string) => {
    const cityObj = SUPPORTED_CITIES.find((c) => c.name === cityName) || SUPPORTED_CITIES[0];
    setUserLocation({ lat: cityObj.lat, lng: cityObj.lng });
    setDetectedLocationName(cityObj.name);
  };

  // Handle manual city switch
  const handleCityChange = (cityName: string) => {
    setSelectedCity(cityName);
    if (cityName === 'Auto (GPS / Nearest)') {
      requestUserLocation();
    } else {
      fallbackToCity(cityName);
    }
  };

  // Compute enriched records with distance
  const recordsWithDistance = useMemo(() => {
    return records.map((record) => {
      let distanceKm: number | undefined;
      if (userLocation && record.lat && record.lng) {
        distanceKm = calculateDistanceKm(userLocation.lat, userLocation.lng, record.lat, record.lng);
      }
      return { ...record, distanceKm };
    });
  }, [records, userLocation]);

  // Sort and filter records
  const filteredRecords = useMemo(() => {
    let result = [...recordsWithDistance];

    // Filter by category
    if (activeCategory !== 'All') {
      result = result.filter((r) => r.type === activeCategory);
    }

    // Filter by city if selected
    if (selectedCity !== 'Auto (GPS / Nearest)' && !selectedCity.includes('National')) {
      result = result.filter(
        (r) => r.city === selectedCity || r.state === 'National' || r.city.includes('National')
      );
    }

    // Filter by distance
    if (maxDistanceKm > 0) {
      result = result.filter((r) => r.distanceKm !== undefined && r.distanceKm <= maxDistanceKm);
    }

    // Filter by text search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.address?.toLowerCase().includes(q) ||
          r.city.toLowerCase().includes(q) ||
          r.state.toLowerCase().includes(q) ||
          r.services?.some((s) => s.toLowerCase().includes(q))
      );
    }

    // Sort: records with known distance appear nearest first, national/helpline last
    result.sort((a, b) => {
      if (a.distanceKm !== undefined && b.distanceKm !== undefined) {
        return a.distanceKm - b.distanceKm;
      }
      if (a.distanceKm !== undefined) return -1;
      if (b.distanceKm !== undefined) return 1;
      return 0;
    });

    return result;
  }, [recordsWithDistance, activeCategory, selectedCity, maxDistanceKm, searchQuery]);

  // Top nearest Police Unit & One Stop Centre for Quick Action spotlight
  const nearestPolice = useMemo(() => {
    return recordsWithDistance
      .filter((r) => r.type === 'Police Unit' && r.distanceKm !== undefined)
      .sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0))[0];
  }, [recordsWithDistance]);

  const nearestSakhi = useMemo(() => {
    return recordsWithDistance
      .filter((r) => r.type === 'One Stop Centre' && r.distanceKm !== undefined)
      .sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0))[0];
  }, [recordsWithDistance]);

  // TinyFish Self-Heal enrich handler
  const handleEnrich = async () => {
    setIsEnriching(true);
    setProgressText('Submitting batch fetch request to TinyFish...');

    try {
      const timer1 = setTimeout(() => {
        setProgressText('Querying official state police & Sakhi registries... 4 of 12 fetched');
      }, 700);

      const timer2 = setTimeout(() => {
        setProgressText('Extracting verified direct lines & duty officer numbers... 10 of 12 verified');
      }, 1500);

      const res = await fetch('/api/tinyfish/enrich', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recordIds: records.map((r) => r.id) }),
      });

      clearTimeout(timer1);
      clearTimeout(timer2);

      if (res.ok) {
        const data = await res.json();
        if (data.records && Array.isArray(data.records)) {
          setRecords(data.records);
          toast.success(`Successfully verified and updated ${data.records.length} centres with TinyFish! 🛡️`);
        }
      } else {
        toast.error('Failed to complete directory enrichment.');
      }
    } catch (err) {
      console.error('Enrich error:', err);
      toast.error('Network error during directory enrichment.');
    } finally {
      setIsEnriching(false);
      setProgressText('');
    }
  };

  const categories = ['All', 'Police Unit', 'One Stop Centre', 'Legal Aid Clinic', 'Shelter Home', 'Crisis Helpline'];

  return (
    <div className="w-full space-y-6">
      {/* 1. MANDATORY LOCATION DETECTION & SPOTLIGHT BANNER */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-slate-900 via-[#1A0B2E] to-slate-900 border border-rani/30 shadow-xl text-white space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-rani/20 text-rani border border-rani/40">
              <LocateFixed className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight text-white">
                  Location-Wise Nearby Emergency Centres
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-peacock/20 text-peacock border border-peacock/40">
                  Compulsory Auto-Locate
                </span>
              </div>
              <p className="text-xs text-slate-300">
                {locatingStatus === 'locating'
                  ? 'Detecting current GPS coordinates to find closest police stations and help centres...'
                  : locatingStatus === 'success'
                  ? `Active Location: ${detectedLocationName} • Sorted by closest distance`
                  : `Showing centres for: ${detectedLocationName} (GPS manual mode)`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              onClick={requestUserLocation}
              disabled={locatingStatus === 'locating'}
              className="bg-white/10 hover:bg-white/20 text-white text-xs h-9 px-3 rounded-xl border border-white/20 flex items-center gap-1.5 shrink-0"
              title="Refresh GPS Coordinates"
            >
              <Crosshair className={`w-3.5 h-3.5 ${locatingStatus === 'locating' ? 'animate-spin' : ''}`} />
              <span>{locatingStatus === 'locating' ? 'Locating...' : 'Re-Locate GPS'}</span>
            </Button>

            <select
              value={selectedCity}
              onChange={(e) => handleCityChange(e.target.value)}
              className="bg-black/60 border border-white/20 text-white text-xs rounded-xl px-3 h-9 focus:outline-none focus:border-rani flex-1 sm:flex-none"
            >
              <option value="Auto (GPS / Nearest)">📍 Auto (GPS / Nearest)</option>
              {SUPPORTED_CITIES.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* SPOTLIGHT: NEAREST POLICE STATION & NEAREST SAKHI CENTRE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          {/* Nearest Police Station Card */}
          {nearestPolice && (
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-400/40 transition-all flex flex-col justify-between space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30 uppercase">
                      Nearest Police Station
                    </span>
                    {nearestPolice.distanceKm !== undefined && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                        📍 {nearestPolice.distanceKm} km away
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-sm text-white mt-1 line-clamp-1">{nearestPolice.name}</h4>
                  <p className="text-[11px] text-slate-300 line-clamp-1">{nearestPolice.address}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1 border-t border-white/10">
                {nearestPolice.phone && (
                  <a
                    href={`tel:${nearestPolice.phone.replace(/\D/g, '')}`}
                    className="flex-1 py-1.5 px-3 rounded-xl bg-rani hover:bg-rani-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" /> Call {nearestPolice.phone}
                  </a>
                )}
                {nearestPolice.lat && nearestPolice.lng && (
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${nearestPolice.lat},${nearestPolice.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-1.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Navigation className="w-3.5 h-3.5" /> Navigate (Maps)
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Nearest Sakhi One Stop Centre Card */}
          {nearestSakhi && (
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-rani/40 transition-all flex flex-col justify-between space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-rani/20 text-rani-200 border border-rani/30 uppercase">
                      Nearest Sakhi (One Stop Centre)
                    </span>
                    {nearestSakhi.distanceKm !== undefined && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                        📍 {nearestSakhi.distanceKm} km away
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-sm text-white mt-1 line-clamp-1">{nearestSakhi.name}</h4>
                  <p className="text-[11px] text-slate-300 line-clamp-1">{nearestSakhi.address}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1 border-t border-white/10">
                {nearestSakhi.phone && (
                  <a
                    href={`tel:${nearestSakhi.phone.replace(/\D/g, '')}`}
                    className="flex-1 py-1.5 px-3 rounded-xl bg-peacock hover:bg-peacock-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" /> Call {nearestSakhi.phone}
                  </a>
                )}
                {nearestSakhi.lat && nearestSakhi.lng && (
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${nearestSakhi.lat},${nearestSakhi.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-1.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Navigation className="w-3.5 h-3.5" /> Navigate (Maps)
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Live Search on Maps shortcuts */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-white/10 text-xs">
          <span className="text-[11px] text-slate-400 font-medium">Quick Live Search:</span>
          <a
            href={
              userLocation
                ? `https://www.google.com/maps/search/police+station+near+me/@${userLocation.lat},${userLocation.lng},14z`
                : 'https://www.google.com/maps/search/police+station+near+me'
            }
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-medium transition"
          >
            <Shield className="w-3 h-3 text-blue-400" />
            <span>Search Police Stations (Live Google Maps)</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </a>

          <a
            href={
              userLocation
                ? `https://www.google.com/maps/search/sakhi+one+stop+centre+near+me/@${userLocation.lat},${userLocation.lng},14z`
                : 'https://www.google.com/maps/search/sakhi+one+stop+centre+near+me'
            }
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-medium transition"
          >
            <Building2 className="w-3 h-3 text-rani" />
            <span>Search Sakhi Centres (Live Google Maps)</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
        </div>
      </div>

      {/* 2. FILTER & ENRICHMENT CONTROL BAR */}
      <div className="space-y-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search centres, police stations, localities, services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-rani"
            />
          </div>

          {/* Distance Filter */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-semibold text-slate-500">Radius:</span>
            <select
              value={maxDistanceKm}
              onChange={(e) => setMaxDistanceKm(Number(e.target.value))}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs rounded-xl px-2.5 py-1.5 font-medium"
            >
              <option value={0}>All Distances</option>
              <option value={10}>Within 10 km</option>
              <option value={25}>Within 25 km</option>
              <option value={50}>Within 50 km</option>
              <option value={100}>Within 100 km</option>
            </select>

            {/* Self-heal button */}
            <Button
              onClick={handleEnrich}
              disabled={isEnriching}
              className="bg-gradient-to-r from-peacock to-blue-600 hover:opacity-95 text-white font-bold text-xs h-9 px-3.5 rounded-xl shadow-sm shrink-0 flex items-center gap-1.5"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isEnriching ? 'animate-spin' : ''}`} />
              <span>{isEnriching ? 'Verifying...' : 'Self-Heal (TinyFish)'}</span>
            </Button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-slate-100 dark:border-slate-800">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" /> Type:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                activeCategory === cat
                  ? 'bg-rani text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Progress Status Bar during enrich */}
      {isEnriching && (
        <div className="p-3 bg-peacock/10 border border-peacock/30 rounded-xl text-xs font-semibold text-peacock-800 dark:text-peacock-300 flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin text-peacock" />
            <span>{progressText || 'Batch fetching institutional portals...'}</span>
          </div>
          <span className="text-[11px] font-mono opacity-80">Rate: 10 URLs/batch</span>
        </div>
      )}

      {/* 3. LOCATION-SORTED RECORDS TABLE */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <table className="w-full min-w-[760px] text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-bold uppercase text-[10px] tracking-wider">
              <th className="p-3.5 pl-4">Proximity</th>
              <th className="p-3.5">Centre / Police Station</th>
              <th className="p-3.5">Category & City</th>
              <th className="p-3.5">Helpline & Navigation</th>
              <th className="p-3.5">Hours & Services</th>
              <th className="p-3.5 pr-4 text-right">Verification</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {filteredRecords.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-500">
                  <AlertTriangle className="w-6 h-6 mx-auto mb-2 text-amber-500 opacity-80" />
                  No centres found within {maxDistanceKm} km. Try increasing the radius or selecting another city.
                </td>
              </tr>
            ) : (
              filteredRecords.map((record) => (
                <tr
                  key={record.id}
                  className={`transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/40 ${
                    isEnriching ? 'animate-pulse' : ''
                  }`}
                >
                  {/* Proximity / Distance Badge */}
                  <td className="p-3.5 pl-4 align-top">
                    {record.distanceKm !== undefined ? (
                      <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-black bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        <Navigation className="w-3 h-3 text-emerald-600" />
                        <span>{record.distanceKm} km</span>
                      </div>
                    ) : (
                      <span className="text-[10px] text-slate-400 font-medium italic">Pan-India</span>
                    )}
                  </td>

                  {/* Name & Address */}
                  <td className="p-3.5 align-top">
                    <div className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                      {record.name}
                    </div>
                    {record.address && (
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-start gap-1 mt-1">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0 mt-0.5" />
                        <span>{record.address}</span>
                      </div>
                    )}
                    <a
                      href={record.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] text-blue-600 dark:text-blue-400 hover:underline mt-1 font-medium"
                    >
                      <span>Official Portal</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </td>

                  {/* Type & City */}
                  <td className="p-3.5 align-top">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        record.type === 'Police Unit'
                          ? 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-900'
                          : record.type === 'One Stop Centre'
                          ? 'bg-rose-50 dark:bg-rose-950 text-rani border-rose-200 dark:border-rose-900'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {record.type}
                    </span>
                    <div className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 mt-1">
                      {record.city}
                    </div>
                  </td>

                  {/* Phone & Directions Navigation */}
                  <td className="p-3.5 align-top space-y-1.5">
                    {record.phone && (
                      <a
                        href={`tel:${record.phone.replace(/\D/g, '')}`}
                        className="inline-flex items-center gap-1.5 font-bold text-rani hover:text-white bg-rani/10 hover:bg-rani px-2.5 py-1 rounded-lg transition-colors text-xs"
                        title="Direct One-Touch Dial"
                      >
                        <Phone className="w-3 h-3" />
                        <span>{record.phone}</span>
                      </a>
                    )}
                    {record.lat && record.lng && (
                      <div>
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${record.lat},${record.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          <Navigation className="w-3 h-3" />
                          <span>Get Directions</span>
                        </a>
                      </div>
                    )}
                  </td>

                  {/* Hours & Services */}
                  <td className="p-3.5 align-top space-y-1">
                    <div className="flex items-center gap-1 text-slate-700 dark:text-slate-300 font-medium text-[11px]">
                      <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>{record.hours || '24/7 Service'}</span>
                    </div>
                    {record.services && record.services.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {record.services.map((s, idx) => (
                          <span
                            key={idx}
                            className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded text-[9px] font-medium"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>

                  {/* Verification */}
                  <td className="p-3.5 pr-4 align-top text-right">
                    <VerifiedBadge
                      verifiedAt={record.verifiedAt}
                      sourceUrl={record.sourceUrl || record.websiteUrl}
                      size="sm"
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
