# Zapsnip

**Capture. Mark up. Ship it.**

A screenshot tool that never phones home. Capture your screen, tab, or window, annotate it on a local canvas, and export - 100% client-side, with zero bytes uploaded.

## Features

- **Screen, tab, or window capture** via the browser's native `getDisplayMedia` API
- **Paste & drag fallback** - works even where screen capture isn't supported
- **Annotation toolkit** - arrows, rectangles, ellipses, freehand pen, text, and blur
- **Undo/redo** - non-destructive editing throughout
- **One-click export** - copy to clipboard or download PNG
- **Local gallery** - saved shots live in IndexedDB on your device
- **No accounts, no server, no analytics** - there is no backend to send anything to

## Stack

React 19 · TypeScript · Vite · Tailwind CSS 4 · React Router 7 · lucide-react

## Develop

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run lint
```

## Privacy

Everything - screen streams, canvas pixels, gallery images - is processed and stored locally in your browser. See [Privacy](./src/pages/Privacy.tsx) for details.

## License

MIT
