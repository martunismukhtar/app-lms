import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const toastIcons = {
  success: "✅",
  error: "❌",
  warning: "⚠️",
  info: "ℹ️",
};

const Toast = ({ id, message, type = "success", onClose, duration }) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const step = 100 / (duration / 50);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(interval);
          return 0;
        }
        return prev - step;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [duration]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 100 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`toast toast-${type}`}
      >
        <div className="toast-content">
          <span className="toast-icon">{toastIcons[type]}</span>
          <span>{message}</span>
          <button onClick={() => onClose(id)} className="toast-close">×</button>
        </div>
        <div className="toast-progress" style={{ width: `${progress}%` }} />
      </motion.div>
    </AnimatePresence>
  );
};

export default Toast;
