import { motion } from "framer-motion";
import "./Transition.css";

const Transition = (OriginalComponent) => {
  return () => (
    <>
      <OriginalComponent />

      <motion.div
        className="slide-in"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0 }}
        exit={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      />
      <motion.div
        className="slide-out"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, delay: 1 }}
      />
    </>
  );
};

export default Transition;
