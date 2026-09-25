import Nav from "../components/Nav";

const Gallery = () => (
  <div className="flex min-h-screen flex-col bg-muted/40">
    <Nav />
    <main className="flex flex-1 flex-col items-center justify-center px-5 text-center">
      <span className="font-display text-xl font-semibold">Gallery</span>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        Your saved shots (stored locally in IndexedDB) appear here.
      </p>
    </main>
  </div>
);

export default Gallery;
