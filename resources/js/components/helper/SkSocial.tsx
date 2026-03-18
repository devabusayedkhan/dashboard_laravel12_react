import React, { useId, useState } from "react";
import "../../../css/SkSocial.css";

export type SocialItem = {
  icon: string;   // e.g. "fa-brands fa-facebook-f"
  color: string;  // hex use করলে best match হবে
  url: string;
  label?: string;
};

type SkSocialProps = {
  data: SocialItem[];
  className?: string;
  tileWidth?: number;
  iconSize?: number;
  gap?: number;
  initialActiveIndex?: number | null;
};

const SkSocial: React.FC<SkSocialProps> = ({
  data,
  className = "",
  tileWidth = 60,
  iconSize = 14,
  gap = 18,
  initialActiveIndex = null,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const safeId = useId().replace(/:/g, "");
  const activeIndex = hoveredIndex ?? initialActiveIndex;

  const itemHeight = Math.round(tileWidth * 0.92);

  return (
    <div
      className={`sk-social ${className}`.trim()}
      style={{ gap: `${gap}px` }}
    >
      {data.map((item: SocialItem, index: number) => {
        const isActive = activeIndex === index;

        const topStart = isActive ? lightenHex(item.color, 8) : "#ffffff";
        const topEnd = isActive ? darkenHex(item.color, 4) : "#f2f2f2";

        const leftStart = isActive ? darkenHex(item.color, 22) : "#dddddd";
        const leftEnd = isActive ? darkenHex(item.color, 34) : "#cfcfcf";

        const rightStart = isActive ? darkenHex(item.color, 14) : "#d8d8d8";
        const rightEnd = isActive ? darkenHex(item.color, 24) : "#c8c8c8";

        const iconColor = isActive ? "#ffffff" : "#111111";

        const topGradientId = `${safeId}-top-${index}`;
        const leftGradientId = `${safeId}-left-${index}`;
        const rightGradientId = `${safeId}-right-${index}`;

        return (
          <a
            key={`${item.icon}-${index}`}
            href={item.url || "#"}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={item.label || item.icon}
            title={item.label || ""}
            className={`sk-social__item ${isActive ? "is-active" : ""}`}
            style={{
              width: `${tileWidth}px`,
              height: `${itemHeight}px`,
            }}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            onFocus={() => setHoveredIndex(index)}
            onBlur={() => setHoveredIndex(null)}
          >
            <span className="sk-social__shadow" aria-hidden="true" />

            <span className="sk-social__block">
              <svg
                className="sk-social__svg"
                viewBox="0 0 204 164"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient
                    id={topGradientId}
                    x1="32"
                    y1="18"
                    x2="182"
                    y2="126"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop offset="0%" stopColor={topStart} />
                    <stop offset="100%" stopColor={topEnd} />
                  </linearGradient>

                  <linearGradient
                    id={leftGradientId}
                    x1="18"
                    y1="62"
                    x2="106"
                    y2="154"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop offset="0%" stopColor={leftStart} />
                    <stop offset="100%" stopColor={leftEnd} />
                  </linearGradient>

                  <linearGradient
                    id={rightGradientId}
                    x1="106"
                    y1="76"
                    x2="192"
                    y2="154"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop offset="0%" stopColor={rightStart} />
                    <stop offset="100%" stopColor={rightEnd} />
                  </linearGradient>
                </defs>

                {/* left face */}
                <polygon
                  points="18,62 106,124 106,154 18,92"
                  fill={`url(#${leftGradientId})`}
                />

                {/* right/front face */}
                <polygon
                  points="192,76 106,124 106,154 192,106"
                  fill={`url(#${rightGradientId})`}
                />

                {/* top face */}
                <polygon
                  points="18,62 104,14 192,76 106,124"
                  fill={`url(#${topGradientId})`}
                />

                {/* subtle top edge */}
                <polyline
                  points="18,62 104,14 192,76"
                  fill="none"
                  stroke={isActive ? darkenHex(item.color, 18) : "#f9f9f9"}
                  strokeOpacity="0.22"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* subtle outer edge */}
                <polyline
                  points="18,62 106,124 192,76"
                  fill="none"
                  stroke="rgba(0,0,0,0.06)"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <span
                className="sk-social__icon"
                style={{
                  fontSize: `${iconSize}px`,
                  color: iconColor,
                  textShadow: isActive
                    ? "0 1px 2px rgba(0,0,0,0.18)"
                    : "none",
                }}
              >
                <i className={item.icon} aria-hidden="true" />
              </span>
            </span>
          </a>
        );
      })}
    </div>
  );
};

function normalizeHex(color: string): string | null {
  let hex = color.trim().replace("#", "");

  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((char: string) => char + char)
      .join("");
  }

  if (!/^[0-9a-fA-F]{6}$/.test(hex)) {
    return null;
  }

  return `#${hex.toLowerCase()}`;
}

function mixHex(color: string, target: number, amount: number): string {
  const hex = normalizeHex(color);

  if (!hex) {
    return color;
  }

  const raw = hex.slice(1);
  const num = Number.parseInt(raw, 16);

  let r = (num >> 16) & 255;
  let g = (num >> 8) & 255;
  let b = num & 255;

  r = Math.round(r + (target - r) * (amount / 100));
  g = Math.round(g + (target - g) * (amount / 100));
  b = Math.round(b + (target - b) * (amount / 100));

  return `rgb(${r}, ${g}, ${b})`;
}

function lightenHex(color: string, amount: number): string {
  return mixHex(color, 255, amount);
}

function darkenHex(color: string, amount: number): string {
  return mixHex(color, 0, amount);
}

export default SkSocial;