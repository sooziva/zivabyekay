import "./App.css";
import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { ReactLenis } from "@studio-freight/react-lenis";

import Home from "./pages/Home/Home";
import Work from "./pages/Work/Work";

function App() {
  const location = useLocation();

  useEffect(() => {
    const scrollTimeout = setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "instant",
      });
    }, 2000);

    return () => clearTimeout(scrollTimeout);
  }, [location.pathname]);

  return (
    <ReactLenis root>
      <div className="app">
        <AnimatePresence mode="wait" initial={false}>
          <Routes location={location} key={location.pathname}>
            <Route index element={<Home />} />
            <Route path="/work" element={<Work />} />
          </Routes>
        </AnimatePresence>
      </div>
    </ReactLenis>
  );
}

export default App;
