'use client';

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Thermometer,
  Snowflake,
  Flame,
  Wind,
  ShieldCheck,
  Zap,
  CheckCircle2,
  PhoneCall,
  MessageCircle,
  Mail,
  Loader2,
  AlertCircle,
  Star,
  Clock,
  Menu,
  X,
  ArrowUpRight,
} from "lucide-react";

/* ================================================================== */
/*  HVAC_ASSETS — single source of truth for every string & image      */
/*  ------------------------------------------------------------------ */
/*  Swap any URL, phone number, or text block below and the header,    */
/*  hero, service grid, dropdown options, trust badges, and footer     */
/*  all update automatically. Nothing downstream hardcodes copy.       */
/*                                                                      */
/*  Mock content-folder layout (mirrors a headless CMS):               */
/*    /content                                                         */
/*      /brand        → business identity + every contact channel     */
/*      /hero          → landing headline, subcopy, background photo   */
/*      /stats          → hero trust numbers                           */
/*      /services       → service grid (images optional per card)     */
/*      /process        → "how it works" steps                        */
/*      /trust-badges    → photo-backed credibility badges             */
/*      /pricing        → cost-estimator system types                  */
/*      /contact        → lead-capture section copy                   */
/*      /footer          → footer copy                                 */
/* ================================================================== */

// Unsplash CDN helper — keeps every image URL on the same query-param
// recipe (quality/format/crop) so swapping a photo ID is a one-line edit.
const unsplashUrl = (photoId, width = 1200) =>
  `https://images.unsplash.com/${photoId}?q=80&w=${width}&auto=format&fit=crop`;

const HVAC_ASSETS = {
  // /content/brand ----------------------------------------------------
  brand: {
    name: "Breeze Max",
    license: "TACLA00000000E",
    serviceArea: "Dallas–Fort Worth metro",
    // Every communication channel lives here. Change a number once,
    // it updates the header, hero, floating actions, and contact panel.
    phoneDisplay: "(555) 123-4567",
    phoneTel: "tel:+15551234567",
    whatsappNumber: "+1234567890", // digits only (no "+"), required by wa.me
    email: "muhammadzohaib4042@gmail.com",
    // Leave blank to fall back to a formatted mailto:. Point this at a
    // Formspree (or similar) endpoint — e.g. "https://formspree.io/f/abcdwxyz" —
    // to POST the lead form to a real inbox/CRM instead.
    formEndpoint: "",
  },

  // /content/hero -------------------------------------------------------
  hero: {
    statusLine: "Dispatch team online across Dallas–Fort Worth",
    headline: "Precision comfort, engineered for Texas heat.",
    subheadline:
      "Breeze Max keeps North Texas homes cool, warm, and running on live-monitored systems, with technicians on call every hour of every day.",
    backgroundImage: unsplashUrl("photo-1718203862467-c33159fdc504", 1800),
    primaryCtaLabel: "Get my instant estimate",
  },

  // /content/stats ------------------------------------------------------
  stats: [
    { icon: Star, value: "4.9", label: "average rating, 2,300+ jobs" },
    { icon: Clock, value: "38 min", label: "average dispatch time" },
    { icon: ShieldCheck, value: "10 yr", label: "parts & labor warranty" },
  ],

  // /content/services ----------------------------------------------------
  // `image` is optional per card — omit it and that card falls back to a
  // clean icon-only layout automatically (see <ServiceCard />).
  services: [
    {
      icon: Wind,
      title: "Duct cleaning",
      copy: "Full duct and vent cleaning that clears dust, allergens, and debris from every supply line.",
      tone: "emerald",
      image: unsplashUrl("photo-1558358235-a0a93f68a52c"),
    },
    {
      icon: Snowflake,
      title: "Compressor repair",
      copy: "Same-day compressor and condenser diagnostics for every major brand, backed by a 90-day guarantee.",
      tone: "amber",
      image: unsplashUrl("photo-1545649311-24d0ac00ae82"),
    },
    {
      icon: Flame,
      title: "Heating system check",
      copy: "Gas, electric, and heat-pump systems tuned for safe, even heat all winter long.",
      tone: "amber",
      image: unsplashUrl("photo-1631985455894-65311148a768"),
    },
    {
      icon: CheckCircle2,
      title: "Seasonal maintenance plans",
      copy: "Two tune-ups a year so small issues never turn into expensive ones.",
      tone: "amber",
    },
    {
      icon: ShieldCheck,
      title: "Indoor air quality",
      copy: "Filtration, UV, and humidity control for a house that breathes easier.",
      tone: "emerald",
    },
    {
      icon: Zap,
      title: "24/7 emergency response",
      copy: "A live technician answers day or night — no answering service, no waiting.",
      tone: "amber",
    },
  ],

  // /content/process -------------------------------------------------
  steps: [
    {
      n: "01",
      title: "Schedule your visit",
      copy: "Call or book online and pick a two-hour arrival window that fits your day.",
    },
    {
      n: "02",
      title: "A technician diagnoses on site",
      copy: "You get upfront, flat-rate pricing before any work begins — no surprises.",
    },
    {
      n: "03",
      title: "We fix it, same day",
      copy: "Most repairs are finished in a single visit, from a fully stocked service van.",
    },
  ],

  // /content/trust-badges ------------------------------------------------
  trustBadges: [
    {
      title: "Licensed & insured technicians",
      description:
        "Every technician carries state licensing, background checks, and full liability coverage on every job.",
      image: unsplashUrl("photo-1685320198649-781e83a61de4"),
    },
    {
      title: "Satisfaction guaranteed",
      description:
        "Not happy with the work? We come back and make it right at no extra cost — no questions asked.",
      image: unsplashUrl("photo-1521790797524-b2497295b8a0"),
    },
  ],

  // /content/pricing ------------------------------------------------------
  systemTypes: [
    {
      id: "ductless",
      label: "Ductless mini-split",
      blurb: "Zoned rooms, no ductwork",
      base: 3200,
      rate: 9,
    },
    {
      id: "central",
      label: "Central AC + furnace",
      blurb: "Whole-home, most common",
      base: 4200,
      rate: 6.5,
    },
    {
      id: "heatpump",
      label: "Heat pump system",
      blurb: "Efficient year-round comfort",
      base: 5200,
      rate: 7.5,
    },
    {
      id: "package",
      label: "Packaged rooftop unit",
      blurb: "Condos & single-story homes",
      base: 3800,
      rate: 6,
    },
  ],

  // /content/contact ----------------------------------------------------
  contact: {
    heading: "Ready when you are",
    subheading:
      "Send your details and a technician will follow up, or skip straight to a real person.",
    directHeading: "Prefer to talk now?",
    directCopy:
      "Skip the form. A dispatcher answers in about four minutes, any hour of the day.",
  },

  // /content/footer -------------------------------------------------------
  footer: {
    blurb: "Serving the Dallas–Fort Worth metro.",
  },
};

