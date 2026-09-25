import Nav from "../components/Nav";

const Capture = () => (
  <div className="flex min-h-screen flex-col bg-muted/40">
    <Nav />
    <main className="flex flex-1 flex-col items-center justify-center px-5 text-center">
      <span className="font-display text-xl font-semibold">Capture tool</span>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        The capture and annotation canvas lands here next.
      </p>
    </main>
  </div>
);

export default Capture;
