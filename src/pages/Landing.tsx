import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Monitor,
  PenTool,
  EyeOff,
  ClipboardPaste,
  Images,
  Download,
  ArrowRight,
  Check,
  ChevronDown,
} from "lucide-react";
import Nav from "../components/Nav";
import Footer from "../components/Footer";

const features = [
  {
    icon: Monitor,
    title: "Screen, tab or window",
    desc: "Pick exactly what to share with the browser's native capture picker - full screen, a single window, or one tab.",
  },
  {
    icon: PenTool,
    title: "Full annotation kit",
    desc: "Arrows, boxes, ellipses, freehand pen, and text - with color and stroke controls that stay out of your way.",
  },
  {
    icon: EyeOff,
    title: "Blur sensitive data",
    desc: "Pixelate passwords, API keys, and personal info before the shot is ever exported.",
  },
  {
    icon: ClipboardPaste,
    title: "Paste or drag anything",
    desc: "No capture API? Paste from clipboard or drop an image file - works in every browser.",
  },
  {
    icon: Images,
    title: "Local gallery",
    desc: "Every export is stored in your browser's IndexedDB. Reopen any shot and keep editing.",
  },
  {
    icon: Download,
    title: "Export in one click",
    desc: "Copy straight to the clipboard or download a PNG, ready to paste into any doc or chat.",
  },
];

const steps = [
  {
    n: "01",
    title: "Capture",
    desc: "Hit the button, pick your screen, window, or tab - or paste an image you already have.",
  },
  {
    n: "02",
    title: "Mark up",
    desc: "Annotate with arrows, boxes, text, and blur. Undo freely, nothing is destructive.",
  },
  {
    n: "03",
    title: "Ship it",
    desc: "Copy to clipboard or download PNG. Your shot lands in the gallery automatically.",
  },
];

const faqs = [
  {
    q: "Does my screen get uploaded anywhere?",
    a: "No. Capture uses your browser's native getDisplayMedia API, annotation runs on a local canvas, exports are generated in memory, and the gallery lives in IndexedDB on your device. There is no server to send anything to.",
  },
  {
    q: "Which browsers are supported?",
    a: "Chrome, Edge, and Firefox support the full capture flow. Safari has limited screen-capture support, but paste and drag-and-drop work everywhere - so you can still annotate any image.",
  },
  {
    q: "Do I need an account?",
    a: "No signup, no login, no email. Open the tool and go.",
  },
  {
    q: "Where are my saved shots stored?",
    a: "In IndexedDB inside your browser profile, on your device only. Clearing the site's data removes them - export anything you want to keep.",
  },
  {
    q: "Is Shotframe really free?",
    a: "Yes - free forever, no pro tier, no capture limits. It's a client-side tool with nothing to meter.",
  },
];

const HeroMock = () => (
  <div className="relative mx-auto w-full max-w-[560px] animate-draw">
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[0_24px_60px_-24px_rgba(0,0,0,0.35)]">
      <div className="flex items-center gap-2 border-b border-border bg-muted/60 px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-2 flex items-center gap-1.5 rounded-full bg-background px-2.5 py-0.5 text-[10px] font-medium text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-danger animate-blink" />
          shotframe - captured
        </span>
      </div>

      <div className="relative h-[280px] bg-[#101014] sm:h-[320px]">
        <div className="absolute inset-0 flex">
          <div className="w-14 border-r border-white/10 bg-[#17171c] p-3">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="mb-2.5 h-7 rounded-lg bg-white/10" />
            ))}
          </div>
          <div className="flex-1 p-5">
            <div className="mb-4 h-4 w-40 rounded bg-white/25" />
            <div className="mb-2 h-2.5 w-full rounded bg-white/10" />
            <div className="mb-2 h-2.5 w-4/5 rounded bg-white/10" />
            <div className="mb-5 h-2.5 w-3/5 rounded bg-white/10" />
            <div className="grid grid-cols-3 gap-3">
              <div className="h-16 rounded-lg bg-white/10" />
              <div className="h-16 rounded-lg bg-[#b8ff2e]/25" />
              <div className="h-16 rounded-lg bg-white/10" />
            </div>
          </div>
        </div>

        <div
          className="absolute left-[22%] top-[38%] h-[74px] w-[46%] rounded-lg border-2 border-danger animate-draw"
          style={{ animationDelay: "0.35s" }}
        />
        <svg
          className="absolute right-[14%] top-[24%] animate-draw"
          width="90"
          height="70"
          viewBox="0 0 90 70"
          fill="none"
          style={{ animationDelay: "0.7s" }}
        >
          <path
            d="M85 65 C 60 55, 30 40, 8 10"
            stroke="#b8ff2e"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path d="M8 10 L 22 14 M8 10 L 12 24" stroke="#b8ff2e" strokeWidth="3" strokeLinecap="round" />
        </svg>
        <span
          className="absolute right-[10%] top-[10%] rounded-md bg-danger px-2 py-1 text-[11px] font-bold text-white animate-draw"
          style={{ animationDelay: "0.95s" }}
        >
          Ship this today
        </span>
        <div
          className="absolute bottom-[16%] left-[30%] h-12 w-28 rounded-md backdrop-blur-md animate-draw"
          style={{
            animationDelay: "1.15s",
            backgroundColor: "rgba(255,255,255,0.18)",
            backgroundImage:
              "repeating-linear-gradient(45deg, rgba(255,255,255,0.25) 0 4px, transparent 4px 8px)",
          }}
        />
      </div>
    </div>

    <div className="absolute -right-3 -top-3 rounded-xl border border-border bg-accent px-3 py-2 text-xs font-bold text-accent-foreground shadow-lg sm:-right-5 sm:-top-4">
      0 bytes uploaded
    </div>
  </div>
);

