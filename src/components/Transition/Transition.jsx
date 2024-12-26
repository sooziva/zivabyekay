import { motion } from "framer-motion";
import "./Transition.css";

const Transition = (OriginalComponent) => {
  return () => (
    <>
      <OriginalComponent />

      <motion.div
        className="slide-in"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 0 }}
        exit={{ scaleY: 1 }}
        transition={{ duration: 1, ease: [0.9, 0, 0.1, 1] }}
      />
      <motion.div
        className="slide-out"
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        exit={{ scaleY: 0 }}
        transition={{ duration: 1, delay: 0.25, ease: [0.9, 0, 0.1, 1] }}
      />
    </>
  );
};

export default Transition;
