import { Link } from "react-router-dom";
import Logo from "./Logo";
import { GithubIcon, XIcon } from "./BrandIcons";

const columns = [
  {
    title: "Product",
    links: [
      { to: "/capture", label: "Capture" },
      { to: "/gallery", label: "Gallery" },
      { to: "/#features", label: "Features" },
      { to: "/#faq", label: "FAQ" },
    ],
  },
  {
    title: "Legal",
    links: [
      { to: "/privacy", label: "Privacy" },
      { to: "/#how", label: "How it works" },
    ],
  },
];

const Footer = () => (
  <footer className="border-t border-border bg-card">
    <div className="mx-auto max-w-6xl px-5 py-12">
      <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <Link to="/" className="flex items-center gap-2.5 font-display text-lg font-bold tracking-tight">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground text-accent">
              <Logo size={17} />
            </span>
            Zapsnip
          </Link>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            Capture. Mark up. Ship it. A screenshot tool that never phones home - everything runs in
            your browser.
          </p>
          <div className="mt-4 flex gap-2">
            <a
              href="https://github.com/bilalmlkdev/zapsnip"
              target="_blank"
              rel="noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:text-foreground"
              title="GitHub"
            >
              <GithubIcon size={16} />
            </a>
            <a
              href="https://x.com/bilalmlkdev"
              target="_blank"
              rel="noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:text-foreground"
              title="X / Twitter"
            >
              <XIcon size={15} />
            </a>
          </div>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              {col.title}
            </h4>
            <ul className="mt-3 space-y-2">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="text-sm text-muted-foreground hover:text-foreground">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row">
        <span>&copy; {new Date().getFullYear()} Zapsnip. Free forever.</span>
        <span>
          Built by{" "}
          <a
            href="https://github.com/bilalmlkdev"
            target="_blank"
            rel="noreferrer"
            className="font-medium text-foreground hover:underline"
          >
            Bilal Malik
          </a>
        </span>
      </div>
    </div>
  </footer>
);

export default Footer;
