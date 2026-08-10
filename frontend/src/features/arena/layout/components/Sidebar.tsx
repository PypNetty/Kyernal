import React, { useState } from 'react';
import { Link, useRouterState } from '@tanstack/react-router';
import { UserProfile } from '../context/types';

// --- ICÔNES SVG FAÇON LINEAR ---
const IconInbox = () => (
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
    <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"></polyline>
    <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path>
  </svg>
);
const IconTicket = () => (
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
    <circle cx="12" cy="12" r="10"></circle>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);
const IconReview = () => (
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
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
    <path d="m9 12 2 2 4-4"></path>
  </svg>
);
const IconPulse = () => (
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
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
  </svg>
);
const IconTarget = () => (
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
    <circle cx="12" cy="12" r="10"></circle>
    <circle cx="12" cy="12" r="6"></circle>
    <circle cx="12" cy="12" r="2"></circle>
  </svg>
);
const IconProject = () => (
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
    <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
    <polyline points="2 17 12 22 22 17"></polyline>
    <polyline points="2 12 12 17 22 12"></polyline>
  </svg>
);
const IconBook = () => (
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
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
  </svg>
);
const IconChart = () => (
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
    <line x1="18" y1="20" x2="18" y2="10"></line>
    <line x1="12" y1="20" x2="12" y2="4"></line>
    <line x1="6" y1="20" x2="6" y2="14"></line>
  </svg>
);
const IconShield = () => (
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
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
  </svg>
);

const IconHome = () => (
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
    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V9.5z" />
  </svg>
);

// --- NAV CONFIG ---
const MAIN_NAV = [
  { id: 'home', icon: <IconHome />, label: 'Home', to: '/home' },
  {
    id: 'inbox',
    icon: <IconInbox />,
    label: 'Inbox',
    to: '/inbox',
  },
  { id: 'tickets', icon: <IconTicket />, label: 'Issues', to: '/tickets' },
  { id: 'reviews', icon: <IconReview />, label: 'Retours', to: '/retours' },
  { id: 'pulse', icon: <IconPulse />, label: 'Activité', to: '/activite' },
];

const WORKSPACE_NAV = [
  {
    id: 'skills',
    icon: <IconTarget />,
    label: 'Compétences',
    to: '/competences',
  },
  { id: 'projects', icon: <IconProject />, label: 'Projets', to: '/projets' },
  { id: 'docs', icon: <IconBook />, label: 'Ressources', to: '/ressources' },
];

const FAVORITES_NAV = [
  {
    id: 'insights',
    icon: <IconChart />,
    label: 'Statistiques IA',
    to: '/statistiques',
  },
  {
    id: 'autonomy',
    icon: <IconShield />,
    label: "Score d'autonomie",
    to: '/autonomie',
  },
];

export default function Sidebar({
  dark,
  user,
}: {
  dark: boolean;
  user: UserProfile;
}) {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const bg = dark ? '#0e0f11' : '#f7f7f9';
  const textMain = dark ? '#ededed' : '#111113';
  const textMuted = dark ? '#8a8a93' : '#6b6b6b';
  const hoverBg = dark ? '#ffffff14' : '#0000000a';
  const border = dark ? '#27282b' : '#e8e8e5';

  const NavItem = ({
    icon,
    label,
    to,
  }: {
    icon: React.ReactNode;
    label: string;
    to: string;
  }) => {
    const isActive = currentPath === to || currentPath.startsWith(to + '/');
    return (
      <Link to={to} style={{ textDecoration: 'none' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '6px 12px',
            margin: '2px 8px',
            borderRadius: '6px',
            cursor: 'pointer',
            background: isActive ? hoverBg : 'transparent',
            color: isActive ? textMain : textMuted,
            fontSize: '13px',
            fontWeight: 500,
            transition: 'background 0.1s, color 0.1s',
          }}
          onMouseEnter={(e) => {
            if (!isActive) e.currentTarget.style.background = hoverBg;
          }}
          onMouseLeave={(e) => {
            if (!isActive) e.currentTarget.style.background = 'transparent';
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: isActive ? 1 : 0.7,
            }}
          >
            {icon}
          </div>
          {label}
        </div>
      </Link>
    );
  };

  const SectionHeader = ({ title }: { title: string }) => (
    <div
      style={{
        fontSize: '11px',
        fontWeight: 600,
        color: textMuted,
        padding: '16px 20px 6px 20px',
        letterSpacing: '0.5px',
      }}
    >
      {title}
    </div>
  );

  return (
    <div
      style={{
        width: '240px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: bg,
        borderRight: `1px solid ${border}`,
        flexShrink: 0,
        fontFamily: '-apple-system, BlinkMacSystemFont, Inter, sans-serif',
      }}
    >
      {/* Header */}
      <div
        style={{
          height: '48px',
          display: 'flex',
          alignItems: 'center',
          padding: '0 16px',
          gap: '10px',
          borderBottom: `1px solid ${border}`,
          cursor: 'pointer',
        }}
      >
        <div
          style={{
            width: '20px',
            height: '20px',
            borderRadius: '4px',
            background: '#0055e5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: '12px',
            fontWeight: 700,
          }}
        >
          K
        </div>
        <span style={{ fontSize: '13px', fontWeight: 600, color: textMain }}>
          {user.organization ?? 'Formation'}
        </span>
        <span
          style={{ marginLeft: 'auto', color: textMuted, fontSize: '10px' }}
        >
          ▼
        </span>
      </div>

      {/* Nav */}
      <div style={{ flex: 1, overflowY: 'auto', paddingTop: '12px' }}>
        {MAIN_NAV.map((item) => (
          <NavItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            to={item.to}
          />
        ))}
        <SectionHeader title="WORKSPACE" />
        {WORKSPACE_NAV.map((item) => (
          <NavItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            to={item.to}
          />
        ))}
        <SectionHeader title="FAVORIS" />
        {FAVORITES_NAV.map((item) => (
          <NavItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            to={item.to}
          />
        ))}
      </div>

      {/* Profil */}
      <Link to="/profil" style={{ textDecoration: 'none' }} title="Mon profil">
        <div
          style={{
            padding: '12px 16px',
            borderTop: `1px solid ${border}`,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer',
            background:
              currentPath === '/profil' ? hoverBg : 'transparent',
          }}
          onMouseEnter={(e) => {
            if (currentPath !== '/profil') {
              e.currentTarget.style.background = hoverBg;
            }
          }}
          onMouseLeave={(e) => {
            if (currentPath !== '/profil') {
              e.currentTarget.style.background = 'transparent';
            }
          }}
        >
          <div
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              background: '#30a46c',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: '9px',
              fontWeight: 700,
            }}
          >
            {user.initials}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: textMain }}>
              {user.name}
            </span>
            <span style={{ fontSize: '10px', color: textMuted }}>
              {user.role}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
