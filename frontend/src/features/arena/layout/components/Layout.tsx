import React, { useCallback, useState } from 'react';
import { Outlet, useRouterState } from '@tanstack/react-router';
import { useAuth } from '../../../auth';
import { usePresenceSync } from '../../../auth/hooks/usePresenceSync';
import {
  getLearnerProgress,
  getTicketStatusByRouteId,
  markTicketResolved,
  markTicketStarted,
} from '../../../progress';
import { getFormationProgression } from '../../skills/data/formationProgression';
import { UserProfile } from '../context/types';
import { useAppTheme } from '../context/AppTheme';
import Sidebar from './Sidebar';

// --- NOUVEAU LOGO ---
const KlixyLogo = ({ size = 20 }: { size?: number }) => (
  <div
    style={{
      position: 'relative',
      width: size,
      height: size,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        width="32"
        height="32"
        rx="8"
        fill="#141416"
        stroke="#27272a"
        strokeWidth="1"
      />
      <path
        d="M12 9V23"
        stroke="#f4f4f5"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M21 9L12 16L21 23"
        stroke="#f4f4f5"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="21" cy="9" r="2.5" fill="#30a46c" />
    </svg>
  </div>
);

// --- ICÔNES MINIMALISTES ---
const IconLayoutH = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <line x1="12" y1="3" x2="12" y2="21" />
  </svg>
);
const IconLayoutV = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <line x1="3" y1="12" x2="21" y2="12" />
  </svg>
);
const IconSun = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);
const IconMoon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);
const IconStop = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="18" height="18" rx="2" />
  </svg>
);
const IconTrash = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
);

const IconBtn = ({
  onClick,
  children,
  title,
  danger = false,
  dark,
}: {
  onClick: () => void;
  children: React.ReactNode;
  title?: string;
  danger?: boolean;
  dark: boolean;
}) => {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      title={title}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: '28px',
        height: '28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        background: hovered
          ? danger
            ? 'rgba(239,68,68,0.1)'
            : dark
              ? '#ffffff0f'
              : '#0000000a'
          : 'transparent',
        color: hovered
          ? danger
            ? '#ef4444'
            : dark
              ? '#ededed'
              : '#111113'
          : dark
            ? '#71717a'
            : '#888888',
        transition: 'all 0.1s ease',
        padding: 0,
      }}
    >
      {children}
    </button>
  );
};

// --- CONTEXTE GLOBAL ---
export interface LayoutContext {
  dark: boolean;
  vertical: boolean;
  vmHost: string | undefined;
  vmId: number | undefined;
  loading: boolean;
  startSession: (incidentId: string) => Promise<void>;
  resolveTicket: (incidentId: string) => Promise<boolean>;
  stopSession: () => Promise<void>;
  deleteSession: () => Promise<void>;
  showTerminal: boolean;
  setShowTerminal: (val: boolean) => void;
  showTicket: boolean;
  setShowTicket: (val: boolean) => void;
  showCourse: boolean;
  setShowCourse: (val: boolean) => void;
}

export const LayoutCtx = React.createContext<LayoutContext>(
  {} as LayoutContext,
);

