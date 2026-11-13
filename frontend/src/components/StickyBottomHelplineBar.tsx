'use client';

import React, { useState } from 'react';
import { Phone, Download, Check, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

export default function StickyBottomHelplineBar() {
  const [copied, setCopied] = useState(false);

  const saveHelplines = () => {
    const text = `SafeSpark Emergency Contacts (India):
- 112: National Emergency Police
- 1091: Women Helpline (24/7)
- 181: Women in Distress / Domestic Abuse
- 1930: National Cyber Crime Reporting
- 15100 / 14416: National Mental Health & Crisis Support
Confidential and Free Toll-Free Support`;

    // 1. Copy to clipboard
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }

    // 2. Download as a quick text file or vCard
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Emergency-Helplines-SafeSpark.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setCopied(true);
    toast.success('Helpline numbers saved to your device!', {
      style: {
        background: '#250714',
        color: '#FAF4EC',
        border: '1px solid rgba(245, 235, 225, 0.2)',
      },
      icon: undefined,
    });

    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="w-full bg-[#15030A] border-t border-[#F5EBE1]/15 text-[#FAF4EC] py-2.5 px-3 sm:px-6 relative z-30 shadow-2xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        {/* Left: Section Title */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-7 h-7 rounded-full bg-[#C0265D]/30 border border-[#FF7A90]/30 flex items-center justify-center text-[#FFA8B8] shrink-0">
            <Phone className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="font-bold text-[#FAF4EC] block leading-tight text-xs sm:text-[13px]">
              Helplines at Your Fingertips
            </span>
            <span className="text-[10px] text-[#E8D7C3]/65 block leading-tight">
              In immediate danger? Reach out now.
            </span>
          </div>
        </div>

        {/* Center: List of Clickable Helplines */}
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap justify-center font-mono text-[11px] sm:text-xs">
          <a
            href="tel:112"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#250714] hover:bg-[#3D0B20] border border-[#F5EBE1]/15 text-[#FAF4EC] transition-all hover:scale-105 active:scale-95 shadow-sm"
            title="112 All-India Emergency Police"
          >
            <Phone className="w-3 h-3 text-[#FF7A90]" />
            <span className="font-bold text-[#FFA8B8]">112</span>
            <span className="text-[10px] text-[#FAF4EC]/75 font-sans">Emergency</span>
          </a>

          <a
            href="tel:1091"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#250714] hover:bg-[#3D0B20] border border-[#F5EBE1]/15 text-[#FAF4EC] transition-all hover:scale-105 active:scale-95 shadow-sm"
            title="1091 National Women Helpline"
          >
            <Phone className="w-3 h-3 text-[#FF7A90]" />
            <span className="font-bold text-[#FFA8B8]">1091</span>
            <span className="text-[10px] text-[#FAF4EC]/75 font-sans">Women Helpline</span>
          </a>

          <a
            href="tel:181"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#250714] hover:bg-[#3D0B20] border border-[#F5EBE1]/15 text-[#FAF4EC] transition-all hover:scale-105 active:scale-95 shadow-sm"
            title="181 Women in Distress"
          >
            <Phone className="w-3 h-3 text-[#FF7A90]" />
            <span className="font-bold text-[#FFA8B8]">181</span>
            <span className="text-[10px] text-[#FAF4EC]/75 font-sans">Women in Distress</span>
          </a>

          <a
            href="tel:1930"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#250714] hover:bg-[#3D0B20] border border-[#F5EBE1]/15 text-[#FAF4EC] transition-all hover:scale-105 active:scale-95 shadow-sm"
            title="1930 National Cyber Crime Helpline"
          >
            <Phone className="w-3 h-3 text-[#FF7A90]" />
            <span className="font-bold text-[#FFA8B8]">1930</span>
            <span className="text-[10px] text-[#FAF4EC]/75 font-sans">Cyber Crime</span>
          </a>

          <a
            href="tel:15100"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#250714] hover:bg-[#3D0B20] border border-[#F5EBE1]/15 text-[#FAF4EC] transition-all hover:scale-105 active:scale-95 shadow-sm"
            title="15100 NALSA Free Legal Aid"
          >
            <Phone className="w-3 h-3 text-[#FF7A90]" />
            <span className="font-bold text-[#FFA8B8]">15100</span>
            <span className="text-[10px] text-[#FAF4EC]/75 font-sans">Mental Health</span>
          </a>
        </div>

        {/* Right: Save Numbers Button */}
        <button
          onClick={saveHelplines}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#B0164E] to-[#C32F6E] hover:brightness-110 text-[#FAF4EC] text-xs font-bold shadow-md shadow-[#C0265D]/30 border border-[#F5EBE1]/20 transition-all hover:scale-105 active:scale-95 shrink-0"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-300" />
              <span>Saved!</span>
            </>
          ) : (
            <>
              <Download className="w-3.5 h-3.5" />
              <span>Save Numbers</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

