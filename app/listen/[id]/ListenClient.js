'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import styles from './page.module.css';

export default function ListenClient({ recordingId }) {
  const [recording, setRecording] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch(`/api/recordings/${recordingId}`, { credentials: 'include' });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Recording not found');
        }
        if (!cancelled) {
          setRecording(data.recording);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Unable to load recording');
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [recordingId]);

  if (error) {
    return <p className={styles.error}>{error}</p>;
  }

  if (!recording) {
    return <p className={styles.meta}>Loading audio…</p>;
  }

  return (
    <>
      <h1>{recording.title}</h1>
      <p className={styles.meta}>
        {recording.voiceLabel ? `${recording.voiceLabel} · ` : ''}
        Streamed from Varterm
      </p>
      {recording.sourceTextPreview ? (
        <p className={styles.preview}>{recording.sourceTextPreview}</p>
      ) : null}
      <audio
        className={styles.player}
        controls
        preload="metadata"
        src={`/api/recordings/${recording.id}/audio`}
      >
        Your browser does not support audio playback.
      </audio>
      <p className={styles.hint}>
        Audio streams from your saved library in parts so you can seek and resume.{' '}
        <Link href="/account">Learn how optional accounts work</Link>
      </p>
    </>
  );
}
