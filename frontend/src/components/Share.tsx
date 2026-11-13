'use client';
import React, { useState } from 'react';
import { Button } from './ui/button';
import { ShareIcon, CheckCircle2, Loader2, ShieldAlert, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';

interface ShareProps {
  imageURL: string;
  resText: string;
  setShared: (shared: boolean) => void;
  formData?: any;
}

function Share({ imageURL, resText, setShared, formData }: ShareProps) {
  const [encodedImage, setEncodedImage] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [savedPost, setSavedPost] = useState<any>(null);

  const handleCommonFunction = async () => {
    try {
      setSubmitting(true);

      // 1. Get stored form data if not directly provided in props
      let reportData = formData;
      if (!reportData && typeof window !== 'undefined') {
        const stored = sessionStorage.getItem('safespark_current_report');
        if (stored) {
          try {
            reportData = JSON.parse(stored);
          } catch (e) {
            console.warn('Session parse note:', e);
          }
        }
      }
      reportData = reportData || {};

      // 2. Encode image URL
      let encImg = encodedImage;
      if (!encImg) {
        try {
          const encodeImage = await axios.post('/api/decompose', {
            resImage: imageURL,
          });
          encImg = encodeImage.data?.encodedImage || imageURL;
          setEncodedImage(encImg);
        } catch (e) {
          encImg = imageURL;
        }
      }

      // 3. Decompose and structure report
      let decomposedData: any = {};
      try {
        const decomposeReq = await axios.post('/api/decompose', {
          resText: resText,
          name: reportData.name,
          phone: reportData.phone,
          location: reportData.location,
          currentSituation: reportData.currentSituation,
          culprit: reportData.culprit,
        });
        decomposedData = decomposeReq.data?.decomposed || {};
      } catch (e) {
        console.warn('Decompose error, using fallback:', e);
      }

      // 4. Resolve exact Name and Location
      const victimName = 
        (reportData.name && reportData.name !== 'Survivor Report') 
          ? reportData.name 
          : (decomposedData.Name && decomposedData.Name !== 'Survivor Report' 
              ? decomposedData.Name 
              : 'Anonymous Survivor');

      const locString = reportData.location && (reportData.location.lat || reportData.location.lng)
        ? `${reportData.location.lat}, ${reportData.location.lng}`
        : (decomposedData.Location || '28.6139, 77.2090');

      const dataToSave = {
        _id: 'post_' + Date.now(),
        Name: victimName,
        name: victimName,
        Location: locString,
        state: decomposedData.state || 'Emergency SOS Location',
        'Severity of domestic violence': decomposedData['Severity of domestic violence'] || 'High',
        'Nature of domestic violence': decomposedData['Nature of domestic violence'] || 'Domestic Violence Incident',
        Contact: reportData.phone || decomposedData.Contact || '+91 Confidential',
        'Current Situation': reportData.currentSituation || decomposedData['Current Situation'] || resText,
        'Culprit Description': reportData.culprit || decomposedData['Culprit Description'] || 'Details recorded',
        status: 'pending',
        imageURL: encImg || imageURL,
      };

      // 5. Save to Server
      await axios.post('/api/save', dataToSave);

      // 6. Also store in browser localStorage so Dashboard displays it instantly
      if (typeof window !== 'undefined') {
        try {
          const existingLocal = JSON.parse(localStorage.getItem('safespark_local_posts') || '[]');
          localStorage.setItem('safespark_local_posts', JSON.stringify([dataToSave, ...existingLocal]));
        } catch (err) {
          console.warn('Local storage save notice:', err);
        }
      }

      setSavedPost(dataToSave);
      setSaveSuccess(true);
      setSubmitting(false);
      return dataToSave;
    } catch (err) {
      console.warn('Save notice:', err);
      setSubmitting(false);
      return null;
    }
  };

  const handleShareTelegram = async () => {
    await handleCommonFunction();
    const shareImg = encodedImage || imageURL;
    const telegramShareUrl = `https://t.me/share/url?url=${encodeURIComponent(shareImg)}`;
    window.open(telegramShareUrl, '_blank');
    setShared(true);
  };

  const handleShareTwitter = async () => {
    await handleCommonFunction();
    const shareImg = encodedImage || imageURL;
    const twitterShareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareImg)}`;
    window.open(twitterShareUrl, '_blank');
    setShared(true);
  };

  const handleShareInstagram = async () => {
    await handleCommonFunction();
    window.open('https://instagram.com', '_blank');
    setShared(true);
  };

  const handleShareSlack = async () => {
    await handleCommonFunction();
    window.open('https://slack.com', '_blank');
    setShared(true);
  };

  return (
    <div className="flex flex-col items-center gap-6 max-w-2xl mx-auto w-full py-4">
      {/* Generated Steganographic Image */}
      <div className="relative w-full max-w-[420px] aspect-square rounded-2xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900">
        <Image
          src={imageURL}
          alt="Generated Steganographic Emergency Image"
          fill
          sizes="(max-width: 768px) 100vw, 420px"
          priority
          className="object-cover"
        />
      </div>

      {/* Primary Action: Direct Submit & Save */}
      <div className="w-full flex flex-col items-center gap-3">
        <Button
          size="lg"
          className="w-full max-w-md bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-6 text-base shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 rounded-xl"
          disabled={submitting || saveSuccess}
          onClick={async () => {
            await handleCommonFunction();
            setShared(true);
          }}
        >
          {submitting ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Saving Incident to Dashboard...
            </>
          ) : saveSuccess ? (
            <>
              <CheckCircle2 className="h-5 w-5" />
              Saved Successfully to Dashboard!
            </>
          ) : (
            <>
              <ShieldAlert className="h-5 w-5" />
              Submit & Save Incident to Dashboard
            </>
          )}
        </Button>

        {saveSuccess && (
          <div className="flex flex-col items-center gap-2 mt-2 p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl w-full max-w-md text-center animate-in fade-in duration-300">
            <p className="text-sm text-emerald-800 dark:text-emerald-200 font-medium">
              Incident filed under <strong>{savedPost?.Name || 'your report'}</strong>
            </p>
            <Link
              href="/dashboard"
              prefetch={false}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow transition-all duration-150"
            >
              View on Live Dashboard
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>

      {/* Social Media Discreet Sharing Options */}
      <div className="w-full flex flex-col items-center gap-2">
        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
          Or discreetly share via social platforms:
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 w-full">
          <Button
            variant="outline"
            className="flex items-center gap-2 hover:bg-blue-50 dark:hover:bg-blue-950 border-blue-200"
            onClick={handleShareTelegram}
            disabled={submitting}
          >
            <ShareIcon className="h-4 w-4 text-blue-500" />
            Telegram
          </Button>

          <Button
            variant="outline"
            className="flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800"
            onClick={handleShareTwitter}
            disabled={submitting}
          >
            <ShareIcon className="h-4 w-4" />
            X (Twitter)
          </Button>

          <Button
            variant="outline"
            className="flex items-center gap-2 hover:bg-pink-50 dark:hover:bg-pink-950 border-pink-200"
            onClick={handleShareInstagram}
            disabled={submitting}
          >
            <ShareIcon className="h-4 w-4 text-pink-500" />
            Instagram
          </Button>

          <Button
            variant="outline"
            className="flex items-center gap-2 hover:bg-purple-50 dark:hover:bg-purple-950 border-purple-200"
            onClick={handleShareSlack}
            disabled={submitting}
          >
            <ShareIcon className="h-4 w-4 text-purple-600" />
            Slack
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Share;
