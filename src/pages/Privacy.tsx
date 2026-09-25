import { Link } from "react-router-dom";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import { ArrowLeft } from "lucide-react";

const Privacy = () => (
  <div className="flex min-h-screen flex-col">
    <Nav />
    <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-14">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft size={15} />
        Back
      </Link>
      <h1 className="mt-5 font-display text-3xl font-bold tracking-tight sm:text-4xl">
        Privacy Policy
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: September 2026</p>

      <div className="mt-8 space-y-8 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="font-display text-lg font-semibold text-foreground">The short version</h2>
          <p className="mt-2">
            Shotframe has no backend. Your screen, images, annotations, and saved shots never leave
            your device. We literally have nowhere to send them.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-foreground">Screen capture</h2>
          <p className="mt-2">
            Capture uses your browser's native <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">getDisplayMedia</code>{" "}
            API. The video stream it returns is processed locally on a canvas and is never
            transmitted over the network.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-foreground">Storage</h2>
          <p className="mt-2">
            Saved shots are stored in IndexedDB inside your browser profile on this device. They are
            never synced or uploaded. Clearing the site's data deletes them permanently.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-foreground">
            Third parties & analytics
          </h2>
          <p className="mt-2">
            No analytics, no trackers, no cookies, no third-party scripts. The only external
            requests are the web fonts loaded from Google Fonts when the page opens.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-foreground">Contact</h2>
          <p className="mt-2">
            Questions? Open an issue on{" "}
            <a
              href="https://github.com/bilalmlkdev/shotframe"
              target="_blank"
              rel="noreferrer"
              className="font-medium text-foreground underline"
            >
              GitHub
            </a>
            .
          </p>
        </section>
      </div>
    </main>
    <Footer />
  </div>
);

export default Privacy;
