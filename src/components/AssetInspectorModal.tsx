import React from "react";

interface AssetInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AssetInspectorModal: React.FC<AssetInspectorModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const assets = [
    {
      name: "Primary Monogram Logo (Hotlinked from HTML)",
      url: "https://lh3.googleusercontent.com/aida/AEtjO1WDJIMTKmR9DVVv1oCBH8ovqUdjqOtC1MdzhamHvnt1WduA7UT9w1NGom_HTLE8TME-3B2IHlY_D8KhtJCbGMrwM58CjOJAdaIKP6tl1miDInKsKW-n_sM42L3spDazfEThGh_mKvm-3MFYSHGS6SUJyYXz3s6QiPIHeZDJnTngzIjFCNH81q7q726rWQBvLRWQ1lUMCaR9XJfAPHrFlusxak6AwPeOXCBKAOTZJKwKyfKe_xOnSrVm1qE",
      type: "PNG Image",
      status: "Live / 200 OK",
      role: "Header, Footer & Brand Monogram",
    },
    {
      name: "Material Symbols Outlined Icon Font",
      url: "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200",
      type: "Google Web Font",
      status: "Cached / 200 OK",
      role: "System Icons, Directional Cues & Analytics Markers",
    },
    {
      name: "Manrope & Inter Typography CDN",
      url: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Manrope:wght@500;600;700;800",
      type: "Google Web Font",
      status: "Cached / 200 OK",
      role: "Headings, Display Metrics, and Tabular Figures",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="bg-surface-container-lowest w-full max-w-2xl rounded-2xl p-6 sm:p-8 shadow-2xl border border-surface-container-high relative max-h-[85vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface flex items-center justify-center transition-colors cursor-pointer"
        >
          ✕
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center">
            <span className="material-symbols-outlined text-[24px]">image</span>
          </div>
          <div>
            <span className="font-label-sm text-[11px] text-secondary uppercase tracking-widest font-bold">
              MockupFlow Asset Telemetry
            </span>
            <h3 className="font-headline-md text-headline-md text-primary font-bold">
              Hotlinked Images &amp; CDNs
            </h3>
          </div>
        </div>

        <p className="text-xs text-on-surface-variant mb-4">
          MockupFlow automatically detects, verifies, and hotlinks external
          image and font assets embedded in the source HTML wireframe:
        </p>

        <div className="flex flex-col gap-3">
          {assets.map((asset, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-surface-container-low border border-surface-container-highest flex flex-col gap-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-primary">
                  {asset.name}
                </span>
                <span className="px-2 py-0.5 rounded bg-on-tertiary-container/10 text-on-tertiary-container text-[10px] font-bold">
                  {asset.status}
                </span>
              </div>

              {asset.type === "PNG Image" && (
                <div className="p-2 rounded bg-surface-container-lowest border border-surface-container flex items-center gap-4">
                  <img
                    src={asset.url}
                    alt="Asset preview"
                    className="h-8 w-auto object-contain bg-surface-container p-1 rounded"
                  />
                  <div className="text-[11px] text-on-surface-variant">
                    <span className="font-semibold block text-primary">
                      Preview Render:
                    </span>
                    <span>
                      Sreeram S R Monogram (SR) logo asset with blue outer rim
                      and teal typography.
                    </span>
                  </div>
                </div>
              )}

              <div className="text-[11px] text-on-surface-variant break-all font-mono bg-surface-container-lowest p-2 rounded border border-surface-container">
                {asset.url}
              </div>

              <div className="flex justify-between items-center text-[10px] text-on-surface-variant pt-1">
                <span>
                  <strong>Role:</strong> {asset.role}
                </span>
                <span>
                  <strong>Format:</strong> {asset.type}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-surface-container flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-primary text-white hover:bg-secondary rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
