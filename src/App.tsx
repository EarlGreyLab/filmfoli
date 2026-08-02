import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ThemeProvider } from "./lib/theme";
import { Nav } from "./components/Nav";
import { Footer } from "./components/Footer";
import { GrainOverlay } from "./components/GrainOverlay";
import { Home } from "./pages/Home";
import { Gallery } from "./pages/Gallery";
import { Reel } from "./pages/Reel";
import { Blog } from "./pages/Blog";
import { BlogPost } from "./pages/BlogPost";
import { About } from "./pages/About";
import { Contact } from "./pages/Contact";

/** SPA housekeeping: jump to top on route change (browsers only do this for full loads). */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo(0, 0), [pathname]);
  return null;
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <ScrollToTop />
        <GrainOverlay />
        <div className="flex min-h-screen flex-col">
          <Nav />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/reel" element={<Reel />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="*" element={<BlogPost />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}
