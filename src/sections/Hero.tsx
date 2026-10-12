import { Fragment, type CSSProperties } from "react";
import {
  ArrowDown,
  ArrowRight,
  MapPin,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { /*heroKpis,*/ profile } from "@/content/profile";
import type { HeroKpi } from "@/types/content";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import { Magnetic } from "@/components/ui/Magnetic";
import { Container } from "@/components/ui/Section";
import { HeroVisual } from "@/components/three/HeroVisual";

/*
 * Entrance animations here are pure CSS (index.css → rise / nudge-up / fade-up):
 * the pre-rendered HTML animates before any JavaScript loads, so the headline
 * is on screen at first paint (good LCP), and reduced motion is honoured by
 * the global CSS guard.
 */
const delay = (seconds: number) =>
  ({ animationDelay: `${seconds}s` }) as CSSProperties;

/** Splits "I turn *messy data* into…" into words, flagging the *highlighted* ones. */
function parseHeadline(text: string) {
  return text.split(/(\*[^*]+\*)/).flatMap((chunk) => {
    const highlighted = chunk.startsWith("*") && chunk.endsWith("*");
    return chunk
      .replace(/\*/g, "")
      .split(" ")
      .filter(Boolean)
      .map((word) => ({ word, highlighted }));
  });
}

function Headline() {
  const words = parseHeadline(profile.headline);
  return (
    <h1
      id="hero-title"
      className="text-[2.6rem] leading-[1.02] font-semibold tracking-[-0.035em] sm:text-6xl lg:text-[4.6rem]"
    >
      {words.map(({ word, highlighted }, i) => (
        <Fragment key={i}>
          <span className="inline-block overflow-hidden pb-[0.08em] align-bottom">
            <span
              className={cn(
                "inline-block animate-rise",
                highlighted &&
                  "bg-linear-to-r from-accent to-accent-strong bg-clip-text text-transparent",
              )}
              style={delay(0.05 + i * 0.05)}
            >
              {word}
            </span>
          </span>{" "}
        </Fragment>
      ))}
    </h1>
  );
}

/** Small glass KPI cards floating over the 3D chart — reinforce the "dashboard" story. */
function KpiCard({
  kpi,
  className,
  startDelay,
}: {
  kpi: HeroKpi;
  className: string;
  startDelay: number;
}) {
  const TrendIcon = kpi.trend === "up" ? TrendingUp : TrendingDown;
  return (
    <div
      aria-hidden="true"
      className={cn("absolute hidden animate-fade-up sm:block", className)}
      style={delay(startDelay)}
    >
      <div
        className="animate-float rounded-2xl border border-line-strong bg-surface/80 px-4 py-3 shadow-card backdrop-blur-xl"
        style={delay(startDelay)}
      >
        <p className="font-mono text-[0.65rem] tracking-[0.18em] text-subtle uppercase">
          {kpi.label}
        </p>
        <p className="mt-1 flex items-center gap-2 font-mono text-xl font-semibold text-fg tabular">
          {kpi.value}
          <TrendIcon className="size-4 text-accent" />
        </p>
      </div>
    </div>
  );
}

const kpiPositions = [
  "top-[12%] left-[2%] lg:left-[4%]",
  "right-[4%] bottom-[16%] lg:right-[12%]",
];

export function Hero() {
  return (
    <section
      id="hero"
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden pt-24 sm:pt-28 lg:min-h-[100svh]"
    >
      {/* Background: dashboard grid + accent glows */}
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid mask-radial opacity-80" />
        <div className="glow absolute -top-64 right-[-20%] size-[56rem]" />
        <div className="absolute bottom-[-30%] left-[-25%] size-[44rem] bg-[radial-gradient(closest-side,rgb(67_56_202/0.14),transparent)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-b from-transparent to-bg" />
      </div>

      <Container className="grid items-center gap-6 lg:min-h-[calc(100svh-7rem)] lg:grid-cols-[1.05fr_1fr] lg:gap-4">
        <div className="relative z-10 max-w-2xl py-6 lg:py-16">
          {/* <p className="mb-7 inline-flex animate-fade-up flex-wrap items-center gap-x-3 gap-y-1 rounded-full border border-line bg-surface/60 py-1.5 pr-4 pl-2 text-sm text-muted backdrop-blur">
            <span className="inline-flex items-center gap-2 rounded-full bg-accent/12 px-2.5 py-0.5 font-medium text-accent">
              <span className="size-1.5 animate-pulse-dot rounded-full bg-accent" aria-hidden="true" />
              {profile.role}
            </span>
            <span>
              Hi, I'm <span className="text-fg">{profile.name}</span>
            </span>
          </p> */}

          <Headline />

          <p
            className="mt-6 max-w-xl animate-nudge-up text-lg leading-relaxed text-muted sm:text-xl"
            style={delay(0.35)}
          >
            {profile.valueProposition}
          </p>

          <div
            className="mt-10 flex animate-fade-up flex-col gap-3 sm:flex-row sm:items-center"
            style={delay(0.55)}
          >
            <Magnetic>
              <Button
                href="#projects"
                size="lg"
                className="w-full sm:w-auto"
                trailingIcon={
                  <ArrowRight aria-hidden="true" className="size-4" />
                }
              >
                View Projects
              </Button>
            </Magnetic>
            <Magnetic>
              <Button
                href="#contact"
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto"
              >
                Let's Work Together
              </Button>
            </Magnetic>
          </div>

          <p
            className="mt-10 flex animate-fade-up items-center gap-2 text-sm text-subtle"
            style={delay(0.8)}
          >
            <MapPin aria-hidden="true" className="size-4" />
            {profile.location}
          </p>
        </div>

        <div className="relative -mx-4 h-[340px] sm:mx-0 sm:h-[460px] lg:-mr-16 lg:h-[640px]">
          <HeroVisual />
          {/* {heroKpis.slice(0, kpiPositions.length).map((kpi, i) => (
            <KpiCard
              key={kpi.label}
              kpi={kpi}
              className={kpiPositions[i]}
              startDelay={1 + i * 0.2}
            />
          ))} */}
        </div>
      </Container>

      <a
        href="#stats"
        aria-label="Scroll to impact numbers"
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 font-mono text-[0.65rem] tracking-[0.25em] text-subtle uppercase transition-colors hover:text-fg lg:flex"
      >
        Scroll
        <ArrowDown aria-hidden="true" className="size-4 animate-bob" />
      </a>
    </section>
  );
}
