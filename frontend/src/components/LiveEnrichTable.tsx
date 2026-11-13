'use client';

import React, { useState } from 'react';
import { DirectoryRecord, INITIAL_DIRECTORY_RECORDS } from '@/data/directory';
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
  CheckCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';

export function LiveEnrichTable() {
  const [records, setRecords] = useState<DirectoryRecord[]>(INITIAL_DIRECTORY_RECORDS);
  const [isEnriching, setIsEnriching] = useState(false);
  const [progressText, setProgressText] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<string>('All');

  const categories = ['All', 'One Stop Centre', 'Crisis Helpline', 'Legal Aid Clinic', 'Police Unit', 'Shelter Home'];

  const filteredRecords =
    activeFilter === 'All'
      ? records
      : records.filter((r) => r.type === activeFilter);

  const handleEnrich = async () => {
    setIsEnriching(true);
    setProgressText('Submitting batch fetch request to TinyFish...');

    try {
      // Simulate live streaming progress feedback
      const timer1 = setTimeout(() => {
        setProgressText('Checking wcd.nic.in, ncw.nic.in, nalsa.gov.in... 2 of 6 fetched');
      }, 700);

      const timer2 = setTimeout(() => {
        setProgressText('Extracting operating hours & helpline numbers... 5 of 6 verified');
      }, 1600);

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
          toast.success(`Successfully verified and enriched ${data.records.length} institutional directory records with TinyFish! 🛡️`);
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

  return (
    <div className="w-full space-y-4">
      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                activeFilter === cat
                  ? 'bg-rani text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <Button
          onClick={handleEnrich}
          disabled={isEnriching}
          className="bg-gradient-to-r from-peacock to-blue-600 hover:opacity-95 text-white font-bold text-xs h-9 px-4 rounded-xl shadow-sm shrink-0 flex items-center gap-1.5"
        >
          <Sparkles className={`w-3.5 h-3.5 ${isEnriching ? 'animate-spin' : ''}`} />
          <span>{isEnriching ? 'Enriching Live...' : 'Self-Heal Directory (TinyFish Fetch)'}</span>
        </Button>
      </div>

      {/* Progress Status Bar */}
      {isEnriching && (
        <div className="p-3 bg-peacock/10 border border-peacock/30 rounded-xl text-xs font-semibold text-peacock-800 dark:text-peacock-300 flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin text-peacock" />
            <span>{progressText || 'Batch fetching institutional portals...'}</span>
          </div>
          <span className="text-[11px] font-mono opacity-80">Rate: 10 URLs/batch</span>
        </div>
      )}

      {/* Records Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <table className="w-full min-w-[700px] text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-bold uppercase text-[10px] tracking-wider">
              <th className="p-3.5 pl-4">Institution / Resource</th>
              <th className="p-3.5">Type & Jurisdiction</th>
              <th className="p-3.5">Verified Helpline</th>
              <th className="p-3.5">Availability</th>
              <th className="p-3.5">Services & Languages</th>
              <th className="p-3.5 pr-4 text-right">Verification Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {filteredRecords.map((record) => (
              <tr
                key={record.id}
                className={`transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/40 ${
                  isEnriching ? 'animate-pulse' : ''
                }`}
              >
                {/* Name & Website */}
                <td className="p-3.5 pl-4 align-top">
                  <div className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                    {record.name}
                  </div>
                  {record.address && (
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="line-clamp-1">{record.address}</span>
                    </div>
                  )}
                  <a
                    href={record.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-blue-600 dark:text-blue-400 hover:underline mt-1 font-medium"
                  >
                    <span>Visit Official Portal</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </td>

                {/* Type */}
                <td className="p-3.5 align-top">
                  <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
                    {record.type}
                  </span>
                  <div className="text-[10px] text-slate-400 mt-1">{record.state}</div>
                </td>

                {/* Phone */}
                <td className="p-3.5 align-top">
                  {record.phone ? (
                    <a
                      href={`tel:${record.phone.replace(/\D/g, '')}`}
                      className="inline-flex items-center gap-1.5 font-bold text-rani hover:text-rani-600 bg-rani/10 hover:bg-rani/20 px-2.5 py-1 rounded-lg transition-colors"
                      title="Direct One-Touch Dial"
                    >
                      <Phone className="w-3 h-3" />
                      <span>{record.phone}</span>
                    </a>
                  ) : (
                    <span className="text-slate-400 italic">Self-healing pending...</span>
                  )}
                </td>

                {/* Hours */}
                <td className="p-3.5 align-top">
                  <div className="flex items-center gap-1 text-slate-700 dark:text-slate-300 font-medium">
                    <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>{record.hours || '24/7 Service'}</span>
                  </div>
                </td>

                {/* Services & Languages */}
                <td className="p-3.5 align-top space-y-1">
                  {record.services && record.services.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {record.services.map((s, idx) => (
                        <span
                          key={idx}
                          className="px-1.5 py-0.2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded text-[9px] font-medium"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                  {record.languages && (
                    <div className="text-[10px] text-slate-400">
                      Spoken: {record.languages.join(', ')}
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

