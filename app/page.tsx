"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Sparkles, Activity, Bell, ChevronDown, Check, ArrowRight, User, Mail, Clock } from 'lucide-react';
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/utils";

type FeatureItem = { title: string; description: string };
type FaqItem = { question: string; answer: string };
type CategoryItem = { name: string; amount: string };

const LAUNCH_DATE = new Date(Date.now() + 1000 * 60 * 60 * 24 * 45);
const WAITLIST_BASE_COUNT = 2400;
const CATEGORY_WIDTHS = [72, 45, 30];
const FEATURE_ICONS = [Sparkles, Activity, Bell];

function getTimeLeft() {
  const diff = Math.max(0, LAUNCH_DATE.getTime() - Date.now());
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds };
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="glass flex w-16 flex-col items-center gap-1 rounded-xl px-2 py-3 sm:w-20 sm:py-4">
      <span className="font-display text-2xl font-semibold text-gradient sm:text-3xl">
        {String(value).padStart(2, "0")}
      </span>
      <span className="text-[10px] uppercase tracking-wide text-muted-foreground sm:text-xs">{label}</span>
    </div>
  );
}

export default function Home() {
  const t = useTranslations();
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [form, setForm] = useState({ name: "", email: "" });
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [position, setPosition] = useState<number | null>(null);
  const [openFaq, setOpenFaq] = useState<number>(0);

  useEffect(() => {
    const update = () => setTimeLeft(getTimeLeft());
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      setError(t("hero.form.errorRequired"));
      return;
    }
    const emailValid = /^\S+@\S+\.\S+$/.test(form.email);
    if (!emailValid) {
      setError(t("hero.form.errorEmail"));
      return;
    }
    setError("");
    const place = WAITLIST_BASE_COUNT + Math.floor(Math.random() * 40) + 1;
    setPosition(place);
    setSubmitted(true);
  }

  const featureItems = (Array.isArray(t.raw("features.items")) ? t.raw("features.items") : []) as FeatureItem[];
  const faqItems = (Array.isArray(t.raw("faq.items")) ? t.raw("faq.items") : []) as FaqItem[];
  const categories = (Array.isArray(t.raw("hero.mockup.categories")) ? t.raw("hero.mockup.categories") : []) as CategoryItem[];

  return (
    <main className="bg-background text-foreground">
      {/* HERO + WAITLIST FORM */}
      <Reveal>
        <section id="waitlist" className="bg-mesh relative overflow-hidden px-6 py-24 md:py-32">
          <div className="mx-auto grid max-w-6xl gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <span className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium uppercase tracking-wide text-foreground/80">
                <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                {t("hero.eyebrow")}
              </span>
              <h1 className="mt-6 text-balance font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl md:text-6xl">
                <span>{t("hero.titleMain")} </span>
                <span className="text-gradient">{t("hero.titleAccent")}</span>
              </h1>
              <p className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
                {t("hero.subtitle")}
              </p>

              <div className="mt-8 flex gap-3 sm:gap-4">
                <CountdownUnit value={timeLeft.days} label={t("hero.countdown.days")} />
                <CountdownUnit value={timeLeft.hours} label={t("hero.countdown.hours")} />
                <CountdownUnit value={timeLeft.minutes} label={t("hero.countdown.minutes")} />
                <CountdownUnit value={timeLeft.seconds} label={t("hero.countdown.seconds")} />
              </div>

              <div className="surface-elevated mt-10 max-w-md rounded-2xl border border-border bg-card p-6">
                {!submitted ? (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-3" noValidate>
                    <div className="relative">
                      <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder={t("hero.form.namePlaceholder")}
                        aria-label={t("hero.form.namePlaceholder")}
                        className="w-full rounded-lg border border-border bg-background py-2.5 pl-9 pr-3 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring"
                      />
                    </div>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                        placeholder={t("hero.form.emailPlaceholder")}
                        aria-label={t("hero.form.emailPlaceholder")}
                        className="w-full rounded-lg border border-border bg-background py-2.5 pl-9 pr-3 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring"
                      />
                    </div>
                    {error && <p className="text-sm text-destructive">{error}</p>}
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-glow transition hover:-translate-y-0.5 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none"
                    >
                      {t("hero.form.submit")}
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <p className="text-xs text-muted-foreground">{t("hero.form.disclaimer")}</p>
                  </form>
                ) : (
                  <div className="flex flex-col items-start gap-2 py-2">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Check className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <p className="font-display text-lg font-semibold">{t("hero.form.successTitle")}</p>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {t("hero.form.successBody", { position: position ?? WAITLIST_BASE_COUNT })}
                    </p>
                  </div>
                )}
              </div>

              <p className="mt-4 text-sm text-muted-foreground">
                {t("hero.socialProof", { count: "2,400" })}
              </p>
            </div>

            {/* Product mockup */}
            <div className="relative mx-auto w-full max-w-sm">
              <div className="glass-strong rounded-3xl p-5 shadow-glow">
                <div className="flex items-center justify-between border-b border-border/60 pb-4">
                  <span className="font-display text-sm font-semibold">{t("hero.mockup.title")}</span>
                  <span className="text-xs text-muted-foreground">{t("hero.mockup.period")}</span>
                </div>
                <div className="mt-4">
                  <p className="text-xs text-muted-foreground">{t("hero.mockup.balanceLabel")}</p>
                  <p className="font-display text-3xl font-semibold tracking-tight">{t("hero.mockup.balanceValue")}</p>
                </div>
                <div className="mt-6 flex flex-col gap-3">
                  {categories.map((cat, i) => (
                    <div key={cat.name}>
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium">{cat.name}</span>
                        <span className="text-muted-foreground">{cat.amount}</span>
                      </div>
                      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${CATEGORY_WIDTHS[i] ?? 40}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex items-center gap-3 rounded-xl border border-border bg-background/60 p-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
                    <Bell className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-medium">{t("hero.mockup.billName")}</p>
                    <p className="text-xs text-muted-foreground">{t("hero.mockup.billDue")}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      {/* SOCIAL PROOF STRIP */}
      <Reveal>
        <section className="border-y border-border bg-muted/40 px-6 py-10">
          <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
            <div className="flex -space-x-3">
              {["A", "M", "J", "K", "S"].map((letter) => (
                <span
                  key={letter}
                  className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-background bg-primary/15 text-sm font-semibold text-primary"
                >
                  {letter}
                </span>
              ))}
            </div>
            <p className="font-display text-lg font-medium sm:text-xl">
              {t("socialProof.headline", { count: "2,400" })}
            </p>
            <span className="glass inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium text-foreground/80">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
              {t("socialProof.badge")}
            </span>
          </div>
        </section>
      </Reveal>

      {/* FEATURES */}
      <Reveal>
        <section id="features" className="px-6 py-24 md:py-32">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-2xl">
              <span className="text-xs font-semibold uppercase tracking-wide text-primary">{t("features.eyebrow")}</span>
              <h2 className="mt-3 text-balance font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                {t("features.title")}
              </h2>
              <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">{t("features.subtitle")}</p>
            </div>
            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {featureItems.map((item, i) => {
                const Icon = FEATURE_ICONS[i] ?? Sparkles;
                return (
                  <Reveal key={item.title} delay={i * 0.08} className={i === 0 ? "md:col-span-2 md:row-span-1" : ""}>
                    <div
                      className={cn(
                        "surface-elevated h-full rounded-2xl border border-border bg-card p-7 transition hover:-translate-y-1 hover:shadow-lg motion-reduce:transition-none",
                        i === 0 && "bg-gradient-brand text-primary-foreground"
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-11 w-11 items-center justify-center rounded-xl",
                          i === 0 ? "bg-primary-foreground/15 text-primary-foreground" : "bg-primary/10 text-primary"
                        )}
                      >
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <h3 className="mt-5 font-display text-xl font-semibold">{item.title}</h3>
                      <p
                        className={cn(
                          "mt-2 text-sm leading-relaxed",
                          i === 0 ? "text-primary-foreground/80" : "text-muted-foreground"
                        )}
                      >
                        {item.description}
                      </p>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>
      </Reveal>

      {/* FOUNDER'S NOTE */}
      <Reveal>
        <section id="founder" className="border-y border-border bg-muted/30 px-6 py-24 md:py-32">
          <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div className="mx-auto w-full max-w-xs overflow-hidden rounded-2xl border border-border shadow-glow">
              <img
                src="https://titoaistorageaccount.blob.core.windows.net/titoai-storage/site-images/fd9d768ae39944cfa566a69c1279dc6b.jpg"
                alt="Portrait of Priya Patel, co-founder of Orbit"
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wide text-primary">{t("founder.eyebrow")}</span>
              <h2 className="mt-3 text-balance font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                {t("founder.title")}
              </h2>
              <p className="mt-6 text-pretty text-lg leading-relaxed text-foreground/90">{t("founder.quote")}</p>
              <div className="mt-6">
                <p className="font-display font-semibold">{t("founder.name")}</p>
                <p className="text-sm text-muted-foreground">{t("founder.role")}</p>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      {/* FAQ */}
      <Reveal>
        <section id="faq" className="px-6 py-24 md:py-32">
          <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wide text-primary">{t("faq.eyebrow")}</span>
              <h2 className="mt-3 text-balance font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                {t("faq.title")}
              </h2>
              <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">{t("faq.subtitle")}</p>
            </div>
            <div className="divide-y divide-border rounded-2xl border border-border bg-card">
              {faqItems.map((item, i) => (
                <div key={item.question}>
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                    className="flex w-full items-center justify-between gap-4 p-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    aria-expanded={openFaq === i}
                  >
                    <span className="font-medium">{item.question}</span>
                    <ChevronDown
                      className={cn("h-4 w-4 shrink-0 text-muted-foreground transition-transform", openFaq === i && "rotate-180")}
                      aria-hidden="true"
                    />
                  </button>
                  {openFaq === i && (
                    <div className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">{item.answer}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* FINAL CTA */}
      <Reveal>
        <section className="bg-gradient-brand px-6 py-20 text-primary-foreground md:py-28">
          <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 text-center">
            <h2 className="text-balance font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              {t("finalCta.title")}
            </h2>
            <p className="max-w-xl text-pretty leading-relaxed text-primary-foreground/85">{t("finalCta.subtitle")}</p>
            <Link
              href="#waitlist"
              className="glass-strong inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-primary-foreground transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none"
            >
              {t("finalCta.button")}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </section>
      </Reveal>
    </main>
  );
}