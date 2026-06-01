// src/components/Icons.jsx
// Petites icônes SVG reprises de la maquette, encapsulées dans la
// pastille verte ".cp-icon".

const base = {
  width: 12,
  height: 12,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export function CpIcon({ children }) {
  return (
    <span className="cp-icon">
      <svg {...base}>{children}</svg>
    </span>
  );
}

export const PinIcon = () => (
  <CpIcon>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </CpIcon>
);

export const BedIcon = () => (
  <CpIcon>
    <path d="M2 4v16" />
    <path d="M2 8h18a2 2 0 0 1 2 2v10" />
    <path d="M2 17h20" />
    <path d="M6 8v9" />
  </CpIcon>
);

export const BathIcon = () => (
  <CpIcon>
    <path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-2.121 0L2 6" />
    <path d="M22 12H2v3a4 4 0 0 0 4 4h12a4 4 0 0 0 4-4z" />
    <path d="M2 12V3a1 1 0 0 1 1-1h2" />
    <path d="M7 19v3" />
    <path d="M17 19v3" />
  </CpIcon>
);

export const GarageIcon = () => (
  <CpIcon>
    <path d="M5 17h14" />
    <path d="M3 13h18l-2-7H5z" />
    <circle cx="7" cy="17" r="2" />
    <circle cx="17" cy="17" r="2" />
  </CpIcon>
);

export const CameraIcon = () => (
  <CpIcon>
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <circle cx="12" cy="13" r="4" />
  </CpIcon>
);
