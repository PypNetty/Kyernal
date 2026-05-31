import { Link } from '@tanstack/react-router';
import { useState, type CSSProperties } from 'react';
import { useAuthReady } from '../../auth';
import KyernalLogo from './KyernalLogo';
import { LANDING_VIDEO_URL } from '../config';
import { THEMES } from '../theme/landingTheme';
import styles from './Landing.module.css';

type Mode = 'dark' | 'light';

const NAV_LINKS = [
  { label: 'Fonctionnalités', href: '#fonctionnalites' },
  { label: 'Tarifs', href: '#tarifs' },
  { label: 'Pour les organismes', href: '/organismes' },
  { label: 'Docs', href: '/docs' },
] as const;

const FEATURES = [
  {
    title: 'Des vraies VMs, en 3 secondes',
    desc: "Pas de simulateurs factices. Déployez de véritables environnements Linux isolés pour bidouiller vos noyaux ou configurer vos réseaux en conditions réelles.",
  },
  {
    title: "Agent d'accompagnement vocal",
    desc: "Bloqué sur la configuration d'un reverse proxy ? Notre IA analyse votre terminal en temps réel et vous guide vocalement sans vous donner la réponse toute cuite.",
  },
  {
    title: 'Détection de frustration',
    desc: "Kyernal repère les commandes répétées qui échouent. Le système ajuste la difficulté ou vous suggère une piste avant que vous n'abandonniez.",
  },
] as const;

function getThemeVars(mode: Mode): CSSProperties {
  const t = THEMES[mode];
  return {
    '--bg': t.bg,
    '--text': t.text,
    '--bg-card': t.bgCard,
    '--border': t.border,
    '--border-muted': t.borderMuted,
    '--nav-bg': t.navBg,
    '--grid-color': t.gridColor,
    '--halo-bg': t.haloBg,
    '--badge-bg': t.badgeBg,
    '--badge-border': t.badgeBorder,
    '--btn-primary': t.btnPrimary,
    '--btn-primary-text': t.btnPrimaryText,
    '--btn-secondary-bg': t.btnSecondaryBg,
    '--btn-secondary-text': t.btnSecondaryText,
    '--text-sub': t.textSub,
    '--text-muted': t.textMuted,
    '--text-faint': t.textFaint,
  } as CSSProperties;
}

