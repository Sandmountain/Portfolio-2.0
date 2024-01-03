import React from "react";

import { useBlinking } from "../../../hooks/useBlinking";
import styles from "../Commandline.module.css";

const BlinkingDot: React.FC = () => {
  const cursorVisible = useBlinking(true);
  return (
    <span style={{ opacity: cursorVisible ? 1 : 0, fontWeight: 700 }} className={styles.paragraph}>
      ■
    </span>
  );
};

export default BlinkingDot;
