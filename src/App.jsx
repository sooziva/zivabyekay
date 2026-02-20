import "./App.css";
import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { ReactLenis } from "@studio-freight/react-lenis";

import Landing from "./pages/Landing/Landing";
import Home from "./pages/Home/Home";
import Work from "./pages/Work/Work";
import BeautyStore from "./pages/BeautyStore/BeautyStore";
import Booking from "./pages/Booking/Booking";
import KellsieBain from "./pages/KellsieBain/KellsieBain";
import Education from "./pages/Education/Education";
import About from "./pages/About/About";
import Weddings from "./pages/Weddings/Weddings";
import Contact from "./pages/Contact/Contact";
import Masterclasses from "./pages/Masterclasses/Masterclasses";
import CoachingCalls from "./pages/CoachingCalls/CoachingCalls";
import Resources from "./pages/Resources/Resources";
import Guide from "./pages/Guide/Guide";
import GuideText from "./pages/Guide/GuideText";
import Checklist from "./pages/Checklist/Checklist";
import BridalInquiry from "./pages/BridalInquiry/BridalInquiry";

function App() {
  const location = useLocation();

  return (
    <ReactLenis root>
      <div className="app">
        <AnimatePresence mode="wait" initial={false}>
          <Routes location={location} key={location.pathname}>
            <Route index element={<Landing />} />
            <Route path="/sooziva" element={<Home />} />
            <Route path="/work" element={<Work />} />
            <Route path="/beauty-store" element={<BeautyStore />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/ekay" element={<KellsieBain />} />
            <Route path="/ekay/about" element={<About />} />
            <Route path="/ekay/weddings" element={<Weddings />} />
            <Route path="/ekay/weddings/inquiry" element={<BridalInquiry />} />
            <Route path="/ekay/contact" element={<Contact />} />
            <Route path="/education" element={<Education />} />
            <Route path="/education/masterclasses" element={<Masterclasses />} />
            <Route path="/education/coaching-calls" element={<CoachingCalls />} />
            <Route path="/education/resources" element={<Resources />} />
            <Route path="/education/resources/guide" element={<Guide />} />
            <Route path="/education/resources/guide-text" element={<GuideText />} />
            <Route path="/education/resources/checklist" element={<Checklist />} />
          </Routes>
        </AnimatePresence>
      </div>
    </ReactLenis>
  );
}

export default App;
