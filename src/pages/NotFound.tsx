import { Link } from "react-router-dom";
import Nav from "../components/Nav";
import Footer from "../components/Footer";

const NotFound = () => (
  <div className="flex min-h-screen flex-col">
    <Nav />
    <main className="flex flex-1 flex-col items-center justify-center px-5 py-20 text-center">
      <span className="font-display text-7xl font-bold tracking-tight">404</span>
      <p className="mt-3 text-muted-foreground">This snip doesn't exist.</p>
      <Link
        to="/"
        className="mt-7 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background"
      >
        Back to home
      </Link>
    </main>
    <Footer />
  </div>
);

export default NotFound;