function Nav({
  mode,
  onToggle,
  isLoggedIn,
}: {
  mode: Mode;
  onToggle: () => void;
  isLoggedIn: boolean;
}) {
  return (
    <nav className={styles.nav}>
      <div className={styles.navLeft}>
        <Link to="/" className={styles.brand}>
          <KyernalLogo size={20} dark={mode === 'light'} />
          <span className={styles.brandName}>Kyernal</span>
        </Link>
        <div className={styles.navLinks}>
          {NAV_LINKS.map((link) => (
            <a key={link.label} href={link.href} className={styles.navLink}>
              {link.label}
            </a>
          ))}
        </div>
      </div>

      <div className={styles.navActions}>
        <button
          type="button"
          onClick={onToggle}
          className={styles.iconBtn}
          aria-label={mode === 'dark' ? 'Activer le thème clair' : 'Activer le thème sombre'}
        >
          {mode === 'dark' ? '☀' : '◐'}
        </button>
        {isLoggedIn ? (
          <Link to="/home" className={`${styles.btnPrimary} ${styles.navBtnPrimary}`}>
            Tableau de bord
          </Link>
        ) : (
          <>
            <Link to="/login" className={`${styles.btnSecondary} ${styles.navBtn}`}>
              Se connecter
            </Link>
            <Link to="/signup" className={`${styles.btnPrimary} ${styles.navBtnPrimary}`}>
              Créer un compte
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

function Hero({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <section className={styles.hero}>
      <div className={styles.badge}>
        <span className={styles.badgeDot} />
        Entraînement IT sur infrastructures réelles
      </div>

      <h1 className={styles.title}>
        Voilà ce qui se passe.
        <br />
        <span className={styles.titleMuted}>La pratique pure.</span>
      </h1>

      <p className={styles.subtitle}>
        Kyernal génère des infrastructures réelles à la volée. Préparez vos titres TSSR,
        vos certifications DevOps et vos entretiens techniques sur de véritables
        environnements Linux isolés.
      </p>

      <div className={styles.ctaRow}>
        {isLoggedIn ? (
          <Link to="/home" className={`${styles.btnPrimary} ${styles.ctaBtn}`}>
            Tableau de bord
          </Link>
        ) : (
          <>
            <Link to="/signup" className={`${styles.btnPrimary} ${styles.ctaBtn}`}>
              Créer un compte
            </Link>
            <Link to="/login" className={`${styles.btnSecondary} ${styles.ctaBtn}`}>
              Se connecter
            </Link>
          </>
        )}
        <a href="#demo" className={`${styles.btnSecondary} ${styles.ctaBtn}`}>
          Voir la démo
        </a>
      </div>
    </section>
  );
}

function DemoVideo() {
  const hasEmbed = LANDING_VIDEO_URL.length > 0;

  return (
    <div id="demo" className={styles.demo}>
      <div className={styles.demoChrome}>
        <span className={`${styles.dot} ${styles.dotRed}`} />
        <span className={`${styles.dot} ${styles.dotYellow}`} />
        <span className={`${styles.dot} ${styles.dotGreen}`} />
        <span className={styles.demoCmd}>kyernal start arena</span>
      </div>
      {hasEmbed ? (
        <iframe
          className={styles.videoEmbed}
          src={LANDING_VIDEO_URL}
          title="Voilà ce qui se passe — démonstration Kyernal"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <div className={styles.demoCenter}>
          <div className={styles.playBtn} aria-hidden="true">
            <span className={styles.playTriangle} />
          </div>
          <span className={styles.demoLabel}>Vidéo de démonstration — bientôt disponible</span>
        </div>
      )}
    </div>
  );
}

function Features() {
  return (
    <section id="fonctionnalites" className={styles.section}>
      <div className={styles.sectionHead}>
        <h2 className={styles.h2}>Conçu pour l'apprentissage actif</h2>
        <p className={styles.sectionSub}>
          Une combinaison d'infrastructures réelles et d'accompagnement intelligent.
        </p>
      </div>

      <div className={styles.cardGrid}>
        {FEATURES.map((feat) => (
          <article key={feat.title} className={styles.featCard}>
            <h3 className={styles.featTitle}>{feat.title}</h3>
            <p className={styles.featDesc}>{feat.desc}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function Pricing({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <section id="tarifs" className={`${styles.section} ${styles.sectionNarrow}`}>
      <div className={`${styles.sectionHead} ${styles.sectionHeadTight}`}>
        <h2 className={styles.h2}>Tarification simple</h2>
      </div>

      <div className={styles.cardGrid}>
        <div className={styles.priceCard}>
          <h3 className={styles.priceName}>Découverte</h3>
          <div className={styles.priceAmount}>
            0€ <span className={styles.priceUnit}>/mois</span>
          </div>
          <ul className={styles.priceList}>
            <li>✓ 2 Arenas par mois</li>
            <li>✓ Environnements éphémères</li>
            <li>✓ Agent IA (Texte uniquement)</li>
          </ul>
          {isLoggedIn ? (
            <Link to="/home" className={`${styles.btnSecondary} ${styles.priceBtn}`}>
              Tableau de bord
            </Link>
          ) : (
            <Link to="/signup" className={`${styles.btnSecondary} ${styles.priceBtn}`}>
              Créer un compte
            </Link>
          )}
        </div>

        <div className={`${styles.priceCard} ${styles.priceCardPro}`}>
          <div className={styles.priceTag}>Le plus populaire</div>
          <h3 className={styles.priceName}>Apprenti Pro</h3>
          <div className={styles.priceAmount}>
            15€ <span className={styles.priceUnit}>/mois</span>
          </div>
          <ul className={styles.priceList}>
            <li>✓ Arenas illimitées</li>
            <li>✓ Persistance des environnements</li>
            <li>✓ Agent IA Vocal complet</li>
            <li>✓ Tableaux de bord de progression</li>
          </ul>
          {isLoggedIn ? (
            <Link to="/home" className={`${styles.btnPrimary} ${styles.priceBtn}`}>
              Tableau de bord
            </Link>
          ) : (
            <Link to="/signup" className={`${styles.btnPrimary} ${styles.priceBtn}`}>
              Passer Pro
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}

function Footer({ mode }: { mode: Mode }) {
  const productLinks = ['Arenas', 'Agent IA', 'Tarifs', 'Changelog'];
  const legalLinks = ['Mentions légales', 'CGU', 'CGV', 'Politique de confidentialité'];

  return (
    <footer className={styles.footer}>
      <div className={styles.footerGrid}>
        <div>
          <div className={styles.footerBrand}>
            <KyernalLogo size={16} dark={mode === 'light'} />
            <span className={styles.footerBrandName}>Kyernal</span>
          </div>
          <p className={styles.footerTagline}>
            L'apprentissage de l'infrastructure par la pratique réelle.
          </p>
        </div>

        <div>
          <h4 className={styles.footerHeading}>Produit</h4>
          <div className={styles.footerLinks}>
            {productLinks.map((l) => (
              <a key={l} href="#" className={styles.footerLink}>
                {l}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className={styles.footerHeading}>Légal</h4>
          <div className={styles.footerLinks}>
            {legalLinks.map((l) => (
              <a key={l} href="#" className={styles.footerLink}>
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.footerBottom}>
        <span className={styles.copyright}>© 2026 Kyernal. Tous droits réservés.</span>
        <span className={styles.hosted}>Hébergé en France · RGPD</span>
      </div>
    </footer>
  );
}

export default function PublicLanding() {
  const [mode, setMode] = useState<Mode>('dark');
  const toggle = () => setMode((m) => (m === 'dark' ? 'light' : 'dark'));
  const { isAuthReady: isLoggedIn } = useAuthReady();

  return (
    <div className={styles.root} style={getThemeVars(mode)}>
      <div className={styles.grid} aria-hidden="true" />
      <div className={styles.halo} aria-hidden="true" />

      <Nav mode={mode} onToggle={toggle} isLoggedIn={isLoggedIn} />

      <main className={styles.main}>
        <Hero isLoggedIn={isLoggedIn} />
        <DemoVideo />
        <Features />
        <Pricing isLoggedIn={isLoggedIn} />
      </main>

      <Footer mode={mode} />
    </div>
  );
}