// Nav links stay separate from content since they're anchors into the
// page itself rather than editorial copy — but the label text is still
// centralized here, not scattered through the header markup.
const NAV_LINKS = [
  { id: "services", label: "Services" },
  { id: "how-it-works", label: "How it works" },
  { id: "estimate", label: "Estimate" },
  { id: "contact", label: "Contact" },
];

// Shared micro-interaction classes: every clickable control in the page
// scales up on hover and compresses slightly on press/tap.
const TAP_FX = "transition-transform duration-200 hover:scale-105 active:scale-95";

function handleImgError(e) {
  // If a hotlinked photo ever fails to load, hide it gracefully rather
  // than showing a broken-image icon — the gradient/overlay underneath
  // still reads fine on its own.
  e.currentTarget.style.display = "none";
}

/* ------------------------------------------------------------------ */
/*  Small utility components / hooks                                   */
/* ------------------------------------------------------------------ */

function Reveal({ children, className = "", delay = 0, as = "div" }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const Tag = as;

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.15 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0px)" : "translateY(26px)",
        transition: `opacity 0.8s ease ${delay}s, transform 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </Tag>
  );
}

function useAnimatedNumber(target, duration = 500) {
  const [display, setDisplay] = useState(target);
  const startRef = useRef(target);

  useEffect(() => {
    const from = startRef.current;
    const to = target;
    const startTime = performance.now();
    let raf;

    function tick(now) {
      const progress = Math.min(1, (now - startTime) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(from + (to - from) * eased));
      if (progress < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        startRef.current = to;
      }
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return display;
}

function currency(n) {
  return `$${Math.round(n / 10) * 10}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/* ------------------------------------------------------------------ */
/*  Header                                                              */
/* ------------------------------------------------------------------ */

