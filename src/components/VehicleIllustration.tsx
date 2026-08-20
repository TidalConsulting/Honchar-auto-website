/**
 * Side-profile illustration used wherever a vehicle has no uploaded photo yet.
 * The silhouette changes with body type and the paint follows `exteriorColor`,
 * so a grid of listings still reads as distinct vehicles.
 */

const PAINT: Record<string, { base: string; dark: string; light: string }> = {
  white: { base: "#e8ebf0", dark: "#b9c0cc", light: "#ffffff" },
  black: { base: "#2b3038", dark: "#181c22", light: "#464d58" },
  gray: { base: "#8b939f", dark: "#666e7a", light: "#adb5c0" },
  silver: { base: "#c2c8d1", dark: "#98a0ac", light: "#e2e6ec" },
  red: { base: "#c0392b", dark: "#8e2820", light: "#e05c4a" },
  blue: { base: "#2f5d9e", dark: "#20406e", light: "#4a80c9" },
  green: { base: "#2f6b4f", dark: "#204a37", light: "#458f6c" },
  yellow: { base: "#e0a42b", dark: "#b07d18", light: "#f0c05e" },
  orange: { base: "#d9722c", dark: "#a8541c", light: "#ee9553" },
  brown: { base: "#6f5340", dark: "#4f3a2c", light: "#8d6d56" },
  tan: { base: "#c4a884", dark: "#9c8365", light: "#dcc5a7" },
  maroon: { base: "#7b2733", dark: "#571a23", light: "#a13c4a" },
};

function paintFor(color?: string | null) {
  if (color) {
    const needle = color.toLowerCase();
    for (const key of Object.keys(PAINT)) {
      if (needle.includes(key)) return PAINT[key];
    }
  }
  return PAINT.white;
}

type Props = {
  bodyType: string;
  exteriorColor?: string | null;
  className?: string;
};

