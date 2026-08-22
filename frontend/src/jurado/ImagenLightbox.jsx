import { useEffect } from "react";

export default function ImagenLightbox({ src, alt, onClose }) {
  useEffect(() => {
    function alTeclado(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", alTeclado);
    const overflowPrevio = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", alTeclado);
      document.body.style.overflow = overflowPrevio;
    };
  }, [onClose]);

  return (
    <div className="jurado-lightbox" role="dialog" aria-modal="true" aria-label={alt} onClick={onClose}>
      <button type="button" className="jurado-lightbox-cerrar" onClick={onClose} aria-label="Cerrar imagen">
        <svg viewBox="0 0 20 20" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M5 5l10 10M15 5L5 15" strokeLinecap="round" />
        </svg>
      </button>
      <img className="jurado-lightbox-imagen" src={src} alt={alt} onClick={(e) => e.stopPropagation()} />
    </div>
  );
}
