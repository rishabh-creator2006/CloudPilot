'use client';

import { useCallback, useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle2, Loader2, RefreshCw } from 'lucide-react';

type BackendState = 'checking' | 'online' | 'waking' | 'slow' | 'offline';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || '/api';

export function BackendStatus() {
  const [state, setState] = useState<BackendState>('checking');
  const [elapsed, setElapsed] = useState(0);

  const checkBackend = useCallback(async () => {
    setState('checking');
    setElapsed(0);

    const started = Date.now();

    const timer = window.setInterval(() => {
      const seconds = Math.floor((Date.now() - started) / 1000);
      setElapsed(seconds);

      if (seconds >= 30) {
        setState((current) =>
          current === 'online' ? 'online' : 'slow'
        );
      }
    }, 1000);

    try {
      const controller = new AbortController();

      const timeout = window.setTimeout(() => {
        controller.abort();
      }, 90000);

      const response = await fetch(
        `${API_BASE_URL.replace(/\/$/, '').replace(/\/api$/, '')}/`,
        {
          method: 'GET',
          cache: 'no-store',
          signal: controller.signal,
        }
      );

      window.clearTimeout(timeout);

      if (response.ok) {
        setState('online');
      } else {
        setState('waking');
      }
    } catch {
      setState((current) =>
        current === 'slow' ? 'slow' : 'waking'
      );
    } finally {
      window.clearInterval(timer);
    }
  }, []);

  useEffect(() => {
    checkBackend();

    const interval = window.setInterval(() => {
      checkBackend();
    }, 60000);

    return () => window.clearInterval(interval);
  }, [checkBackend]);

  if (state === 'online') {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-2 text-xs text-emerald-400">
        <CheckCircle2 className="h-4 w-4" />
        <span>Backend connected</span>
      </div>
    );
  }

  if (state === 'slow') {
    return (
      <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />

          <div className="min-w-0 flex-1">
            <div className="font-semibold text-amber-300">
              Backend is taking longer than expected
            </div>

            <p className="mt-1 text-xs text-amber-200/70">
              CloudPilot backend has been waking for {elapsed}s.
              Render may need additional time after inactivity.
            </p>

            <button
              onClick={checkBackend}
              className="mt-2 inline-flex items-center gap-1.5 rounded-md border border-amber-500/30 bg-amber-500/10 px-2.5 py-1.5 text-xs font-semibold text-amber-300 hover:bg-amber-500/20"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 px-4 py-3">
      <div className="flex items-center gap-3">
        <Loader2 className="h-5 w-5 shrink-0 animate-spin text-blue-400" />

        <div>
          <div className="font-semibold text-blue-300">
            Connecting to CloudPilot backend
          </div>

          <p className="mt-1 text-xs text-blue-200/70">
            Backend may be waking up after inactivity.
            {elapsed > 0 && ` ${elapsed}s`}
          </p>
        </div>
      </div>
    </div>
  );
}