export function VehicleIllustration({ bodyType, exteriorColor, className }: Props) {
  const paint = paintFor(exteriorColor);
  const uid = `${bodyType}-${exteriorColor ?? "default"}`.replace(/[^a-zA-Z0-9]/g, "");
  const glass = "#9fb4c9";
  const glassDark = "#7c93ab";
  const chassis = "#3c424c";

  const wheels = wheelPositions(bodyType);

  return (
    <svg
      viewBox="58 104 704 350"
      className={className}
      role="img"
      aria-label={`${bodyType} illustration`}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        {/* Painted in user space and oversized so the backdrop still fills the
            frame when a taller container letterboxes the wide viewBox. */}
        <linearGradient
          id={`sky-${uid}`}
          gradientUnits="userSpaceOnUse"
          x1="0"
          y1="60"
          x2="0"
          y2="470"
        >
          <stop offset="0%" stopColor="#f7f8fa" />
          <stop offset="100%" stopColor="#dde3ea" />
        </linearGradient>
        <linearGradient id={`body-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={paint.light} />
          <stop offset="55%" stopColor={paint.base} />
          <stop offset="100%" stopColor={paint.dark} />
        </linearGradient>
      </defs>

      <rect x="-1200" y="-1200" width="3200" height="3200" fill={`url(#sky-${uid})`} />
      <ellipse cx="420" cy="420" rx="320" ry="16" fill="#0d1118" opacity="0.1" />

      <g>
        {shapeFor(bodyType, `url(#body-${uid})`, paint, glass, glassDark, chassis)}
        {wheels.map((wheel, index) => (
          <Wheel key={index} cx={wheel.x} cy={366} r={wheel.r} />
        ))}
      </g>
    </svg>
  );
}

function Wheel({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="#22262d" />
      <circle cx={cx} cy={cy} r={r * 0.55} fill="#8d949e" />
      <circle cx={cx} cy={cy} r={r * 0.22} fill="#5d636c" />
    </g>
  );
}

function wheelPositions(bodyType: string): { x: number; r: number }[] {
  switch (bodyType) {
    case "Dump Truck":
    case "Concrete Mixer":
    case "Roll-Off":
      return [
        { x: 178, r: 52 },
        { x: 560, r: 52 },
        { x: 662, r: 52 },
      ];
    case "Semi Tractor":
      return [
        { x: 168, r: 52 },
        { x: 452, r: 52 },
        { x: 552, r: 52 },
      ];
    case "Trailer":
      return [
        { x: 560, r: 48 },
        { x: 652, r: 48 },
      ];
    case "Pickup Truck":
      return [
        { x: 205, r: 54 },
        { x: 596, r: 54 },
      ];
    case "Cargo Van":
    case "Passenger Van":
      return [
        { x: 200, r: 50 },
        { x: 610, r: 50 },
      ];
    default:
      return [
        { x: 180, r: 52 },
        { x: 620, r: 52 },
      ];
  }
}

/** Flat-front commercial cab used by most of the heavy body types. */
function CabOver({
  fill,
  glass,
  glassDark,
  x = 90,
}: {
  fill: string;
  glass: string;
  glassDark: string;
  x?: number;
}) {
  return (
    <g transform={`translate(${x - 90}, 0)`}>
      <path
        d="M96 366 L96 176 Q96 162 110 162 L246 162 Q258 162 261 174 L272 250 L272 366 Z"
        fill={fill}
        stroke="#00000033"
        strokeWidth="2"
      />
      <path d="M118 182 L244 182 L254 246 L118 246 Z" fill={glass} />
      <path d="M118 182 L160 182 L134 246 L118 246 Z" fill={glassDark} opacity="0.5" />
      <rect x="100" y="286" width="18" height="52" rx="4" fill="#00000022" />
      <rect x="96" y="330" width="176" height="14" fill="#00000018" />
      <circle cx="112" cy="300" r="9" fill="#f2d98c" />
    </g>
  );
}

/** Long-hood cab for pickups and service bodies. */
function ConventionalCab({
  fill,
  glass,
  glassDark,
}: {
  fill: string;
  glass: string;
  glassDark: string;
}) {
  return (
    <g>
      <path
        d="M120 366 L120 300 Q120 286 136 282 L214 274 L252 196 Q258 182 276 182 L376 182 Q392 182 396 196 L404 366 Z"
        fill={fill}
        stroke="#00000033"
        strokeWidth="2"
      />
      <path d="M266 200 L376 200 L380 266 L238 266 Z" fill={glass} />
      <path d="M266 200 L300 200 L272 266 L238 266 Z" fill={glassDark} opacity="0.5" />
      <rect x="124" y="308" width="16" height="30" rx="4" fill="#f2d98c" />
      <rect x="120" y="336" width="284" height="12" fill="#00000018" />
    </g>
  );
}

function Frame({ from, to, chassis }: { from: number; to: number; chassis: string }) {
  return <rect x={from} y="330" width={to - from} height="20" rx="4" fill={chassis} />;
}

function shapeFor(
  bodyType: string,
  fill: string,
  paint: { base: string; dark: string; light: string },
  glass: string,
  glassDark: string,
  chassis: string,
) {
  switch (bodyType) {
    case "Dump Truck":
      return (
        <g>
          <Frame from={260} to={720} chassis={chassis} />
          {/* dump bed with a raked front wall */}
          <path
            d="M278 330 L278 212 L318 186 L716 186 L716 330 Z"
            fill={fill}
            stroke="#00000033"
            strokeWidth="2"
          />
          <path d="M278 212 L318 186 L716 186 L716 204 L294 204 Z" fill={paint.light} opacity="0.65" />
          {[380, 470, 560, 650].map((x) => (
            <rect key={x} x={x} y="206" width="9" height="120" fill="#0000001f" />
          ))}
          <rect x="278" y="304" width="438" height="12" fill="#00000022" />
          {/* hoist cylinder */}
          <rect x="330" y="318" width="46" height="14" rx="6" fill="#7a828e" />
          <CabOver fill={fill} glass={glass} glassDark={glassDark} />
        </g>
      );

    case "Cargo Van":
    case "Passenger Van":
      return (
        <g>
          <Frame from={200} to={660} chassis={chassis} />
          <path
            d="M120 340 L120 250 Q120 232 152 214 L236 176 Q252 168 288 168 L660 168 Q690 168 690 196 L690 340 Z"
            fill={fill}
            stroke="#00000033"
            strokeWidth="2"
          />
          {/* windshield + cab glass */}
          <path d="M170 214 L246 186 Q256 182 282 182 L300 182 L300 236 L152 236 Z" fill={glass} />
          <path d="M170 214 L210 196 L196 236 L152 236 Z" fill={glassDark} opacity="0.45" />
          {bodyType === "Passenger Van" ? (
            <>
              <rect x="320" y="186" width="150" height="52" rx="5" fill={glass} />
              <rect x="490" y="186" width="150" height="52" rx="5" fill={glass} />
            </>
          ) : (
            <>
              {/* cargo body: seam lines and a rear door edge */}
              <rect x="320" y="182" width="330" height="10" fill={paint.light} opacity="0.6" />
              <rect x="596" y="200" width="82" height="126" rx="4" fill="#00000012" />
            </>
          )}
          <rect x="120" y="318" width="570" height="14" fill="#00000018" />
          <rect x="124" y="276" width="16" height="30" rx="4" fill="#f2d98c" />
        </g>
      );

    case "Box Truck":
      return (
        <g>
          <Frame from={260} to={730} chassis={chassis} />
          <path d="M286 330 L286 150 L730 150 L730 330 Z" fill={fill} stroke="#00000033" strokeWidth="2" />
          <rect x="286" y="150" width="444" height="16" fill={paint.light} opacity="0.7" />
          <rect x="640" y="176" width="76" height="146" rx="4" fill="#00000012" />
          <rect x="286" y="316" width="444" height="14" fill="#00000018" />
          <CabOver fill={fill} glass={glass} glassDark={glassDark} />
        </g>
      );

    case "Flatbed":
      return (
        <g>
          <Frame from={260} to={740} chassis={chassis} />
          <rect x="278" y="298" width="462" height="34" rx="4" fill={fill} stroke="#00000033" strokeWidth="2" />
          <rect x="278" y="298" width="462" height="10" fill={paint.light} opacity="0.7" />
          {[300, 380, 460, 540, 620, 700].map((x) => (
            <rect key={x} x={x} y="268" width="10" height="32" rx="2" fill={paint.dark} />
          ))}
          <path d="M278 298 L278 200 L296 200 L296 298 Z" fill={paint.dark} />
          <CabOver fill={fill} glass={glass} glassDark={glassDark} />
        </g>
      );

    case "Pickup Truck":
      return (
        <g>
          <Frame from={380} to={700} chassis={chassis} />
          <path
            d="M404 366 L404 268 L700 268 L700 366 Z"
            fill={fill}
            stroke="#00000033"
            strokeWidth="2"
          />
          <rect x="404" y="268" width="296" height="12" fill={paint.light} opacity="0.7" />
          <rect x="404" y="330" width="296" height="14" fill="#00000018" />
          <rect x="688" y="292" width="16" height="46" rx="4" fill="#00000022" />
          <ConventionalCab fill={fill} glass={glass} glassDark={glassDark} />
        </g>
      );

    case "Roll-Off":
      return (
        <g>
          <Frame from={260} to={740} chassis={chassis} />
          <path
            d="M300 330 L300 232 L640 232 L716 300 L716 330 Z"
            fill={fill}
            stroke="#00000033"
            strokeWidth="2"
          />
          <rect x="300" y="232" width="340" height="12" fill={paint.light} opacity="0.7" />
          {[350, 430, 510, 590].map((x) => (
            <rect key={x} x={x} y="244" width="8" height="80" fill="#00000015" />
          ))}
          {/* hoist rails */}
          <path d="M286 322 L740 322 L740 334 L286 334 Z" fill="#7a828e" />
          <CabOver fill={fill} glass={glass} glassDark={glassDark} />
        </g>
      );

    case "Service / Utility":
      return (
        <g>
          <Frame from={400} to={730} chassis={chassis} />
          <rect x="410" y="252" width="320" height="82" rx="6" fill={fill} stroke="#00000033" strokeWidth="2" />
          <rect x="410" y="252" width="320" height="10" fill={paint.light} opacity="0.7" />
          {[424, 528, 632].map((x) => (
            <rect key={x} x={x} y="272" width="90" height="48" rx="4" fill="#00000015" />
          ))}
          <rect x="470" y="216" width="200" height="38" rx="4" fill={paint.dark} opacity="0.85" />
          <ConventionalCab fill={fill} glass={glass} glassDark={glassDark} />
        </g>
      );

    case "Concrete Mixer":
      return (
        <g>
          <Frame from={260} to={730} chassis={chassis} />
          <path
            d="M300 268 Q300 196 372 192 L600 206 Q672 214 672 268 Q672 322 600 330 L372 330 Q300 326 300 268 Z"
            fill={fill}
            stroke="#00000033"
            strokeWidth="2"
          />
          <path
            d="M340 210 L420 322 M400 198 L488 326 M462 200 L556 326 M528 204 L618 320"
            stroke="#00000033"
            strokeWidth="10"
            fill="none"
          />
          <rect x="660" y="240" width="60" height="16" rx="6" fill="#7a828e" />
          <path d="M694 250 L716 300 L688 300 Z" fill="#8d949e" />
          <CabOver fill={fill} glass={glass} glassDark={glassDark} />
        </g>
      );

    case "Bucket / Boom":
      return (
        <g>
          <Frame from={260} to={730} chassis={chassis} />
          <rect x="300" y="272" width="420" height="60" rx="5" fill={fill} stroke="#00000033" strokeWidth="2" />
          {[314, 420, 526, 632].map((x) => (
            <rect key={x} x={x} y="288" width="90" height="34" rx="3" fill="#00000015" />
          ))}
          {/* boom */}
          <rect x="330" y="236" width="60" height="38" rx="6" fill="#7a828e" />
          <path d="M348 250 L634 158 L648 188 L366 280 Z" fill={paint.dark} />
          <rect x="622" y="130" width="68" height="48" rx="6" fill={paint.light} stroke="#00000033" strokeWidth="2" />
          <CabOver fill={fill} glass={glass} glassDark={glassDark} />
        </g>
      );

    case "Semi Tractor":
      return (
        <g>
          <Frame from={240} to={620} chassis={chassis} />
          {/* sleeper */}
          <path d="M268 330 L268 150 L470 150 L470 330 Z" fill={fill} stroke="#00000033" strokeWidth="2" />
          <rect x="268" y="150" width="202" height="14" fill={paint.light} opacity="0.7" />
          <rect x="288" y="182" width="60" height="52" rx="4" fill={glass} />
          {/* fifth wheel */}
          <rect x="470" y="300" width="140" height="18" rx="4" fill="#7a828e" />
          <rect x="510" y="286" width="60" height="16" rx="4" fill="#5d636c" />
          {/* exhaust stacks */}
          <rect x="252" y="126" width="14" height="204" fill="#9aa1ab" />
          <CabOver fill={fill} glass={glass} glassDark={glassDark} />
        </g>
      );

    case "Trailer":
      return (
        <g>
          <Frame from={120} to={730} chassis={chassis} />
          <rect x="120" y="288" width="610" height="44" rx="4" fill={fill} stroke="#00000033" strokeWidth="2" />
          <rect x="120" y="288" width="610" height="12" fill={paint.light} opacity="0.7" />
          {/* kingpin + landing gear */}
          <rect x="150" y="332" width="26" height="14" rx="3" fill="#5d636c" />
          <rect x="250" y="332" width="14" height="56" fill="#7a828e" />
          <rect x="286" y="332" width="14" height="56" fill="#7a828e" />
          {[200, 300, 400, 500, 600, 700].map((x) => (
            <rect key={x} x={x} y="256" width="10" height="34" rx="2" fill={paint.dark} />
          ))}
        </g>
      );

    default:
      return (
        <g>
          <Frame from={260} to={730} chassis={chassis} />
          <rect x="290" y="228" width="440" height="104" rx="6" fill={fill} stroke="#00000033" strokeWidth="2" />
          <rect x="290" y="228" width="440" height="12" fill={paint.light} opacity="0.7" />
          <CabOver fill={fill} glass={glass} glassDark={glassDark} />
        </g>
      );
  }
}
