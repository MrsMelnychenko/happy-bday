import React from "react";
import "./GreetingCard.css";

export default function GreetingCard({ hasCandles }) {
  const cakeClass = hasCandles ? "non-blown-out" : "blown-out";
  return (
    <div className="card">
      <div className={cakeClass}></div>
      <div className="happy-text">happy</div>
      <div className="outlined-text">BIRTHDAY</div>
    </div>
  );
}