const Landing = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="flex min-h-screen flex-col">
      <Nav />

      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-5 pb-16 pt-14 md:pt-20">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-medium text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-accent ring-1 ring-foreground/20" />
                100% client-side - no uploads, no accounts
              </span>
              <h1 className="mt-5 font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-[3.4rem]">
                Capture. Mark up.
                <br />
                <span className="relative inline-block">
                  Ship it.
                  <span className="absolute -bottom-1.5 left-0 h-3 w-full -z-10 bg-accent" />
                </span>
              </h1>
              <p className="mt-5 max-w-md text-lg text-muted-foreground">
                Screenshot your screen, tab, or window, annotate it in seconds, and export - without a
                single byte leaving your browser.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Link
                  to="/capture"
                  className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background transition-transform hover:-translate-y-0.5"
                >
                  Open Capture
                  <ArrowRight size={16} />
                </Link>
                <a
                  href="#how"
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
                >
                  See how it works
                </a>
              </div>
              <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2">
                {["No signup", "No server", "Free forever", "Works offline"].map((t) => (
                  <span key={t} className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                    <Check size={13} className="text-foreground" />
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <HeroMock />
          </div>
        </section>

        <section className="border-y border-border bg-card">
          <div className="mx-auto grid max-w-6xl grid-cols-3 divide-x divide-border px-5">
            {[
              { big: "3", label: "capture modes" },
              { big: "8", label: "annotation tools" },
              { big: "0", label: "bytes uploaded" },
            ].map((s) => (
              <div key={s.label} className="py-8 text-center">
                <div className="font-display text-3xl font-bold sm:text-4xl">{s.big}</div>
                <div className="mt-1 text-xs font-medium uppercase tracking-wider text-muted-foreground sm:text-sm">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="features" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-16 md:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need, nothing you don't
            </h2>
            <p className="mt-3 text-muted-foreground">
              A focused toolbelt for the screenshot workflow - capture, annotate, export, done.
            </p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="group rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-1 hover:shadow-[0_16px_40px_-20px_rgba(0,0,0,0.3)]"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-foreground text-accent transition-transform group-hover:scale-110">
                  <f.icon size={18} />
                </span>
                <h3 className="mt-4 font-display text-base font-semibold">{f.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="how" className="scroll-mt-20 border-y border-border bg-card py-16 md:py-24">
          <div className="mx-auto max-w-6xl px-5">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                Three steps to a finished shot
              </h2>
              <p className="mt-3 text-muted-foreground">No installs, no accounts, no waiting.</p>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {steps.map((s) => (
                <div key={s.n} className="relative rounded-2xl border border-border bg-background p-6">
                  <span className="font-display text-sm font-bold text-muted-foreground">{s.n}</span>
                  <h3 className="mt-2 font-display text-xl font-semibold">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-foreground py-16 text-background md:py-20">
          <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-5 text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Nothing leaves your browser.
            </h2>
            <p className="max-w-xl text-background/70">
              Screen streams, canvas pixels, gallery images - all processed and stored locally. There
              is no backend to send anything to, because there is no backend.
            </p>
            <Link
              to="/privacy"
              className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition-transform hover:-translate-y-0.5"
            >
              Read the privacy details
              <ArrowRight size={15} />
            </Link>
          </div>
        </section>

        <section id="faq" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-16 md:py-24">
          <div className="mx-auto max-w-2xl">
            <h2 className="text-center font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Frequently asked questions
            </h2>
            <div className="mt-8 divide-y divide-border border-y border-border">
              {faqs.map((f, i) => (
                <div key={f.q}>
                  <button
                    className="flex w-full items-center justify-between gap-4 py-4 text-left"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    <span className="font-medium">{f.q}</span>
                    <ChevronDown
                      size={17}
                      className={`shrink-0 text-muted-foreground transition-transform ${
                        openFaq === i ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {openFaq === i && (
                    <p className="pb-5 pr-8 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 pb-20">
          <div className="relative overflow-hidden rounded-3xl border border-border bg-card px-6 py-14 text-center">
            <div className="absolute -left-16 -top-16 h-48 w-48 rounded-full bg-accent/40 blur-3xl" />
            <div className="absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-accent/30 blur-3xl" />
            <div className="relative">
              <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                Ready to take the shot?
              </h2>
              <p className="mx-auto mt-3 max-w-md text-muted-foreground">
                Open the capture tool and go from blank screen to annotated export in under a minute.
              </p>
              <Link
                to="/capture"
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-foreground px-7 py-3.5 text-sm font-semibold text-background transition-transform hover:-translate-y-0.5"
              >
                Open Capture
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Landing;
