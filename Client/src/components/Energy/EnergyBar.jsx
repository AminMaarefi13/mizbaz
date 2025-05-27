import React from "react";
import { useGameContext } from "../../context/GameContext";

export default function EnergyBar() {
  const { energy } = useGameContext();
  return (
    <div>
      <span>انرژی: {energy} / 10</span>
      <progress value={energy} max={10} style={{ width: 100 }} />
    </div>
  );
}