function Header({ onNavClick }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { brand } = HVAC_ASSETS;

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 24);
    }
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="fixed top-0 inset-x-0 z-50 transition-all duration-300"
      style={{
        backgroundColor: scrolled ? "rgba(2,6,23,0.86)" : "rgba(2,6,23,0.0)",
        backdropFilter: scrolled ? "blur(14px)" : "none",
        borderBottom: scrolled
          ? "1px solid rgba(245,158,11,0.16)"
          : "1px solid rgba(245,158,11,0)",
      }}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <button
            onClick={() => onNavClick("hero")}
            className={`flex items-center gap-3 group ${TAP_FX}`}
          >
            <span
              className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600"
              style={{ boxShadow: "0 0 22px rgba(245,158,11,0.35)" }}
            >
              <Thermometer className="w-5 h-5 text-slate-950" strokeWidth={2.5} />
            </span>
            <span
              className="text-xl text-slate-50 tracking-tight"
              style={{ fontFamily: "'Chakra Petch', sans-serif", fontWeight: 600 }}
            >
              {brand.name}
            </span>
          </button>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-9">
            {NAV_LINKS.map((link) => (
              <button
                key={link.id}
                onClick={() => onNavClick(link.id)}
                className="text-sm text-slate-300 hover:text-amber-400 transition-colors duration-200"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Direct Mobile Dialer — prominent, always visible */}
          <div className="flex items-center gap-3">
            <a
              href={brand.phoneTel}
              className={`hidden sm:flex items-center gap-2 rounded-full border border-amber-500 px-4 py-2 text-sm text-amber-400 hover:bg-amber-500 hover:text-slate-950 ${TAP_FX}`}
              style={{ boxShadow: "0 0 16px rgba(245,158,11,0.18)" }}
              aria-label={`Call live dispatcher at ${brand.phoneDisplay}`}
            >
              <PhoneCall className="w-4 h-4" />
              Call Live Dispatcher
            </a>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className={`lg:hidden flex items-center justify-center w-10 h-10 rounded-lg border border-slate-800 text-slate-200 ${TAP_FX}`}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className="lg:hidden overflow-hidden transition-all duration-300"
        style={{
          maxHeight: menuOpen ? "320px" : "0px",
          backgroundColor: "rgba(2,6,23,0.97)",
          borderTop: menuOpen ? "1px solid rgba(245,158,11,0.14)" : "none",
        }}
      >
        <div className="px-6 py-5 flex flex-col gap-4">
          {NAV_LINKS.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                onNavClick(link.id);
                setMenuOpen(false);
              }}
              className="text-left text-slate-200 text-base py-1"
            >
              {link.label}
            </button>
          ))}
          <a
            href={brand.phoneTel}
            className={`flex items-center justify-center gap-2 rounded-full bg-amber-500 text-slate-950 px-4 py-3 text-sm font-medium mt-2 ${TAP_FX}`}
          >
            <PhoneCall className="w-4 h-4" />
            Call Live Dispatcher
          </a>
        </div>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/*  Floating action buttons (mobile-first quick contact)               */
/* ------------------------------------------------------------------ */

function FloatingActions() {
  const [show, setShow] = useState(false);
  const { brand } = HVAC_ASSETS;

  useEffect(() => {
    function onScroll() {
      setShow(window.scrollY > 480);
    }
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Generic quick-contact message — the FAB lives outside the lead form,
  // so it can't read live field values. The smart, field-aware WhatsApp
  // trigger lives in the LeadCapture section below.
  const genericWhatsappHref = `https://wa.me/${brand.whatsappNumber}?text=${encodeURIComponent(
    "Hi Breeze Max, I'd like help with my HVAC system."
  )}`;

  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 transition-all duration-400"
      style={{
        opacity: show ? 1 : 0,
        transform: show ? "translateY(0px)" : "translateY(16px)",
        pointerEvents: show ? "auto" : "none",
      }}
    >
      <a
        href={genericWhatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Message Breeze Max on WhatsApp"
        className={`flex items-center justify-center w-12 h-12 rounded-full border ${TAP_FX}`}
        style={{
          backgroundColor: "rgba(2,6,23,0.9)",
          borderColor: "rgba(16,185,129,0.5)",
          boxShadow: "0 0 18px rgba(16,185,129,0.3)",
        }}
      >
        <MessageCircle className="w-5 h-5 text-emerald-400" />
      </a>
      <a
        href={brand.phoneTel}
        aria-label={`Call Live Dispatcher now at ${brand.phoneDisplay}`}
        className={`flex items-center justify-center w-14 h-14 rounded-full ${TAP_FX}`}
        style={{
          background: "linear-gradient(135deg, #fbbf24, #d97706)",
          boxShadow: "0 0 0 6px rgba(245,158,11,0.14), 0 0 26px rgba(245,158,11,0.55)",
        }}
      >
        <PhoneCall className="w-6 h-6 text-slate-950" strokeWidth={2.5} />
      </a>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Hero                                                                */
/* ------------------------------------------------------------------ */

function ThermoDial() {
  const [pct, setPct] = useState(0);
  const target = 0.78; // decorative "system efficiency" ring

  useEffect(() => {
    const t = setTimeout(() => setPct(target), 350);
    return () => clearTimeout(t);
  }, []);

  const radius = 84;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - pct);

  return (
    <div className="relative w-64 h-64 sm:w-72 sm:h-72 mx-auto">
      {/* rotating tick ring */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          border: "1px dashed rgba(245,158,11,0.25)",
          animation: "spin-slow 40s linear infinite",
        }}
      />
      <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke="rgba(148,163,184,0.15)"
          strokeWidth="10"
        />
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke="url(#dialGradient)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1.4s cubic-bezier(0.16,1,0.3,1)" }}
        />
        <defs>
          <linearGradient id="dialGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
        </defs>
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="text-5xl sm:text-6xl text-slate-50 tabular-nums"
          style={{ fontFamily: "'Chakra Petch', sans-serif", fontWeight: 600 }}
        >
          72°
        </span>
        <span className="text-xs tracking-wide text-slate-400 mt-2">
          Perfect comfort, holding steady
        </span>
        <div className="flex items-center gap-1.5 mt-3">
          <span
            className="w-1.5 h-1.5 rounded-full bg-emerald-400"
            style={{ animation: "pulse-dot 2s ease-in-out infinite" }}
          />
          <span className="text-xs text-emerald-400">Live diagnostics online</span>
        </div>
      </div>
    </div>
  );
}

