import {
  createRouter,
  createRoute,
  createRootRoute,
  Outlet,
  redirect,
  useParams,
} from '@tanstack/react-router';
import React, { useContext } from 'react';
import { Allotment } from 'allotment';
import 'allotment/dist/style.css';

import Layout, { LayoutCtx } from './layout/components/Layout';
import { InboxPanel } from './inbox';
import MyTickets from './tickets/components/MyTickets';
import RetourPanel from './feedback/components/RetourPanel';
import ActivitePanel from './activity/components/ActivitePanel';
import { ProjetsPanel } from './projects';
import StatistiquesPanel from './stats/components/StatistiquesPanel';
import SkillTreePanel from './skills/components/SkillTreePanel';
import { DocsPanel } from './docs';
import TicketPanel from './tickets/components/TicketPanel';
import TerminalPanel from './tickets/components/TerminalPanel';
import {
  FormationSelectPage,
  getStoredSession,
  hasSelectedFormation,
  LoginPage,
  ProfilePage,
  SignupPage,
} from '../auth';
import { PublicLanding } from '../landing';
import { HomeLayout, HomePanel } from './home';
import { parseAuthRedirect, safeRedirectPath } from './routing';

function RootPage() {
  return <Outlet />;
}

function InboxPage() {
  const { dark } = useContext(LayoutCtx);
  return <InboxPanel dark={dark} />;
}

function MyTicketsPage() {
  return <MyTickets />;
}

function TicketDetailPage() {
  const { incidentId } = useParams({ strict: false }) as { incidentId: string };
  const { dark, vmHost, loading, sessionError, startSession, vertical } =
    useContext(LayoutCtx);

  React.useEffect(() => {
    if (incidentId) {
      void startSession(incidentId);
    }
  }, [incidentId, startSession]);

  const [draggedOver, setDraggedOver] = React.useState<
    'term' | 'ticket' | null
  >(null);
  const [reverseOrder, setReverseOrder] = React.useState(false);

  const handleDragStart = (e: React.DragEvent, type: 'term' | 'ticket') => {
    e.dataTransfer.setData('text/plain', type);
  };
  const handleDrop = (e: React.DragEvent, target: 'term' | 'ticket') => {
    e.preventDefault();
    setDraggedOver(null);
    const source = e.dataTransfer.getData('text/plain') as 'term' | 'ticket';
    if (source && source !== target) setReverseOrder((r) => !r);
  };

  const panelProps = {
    dark,
    vmHost,
    onDragStart: handleDragStart,
    onDrop: handleDrop,
  };

  const termPanel = (
    <TerminalPanel
      {...panelProps}
      isDraggedOver={draggedOver === 'term'}
      onDragOver={(e) => {
        e.preventDefault();
        setDraggedOver('term');
      }}
    />
  );
  const ticketPanel = (
    <TicketPanel
      {...panelProps}
      isDraggedOver={draggedOver === 'ticket'}
      onDragOver={(e) => {
        e.preventDefault();
        setDraggedOver('ticket');
      }}
      incidentId={incidentId}
      loading={loading}
      sessionError={sessionError}
      vmReady={Boolean(vmHost)}
    />
  );

  return (
    <div style={{ height: '100%' }} onDragLeave={() => setDraggedOver(null)}>
      <Allotment key={`${vertical}-${reverseOrder}`} vertical={vertical}>
        <Allotment.Pane minSize={200}>
          {reverseOrder ? ticketPanel : termPanel}
        </Allotment.Pane>
        <Allotment.Pane minSize={200}>
          {reverseOrder ? termPanel : ticketPanel}
        </Allotment.Pane>
      </Allotment>
    </div>
  );
}

function PlaceholderPage({ name }: { name: string }) {
  return (
    <div
      style={{
        display: 'flex',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#8a8a93',
        fontSize: '13px',
        fontFamily: '-apple-system, BlinkMacSystemFont, Inter, sans-serif',
      }}
    >
      {name} — à venir
    </div>
  );
}

function RetourPage() {
  return <RetourPanel />;
}
function ActivitePage() {
  return <ActivitePanel />;
}
function CompetencePage() {
  return <SkillTreePanel />;
}
function ProjetsPage() {
  return <ProjetsPanel />;
}
function RessourcePage() {
  return <DocsPanel />;
}
function StatistiquePage() {
  return <StatistiquesPanel />;
}
function AutonomiePage() {
  return <PlaceholderPage name="Score d'autonomie" />;
}
function ProfilePageRoute() {
  return <ProfilePage />;
}

