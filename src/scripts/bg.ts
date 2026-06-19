function getRandom(max: number): number {
  return Math.floor(Math.random() * max);
}

function generateDots(n: number, color: string): string {
  return Array.from({ length: n }, () =>
    `${getRandom(2560)}px ${getRandom(2560)}px ${color}`
  ).join(", ");
}

function applyDots(
  id: string,
  size: string,
  dots: string,
  animation?: string,
): void {
  const el = document.getElementById(id);
  if (!el) return;
  el.style.cssText = `
    width: ${size};
    height: ${size};
    border-radius: 50%;
    box-shadow: ${dots};
    ${animation ? `animation: ${animation};` : ""}
  `;
}

function initBG(): void {
  // Light mode particles
  applyDots("particles1", "1px", generateDots(1000, "#000"), "animateParticle 50s linear infinite");
  applyDots("particles2", "1.5px", generateDots(500, "#000"), "animateParticle 100s linear infinite");
  applyDots("particles3", "2px", generateDots(250, "#000"), "animateParticle 150s linear infinite");

  // Dark mode stars
  applyDots("stars1", "1px", generateDots(1000, "#fff"));
  applyDots("stars2", "1.5px", generateDots(500, "#fff"));
  applyDots("stars3", "2px", generateDots(250, "#fff"));
}

document.addEventListener("astro:after-swap", initBG);
initBG();
