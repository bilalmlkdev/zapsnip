import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  ArrowUpRight,
  Square,
  Circle,
  Pencil,
  Highlighter,
  Type,
  EyeOff,
  ListOrdered,
  Crop,
  Undo2,
  Redo2,
  Trash2,
  Copy,
  Download,
  Heart,
  Plus,
  MonitorUp,
  ImagePlus,
  Check,
} from "lucide-react";
import { drawShapes } from "../utils/draw";
import type { Shape, Tool } from "../utils/draw";
import { putShot } from "../utils/db";
import Logo from "../components/Logo";

const TOOLS: { id: Tool; label: string; icon: typeof ArrowUpRight }[] = [
  { id: "arrow", label: "Arrow", icon: ArrowUpRight },
  { id: "rect", label: "Box", icon: Square },
  { id: "ellipse", label: "Ellipse", icon: Circle },
  { id: "pen", label: "Pen", icon: Pencil },
  { id: "highlight", label: "Mark", icon: Highlighter },
  { id: "text", label: "Text", icon: Type },
  { id: "blur", label: "Blur", icon: EyeOff },
  { id: "counter", label: "Step", icon: ListOrdered },
  { id: "crop", label: "Crop", icon: Crop },
];

const COLORS = ["#ef4444", "#facc15", "#b8ff2e", "#22d3ee", "#3b82f6", "#ffffff", "#0a0a0a"];
const WIDTHS = [
  { v: 2, label: "S" },
  { v: 4, label: "M" },
  { v: 8, label: "L" },
];

const norm = (a: number, b: number) => (a < b ? [a, b - a] : [b, a - b]);

