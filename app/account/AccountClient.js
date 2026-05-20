'use client';

import { useCallback, useEffect, useState } from 'react';
import styles from './page.module.css';

export default function AccountClient() {
  const [enabled, setEnabled] = useState(null);
  const [user, setUser] = useState(null);
  const [recordings, setRecordings] = useState([]);
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const loadMe = useCallback(async () => {
    const res = await fetch('/api/auth/me', { credentials: 'include' });
    const data = await res.json();
    setEnabled(data.enabled);
    setUser(data.user);
    return data.user;
  }, []);

  const loadRecordings = useCallback(async () => {
    const res = await fetch('/api/recordings', { credentials: 'include' });
    if (!res.ok) {
      return;
    }
    const data = await res.json();
    setRecordings(data.recordings || []);
  }, []);

  useEffect(() => {
    loadMe().then((currentUser) => {
      if (currentUser) {
        loadRecordings();
      }
    });
  }, [loadMe, loadRecordings]);

  async function handleAuthSubmit(event) {
    event.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const res = await fetch(endpoint, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Request failed');
      }
      setUser(data.user);
      setMessage(mode === 'login' ? 'Signed in.' : 'Account created.');
      setPassword('');
      await loadRecordings();
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    setUser(null);
    setRecordings([]);
    setMessage('Signed out.');
  }

  async function handleDelete(recordingId) {
    if (!window.confirm('Delete this recording?')) {
      return;
    }
    const res = await fetch(`/api/recordings/${recordingId}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (res.ok) {
      setRecordings((prev) => prev.filter((r) => r.id !== recordingId));
    }
  }

  if (enabled === null) {
    return <p className={styles.intro}>Loading account status…</p>;
  }

  if (!enabled) {
    return (
      <p className={styles.intro}>
        Optional accounts are not turned on for this site yet. You can still use Varterm for
        text-to-speech without signing in.
      </p>
    );
  }

  if (!user) {
    return (
      <div className={styles.panel}>
        <p className={styles.intro}>
          Create a free account to save TTS recordings and share listen links for streaming on other
          devices.
        </p>
        <form className={styles.form} onSubmit={handleAuthSubmit}>
          <label>
            Email
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />
          </label>
          <div className={styles.actions}>
            <button type="submit" className={`${styles.button} ${styles.buttonPrimary}`} disabled={loading}>
              {loading ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}
            </button>
            <button
              type="button"
              className={styles.button}
              onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            >
              {mode === 'login' ? 'Need an account?' : 'Already have an account?'}
            </button>
          </div>
        </form>
        {error ? <p className={styles.error}>{error}</p> : null}
        {message ? <p className={styles.success}>{message}</p> : null}
      </div>
    );
  }

  return (
    <>
      <p className={styles.intro}>
        Signed in as <strong>{user.email}</strong>. Saved recordings can be played here or via an
        unlisted listen link.
      </p>
      <div className={styles.actions}>
        <button type="button" className={styles.button} onClick={handleLogout}>
          Sign out
        </button>
      </div>
      {message ? <p className={styles.success}>{message}</p> : null}

      <section className={styles.panel}>
        <h2>Your recordings</h2>
        {recordings.length === 0 ? (
          <p className={styles.empty}>
            No saved recordings yet. Use the save action after generating audio on the home page.
          </p>
        ) : (
          <ul className={styles.recordingList}>
            {recordings.map((recording) => (
              <li key={recording.id} className={styles.recordingItem}>
                <p className={styles.recordingTitle}>{recording.title}</p>
                <p className={styles.recordingMeta}>
                  {recording.voiceLabel ? `${recording.voiceLabel} · ` : ''}
                  {Math.round(recording.bytes / 1024)} KB ·{' '}
                  {new Date(recording.createdAt).toLocaleString()}
                </p>
                <div className={styles.recordingActions}>
                  <a href={`/listen/${recording.id}`}>Open listen page</a>
                  {recording.listenUrl ? (
                    <a href={recording.listenUrl} target="_blank" rel="noreferrer">
                      Share link
                    </a>
                  ) : null}
                  <button type="button" className={styles.button} onClick={() => handleDelete(recording.id)}>
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
