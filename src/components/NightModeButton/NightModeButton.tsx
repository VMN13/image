import React  from 'react';
import type { FC } from "react";

interface NightModeButtonProps {
  nightMode: boolean;
  setNightMode: (mode: boolean) => void;
}

const NightModeButton: FC<NightModeButtonProps> = ({ nightMode, setNightMode }) => {
  return (
    <>
      {nightMode && <div className="night-overlay"></div>}
      <button 
        className={`night-mode-button ${nightMode ? 'glowing' : ''}`} 
        onClick={() => setNightMode(!nightMode)}
      >
        {nightMode ? "🌞" : "🌜"}
      </button>
    </>
  );
};

export default NightModeButton;