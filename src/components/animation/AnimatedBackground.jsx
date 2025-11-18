import React from "react";
import "./AnimatedBackground.css";

export default function AnimatedBackground({ children }) {
  return (
    <div className="black-background">
      <div className="gradient-circle"></div>
      {children}
    </div>
  );
}
