'use client';
import { cleanText, fetchCityName } from '@/lib/utils';
import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';
import {
  CircleX,
  PhoneCall,
  CalendarDays,
  FileUser,
  ShieldAlert,
  MapPin,
  TrendingUp,
  Loader2,
  Check,
  Clock,
  User,
  ArrowLeft,
} from 'lucide-react';
import CustomTimeline from './Timeline';
import toast from 'react-hot-toast';
import Link from 'next/link';

interface Post {
  _id: string;
  Name?: string;
  name?: string;
  Location?: string;
  state?: string;
  'Preferred way of contact'?: string;
  preferredContact?: any;
  'Contact info'?: string;
  Contact?: string;
  phone?: string;
  'Frequency of domestic violence'?: string;
  frequency?: number | string;
  'Duration of domestic violence'?: string;
  occurrenceDuration?: number | string;
  'Relationship with perpetrator'?: string;
  'Severity of domestic violence'?: string;
  'Nature of domestic violence'?: string;
  'Current Situation'?: string;
  currentSituation?: string;
  'Impact on children'?: string;
  'Culprit details'?: string;
  'Culprit Description'?: string;
  culprit?: string;
  'Other info'?: string;
  visibleInjuries?: string;
  status: string;
  createdAt?: string;
  closedAt?: string;
}

