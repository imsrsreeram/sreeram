import React, { useState } from "react";

interface MockupStudioBarProps {
  deviceMode: "desktop" | "tablet" | "mobile";
  setDeviceMode: (mode: "desktop" | "tablet" | "mobile") => void;
  wireframeMode: boolean;
  setWireframeMode: (val: boolean) => void;
  onOpenSourceModal: () => void;
  onOpenAssetInspector: () => void;
}

export const MockupStudioBar: React.FC<MockupStudioBarProps> = ({
  deviceMode,
  setDeviceMode,
  wireframeMode,
  setWireframeMode,
  onOpenSourceModal,
  onOpenAssetInspector,
}) => {
  const [collapsed, setCollapsed] = useState(false);

  if (collapsed) {
    return (
      <div className="fixed top-2 right-4 z-50">
        <button
          onClick={() => setCollapsed(false)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary text-white shadow-xl text-xs font-semibold hover:bg-secondary transition-all cursor-pointer border border-white/20"
          title="Open MockupFlow Controls"
        >
          <span className="material-symbols-outlined text-[16px] text-tertiary-fixed-dim">
            auto_awesome
          </span>
          <span>MockupFlow Studio</span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-[#0e1b32]/95 backdrop-blur-md border-b border-white/10 text-white px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-3 shadow-lg">
      {/* Brand & Status */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-secondary/30 border border-secondary/40">
          <span className="w-2 h-2 rounded-full bg-on-tertiary-container animate-pulse" />
          <span className="font-bold text-white tracking-wide">MockupFlow</span>
        </div>
        <span className="hidden sm:inline text-surface-variant text-[11px]">
          HTML Wireframe → High-Fidelity Prototype
        </span>
      </div>

      {/* Device Viewport Selector */}
      <div className="flex items-center gap-1 bg-white/10 p-1 rounded-lg">
        <button
          onClick={() => setDeviceMode("desktop")}
          className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
            deviceMode === "desktop"
              ? "bg-secondary text-white font-bold"
              : "text-surface-variant hover:text-white"
          }`}
          title="Desktop View (Full Width)"
        >
          <span className="material-symbols-outlined text-[15px]">
            desktop_windows
          </span>
          <span className="hidden md:inline">Desktop</span>
        </button>
        <button
          onClick={() => setDeviceMode("tablet")}
          className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
            deviceMode === "tablet"
              ? "bg-secondary text-white font-bold"
              : "text-surface-variant hover:text-white"
          }`}
          title="Tablet View (768px)"
        >
          <span className="material-symbols-outlined text-[15px]">
            tablet_mac
          </span>
          <span className="hidden md:inline">Tablet</span>
        </button>
        <button
          onClick={() => setDeviceMode("mobile")}
          className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
            deviceMode === "mobile"
              ? "bg-secondary text-white font-bold"
              : "text-surface-variant hover:text-white"
          }`}
          title="Mobile View (390px)"
        >
          <span className="material-symbols-outlined text-[15px]">
            smartphone
          </span>
          <span className="hidden md:inline">Mobile</span>
        </button>
      </div>

      {/* Quick Tools */}
      <div className="flex items-center gap-2">
        {/* Wireframe Outline Toggle */}
        <button
          onClick={() => setWireframeMode(!wireframeMode)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors border cursor-pointer ${
            wireframeMode
              ? "bg-[#002114] text-tertiary-fixed-dim border-[#00966a]"
              : "bg-white/5 text-surface-variant hover:text-white border-white/10"
          }`}
          title="Toggle Wireframe Blueprint Overlay"
        >
          <span className="material-symbols-outlined text-[15px]">
            {wireframeMode ? "check_box" : "check_box_outline_blank"}
          </span>
          <span>Wireframe Grid</span>
        </button>

        {/* Hotlink Asset Inspector */}
        <button
          onClick={onOpenAssetInspector}
          className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/5 hover:bg-white/15 text-surface-variant hover:text-white text-xs transition-colors border border-white/10 cursor-pointer"
          title="Inspect Hotlinked Assets & Images"
        >
          <span className="material-symbols-outlined text-[15px] text-secondary-fixed">
            image
          </span>
          <span className="hidden sm:inline">Linked Assets</span>
        </button>

        {/* HTML Source Inspector */}
        <button
          onClick={onOpenSourceModal}
          className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/5 hover:bg-white/15 text-surface-variant hover:text-white text-xs transition-colors border border-white/10 cursor-pointer"
          title="View Source HTML Wireframe"
        >
          <span className="material-symbols-outlined text-[15px] text-tertiary-fixed-dim">
            code
          </span>
          <span className="hidden sm:inline">Source HTML</span>
        </button>

        {/* Collapse Button */}
        <button
          onClick={() => setCollapsed(true)}
          className="p-1 rounded text-surface-variant hover:text-white text-xs cursor-pointer ml-1"
          title="Hide toolbar"
        >
          ✕
        </button>
      </div>
    </div>
  );
};