export default function Layout() {
  const { dark, toggleDark } = useAppTheme();
  const [vertical, setVertical] = React.useState(false);
  const [vmHost, setVmHost] = useState<string | undefined>(undefined);
  const [vmId, setVmId] = useState<number | undefined>(undefined);
  const [activeIncidentId, setActiveIncidentId] = useState<string | undefined>(
    undefined,
  );
  const [loading, setLoading] = useState(false);
  const [showTerminal, setShowTerminal] = useState(true);
  const [showTicket, setShowTicket] = useState(true);
  const [showCourse, setShowCourse] = useState(false);

  const routerState = useRouterState();
  const isInsideTicketDetail =
    routerState.location.pathname.startsWith('/tickets/');

  const { data: session, isLoading: authLoading } = useAuth();
  const currentUser: UserProfile | undefined = session?.user;

  usePresenceSync(vmHost, showCourse, routerState.location.pathname);

  const border = dark ? '#1c1c1e' : '#e4e4e7';
  const bg = dark ? '#09090b' : '#fafafa';
  const text = dark ? '#f4f4f5' : '#09090b';
  const textMuted = dark ? '#71717a' : '#71717a';

  const progressionBundle = useCallback(() => {
    const base = getFormationProgression(session?.formationId);
    const progress =
      session?.email && session.formationId
        ? (getLearnerProgress(session.email, session.formationId) ?? [])
        : [];

    return { ...base, progress };
  }, [session?.email, session?.formationId]);

  const startSession = useCallback(
    async (incidentId: string) => {
      const bundle = progressionBundle();
      const ticketStatus = getTicketStatusByRouteId(bundle, incidentId);
      if (ticketStatus === 'verrouille' || ticketStatus === 'unknown') {
        return;
      }

      if (session?.email && session.formationId) {
        markTicketStarted(
          session.email,
          session.formationId,
          incidentId,
          bundle,
        );
      }

      if (activeIncidentId === incidentId && vmHost) {
        return;
      }

      setActiveIncidentId(incidentId);
      setLoading(true);
      setVmHost(undefined);
      try {
        const res = await fetch(
          `http://127.0.0.1:8080/arena/start?incident=${incidentId}`,
          { method: 'POST' },
        );
        const data = await res.json();
        setVmHost(data.vmIP);
        setVmId(data.vmID);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    },
    [
      activeIncidentId,
      progressionBundle,
      session?.email,
      session?.formationId,
      vmHost,
    ],
  );

  const stopSession = useCallback(async () => {
    if (!vmId) return;
    try {
      await fetch(`http://127.0.0.1:8080/arena/stop?vmid=${vmId}`, {
        method: 'POST',
      });
      setVmHost(undefined);
    } catch (e) {
      console.error(e);
    }
  }, [vmId]);

  const resolveTicket = useCallback(
    async (incidentId: string): Promise<boolean> => {
      if (!session?.email || !session.formationId) return false;

      const bundle = progressionBundle();
      markTicketStarted(session.email, session.formationId, incidentId, bundle);

      const freshBundle = {
        ...bundle,
        progress:
          getLearnerProgress(session.email, session.formationId) ?? [],
      };
      const updated = markTicketResolved(
        session.email,
        session.formationId,
        incidentId,
        freshBundle,
      );

      await stopSession();
      setActiveIncidentId(undefined);
      return updated !== null;
    },
    [progressionBundle, session?.email, session?.formationId, stopSession],
  );

  const deleteSession = useCallback(async () => {
    if (!vmId) return;
    try {
      await fetch(`http://127.0.0.1:8080/arena/delete?vmid=${vmId}`, {
        method: 'DELETE',
      });
      setVmHost(undefined);
      setVmId(undefined);
      setActiveIncidentId(undefined);
    } catch (e) {
      console.error(e);
    }
  }, [vmId]);

  const renderPanelToggle = (
    label: string,
    active: boolean,
    onClick: () => void,
  ) => (
    <button
      onClick={onClick}
      style={{
        height: '22px',
        padding: '0 8px',
        borderRadius: '4px',
        marginRight: '4px',
        border: `1px solid ${active ? (dark ? '#27272a' : '#d4d4d8') : 'transparent'}`,
        background: active ? (dark ? '#18181b' : '#f4f4f5') : 'transparent',
        color: active ? text : textMuted,
        fontSize: '11px',
        fontWeight: 500,
        cursor: 'pointer',
        transition: 'all 0.1s ease',
      }}
    >
      {label}
    </button>
  );

  if (authLoading || !currentUser) {
    return (
      <div
        style={{
          width: '100vw',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: bg,
          color: textMuted,
          fontSize: '13px',
          fontFamily: '-apple-system, BlinkMacSystemFont, Inter, sans-serif',
        }}
      >
        Chargement…
      </div>
    );
  }

  return (
    <LayoutCtx.Provider
      value={{
        dark,
        vertical,
        vmHost,
        vmId,
        loading,
        startSession,
        resolveTicket,
        stopSession,
        deleteSession,
        showTerminal,
        setShowTerminal,
        showTicket,
        setShowTicket,
        showCourse,
        setShowCourse,
      }}
    >
      <div
        style={{
          width: '100vw',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          background: dark ? '#09090b' : '#ffffff',
          color: text,
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        }}
      >
        <div
          style={{
            height: '36px',
            borderBottom: `1px solid ${border}`,
            display: 'flex',
            alignItems: 'center',
            padding: '0 12px',
            justifyContent: 'space-between',
            background: bg,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              fontSize: '11px',
              fontWeight: 600,
              color: text,
              letterSpacing: '0.3px',
              textTransform: 'uppercase',
              opacity: 0.8,
            }}
          >
            Klixy Node
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
            {isInsideTicketDetail && (
              <>
                {renderPanelToggle('Ticket', showTicket, () =>
                  setShowTicket(!showTicket),
                )}
                {renderPanelToggle('Cours', showCourse, () =>
                  setShowCourse(!showCourse),
                )}
                {renderPanelToggle('Terminal', showTerminal, () =>
                  setShowTerminal(!showTerminal),
                )}
                <div
                  style={{
                    width: '1px',
                    height: '12px',
                    background: border,
                    margin: '0 6px',
                  }}
                />
              </>
            )}

            {vmHost && (
              <>
                <IconBtn
                  onClick={stopSession}
                  title="Stopper la session"
                  dark={dark}
                >
                  <IconStop />
                </IconBtn>
                <IconBtn
                  onClick={deleteSession}
                  title="Supprimer la VM"
                  danger
                  dark={dark}
                >
                  <IconTrash />
                </IconBtn>
                <div
                  style={{
                    width: '1px',
                    height: '12px',
                    background: border,
                    margin: '0 4px',
                  }}
                />
              </>
            )}

            {isInsideTicketDetail && (
              <IconBtn
                onClick={() => setVertical(!vertical)}
                title={
                  vertical ? 'Disposition horizontale' : 'Disposition verticale'
                }
                dark={dark}
              >
                {vertical ? <IconLayoutH /> : <IconLayoutV />}
              </IconBtn>
            )}
            <IconBtn
              onClick={() => toggleDark()}
              title={dark ? 'Mode clair' : 'Mode sombre'}
              dark={dark}
            >
              {dark ? <IconSun /> : <IconMoon />}
            </IconBtn>
          </div>
        </div>

        {/* Workspace */}
        <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
          <Sidebar dark={dark} user={currentUser} />
          <div
            style={{
              flex: 1,
              minWidth: 0,
              overflow: 'hidden',
              background: dark ? '#09090b' : '#ffffff',
            }}
          >
            <Outlet />
          </div>
        </div>
      </div>
    </LayoutCtx.Provider>
  );
}
