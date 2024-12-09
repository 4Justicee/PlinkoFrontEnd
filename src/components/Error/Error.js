import React from "react";
import "./error.css";
import { motion } from "framer-motion";
import { errorStrings } from "../../utils/util";

const Error = ({ error }) => {
  const variants = {
    open: { opacity: 1, y: 0 },
    closed: { opacity: 0, y: "-100%" },
  };
  const errorString  = errorStrings[error];
  return (
    <motion.div
      initial={false}
      className='error'
      animate={error > 0 ? "open" : "closed"}
      variants={variants}
    >
      <p>
        <strong>ERROR!</strong> {errorString}
      </p>
    </motion.div>
  );
};

export default Error;
