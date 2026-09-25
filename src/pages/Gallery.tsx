import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Images, Trash2, Download, PenLine, Plus } from "lucide-react";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import { getShots, deleteShot } from "../utils/db";
import type { Shot } from "../utils/db";

const Gallery = () => {
  const navigate = useNavigate();
  const [shots, setShots] = useState<Shot[]>([]);
  const [urls, setUrls] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    const map: Record<string, string> = {};
    getShots()
      .then((list) => {
        if (!alive) return;
        list.forEach((s) => {
          map[s.id] = URL.createObjectURL(s.blob);
        });
        setShots(list);
        setUrls(map);
        setLoading(false);
      })
      .catch(() => setLoading(false));
    return () => {
      alive = false;
      Object.values(map).forEach((u) => URL.revokeObjectURL(u));
    };
  }, []);

  const remove = async (id: string) => {
    await deleteShot(id);
    setShots((prev) => prev.filter((s) => s.id !== id));
    setUrls((prev) => {
      URL.revokeObjectURL(prev[id]);
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const download = (shot: Shot) => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(shot.blob);
    a.download = `zapsnip-${shot.id.slice(0, 8)}.png`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const openEditor = (shot: Shot) => {
    navigate("/capture", { state: { blob: shot.blob } });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Nav />

      <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-12">
        <div className="text-center">
          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Gallery</h1>
          <p className="mt-2 text-muted-foreground">
            Saved shots live in your browser only - nothing was uploaded.
          </p>
        </div>

        {loading ? (
          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-52 animate-pulse rounded-2xl border border-border bg-muted" />
            ))}
          </div>
        ) : shots.length === 0 ? (
          <div className="mx-auto mt-12 flex max-w-md flex-col items-center rounded-3xl border border-dashed border-border bg-card px-6 py-14 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-foreground text-accent">
              <Images size={26} />
            </span>
            <h2 className="mt-5 font-display text-xl font-semibold">No shots yet</h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Capture something and hit Save - it will show up here.
            </p>
            <Link
              to="/capture"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background transition-transform hover:-translate-y-0.5"
            >
              <Plus size={15} />
              New capture
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {shots.map((shot) => (
              <div
                key={shot.id}
                className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-[0_16px_40px_-20px_rgba(0,0,0,0.3)]"
              >
                <button
                  onClick={() => openEditor(shot)}
                  className="relative block h-48 w-full overflow-hidden bg-muted"
                  title="Open in editor"
                >
                  <img
                    src={urls[shot.id]}
                    alt={shot.name}
                    loading="lazy"
                    className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                  <span className="absolute inset-0 flex items-center justify-center bg-foreground/50 opacity-0 transition-opacity group-hover:opacity-100">
                    <span className="flex items-center gap-1.5 rounded-full bg-background px-4 py-2 text-xs font-semibold text-foreground">
                      <PenLine size={13} />
                      Open in editor
                    </span>
                  </span>
                </button>

                <div className="flex items-center justify-between gap-3 px-4 py-3">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium text-foreground">{shot.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {shot.width} x {shot.height}
                    </div>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <button
                      onClick={() => download(shot)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      title="Download PNG"
                    >
                      <Download size={15} />
                    </button>
                    <button
                      onClick={() => remove(shot.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-danger/10 hover:text-danger"
                      title="Delete shot"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {shots.length > 0 && (
          <Link
            to="/capture"
            className="mx-auto mt-10 flex w-fit items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background transition-transform hover:-translate-y-0.5"
          >
            <Plus size={15} />
            New capture
          </Link>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Gallery;
