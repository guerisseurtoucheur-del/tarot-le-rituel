"use client";

import { useState, useEffect, useRef } from "react";
import StarField from "@/components/star-field";
import MysticOrb from "@/components/mystic-orb";
import FloatingCards from "@/components/floating-cards";
import TarotRitual from "@/components/tarot-ritual";

/* ---- Section wrapper with scroll reveal ---- */
function RevealSection({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(50px)",
        transition: `opacity 0.8s ease-out ${delay}s, transform 0.8s ease-out ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

/* ---- Decorative divider ---- */
function MysticDivider() {
  return (
    <div className="flex items-center justify-center gap-4 py-6">
      <div
        className="h-px flex-1 max-w-24"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(212,175,55,0.3))",
        }}
      />
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M10 0L12.245 7.755L20 10L12.245 12.245L10 20L7.755 12.245L0 10L7.755 7.755L10 0Z"
          fill="rgba(212,175,55,0.4)"
        />
      </svg>
      <div
        className="h-px flex-1 max-w-24"
        style={{
          background:
            "linear-gradient(to left, transparent, rgba(212,175,55,0.3))",
        }}
      />
    </div>
  );
}

/* ---- Services data ---- */
const SERVICES = [
  {
    title: "Tirage Classique",
    description:
      "Quatre arcanes majeurs pour eclairer votre chemin. Un tirage traditionnel qui revele les forces en jeu dans votre situation.",
    icon: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        aria-hidden="true"
      >
        <rect
          x="4"
          y="2"
          width="16"
          height="24"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <rect
          x="12"
          y="6"
          width="16"
          height="24"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity="0.5"
        />
      </svg>
    ),
  },
  {
    title: "Approfondissement",
    description:
      "Deux cartes supplementaires pour aller au-dela de la surface. Decouvrez les couches cachees de votre destinee.",
    icon: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        aria-hidden="true"
      >
        <circle
          cx="16"
          cy="16"
          r="12"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <circle
          cx="16"
          cy="16"
          r="6"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity="0.5"
        />
        <circle cx="16" cy="16" r="1.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    title: "Guidance Spirituelle",
    description:
      "Les arcanes majeurs de Grimaud canalisent une sagesse ancestrale pour vous offrir des reponses profondes et revelatrices.",
    icon: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M16 2L18.472 11.528L28 14L18.472 16.472L16 26L13.528 16.472L4 14L13.528 11.528L16 2Z"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>
    ),
  },
];

export default function HomePage() {
  const [showRitual, setShowRitual] = useState(false);
  const [mounted, setMounted] = useState(false);
  const ritualRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const startRitual = () => {
    setShowRitual(true);
    setTimeout(() => {
      ritualRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleRestart = () => {
    setShowRitual(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--color-background)" }}>
        <p className="text-primary tracking-widest text-sm" style={{ animation: "fade-in 0.5s ease-out" }}>
          Preparation du rituel...
        </p>
      </div>
    );
  }

  if (showRitual) {
    return (
      <main
        className="min-h-screen relative"
        style={{
          background:
            "radial-gradient(ellipse at center top, #0d0a14 0%, #050510 60%)",
        }}
      >
        <StarField />
        <div ref={ritualRef}>
          <TarotRitual onRestart={handleRestart} />
        </div>
      </main>
    );
  }

  return (
    <main className="relative overflow-hidden" style={{ background: "var(--color-background)" }}>
      <StarField />

      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 py-20">
        {/* Radial background glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(ellipse at 50% 30%, rgba(212,175,55,0.04) 0%, transparent 60%),
              radial-gradient(ellipse at 50% 80%, rgba(160,64,64,0.03) 0%, transparent 50%)
            `,
          }}
          aria-hidden="true"
        />

        <div className="relative z-10 text-center max-w-4xl mx-auto">
          {/* Mystic Orb */}
          <div
            className="mb-10"
            style={{ animation: "fade-in 1.2s ease-out" }}
          >
            <MysticOrb />
          </div>

          {/* Title */}
          <h1
            className="text-4xl md:text-6xl lg:text-7xl tracking-wider mb-4 text-balance"
            style={{
              color: "var(--color-primary)",
              animation: "fade-in-up 0.8s ease-out 0.3s both",
              lineHeight: 1.1,
            }}
          >
            Le Rituel du Tarot
          </h1>

          {/* Subtitle */}
          <p
            className="text-sm md:text-base tracking-[0.3em] uppercase mb-6"
            style={{
              color: "var(--color-muted-foreground)",
              animation: "fade-in-up 0.8s ease-out 0.5s both",
            }}
          >
            Les 22 Arcanes Majeurs du Tarot de Grimaud
          </p>

          <MysticDivider />

          {/* Description */}
          <p
            className="text-base md:text-lg leading-relaxed max-w-xl mx-auto mb-12 text-pretty"
            style={{
              color: "var(--color-secondary-foreground)",
              fontFamily: "var(--font-serif)",
              animation: "fade-in-up 0.8s ease-out 0.7s both",
            }}
          >
            Entrez dans le sanctuaire sacre de la voyante.
            Les cartes vous attendent, chargees de sagesse ancestrale
            et de revelations mystiques.
          </p>

          {/* CTA Button */}
          <div style={{ animation: "fade-in-up 0.8s ease-out 0.9s both" }}>
            <button
              className="relative group bg-transparent border border-primary text-primary px-10 py-4 font-sans text-base md:text-lg tracking-widest cursor-pointer transition-all duration-500 hover:bg-primary/10 hover:-translate-y-1"
              onClick={startRitual}
              style={{
                boxShadow: "0 0 30px rgba(212,175,55,0.1)",
              }}
            >
              <span className="relative z-10">Commencer le Rituel</span>
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(212,175,55,0.05) 0%, transparent 50%, rgba(212,175,55,0.05) 100%)",
                }}
              />
            </button>
          </div>

          {/* Scroll indicator */}
          <div
            className="mt-20 flex flex-col items-center gap-2"
            style={{ animation: "fade-in 1s ease-out 1.5s both" }}
          >
            <p
              className="text-xs tracking-[0.4em] uppercase"
              style={{ color: "var(--color-muted-foreground)", opacity: 0.5 }}
            >
              Decouvrir
            </p>
            <div
              className="w-px h-8"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(212,175,55,0.4), transparent)",
                animation: "fade-in 1.5s ease-in-out infinite alternate",
              }}
            />
          </div>
        </div>
      </section>

      {/* ===== FLOATING CARDS SECTION ===== */}
      <RevealSection>
        <section className="relative px-4 py-10">
          <div className="text-center mb-4">
            <p
              className="text-xs tracking-[0.4em] uppercase mb-4"
              style={{ color: "var(--color-muted-foreground)" }}
            >
              Les Arcanes
            </p>
            <h2
              className="text-2xl md:text-4xl tracking-wider mb-3 text-balance"
              style={{ color: "var(--color-primary)" }}
            >
              Les Cartes du Destin
            </h2>
            <p
              className="text-sm md:text-base max-w-lg mx-auto leading-relaxed text-pretty"
              style={{
                color: "var(--color-muted-foreground)",
                fontFamily: "var(--font-serif)",
              }}
            >
              Chaque arcane porte en elle une sagesse millenaire,
              un fragment de verite universelle.
            </p>
          </div>
          <FloatingCards />
        </section>
      </RevealSection>

      {/* ===== SERVICES SECTION ===== */}
      <RevealSection delay={0.1}>
        <section className="relative px-4 py-20 md:py-32">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <p
                className="text-xs tracking-[0.4em] uppercase mb-4"
                style={{ color: "var(--color-muted-foreground)" }}
              >
                Nos Services
              </p>
              <h2
                className="text-2xl md:text-4xl tracking-wider mb-3 text-balance"
                style={{ color: "var(--color-primary)" }}
              >
                La Voie des Arcanes
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {SERVICES.map((service, i) => (
                <RevealSection key={service.title} delay={i * 0.15}>
                  <div
                    className="group relative p-8 md:p-10 rounded-xl text-center transition-all duration-500 hover:-translate-y-1"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(212,175,55,0.02) 0%, rgba(10,10,26,0.5) 100%)",
                      border: "1px solid rgba(212,175,55,0.08)",
                      boxShadow: "0 4px 30px rgba(0,0,0,0.3)",
                    }}
                  >
                    {/* Hover glow */}
                    <div
                      className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                      style={{
                        background:
                          "radial-gradient(circle at 50% 0%, rgba(212,175,55,0.06) 0%, transparent 70%)",
                      }}
                    />

                    <div
                      className="relative z-10 text-primary mb-6 flex justify-center"
                      style={{ opacity: 0.7 }}
                    >
                      {service.icon}
                    </div>
                    <h3
                      className="relative z-10 text-base md:text-lg tracking-wider mb-4"
                      style={{ color: "var(--color-primary)" }}
                    >
                      {service.title}
                    </h3>
                    <p
                      className="relative z-10 text-sm leading-relaxed text-pretty"
                      style={{
                        color: "var(--color-muted-foreground)",
                        fontFamily: "var(--font-serif)",
                      }}
                    >
                      {service.description}
                    </p>
                  </div>
                </RevealSection>
              ))}
            </div>
          </div>
        </section>
      </RevealSection>

      {/* ===== ABOUT / ATMOSPHERE SECTION ===== */}
      <RevealSection delay={0.1}>
        <section className="relative px-4 py-20 md:py-32">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">
              {/* Card image showcase */}
              <div className="relative flex-shrink-0">
                <div
                  className="relative w-48 h-72 md:w-56 md:h-80 rounded-xl overflow-hidden"
                  style={{
                    border: "1px solid rgba(212,175,55,0.2)",
                    boxShadow: `
                      0 20px 60px rgba(0,0,0,0.5),
                      0 0 40px rgba(212,175,55,0.06)
                    `,
                    animation: "card-bob 6s ease-in-out infinite",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/cards/17-etoile.jpg"
                    alt="L'Etoile - Arcane XVII"
                    className="w-full h-full object-cover"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(5,5,16,0.4) 0%, transparent 40%)",
                    }}
                  />
                </div>
                {/* Floating secondary card behind */}
                <div
                  className="absolute -right-6 -bottom-6 w-40 h-60 md:w-44 md:h-64 rounded-xl overflow-hidden -z-10"
                  style={{
                    border: "1px solid rgba(212,175,55,0.1)",
                    boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
                    opacity: 0.5,
                    transform: "rotate(8deg)",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/cards/18-lune.jpg"
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Text content */}
              <div className="text-center md:text-left">
                <p
                  className="text-xs tracking-[0.4em] uppercase mb-4"
                  style={{ color: "var(--color-muted-foreground)" }}
                >
                  Le Sanctuaire
                </p>
                <h2
                  className="text-2xl md:text-3xl tracking-wider mb-6 text-balance"
                  style={{ color: "var(--color-primary)" }}
                >
                  Un Espace Sacre de Revelation
                </h2>
                <p
                  className="text-sm md:text-base leading-relaxed mb-6 text-pretty"
                  style={{
                    color: "var(--color-muted-foreground)",
                    fontFamily: "var(--font-serif)",
                    lineHeight: 1.8,
                  }}
                >
                  Depuis des siecles, le Tarot de Grimaud guide ceux qui
                  cherchent des reponses au-dela du visible. Les 22 arcanes
                  majeurs sont autant de portes vers une comprehension
                  profonde de votre destinee.
                </p>
                <p
                  className="text-sm md:text-base leading-relaxed text-pretty"
                  style={{
                    color: "var(--color-muted-foreground)",
                    fontFamily: "var(--font-serif)",
                    lineHeight: 1.8,
                    opacity: 0.7,
                  }}
                >
                  Chaque tirage est un rituel unique, un dialogue intime
                  entre vous et les forces de l'univers. Laissez-vous guider
                  par la sagesse des arcanes.
                </p>
              </div>
            </div>
          </div>
        </section>
      </RevealSection>

      {/* ===== FINAL CTA ===== */}
      <RevealSection delay={0.1}>
        <section className="relative px-4 py-24 md:py-36">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at 50% 50%, rgba(212,175,55,0.03) 0%, transparent 60%)",
            }}
            aria-hidden="true"
          />
          <div className="relative z-10 text-center max-w-2xl mx-auto">
            <MysticDivider />
            <h2
              className="text-2xl md:text-4xl tracking-wider mb-6 mt-6 text-balance"
              style={{ color: "var(--color-primary)" }}
            >
              Les Cartes Vous Attendent
            </h2>
            <p
              className="text-sm md:text-base leading-relaxed mb-10 text-pretty"
              style={{
                color: "var(--color-muted-foreground)",
                fontFamily: "var(--font-serif)",
              }}
            >
              Le moment est venu de poser votre question et de laisser les
              arcanes vous reveler ce que le destin a tisse pour vous.
            </p>
            <button
              className="relative group bg-transparent border border-primary text-primary px-10 py-4 font-sans text-base md:text-lg tracking-widest cursor-pointer transition-all duration-500 hover:bg-primary/10 hover:-translate-y-1"
              onClick={startRitual}
              style={{
                boxShadow: "0 0 30px rgba(212,175,55,0.1)",
              }}
            >
              <span className="relative z-10">Commencer le Rituel</span>
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(212,175,55,0.05) 0%, transparent 50%, rgba(212,175,55,0.05) 100%)",
                }}
              />
            </button>
            <MysticDivider />
          </div>
        </section>
      </RevealSection>

      {/* ===== FOOTER ===== */}
      <footer className="relative z-10 px-4 py-12 text-center">
        <div
          className="h-px max-w-xs mx-auto mb-8"
          style={{
            background:
              "linear-gradient(to right, transparent, rgba(212,175,55,0.2), transparent)",
          }}
        />
        <p
          className="text-xs tracking-[0.3em] uppercase"
          style={{ color: "var(--color-muted-foreground)", opacity: 0.4 }}
        >
          Le Rituel du Tarot
        </p>
        <p
          className="text-xs mt-2"
          style={{
            color: "var(--color-muted-foreground)",
            fontFamily: "var(--font-serif)",
            opacity: 0.3,
          }}
        >
          Les 22 Arcanes Majeurs du Tarot de Grimaud
        </p>
      </footer>
    </main>
  );
}