function Hero({ onNavClick }) {
  const { hero, stats, brand } = HVAC_ASSETS;

  return (
    <section
      id="hero"
      className="relative pt-40 pb-24 sm:pt-48 sm:pb-32 overflow-hidden"
    >
      {/* Hero background photo — swap HVAC_ASSETS.hero.backgroundImage and
          this layer updates everywhere it's used, no markup changes needed. */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <img
          src={hero.backgroundImage}
          alt=""
          onError={handleImgError}
          className="w-full h-full object-cover"
          style={{ opacity: 0.22 }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(2,6,23,0.75) 0%, rgba(2,6,23,0.92) 55%, rgba(2,6,23,1) 100%)",
          }}
        />
      </div>

      {/* ambient glows */}
      <div
        className="absolute -top-24 -left-24 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(245,158,11,0.22), transparent 70%)",
          filter: "blur(10px)",
          animation: "float-slow 12s ease-in-out infinite",
        }}
      />
      <div
        className="absolute top-40 -right-32 rounded-full pointer-events-none"
        style={{
          width: "28rem",
          height: "28rem",
          background: "radial-gradient(circle, rgba(16,185,129,0.16), transparent 70%)",
          filter: "blur(10px)",
          animation: "float-slow 15s ease-in-out infinite reverse",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.35,
          backgroundImage:
            "linear-gradient(rgba(148,163,184,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.06) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage: "radial-gradient(ellipse at 50% 30%, black 40%, transparent 75%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10 grid lg:grid-cols-2 gap-16 items-center">
        <Reveal>
          <div className="flex items-center gap-2 text-emerald-400 text-sm mb-6">
            <span
              className="w-1.5 h-1.5 rounded-full bg-emerald-400"
              style={{ animation: "pulse-dot 2s ease-in-out infinite" }}
            />
            {hero.statusLine}
          </div>
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl text-slate-50 max-w-xl"
            style={{
              fontFamily: "'Chakra Petch', sans-serif",
              fontWeight: 600,
              lineHeight: 1.08,
            }}
          >
            {hero.headline}
          </h1>
          <p className="mt-6 text-lg text-slate-400 max-w-md leading-relaxed">
            {hero.subheadline}
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => onNavClick("estimate")}
              className={`flex items-center justify-center gap-2 rounded-full bg-amber-500 text-slate-950 px-7 py-3.5 text-sm font-medium ${TAP_FX}`}
              style={{ boxShadow: "0 0 26px rgba(245,158,11,0.4)" }}
            >
              {hero.primaryCtaLabel}
              <ArrowUpRight className="w-4 h-4" />
            </button>
            {/* Direct Mobile Dialer — instant tel: trigger */}
            <a
              href={brand.phoneTel}
              className={`flex items-center justify-center gap-2 rounded-full border border-slate-700 text-slate-200 px-7 py-3.5 text-sm hover:border-amber-500 hover:text-amber-400 ${TAP_FX}`}
              aria-label={`Call live dispatcher at ${brand.phoneDisplay}`}
            >
              <PhoneCall className="w-4 h-4" />
              Call Live Dispatcher
            </a>
          </div>
          <p className="mt-3 text-xs text-slate-500">
            Tap to dial instantly on mobile · {brand.phoneDisplay}
          </p>

          <div className="mt-12 grid grid-cols-3 gap-6 max-w-lg">
            {stats.map((stat) => (
              <div key={stat.label}>
                <div className="flex items-center gap-1.5 text-amber-400">
                  <stat.icon className="w-4 h-4" />
                  <span
                    className="text-xl text-slate-50"
                    style={{ fontFamily: "'Chakra Petch', sans-serif", fontWeight: 600 }}
                  >
                    {stat.value}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1 leading-snug">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div
            className="relative rounded-3xl border p-10 flex items-center justify-center"
            style={{
              borderColor: "rgba(245,158,11,0.2)",
              backgroundColor: "rgba(15,23,42,0.4)",
              backdropFilter: "blur(16px)",
              boxShadow:
                "0 0 60px rgba(245,158,11,0.08), inset 0 0 40px rgba(15,23,42,0.4)",
            }}
          >
            <ThermoDial />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Services                                                            */
/* ------------------------------------------------------------------ */

function ServiceCard({ service, index }) {
  const Icon = service.icon;
  const accent = service.tone === "emerald" ? "emerald" : "amber";
  const accentColor = accent === "emerald" ? "16,185,129" : "245,158,11";
  const accentText = accent === "emerald" ? "text-emerald-400" : "text-amber-400";

  return (
    <Reveal delay={Math.min(index * 0.08, 0.4)}>
      <div
        className="group relative rounded-2xl border overflow-hidden h-full transition-all duration-300 hover:-translate-y-1.5"
        style={{ borderColor: "rgba(148,163,184,0.14)", backgroundColor: "rgba(15,23,42,0.5)" }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = `rgba(${accentColor},0.5)`;
          e.currentTarget.style.boxShadow = `0 0 28px rgba(${accentColor},0.18)`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "rgba(148,163,184,0.14)";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        {/* Photo variant: renders automatically whenever HVAC_ASSETS gives
            this service an `image`. Remove the URL and it falls back to
            the icon-only layout below with zero markup changes. */}
        {service.image ? (
          <div
            className="relative w-full overflow-hidden"
            style={{ aspectRatio: "16 / 9" }}
          >
            <img
              src={service.image}
              alt=""
              onError={handleImgError}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, rgba(2,6,23,0.15) 0%, rgba(2,6,23,0.9) 100%)",
              }}
            />
            <div
              className="absolute bottom-3 left-3 flex items-center justify-center w-10 h-10 rounded-xl"
              style={{ backgroundColor: `rgba(${accentColor},0.18)`, backdropFilter: "blur(4px)" }}
            >
              <Icon className={`w-5 h-5 ${accentText}`} />
            </div>
          </div>
        ) : null}

        <div className="p-7">
          {!service.image && (
            <div
              className="flex items-center justify-center w-11 h-11 rounded-xl mb-5"
              style={{ backgroundColor: `rgba(${accentColor},0.12)` }}
            >
              <Icon className={`w-5 h-5 ${accentText}`} />
            </div>
          )}
          <h3 className="text-lg text-slate-50 font-medium mb-2">{service.title}</h3>
          <p className="text-sm text-slate-400 leading-relaxed">{service.copy}</p>
        </div>
      </div>
    </Reveal>
  );
}

function Services() {
  const { services } = HVAC_ASSETS;
  return (
    <section id="services" className="relative py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal>
          <div className="max-w-xl mb-14">
            <h2
              className="text-3xl sm:text-4xl text-slate-50"
              style={{ fontFamily: "'Chakra Petch', sans-serif", fontWeight: 600 }}
            >
              Every comfort system, one crew
            </h2>
            <p className="mt-4 text-slate-400 leading-relaxed">
              From a rattling furnace to a full system replacement, our
              technicians carry the parts and training to close it out in one
              trip.
            </p>
          </div>
        </Reveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <ServiceCard service={service} index={i} key={service.title} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  How it works                                                       */
/* ------------------------------------------------------------------ */

function HowItWorks() {
  const { steps } = HVAC_ASSETS;
  return (
    <section id="how-it-works" className="relative py-28">
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(245,158,11,0.3), transparent)",
        }}
      />
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal>
          <h2
            className="text-3xl sm:text-4xl text-slate-50 max-w-xl"
            style={{ fontFamily: "'Chakra Petch', sans-serif", fontWeight: 600 }}
          >
            From call to fixed, in one visit
          </h2>
        </Reveal>
        <div className="mt-14 grid md:grid-cols-3 gap-10">
          {steps.map((step, i) => (
            <Reveal delay={i * 0.1} key={step.n}>
              <div className="relative pl-2">
                <span
                  className="text-4xl text-transparent bg-clip-text"
                  style={{
                    fontFamily: "'Chakra Petch', sans-serif",
                    fontWeight: 700,
                    backgroundImage: "linear-gradient(135deg, #fbbf24, #10b981)",
                  }}
                >
                  {step.n}
                </span>
                <h3 className="text-lg text-slate-50 font-medium mt-4 mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
                  {step.copy}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Trust badges — photo-backed credibility markers, sourced from
            HVAC_ASSETS.trustBadges. Add/remove an entry there and this
            grid reflows on its own. */}
        <div className="mt-20 grid sm:grid-cols-2 gap-6">
          {HVAC_ASSETS.trustBadges.map((badge, i) => (
            <Reveal delay={i * 0.1} key={badge.title}>
              <div
                className="flex items-center gap-5 rounded-2xl border p-5"
                style={{
                  borderColor: "rgba(148,163,184,0.14)",
                  backgroundColor: "rgba(15,23,42,0.5)",
                }}
              >
                <div
                  className="flex-shrink-0 rounded-xl overflow-hidden"
                  style={{ width: "72px", height: "72px" }}
                >
                  <img
                    src={badge.image}
                    alt=""
                    onError={handleImgError}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-slate-50 font-medium">{badge.title}</h4>
                  <p className="text-sm text-slate-400 mt-1 leading-relaxed">
                    {badge.description}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Cost estimate slider                                                */
/* ------------------------------------------------------------------ */

function CostEstimator() {
  const { systemTypes } = HVAC_ASSETS;
  const [sqft, setSqft] = useState(1800);
  const [systemId, setSystemId] = useState(systemTypes[1].id);
  const system = systemTypes.find((s) => s.id === systemId);

  const { low, high, monthly } = useMemo(() => {
    const lowRaw = system.base + sqft * system.rate * 0.85;
    const highRaw = system.base + sqft * system.rate * 1.25;
    return {
      low: lowRaw,
      high: highRaw,
      monthly: highRaw / 84,
    };
  }, [sqft, system]);

  const animatedLow = useAnimatedNumber(low);
  const animatedHigh = useAnimatedNumber(high);
  const animatedMonthly = useAnimatedNumber(monthly);

  const pct = ((sqft - 800) / (4000 - 800)) * 100;

  return (
    <section id="estimate" className="relative py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal>
          <div className="max-w-xl mb-14">
            <h2
              className="text-3xl sm:text-4xl text-slate-50"
              style={{ fontFamily: "'Chakra Petch', sans-serif", fontWeight: 600 }}
            >
              See what your project costs
            </h2>
            <p className="mt-4 text-slate-400 leading-relaxed">
              Move the slider and choose your system for a real installed
              price range. No sales call required.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div
            className="rounded-3xl border p-8 sm:p-12 grid lg:grid-cols-5 gap-12"
            style={{
              borderColor: "rgba(245,158,11,0.18)",
              backgroundColor: "rgba(15,23,42,0.5)",
              backdropFilter: "blur(16px)",
            }}
          >
            {/* Controls */}
            <div className="lg:col-span-3">
              <div className="flex items-baseline justify-between mb-4">
                <label className="text-sm text-slate-300">Home size</label>
                <span
                  className="text-2xl text-amber-400 tabular-nums"
                  style={{ fontFamily: "'Chakra Petch', sans-serif", fontWeight: 600 }}
                >
                  {sqft.toLocaleString()} sq ft
                </span>
              </div>
              <input
                type="range"
                min={800}
                max={4000}
                step={100}
                value={sqft}
                onChange={(e) => setSqft(Number(e.target.value))}
                className="hvac-slider w-full"
                style={{ "--fill": `${pct}%` }}
                aria-label="Home size in square feet"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-2">
                <span>800 sq ft</span>
                <span>4,000 sq ft</span>
              </div>

              <div className="mt-10">
                <label className="text-sm text-slate-300 mb-4 block">
                  System type
                </label>
                <div className="grid sm:grid-cols-2 gap-3">
                  {systemTypes.map((type) => {
                    const active = type.id === systemId;
                    return (
                      <button
                        key={type.id}
                        onClick={() => setSystemId(type.id)}
                        className={`text-left rounded-xl border px-4 py-3.5 ${TAP_FX}`}
                        style={{
                          borderColor: active
                            ? "rgba(245,158,11,0.6)"
                            : "rgba(148,163,184,0.16)",
                          backgroundColor: active
                            ? "rgba(245,158,11,0.1)"
                            : "transparent",
                        }}
                      >
                        <span
                          className={`block text-sm font-medium ${
                            active ? "text-amber-400" : "text-slate-200"
                          }`}
                        >
                          {type.label}
                        </span>
                        <span className="block text-xs text-slate-500 mt-0.5">
                          {type.blurb}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Output */}
            <div
              className="lg:col-span-2 rounded-2xl border p-8 flex flex-col justify-between"
              style={{
                borderColor: "rgba(16,185,129,0.25)",
                backgroundColor: "rgba(6,78,59,0.16)",
              }}
            >
              <div>
                <p className="text-xs text-emerald-400 mb-2">
                  Estimated installed price
                </p>
                <div
                  className="text-3xl sm:text-4xl text-slate-50 tabular-nums leading-tight"
                  style={{ fontFamily: "'Chakra Petch', sans-serif", fontWeight: 600 }}
                >
                  {currency(animatedLow)}–{currency(animatedHigh)}
                </div>
                <p className="text-sm text-slate-400 mt-4 leading-relaxed">
                  Based on {system.label.toLowerCase()} for a{" "}
                  {sqft.toLocaleString()} sq ft home, including equipment,
                  labor, and permitting.
                </p>
              </div>

              <div className="mt-8 pt-6 border-t" style={{ borderColor: "rgba(16,185,129,0.2)" }}>
                <p className="text-sm text-slate-300">
                  As low as{" "}
                  <span className="text-emerald-400 font-medium">
                    ${Math.round(animatedMonthly)}/mo
                  </span>{" "}
                  with approved financing
                </p>
                <button
                  onClick={() =>
                    document
                      .getElementById("contact")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className={`mt-5 w-full flex items-center justify-center gap-2 rounded-full bg-emerald-500 text-slate-950 px-6 py-3 text-sm font-medium ${TAP_FX}`}
                >
                  Lock in this estimate
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Lead capture — the three communication systems live here:          */
/*    1. Direct Mobile Dialer  → tel: anchor                           */
/*    2. Smart WhatsApp Trigger → wa.me anchor, built from form state  */
/*    3. Functional Email Form  → mailto: fallback or Formspree POST   */
/* ------------------------------------------------------------------ */

function LeadCapture() {
  const { contact, brand, services } = HVAC_ASSETS;
  const serviceOptions = useMemo(() => services.map((s) => s.title), [services]);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    service: serviceOptions[0] || "",
    message: "",
  });
  // idle | submitting | success | error
  const [status, setStatus] = useState("idle");

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  // --- 3. Functional Email Form ------------------------------------
  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("submitting");

    const endpoint = brand.formEndpoint;

    if (endpoint) {
      // Formspree-style external endpoint: POST the structured payload.
      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(form),
        });
        setStatus(res.ok ? "success" : "error");
      } catch (err) {
        setStatus("error");
      }
      return;
    }

    // No external endpoint configured — fall back to a neatly formatted
    // mailto: so the request lands directly in the dispatch inbox.
    try {
      const subject = `New service request from ${form.name || "website visitor"}`;
      const bodyLines = [
        `Name: ${form.name}`,
        `Phone: ${form.phone}`,
        `Email: ${form.email}`,
        `Service needed: ${form.service}`,
        "",
        "Message:",
        form.message || "(no additional details provided)",
      ];
      const mailtoHref = `mailto:${brand.email}?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(bodyLines.join("\n"))}`;
      window.location.href = mailtoHref;
      setStatus("success");
    } catch (err) {
      setStatus("error");
    }
  }

  // --- 2. Smart WhatsApp Trigger ------------------------------------
  // Recomputed on every render, so it always reflects whatever the
  // person has typed into Name / Selected Service right now.
  const whatsappMessage = `Hi ${brand.name}, this is ${
    form.name.trim() || "a homeowner"
  }. I'd like help with: ${form.service}. Please reach out when you can.`;
  const whatsappHref = `https://wa.me/${brand.whatsappNumber}?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  return (
    <section id="contact" className="relative py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal>
          <div className="max-w-xl mb-14">
            <h2
              className="text-3xl sm:text-4xl text-slate-50"
              style={{ fontFamily: "'Chakra Petch', sans-serif", fontWeight: 600 }}
            >
              {contact.heading}
            </h2>
            <p className="mt-4 text-slate-400 leading-relaxed">{contact.subheading}</p>
          </div>
        </Reveal>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Form panel — system 3: Functional Email Form */}
          <Reveal className="lg:col-span-3" delay={0.05}>
            <div
              className="rounded-3xl border p-8 sm:p-10 h-full"
              style={{
                borderColor: "rgba(245,158,11,0.18)",
                backgroundColor: "rgba(15,23,42,0.5)",
                backdropFilter: "blur(16px)",
              }}
            >
              {status === "success" ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center mb-5"
                    style={{ backgroundColor: "rgba(16,185,129,0.14)" }}
                  >
                    <CheckCircle2 className="w-7 h-7 text-emerald-400" />
                  </div>
                  <h3 className="text-xl text-slate-50 font-medium mb-2">
                    Request received
                  </h3>
                  <p className="text-sm text-slate-400 max-w-sm">
                    A technician will call {form.name || "you"} within 15
                    minutes. Keep your phone handy.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-5">
                  <div className="sm:col-span-1">
                    <label className="text-xs text-slate-400 block mb-2">
                      Full name
                    </label>
                    <input
                      required
                      value={form.name}
                      onChange={update("name")}
                      placeholder="Jordan Lee"
                      className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition-colors duration-200 focus:border-amber-500"
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <label className="text-xs text-slate-400 block mb-2">
                      Phone number
                    </label>
                    <input
                      required
                      type="tel"
                      value={form.phone}
                      onChange={update("phone")}
                      placeholder="(555) 010-0100"
                      className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition-colors duration-200 focus:border-amber-500"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs text-slate-400 block mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={update("email")}
                      placeholder="jordan@email.com"
                      className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition-colors duration-200 focus:border-amber-500"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs text-slate-400 block mb-2">
                      Service needed
                    </label>
                    {/* Options are generated from HVAC_ASSETS.services — add
                        a service to that array and it appears here too. */}
                    <select
                      value={form.service}
                      onChange={update("service")}
                      className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition-colors duration-200 focus:border-amber-500"
                    >
                      {serviceOptions.map((title) => (
                        <option key={title}>{title}</option>
                      ))}
                      <option>Something else</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs text-slate-400 block mb-2">
                      What's going on? (optional)
                    </label>
                    <textarea
                      value={form.message}
                      onChange={update("message")}
                      rows={3}
                      placeholder="e.g. Upstairs bedroom won't cool below 78°"
                      className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition-colors duration-200 focus:border-amber-500 resize-none"
                    />
                  </div>

                  {status === "error" && (
                    <div className="sm:col-span-2 flex items-center gap-2 text-sm text-amber-400 rounded-lg border border-amber-500/40 px-4 py-3">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      Something went wrong sending that — try again, or call
                      Live Dispatcher directly.
                    </div>
                  )}

                  <div className="sm:col-span-2">
                    <button
                      type="submit"
                      disabled={status === "submitting"}
                      className={`w-full flex items-center justify-center gap-2 rounded-full bg-amber-500 text-slate-950 px-6 py-3.5 text-sm font-medium disabled:opacity-70 ${TAP_FX}`}
                      style={{ boxShadow: "0 0 26px rgba(245,158,11,0.35)" }}
                    >
                      {status === "submitting" ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Sending…
                        </>
                      ) : (
                        <>
                          <Mail className="w-4 h-4" />
                          Request my estimate
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </Reveal>

          {/* Direct contact panel — systems 1 & 2: Call + WhatsApp */}
          <Reveal className="lg:col-span-2" delay={0.15}>
            <div
              className="rounded-3xl border p-8 sm:p-10 h-full flex flex-col justify-between"
              style={{
                borderColor: "rgba(16,185,129,0.25)",
                backgroundColor: "rgba(6,78,59,0.14)",
              }}
            >
              <div>
                <div className="flex items-center gap-2 text-emerald-400 text-sm mb-6">
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                    style={{ animation: "pulse-dot 2s ease-in-out infinite" }}
                  />
                  Dispatch team online now
                </div>
                <h3 className="text-xl text-slate-50 font-medium mb-2">
                  {contact.directHeading}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {contact.directCopy}
                </p>
              </div>

              <div className="mt-8 flex flex-col gap-3">
                {/* 1. Direct Mobile Dialer */}
                <a
                  href={brand.phoneTel}
                  className={`flex items-center justify-center gap-2 rounded-full bg-emerald-500 text-slate-950 px-6 py-3.5 text-sm font-medium ${TAP_FX}`}
                  aria-label={`Call Live Dispatcher at ${brand.phoneDisplay}`}
                >
                  <PhoneCall className="w-4 h-4" />
                  Call Live Dispatcher
                </a>

                {/* 2. Smart WhatsApp Trigger — href rebuilt every render from
                    the Name and Service fields in the form on the left. */}
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center justify-center gap-2 rounded-full border border-emerald-500 text-emerald-400 px-6 py-3.5 text-sm font-medium hover:bg-emerald-500 hover:text-slate-950 ${TAP_FX}`}
                >
                  <MessageCircle className="w-4 h-4" />
                  Send on WhatsApp
                </a>
                <p className="text-xs text-slate-500 text-center">
                  Prefills with your name and selected service from the form
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Footer                                                              */
/* ------------------------------------------------------------------ */

function Footer() {
  const { brand, footer } = HVAC_ASSETS;
  return (
    <footer className="relative border-t" style={{ borderColor: "rgba(148,163,184,0.12)" }}>
      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600">
            <Thermometer className="w-4 h-4 text-slate-950" strokeWidth={2.5} />
          </span>
          <div>
            <p
              className="text-slate-100 text-sm"
              style={{ fontFamily: "'Chakra Petch', sans-serif", fontWeight: 600 }}
            >
              {brand.name}
            </p>
            <p className="text-xs text-slate-500">
              Licensed & insured · {brand.license}
            </p>
          </div>
        </div>
        <p className="text-xs text-slate-500">
          © {new Date().getFullYear()} {brand.name} Heating & Air. {footer.blurb}
        </p>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/*  Root                                                                */
/* ------------------------------------------------------------------ */

export default function BreezeMaxLandingPage() {
  function handleNavClick(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div
      className="min-h-screen bg-slate-950 text-slate-100 antialiased"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@500;600;700&family=Inter:wght@400;500;600&display=swap');

        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(0, -24px); }
        }
        @keyframes pulse-dot {
          0%, 100% { box-shadow: 0 0 0 0 rgba(16,185,129,0.5); opacity: 1; }
          50% { box-shadow: 0 0 0 6px rgba(16,185,129,0); opacity: 0.7; }
        }

        .hvac-slider {
          -webkit-appearance: none;
          appearance: none;
          height: 8px;
          border-radius: 999px;
          background: linear-gradient(to right, #f59e0b var(--fill), #1e293b var(--fill));
          outline: none;
          cursor: pointer;
        }
        .hvac-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #fbbf24;
          border: 2px solid #78350f;
          box-shadow: 0 0 0 4px rgba(245,158,11,0.15), 0 0 20px rgba(245,158,11,0.6);
          transition: transform 0.15s ease;
        }
        .hvac-slider::-webkit-slider-thumb:hover {
          transform: scale(1.15);
        }
        .hvac-slider::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #fbbf24;
          border: 2px solid #78350f;
          box-shadow: 0 0 0 4px rgba(245,158,11,0.15), 0 0 20px rgba(245,158,11,0.6);
          cursor: pointer;
        }
        .hvac-slider::-moz-range-track {
          height: 8px;
          border-radius: 999px;
          background: transparent;
        }

        ::-webkit-scrollbar { width: 10px; }
        ::-webkit-scrollbar-track { background: #020617; }
        ::-webkit-scrollbar-thumb { background: #92400e; border-radius: 999px; }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.001ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.001ms !important;
          }
        }
      `}</style>

      <Header onNavClick={handleNavClick} />
      <FloatingActions />

      <main>
        <Hero onNavClick={handleNavClick} />
        <Services />
        <HowItWorks />
        <CostEstimator />
        <LeadCapture />
      </main>

      <Footer />
    </div>
  );
}
