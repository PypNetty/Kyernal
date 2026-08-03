import { useEffect, useRef } from 'react';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';
import { getWsBaseUrl } from '../lib/apiConfig';

interface TerminalComponentProps {
  vmHost?: string;
}

export default function TerminalComponent({ vmHost }: TerminalComponentProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const termRef = useRef<Terminal | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const term = new Terminal({
      cursorBlink: true,
      fontSize: 13,
      fontFamily: 'JetBrains Mono, Fira Code, monospace',
      theme: {
        background: '#0f0f0f',
        foreground: '#e8e8e8',
        cursor: '#60a5fa',
      },
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(containerRef.current);
    fitAddon.fit();
    termRef.current = term;

    let onDataDisposable: { dispose: () => void } | null = null;
    let sshFailed = false;

    if (!vmHost) {
      term.writeln(
        '\x1b[1;32m[KLIXY ARENA]\x1b[0m — Session interactive initialisée',
      );
      term.writeln(
        'Connexion SSH établie avec \x1b[1;34mvm-apprenant-01\x1b[0m (Debian 13)',
      );
      term.writeln('');
      term.write('\x1b[1;32mapprenant\x1b[0m@\x1b[1;34mvm-01\x1b[0m:~$ ');
    } else {
      term.writeln(`\x1b[1;34m[KLIXY] Connexion à ${vmHost}...\x1b[0m`);

      const ws = new WebSocket(`${getWsBaseUrl()}/ws/pty?host=${vmHost}`);
      ws.binaryType = 'arraybuffer';
      wsRef.current = ws;

      ws.onopen = () => {
        term.writeln(`\x1b[1;32m● Connecté à ${vmHost}\x1b[0m`);
      };

      ws.onmessage = (event) => {
        if (typeof event.data === 'string') {
          // Message texte = erreur SSH côté backend
          sshFailed = true;
          term.writeln(`\x1b[1;31m${event.data}\x1b[0m`);
        } else {
          term.write(new Uint8Array(event.data as ArrayBuffer));
        }
      };

      ws.onerror = () => {
        term.writeln('\x1b[1;31m● Erreur WebSocket\x1b[0m');
      };

      ws.onclose = () => {
        if (sshFailed) {
          term.writeln(
            '\x1b[1;31m● Connexion SSH échouée — vérifiez les logs backend.\x1b[0m',
          );
        } else {
          term.writeln('\x1b[1;33m● Session terminée.\x1b[0m');
        }
      };

      if (onDataDisposable) onDataDisposable.dispose();
      onDataDisposable = term.onData((data) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(new TextEncoder().encode(data));
        }
      });
    }

    const handleResize = () => fitAddon.fit();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (onDataDisposable) onDataDisposable.dispose();
      const ws = wsRef.current;
      if (ws) {
        wsRef.current = null;
        ws.onmessage = null;
        ws.onerror = null;
        ws.onclose = null;
        if (ws.readyState === WebSocket.CONNECTING) {
          // Deferring close prevents the "closed before connection established" browser error
          ws.onopen = () => ws.close();
        } else {
          ws.onopen = null;
          ws.close();
        }
      }
      term.dispose();
    };
  }, [vmHost]);

  return <div ref={containerRef} style={{ height: '100%', width: '100%' }} />;
}