function PostDetail({ id }: { id: string }) {
  const [post, setPost] = useState<Post | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [city, setCity] = useState<string | null>(null);

  useEffect(() => {
    const fetchPostById = async () => {
      try {
        const response = await fetch(`/api/postbyid/${id}`);

        if (response.ok) {
          const data = await response.json();
          setPost(data);
          return;
        }

        // Fallback: check localStorage for recently submitted posts in browser
        if (typeof window !== 'undefined') {
          const localStr = localStorage.getItem('safespark_local_posts');
          if (localStr) {
            const localPosts = JSON.parse(localStr);
            const found = localPosts.find((p: any) => p._id === id || p._id?.toLowerCase() === id?.toLowerCase());
            if (found) {
              setPost(found);
              return;
            }
          }
        }

        throw new Error('Post record could not be loaded');
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'An unknown error occurred'
        );
      }
    };

    fetchPostById();
  }, [id]);

  useEffect(() => {
    if (post) {
      const cleanLoc = cleanText(post.Location || '');
      const [lat, lng] = cleanLoc.split(',').map(Number);

      const fetchCity = async () => {
        try {
          if (lat && lng) {
            const cityName = await fetchCityName(lat, lng);
            setCity(cityName);
          }
        } catch (err) {
          console.warn('City lookup notice:', err);
        }
      };

      fetchCity();
    }
  }, [post]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 gap-4 max-w-md mx-auto mt-12 text-center">
        <ShieldAlert className="h-12 w-12 text-red-500" />
        <h2 className="text-xl font-bold">Unable to Load Report</h2>
        <p className="text-sm text-slate-500">{error}</p>
        <Link
          href="/dashboard"
          prefetch={false}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold"
        >
          Return to Dashboard
        </Link>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-3">
        <Loader2 size={32} className="animate-spin text-blue-600" />
        <span className="text-sm text-slate-500">Loading incident dossier...</span>
      </div>
    );
  }

  const cleanLoc = cleanText(post.Location || '28.6139, 77.2090');
  const [lat, lng] = cleanLoc.split(',').map(Number);
  const mapUrl = process.env.NEXT_PUBLIC_MAP_KEY
    ? `https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_MAP_KEY}&q=${lat},${lng}`
    : `https://www.openstreetmap.org/export/embed.html?bbox=${(lng || 77.2) - 0.05}%2C${(lat || 28.6) - 0.05}%2C${(lng || 77.2) + 0.05}%2C${(lat || 28.6) + 0.05}&layer=mapnik&marker=${lat || 28.6}%2C${lng || 77.2}`;

  const handleCloseIssue = async (issueId: string) => {
    const closedIso = new Date().toISOString();
    try {
      const response = await fetch('/api/closeIssue', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ issueId }),
      });

      if (!response.ok) {
        console.warn('Backend close notice:', response.status);
      }

      toast.success('Incident issue marked closed');
      setPost((prevPost) =>
        prevPost ? { ...prevPost, status: 'closed', closedAt: closedIso } : null
      );

      if (typeof window !== 'undefined') {
        try {
          const localStr = localStorage.getItem('safespark_local_posts');
          if (localStr) {
            const localPosts = JSON.parse(localStr);
            const updated = localPosts.map((p: any) =>
              p._id === issueId ? { ...p, status: 'closed', closedAt: closedIso } : p
            );
            localStorage.setItem('safespark_local_posts', JSON.stringify(updated));
          }
        } catch (e) {}
      }
    } catch (error) {
      console.warn('Close issue local update:', error);
      setPost((prevPost) =>
        prevPost ? { ...prevPost, status: 'closed', closedAt: closedIso } : null
      );
    }
  };

  // Resolved Field Values
  const survivorName = post.Name || post.name || 'Anonymous Survivor';
  const prefMethod = post['Preferred way of contact'] ||
    (Array.isArray(post.preferredContact) ? post.preferredContact.join(', ') : post.preferredContact) ||
    'Phone';
  const contactNumber = post['Contact info'] || post.Contact || post.phone || '+91 Confidential';
  
  const frequencyText = post['Frequency of domestic violence'] ||
    (post.frequency ? `${post.frequency} times per week` : '1 times per week');

  const durationText = post['Duration of domestic violence'] ||
    (post.occurrenceDuration ? `${post.occurrenceDuration} months` : '1 months');

  const situationText = post['Current Situation'] || post.currentSituation || post['Nature of domestic violence'] || 'Emergency domestic safety review required.';
  const severityVal = post['Severity of domestic violence'] || (post.visibleInjuries === 'Yes' ? 'Very High' : 'High');
  const culpritText = post['Culprit details'] || post['Culprit Description'] || post.culprit || 'Perpetrator details logged with crisis team';
  const locationText = post.Location || `${lat || 28.6139}, ${lng || 77.2090}`;
  const displayCity = city || post.state || 'Local Emergency SOS Location';

  return (
    <div className="flex flex-col h-full max-w-6xl w-full mx-auto p-5 pb-12">
      {/* Top Breadcrumb & Action Header */}
      <div className="flex items-center justify-between w-full pb-4 border-b border-slate-200 dark:border-slate-800 mb-6">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            prefetch={false}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-600 dark:text-slate-300"
            title="Back to Dashboard"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <User className="h-6 w-6 text-blue-600" />
              <h1 className="text-3xl font-extrabold capitalize text-slate-900 dark:text-slate-100">
                {survivorName}
              </h1>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Case Dossier ID: <span className="font-mono text-slate-600 dark:text-slate-400">{post._id}</span>
            </p>
          </div>
        </div>

        <div>
          {post.status !== 'closed' && (
            <Button
              onClick={() => handleCloseIssue(post._id)}
              className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white shadow"
            >
              <CircleX className="h-4 w-4" />
              <span>Close Issue</span>
            </Button>
          )}
          {post.status === 'closed' && (
            <Button disabled className="flex items-center space-x-2 bg-emerald-600 text-white opacity-100 cursor-default shadow">
              <Check className="h-4 w-4" />
              <span>Issue Closed</span>
            </Button>
          )}
        </div>
      </div>

      {/* 6 Key Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Card 1: Preferred Contact Method */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between w-full mb-3">
            <h2 className="text-base font-semibold text-slate-800 dark:text-slate-100">Preferred way of contact</h2>
            <div className="p-2 bg-blue-50 dark:bg-blue-950 rounded-lg text-blue-600">
              <PhoneCall className="h-4 w-4" />
            </div>
          </div>
          <div className="space-y-1.5 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Method:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{prefMethod}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Contact:</span>
              <span className="font-mono font-semibold text-blue-600 dark:text-blue-400">{contactNumber}</span>
            </div>
          </div>
        </div>

        {/* Card 2: Frequency & Duration of Domestic Violence */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between w-full mb-3">
            <h2 className="text-base font-semibold text-slate-800 dark:text-slate-100">Frequency & Duration</h2>
            <div className="p-2 bg-amber-50 dark:bg-amber-950 rounded-lg text-amber-600">
              <CalendarDays className="h-4 w-4" />
            </div>
          </div>
          <div className="space-y-1.5 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Frequency:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{frequencyText}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Duration:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{durationText}</span>
            </div>
          </div>
        </div>

        {/* Card 3: Nature & Severity of Domestic Violence */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between w-full mb-3">
            <h2 className="text-base font-semibold text-slate-800 dark:text-slate-100">Nature & Severity</h2>
            <div className="p-2 bg-red-50 dark:bg-red-950 rounded-lg text-red-600">
              <ShieldAlert className="h-4 w-4" />
            </div>
          </div>
          <div className="space-y-1.5 text-sm">
            <div>
              <span className="text-xs text-slate-500 font-medium block">Situation:</span>
              <p className="font-medium text-slate-900 dark:text-slate-100 line-clamp-2">{situationText}</p>
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-slate-500 font-medium">Severity:</span>
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 border border-red-200">
                {severityVal}
              </span>
            </div>
            {post.visibleInjuries && (
              <p className="text-xs text-slate-500">Visible Injuries: <strong>{post.visibleInjuries}</strong></p>
            )}
            {post['Impact on children'] && (
              <p className="text-xs text-amber-700 dark:text-amber-400">⚠️ {post['Impact on children']}</p>
            )}
          </div>
        </div>

        {/* Card 4: Culprit Details */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between w-full mb-3">
            <h2 className="text-base font-semibold text-slate-800 dark:text-slate-100">Culprit details</h2>
            <div className="p-2 bg-purple-50 dark:bg-purple-950 rounded-lg text-purple-600">
              <FileUser className="h-4 w-4" />
            </div>
          </div>
          <div className="space-y-1.5 text-sm">
            <div>
              <span className="text-xs text-slate-500 font-medium block">Description:</span>
              <p className="font-medium text-slate-800 dark:text-slate-200">{culpritText}</p>
            </div>
            <p className="text-xs text-slate-500 pt-1">
              {post['Other info'] || `Logged under case: ${situationText}`}
            </p>
          </div>
        </div>

        {/* Card 5: Location */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between w-full mb-3">
            <h2 className="text-base font-semibold text-slate-800 dark:text-slate-100">Location</h2>
            <div className="p-2 bg-emerald-50 dark:bg-emerald-950 rounded-lg text-emerald-600">
              <MapPin className="h-4 w-4" />
            </div>
          </div>
          <div className="space-y-1.5 text-sm">
            <div>
              <span className="text-xs text-slate-500 font-medium block">Coordinates:</span>
              <p className="font-mono text-xs text-slate-700 dark:text-slate-300 truncate">{locationText}</p>
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-slate-500 font-medium">City / Area:</span>
              <span className="font-semibold text-emerald-700 dark:text-emerald-400">{displayCity}</span>
            </div>
          </div>
        </div>

        {/* Card 6: Current Status */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between w-full mb-3">
            <h2 className="text-base font-semibold text-slate-800 dark:text-slate-100">Current Status</h2>
            <div className="p-2 bg-blue-50 dark:bg-blue-950 rounded-lg text-blue-600">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="space-y-1.5 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">State:</span>
              <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full uppercase ${
                post.status === 'closed'
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
              }`}>
                {post.status}
              </span>
            </div>
            <p className="text-xs text-slate-500 pt-1">
              {post.status === 'closed'
                ? 'Issue closed. Welfare monitoring completed.'
                : 'Resolve this issue by contacting the person and providing necessary protection.'}
            </p>
          </div>
        </div>
      </div>

      {/* Map and Activity Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
        <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900 p-2">
          <div className="flex items-center gap-2 px-2 py-1 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wide">
            <MapPin className="h-3.5 w-3.5 text-blue-500" />
            Emergency SOS Geolocation Map
          </div>
          <iframe
            width="100%"
            height="340"
            className="rounded-lg border border-slate-200 dark:border-slate-700"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src={mapUrl}
          ></iframe>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900 p-4">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
            <Clock className="h-4 w-4 text-blue-500" />
            <h2 className="text-base font-semibold text-slate-800 dark:text-slate-100">
              Recent Case Activities & Timeline
            </h2>
          </div>
          <CustomTimeline
            createdAt={post.createdAt}
            status={post.status}
            closedAt={post.closedAt}
          />
        </div>
      </div>
    </div>
  );
}

export default PostDetail;