function requireAuthWithFormation({
  location,
}: {
  location: { href: string };
}) {
  const session = getStoredSession();
  const safeRedirect = safeRedirectPath(location.href);

  if (!session) {
    throw redirect({
      to: '/login',
      search: { redirect: safeRedirect },
    });
  }

  if (!hasSelectedFormation(session)) {
    throw redirect({
      to: '/formation',
      search: { redirect: safeRedirect },
    });
  }
}

const rootRoute = createRootRoute({ component: RootPage });

const homeLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'home-layout',
  component: HomeLayout,
  beforeLoad: requireAuthWithFormation,
});

const arenaLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'arena-layout',
  component: Layout,
  beforeLoad: requireAuthWithFormation,
});

const publicLandingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: PublicLanding,
});

const landingLegacyRedirectRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/landing',
  beforeLoad: () => {
    throw redirect({ to: '/' });
  },
});

const waitlistLegacyRedirectRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/waitlist',
  beforeLoad: () => {
    throw redirect({ to: '/' });
  },
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: parseAuthRedirect(search),
  }),
  component: LoginPage,
});

const signupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/signup',
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: parseAuthRedirect(search),
  }),
  component: SignupPage,
});

const formationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/formation',
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: parseAuthRedirect(search),
    change: search.change === '1' || search.change === 1 || search.change === true,
  }),
  beforeLoad: ({ search, location }) => {
    const session = getStoredSession();
    const safeRedirect = safeRedirectPath(location.href);

    if (!session) {
      throw redirect({
        to: '/login',
        search: { redirect: safeRedirect },
      });
    }
    if (hasSelectedFormation(session) && !search.change) {
      throw redirect({ to: search.redirect });
    }
  },
  component: FormationSelectPage,
});

const homeRoute = createRoute({
  getParentRoute: () => homeLayoutRoute,
  path: '/home',
  component: HomePanel,
});

const inboxRoute = createRoute({
  getParentRoute: () => arenaLayoutRoute,
  path: '/inbox',
  component: InboxPage,
});
const ticketsRoute = createRoute({
  getParentRoute: () => arenaLayoutRoute,
  path: '/tickets',
});
const ticketsIndexRoute = createRoute({
  getParentRoute: () => ticketsRoute,
  path: '/',
  component: MyTicketsPage,
});
const ticketDetailRoute = createRoute({
  getParentRoute: () => ticketsRoute,
  path: '$incidentId',
  component: TicketDetailPage,
});
const reviewsRoute = createRoute({
  getParentRoute: () => arenaLayoutRoute,
  path: '/retours',
  component: RetourPage,
});
const pulseRoute = createRoute({
  getParentRoute: () => arenaLayoutRoute,
  path: '/activite',
  component: ActivitePage,
});
const skillsRoute = createRoute({
  getParentRoute: () => arenaLayoutRoute,
  path: '/competences',
  component: CompetencePage,
});
const projectsRoute = createRoute({
  getParentRoute: () => arenaLayoutRoute,
  path: '/projets',
  component: ProjetsPage,
});
const docsRoute = createRoute({
  getParentRoute: () => arenaLayoutRoute,
  path: '/ressources',
  component: RessourcePage,
});
const insightsRoute = createRoute({
  getParentRoute: () => arenaLayoutRoute,
  path: '/statistiques',
  component: StatistiquePage,
});
const autonomyRoute = createRoute({
  getParentRoute: () => arenaLayoutRoute,
  path: '/autonomie',
  component: AutonomiePage,
});
const profileRoute = createRoute({
  getParentRoute: () => arenaLayoutRoute,
  path: '/profil',
  component: ProfilePageRoute,
});

const routeTree = rootRoute.addChildren([
  publicLandingRoute,
  landingLegacyRedirectRoute,
  waitlistLegacyRedirectRoute,
  loginRoute,
  signupRoute,
  formationRoute,
  homeLayoutRoute.addChildren([homeRoute]),
  arenaLayoutRoute.addChildren([
    inboxRoute,
    ticketsRoute.addChildren([ticketsIndexRoute, ticketDetailRoute]),
    reviewsRoute,
    pulseRoute,
    skillsRoute,
    projectsRoute,
    docsRoute,
    insightsRoute,
    autonomyRoute,
    profileRoute,
  ]),
]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
