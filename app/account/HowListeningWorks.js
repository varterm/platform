'use client';

import { useEffect, useRef } from 'react';
import styles from './page.module.css';

const LISTENING_FLOW_DIAGRAM = `sequenceDiagram
  participant You as Your browser
  participant Account as Varterm account
  participant Listen as Listen page
  participant Library as Saved library
  participant Player as Audio playback

  opt Optional: create an account
    You->>Account: Sign up or sign in
    Account-->>You: Signed in
    You->>Library: Save a recording
    Library-->>You: Stored in your library
  end

  You->>Listen: Open listen link or pick a saved recording
  Listen->>Library: Load title and details
  Library-->>Listen: Show recording info
  You->>Player: Press play
  Player->>Library: Request audio (supports resume and seek)
  Library-->>Player: Stream audio in parts
  Player-->>You: Hear your text read aloud`;

export default function HowListeningWorks({ embedded = false }) {
  const diagramRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const mermaid = (await import('mermaid')).default;
      mermaid.initialize({
        startOnLoad: false,
        theme: 'dark',
        securityLevel: 'strict',
        sequence: {
          useMaxWidth: true,
          wrap: true,
        },
      });

      if (cancelled || !diagramRef.current) {
        return;
      }

      const id = `varterm-listen-flow-${Date.now()}`;
      const { svg } = await mermaid.render(id, LISTENING_FLOW_DIAGRAM);
      if (!cancelled && diagramRef.current) {
        diagramRef.current.innerHTML = svg;
      }
    })().catch(() => {
      if (diagramRef.current) {
        diagramRef.current.innerHTML =
          '<p class="' +
          styles.diagramFallback +
          '">Diagram could not be loaded. You can still use accounts and listen links as described above.</p>';
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section
      id={embedded ? undefined : 'how-listening-works'}
      className={embedded ? styles.howItWorksEmbedded : styles.howItWorks}
      aria-labelledby="how-listening-works-heading"
    >
      {!embedded ? <h2 id="how-listening-works-heading">How saved listening works</h2> : null}
      {embedded ? (
        <h3 id="how-listening-works-heading" className={styles.howItWorksEmbeddedTitle}>
          How saved listening works
        </h3>
      ) : null}
      <p className={styles.howItWorksIntro}>
        Varterm works without an account: paste text and listen right away. If you want to keep
        recordings and open them on another phone, laptop, or speaker, create a free account (optional),
        save your audio, and use a listen link to stream it anywhere.
      </p>
      <ul className={styles.howItWorksList}>
        <li>
          <strong>No account required</strong> for everyday text-to-speech on the home page.
        </li>
        <li>
          <strong>Optional account</strong> stores recordings in your library so you do not lose them.
        </li>
        <li>
          <strong>Listen links</strong> open a simple player; audio streams in chunks so you can seek
          and resume without downloading the whole file first.
        </li>
      </ul>
      <div
        ref={diagramRef}
        className={styles.diagram}
        role="img"
        aria-label="Flowchart: optional sign-up and save, then open a listen page, load details, stream audio, and play in your browser."
      />
    </section>
  );
}
