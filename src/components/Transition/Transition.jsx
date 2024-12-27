import { motion } from "framer-motion";
import "./Transition.css";

const Transition = (OriginalComponent, transitionText = "loading") => {
  return () => (
    <>
      <OriginalComponent />

      <motion.div
        className="slide-in"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0 }}
        exit={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="loader-bg">
          <img src="/loader/loader-bg.png" alt="" />
        </div>
        <p className="transition-text">
          origin <span>studio</span>
        </p>
      </motion.div>

      <motion.div
        className="slide-out"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, delay: 1 }}
      >
        <div className="loader-bg">
          <img src="/loader/loader-bg.png" alt="" />
        </div>
        <p className="transition-text">
          origin <span>studio</span>
        </p>
      </motion.div>
    </>
  );
};

export default Transition;
