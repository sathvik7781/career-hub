import { useEffect, useRef } from "react";

// Each palette: [light color, dark color, top%, left%, size, dur, delay, parallax strength]
const PRESETS = {
  login: [
    ["#93c5fd", "#1d4ed8", -10,  -5, "38rem", "18s", "0s",   0.04],
    ["#c4b5fd", "#6d28d9",  20,  55, "32rem", "22s", "3s",   0.06],
    ["#6ee7b7", "#065f46",  55,  10, "28rem", "16s", "6s",   0.03],
    ["#fde68a", "#92400e",  65,  65, "24rem", "20s", "2s",   0.05],
    ["#f9a8d4", "#9d174d",  35,  30, "20rem", "14s", "9s",   0.07],
  ],
  register: [
    ["#c4b5fd", "#6d28d9", -10,  -5, "38rem", "18s", "0s",   0.04],
    ["#a5b4fc", "#3730a3",  20,  55, "32rem", "22s", "3s",   0.06],
    ["#6ee7b7", "#065f46",  55,  10, "28rem", "16s", "6s",   0.03],
    ["#f9a8d4", "#9d174d",  65,  65, "24rem", "20s", "2s",   0.05],
    ["#93c5fd", "#1e40af",  35,  30, "20rem", "14s", "9s",   0.07],
  ],
};

export default function GradientMesh({ variant = "login" }) {
  const ref = useRef(null);
  const mouse = useRef({ x: 0.5, y: 0.5 });
  const current = useRef({ x: 0.5, y: 0.5 });
  const raf = useRef(null);

  useEffect(() => {
    const onMove = (e) => {
      mouse.current = {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      };
    };
    window.addEventListener("mousemove", onMove);

    const tick = () => {
      // Lerp toward mouse for smooth lag
      current.current.x += (mouse.current.x - current.current.x) * 0.04;
      current.current.y += (mouse.current.y - current.current.y) * 0.04;
      if (ref.current) {
        ref.current.style.setProperty("--mx", current.current.x);
        ref.current.style.setProperty("--my", current.current.y);
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  const blobs = PRESETS[variant];

  return (
    <div ref={ref} className="bg-mesh" aria-hidden="true">
      {blobs.map(([light, dark, top, left, size, dur, delay, strength], i) => (
        <span
          key={i}
          className="mesh-blob"
          style={{
            "--blob-light": light,
            "--blob-dark": dark,
            "--blob-top": `${top}%`,
            "--blob-left": `${left}%`,
            "--size": size,
            "--dur": dur,
            "--delay": delay,
            "--strength": strength,
            "--op-light": i === 0 ? 0.45 : i === 1 ? 0.35 : i === 2 ? 0.28 : i === 3 ? 0.22 : 0.2,
            "--op-dark":  i === 0 ? 0.35 : i === 1 ? 0.3  : i === 2 ? 0.25 : i === 3 ? 0.18 : 0.18,
          }}
        />
      ))}
    </div>
  );
}