const Capture = () => {
  const location = useLocation();
  const imgRef = useRef<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const idRef = useRef(1);

  const [imgTick, setImgTick] = useState(0);
  const [hasImage, setHasImage] = useState(false);
  const [tool, setTool] = useState<Tool>("arrow");
  const [color, setColor] = useState("#ef4444");
  const [stroke, setStroke] = useState(4);

  const [shapes, setShapes] = useState<Shape[]>([]);
  const [past, setPast] = useState<Shape[][]>([]);
  const [future, setFuture] = useState<Shape[][]>([]);
  const [draft, setDraft] = useState<Shape | null>(null);
  const [drawing, setDrawing] = useState(false);

  const [textPos, setTextPos] = useState<{ x: number; y: number; cx: number; cy: number } | null>(
    null,
  );
  const [textVal, setTextVal] = useState("");

  const [msg, setMsg] = useState<string | null>(null);
  const [flash, setFlash] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const flashMsg = useCallback((m: string) => {
    setFlash(m);
    setTimeout(() => setFlash(null), 1800);
  }, []);

  const loadImage = useCallback((img: HTMLImageElement) => {
    imgRef.current = img;
    setShapes([]);
    setPast([]);
    setFuture([]);
    setDraft(null);
    setTextPos(null);
    setTextVal("");
    setHasImage(true);
    setMsg(null);
    setImgTick((t) => t + 1);
  }, []);

  const loadFile = useCallback(
    (file: Blob) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        loadImage(img);
        URL.revokeObjectURL(url);
      };
      img.onerror = () => {
        setMsg("Couldn't read that image file.");
        URL.revokeObjectURL(url);
      };
      img.src = url;
    },
    [loadImage],
  );

  const captureScreen = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false,
      });
      const video = document.createElement("video");
      video.srcObject = stream;
      video.muted = true;
      await new Promise<void>((resolve, reject) => {
        video.onloadedmetadata = () => resolve();
        video.onerror = () => reject(new Error("video error"));
      });
      await video.play();
      await new Promise((r) => setTimeout(r, 180));
      const cv = document.createElement("canvas");
      cv.width = video.videoWidth;
      cv.height = video.videoHeight;
      cv.getContext("2d")?.drawImage(video, 0, 0);
      stream.getTracks().forEach((t) => t.stop());
      video.srcObject = null;
      const data = cv.toDataURL("image/png");
      const img = new Image();
      img.onload = () => loadImage(img);
      img.src = data;
    } catch {
      setMsg("Capture cancelled or unavailable here. Paste or upload an image instead.");
    }
  };

  useEffect(() => {
    const blob = (location.state as { blob?: Blob } | null)?.blob;
    if (blob) loadFile(blob);
  }, [location.state, loadFile]);

  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (const item of Array.from(items)) {
        if (item.type.startsWith("image/")) {
          const f = item.getAsFile();
          if (f) loadFile(f);
        }
      }
    };
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, [loadFile]);

  useEffect(() => {
    const c = canvasRef.current;
    const img = imgRef.current;
    if (!c || !img || !hasImage) return;
    c.width = img.naturalWidth;
    c.height = img.naturalHeight;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(img, 0, 0);
    const k = Math.max(1, c.width / 1000);
    drawShapes(ctx, shapes, k);
    if (draft) drawShapes(ctx, [draft], k);
  }, [shapes, draft, imgTick, hasImage]);

  const commit = (s: Shape) => {
    setPast((p) => [...p, shapes]);
    setShapes((prev) => [...prev, s]);
    setFuture([]);
    setDraft(null);
  };

  const undo = () => {
    if (!past.length) return;
    setFuture((f) => [shapes, ...f]);
    setShapes(past[past.length - 1]);
    setPast((p) => p.slice(0, -1));
  };

  const redo = () => {
    if (!future.length) return;
    setPast((p) => [...p, shapes]);
    setShapes(future[0]);
    setFuture((f) => f.slice(1));
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA")) return;
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
        e.preventDefault();
        if (e.shiftKey) redo();
        else undo();
      }
      if (e.key === "Escape") {
        setDraft(null);
        setTextPos(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const toCanvasPos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const c = canvasRef.current!;
    const r = c.getBoundingClientRect();
    return {
      x: (e.clientX - r.left) * (c.width / r.width),
      y: (e.clientY - r.top) * (c.height / r.height),
      cx: e.clientX - r.left,
      cy: e.clientY - r.top,
      sx: r.width / c.width,
    };
  };

  const onDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!hasImage || textPos) return;
    const p = toCanvasPos(e);
    e.currentTarget.setPointerCapture(e.pointerId);

    if (tool === "text") {
      setTextPos({ x: p.x, y: p.y, cx: p.cx, cy: p.cy });
      return;
    }
    if (tool === "counter") {
      const n = shapes.filter((s) => s.type === "counter").length + 1;
      commit({
        id: idRef.current++,
        type: "counter",
        x1: p.x,
        y1: p.y,
        x2: p.x,
        y2: p.y,
        color,
        width: stroke,
        text: String(n),
      });
      return;
    }
    setDrawing(true);
    setDraft({
      id: idRef.current++,
      type: tool,
      x1: p.x,
      y1: p.y,
      x2: p.x,
      y2: p.y,
      color,
      width: stroke,
      points: tool === "pen" ? [p.x, p.y] : undefined,
    });
  };

  const onMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing || !draft) return;
    const p = toCanvasPos(e);
    if (draft.type === "pen" && draft.points) {
      setDraft({ ...draft, points: [...draft.points, p.x, p.y] });
    } else {
      setDraft({ ...draft, x2: p.x, y2: p.y });
    }
  };

  const applyCrop = (s: Shape) => {
    const c = canvasRef.current;
    if (!c) return;
    const [x, w] = norm(s.x1, s.x2);
    const [y, h] = norm(s.y1, s.y2);
    if (w < 10 || h < 10) {
      setDraft(null);
      return;
    }
    const nc = document.createElement("canvas");
    nc.width = Math.round(w);
    nc.height = Math.round(h);
    nc.getContext("2d")?.drawImage(c, x, y, w, h, 0, 0, nc.width, nc.height);
    const img = new Image();
    img.onload = () => loadImage(img);
    img.src = nc.toDataURL("image/png");
  };

  const onUp = () => {
    if (!drawing || !draft) return;
    setDrawing(false);
    const dist = Math.hypot(draft.x2 - draft.x1, draft.y2 - draft.y1);
    if (draft.type === "pen") {
      if (draft.points && draft.points.length >= 4) commit(draft);
      else setDraft(null);
    } else if (draft.type === "crop") {
      if (dist > 10) applyCrop(draft);
      else setDraft(null);
    } else if (dist > 3) {
      commit(draft);
    } else {
      setDraft(null);
    }
  };

  const commitText = () => {
    if (!textPos || !textVal.trim()) {
      setTextPos(null);
      setTextVal("");
      return;
    }
    commit({
      id: idRef.current++,
      type: "text",
      x1: textPos.x,
      y1: textPos.y,
      x2: textPos.x,
      y2: textPos.y,
      color,
      width: stroke,
      text: textVal.trim(),
    });
    setTextPos(null);
    setTextVal("");
  };

  const withCanvas = (fn: (canvas: HTMLCanvasElement, blob: Blob) => void) => {
    const c = canvasRef.current;
    if (!c) return;
    c.toBlob((blob) => {
      if (!blob) return;
      fn(c, blob);
    }, "image/png");
  };

  const copyPng = () =>
    withCanvas((_c, blob) => {
      navigator.clipboard
        .write([new ClipboardItem({ "image/png": blob })])
        .then(() => flashMsg("Copied to clipboard"))
        .catch(() => setMsg("Clipboard blocked by the browser - use Download instead."));
    });

  const downloadPng = () =>
    withCanvas((_c, blob) => {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `zapsnip-${new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-")}.png`;
      a.click();
      URL.revokeObjectURL(a.href);
      flashMsg("Downloaded PNG");
    });

  const saveShot = () =>
    withCanvas((c, blob) => {
      putShot({
        id: crypto.randomUUID(),
        name: `Shot ${new Date().toLocaleString()}`,
        blob,
        width: c.width,
        height: c.height,
        createdAt: Date.now(),
      })
        .then(() => flashMsg("Saved to gallery"))
        .catch(() => setMsg("Could not save - storage may be full or blocked."));
    });

  const reset = () => {
    imgRef.current = null;
    setHasImage(false);
    setShapes([]);
    setPast([]);
    setFuture([]);
    setDraft(null);
    setTextPos(null);
    setMsg(null);
  };

  const clearMarks = () => {
    if (!shapes.length) return;
    setPast((p) => [...p, shapes]);
    setShapes([]);
    setFuture([]);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f && f.type.startsWith("image/")) loadFile(f);
  };

  const uploadClick = () => document.getElementById("zapsnip-file")?.click();

  return (
    <div className="flex h-screen flex-col bg-[#0c0c10] text-white">
      <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-white/10 px-3 sm:px-4">
        <div className="flex items-center gap-2.5 min-w-0">
          <Link
            to="/"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 hover:bg-white/15 transition-colors"
            title="Back to home"
          >
            <ArrowLeft size={16} />
          </Link>
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#b8ff2e] text-[#0a0a0a]">
            <Logo size={16} />
          </span>
          <span className="font-display text-sm font-semibold truncate">Zapsnip</span>
          {hasImage && (
            <span className="hidden sm:inline text-xs text-white/40 truncate">Untitled shot</span>
          )}
        </div>

        {hasImage && (
          <div className="flex items-center gap-1">
            <button
              onClick={undo}
              disabled={!past.length}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-white/70 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
              title="Undo (Ctrl+Z)"
            >
              <Undo2 size={15} />
            </button>
            <button
              onClick={redo}
              disabled={!future.length}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-white/70 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
              title="Redo (Ctrl+Shift+Z)"
            >
              <Redo2 size={15} />
            </button>
            <button
              onClick={clearMarks}
              disabled={!shapes.length}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-white/70 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
              title="Clear marks"
            >
              <Trash2 size={15} />
            </button>
            <span className="mx-1 h-5 w-px bg-white/10" />
            <button
              onClick={copyPng}
              className="hidden sm:flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium text-white/70 hover:bg-white/10 hover:text-white transition-colors"
              title="Copy PNG to clipboard"
            >
              <Copy size={14} /> Copy
            </button>
            <button
              onClick={downloadPng}
              className="flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium text-white/70 hover:bg-white/10 hover:text-white transition-colors"
              title="Download PNG"
            >
              <Download size={14} />
              <span className="hidden sm:inline">Download</span>
            </button>
            <button
              onClick={saveShot}
              className="flex h-8 items-center gap-1.5 rounded-lg bg-[#b8ff2e] px-3 text-xs font-bold text-[#0a0a0a] hover:brightness-95 transition-all"
              title="Save to gallery"
            >
              <Heart size={13} /> Save
            </button>
            <button
              onClick={reset}
              className="flex h-8 items-center gap-1.5 rounded-lg px-2 text-xs font-medium text-white/50 hover:bg-white/10 hover:text-white transition-colors"
              title="New capture"
            >
              <Plus size={14} />
              <span className="hidden md:inline">New</span>
            </button>
          </div>
        )}
      </header>

      <main
        className="flex-1 min-h-0 relative flex items-center justify-center overflow-hidden p-4 sm:p-6"
        style={{
          backgroundImage:
            "linear-gradient(45deg, #1a1a20 25%, transparent 25%), linear-gradient(-45deg, #1a1a20 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #1a1a20 75%), linear-gradient(-45deg, transparent 75%, #1a1a20 75%)",
          backgroundSize: "24px 24px",
          backgroundPosition: "0 0, 0 12px, 12px -12px, -12px 0px",
          backgroundColor: "#141419",
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
      >
        {!hasImage ? (
          <div
            className={`flex flex-col items-center text-center px-6 py-10 rounded-3xl border-2 border-dashed transition-colors max-w-lg w-full ${
              dragOver ? "border-[#b8ff2e] bg-[#b8ff2e]/5" : "border-white/15 bg-white/[0.03]"
            }`}
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#b8ff2e] text-[#0a0a0a] shadow-[0_0_40px_rgba(184,255,46,0.25)]">
              <Logo size={28} />
            </span>
            <h1 className="mt-5 font-display text-2xl font-bold sm:text-3xl">Snip something</h1>
            <p className="mt-2 text-sm text-white/50 max-w-sm">
              Capture your screen, tab, or window - or drop in an image to start marking it up.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={captureScreen}
                className="inline-flex items-center gap-2 rounded-full bg-[#b8ff2e] px-6 py-3 text-sm font-bold text-[#0a0a0a] hover:brightness-95 transition-all hover:-translate-y-0.5"
              >
                <MonitorUp size={16} />
                Capture screen
              </button>
              <button
                onClick={uploadClick}
                className="inline-flex items-center gap-2 rounded-full bg-white/10 px-6 py-3 text-sm font-semibold text-white hover:bg-white/15 transition-colors"
              >
                <ImagePlus size={16} />
                Upload image
              </button>
            </div>
            <p className="mt-5 text-xs text-white/35">
              or paste with <kbd className="rounded bg-white/10 px-1.5 py-0.5 font-mono">Ctrl+V</kbd>{" "}
              or drag &amp; drop anywhere here
            </p>
            {msg && <p className="mt-4 text-xs text-[#ff8a8a]">{msg}</p>}
            <input
              id="zapsnip-file"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) loadFile(f);
                e.target.value = "";
              }}
            />
          </div>
        ) : (
          <div className="relative max-h-full max-w-full" style={{ lineHeight: 0 }}>
            <canvas
              ref={canvasRef}
              className="block max-h-[calc(100vh-11rem)] sm:max-h-[calc(100vh-10rem)] max-w-full rounded-lg shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] touch-none"
              style={{
                cursor: tool === "text" ? "text" : "crosshair",
              }}
              onPointerDown={onDown}
              onPointerMove={onMove}
              onPointerUp={onUp}
              onPointerCancel={onUp}
            />
            {textPos && (
              <input
                autoFocus
                value={textVal}
                onChange={(e) => setTextVal(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") commitText();
                  if (e.key === "Escape") {
                    setTextPos(null);
                    setTextVal("");
                  }
                }}
                onBlur={commitText}
                placeholder="Type, Enter"
                className="absolute z-10 min-w-[140px] rounded-md border border-[#b8ff2e] bg-black/80 px-2 py-1 font-display font-bold text-white outline-none placeholder:text-white/30"
                style={{
                  left: textPos.cx,
                  top: textPos.cy,
                  color,
                  fontSize: 18,
                }}
              />
            )}
            {msg && (
              <div className="absolute -bottom-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-black/80 px-3.5 py-1.5 text-xs text-[#ff8a8a] border border-[#ff8a8a]/30">
                {msg}
              </div>
            )}
          </div>
        )}

        {flash && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 rounded-full bg-[#b8ff2e] px-4 py-2 text-xs font-bold text-[#0a0a0a] shadow-lg">
            <Check size={13} /> {flash}
          </div>
        )}
      </main>

      {hasImage && (
        <footer className="shrink-0 border-t border-white/10 bg-[#0c0c10] px-3 py-2.5">
          <div className="flex flex-wrap items-center justify-center gap-x-1 gap-y-2">
            {TOOLS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTool(t.id)}
                className={`flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-medium transition-colors ${
                  tool === t.id
                    ? "bg-[#b8ff2e] text-[#0a0a0a]"
                    : "text-white/60 hover:bg-white/10 hover:text-white"
                }`}
                title={t.label}
              >
                <t.icon size={15} />
                <span className="hidden lg:inline">{t.label}</span>
              </button>
            ))}

            <span className="mx-1.5 h-5 w-px bg-white/10 hidden sm:block" />

            <div className="flex items-center gap-1.5">
              {COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`h-6 w-6 rounded-full border-2 transition-transform hover:scale-110 ${
                    color === c ? "border-white scale-110" : "border-white/20"
                  }`}
                  style={{ backgroundColor: c }}
                  title={c}
                />
              ))}
              <label
                className="relative h-6 w-6 cursor-pointer rounded-full border-2 border-white/20 overflow-hidden hover:scale-110 transition-transform"
                title="Custom color"
                style={{ background: `conic-gradient(${color}, ${color})` }}
              >
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  aria-label="Custom color"
                />
              </label>
            </div>

            <span className="mx-1.5 h-5 w-px bg-white/10 hidden sm:block" />

            <div className="flex items-center gap-1">
              {WIDTHS.map((w) => (
                <button
                  key={w.v}
                  onClick={() => setStroke(w.v)}
                  className={`flex h-7 w-7 items-center justify-center rounded-lg text-[11px] font-bold transition-colors ${
                    stroke === w.v
                      ? "bg-white/15 text-white"
                      : "text-white/45 hover:bg-white/10 hover:text-white"
                  }`}
                  title={`${w.label} stroke`}
                >
                  {w.label}
                </button>
              ))}
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default Capture;
