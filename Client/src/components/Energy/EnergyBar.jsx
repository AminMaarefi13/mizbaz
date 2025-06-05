import React from "react";
import { useAppContext } from "../../context/AppContext";

export default function EnergyBar() {
  const { energy } = useAppContext();
  return (
    <div>
      <span>انرژی: {energy} / 10</span>
      <progress value={energy} max={10} style={{ width: 100 }} />
    </div>
  );
}
