import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import Landing from "./pages/Landing";
import Capture from "./pages/Capture";
import Gallery from "./pages/Gallery";
import Privacy from "./pages/Privacy";
import NotFound from "./pages/NotFound";

const router = createBrowserRouter([
  { path: "/", element: <Landing /> },
  { path: "/capture", element: <Capture /> },
  { path: "/gallery", element: <Gallery /> },
  { path: "/privacy", element: <Privacy /> },
  { path: "*", element: <NotFound /> },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
