'use client';

import { useEffect, useRef, useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { profile } from '@/data/portfolio';
import { useT } from '@/i18n/provider';

/**
 * One-tap "copy email" micro-interaction. Uses the async Clipboard API with a
 * legacy execCommand fallback (older browsers / non-secure contexts), and
 * flips the label + icon to a "Copied!" confirmation for ~2s.
 */
export default function CopyEmailButton() {
  const t = useT();
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(() => () => {
    if (timer.current) window.clearTimeout(timer.current);
  }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = profile.email;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand('copy');
      } catch {
        /* clipboard unavailable — silently ignore */
      }
      document.body.removeChild(ta);
    }
    setCopied(true);
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={copy}
      data-cursor="hover"
      aria-label={copied ? t.contact.copied : `${t.contact.copy} email`}
      aria-live="polite"
      className="glass inline-flex items-center gap-2 rounded-full px-5 py-4 text-sm font-semibold text-slate-700 transition-colors hover:text-blue-600"
    >
      {copied ? (
        <Check className="h-4 w-4 text-emerald-500" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
      <span className="min-w-[4rem] text-start">{copied ? t.contact.copied : t.contact.copy}</span>
    </button>
  );
}
