export type Tool =
  | "arrow"
  | "rect"
  | "ellipse"
  | "pen"
  | "highlight"
  | "text"
  | "blur"
  | "counter"
  | "crop";

export interface Shape {
  id: number;
  type: Tool;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
  width: number;
  points?: number[];
  text?: string;
}

const norm = (a: number, b: number) => (a < b ? [a, b - a] : [b, a - b]);

export const drawShapes = (ctx: CanvasRenderingContext2D, shapes: Shape[], k: number) => {
  for (const s of shapes) {
    const w = Math.max(1, s.width * k);
    ctx.save();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = s.color;
    ctx.fillStyle = s.color;
    ctx.lineWidth = w;

    if (s.type === "rect") {
      const [x, w2] = norm(s.x1, s.x2);
      const [y, h2] = norm(s.y1, s.y2);
      ctx.strokeRect(x, y, w2, h2);
    } else if (s.type === "highlight") {
      const [x, w2] = norm(s.x1, s.x2);
      const [y, h2] = norm(s.y1, s.y2);
      ctx.globalAlpha = 0.35;
      ctx.fillRect(x, y, w2, h2);
    } else if (s.type === "ellipse") {
      const cx = (s.x1 + s.x2) / 2;
      const cy = (s.y1 + s.y2) / 2;
      const rx = Math.abs(s.x2 - s.x1) / 2;
      const ry = Math.abs(s.y2 - s.y1) / 2;
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
      ctx.stroke();
    } else if (s.type === "arrow") {
      const angle = Math.atan2(s.y2 - s.y1, s.x2 - s.x1);
      ctx.beginPath();
      ctx.moveTo(s.x1, s.y1);
      ctx.lineTo(s.x2, s.y2);
      ctx.stroke();
      const head = Math.max(w * 3, 12 * k);
      ctx.beginPath();
      ctx.moveTo(s.x2, s.y2);
      ctx.lineTo(s.x2 - head * Math.cos(angle - 0.45), s.y2 - head * Math.sin(angle - 0.45));
      ctx.lineTo(s.x2 - head * Math.cos(angle + 0.45), s.y2 - head * Math.sin(angle + 0.45));
      ctx.closePath();
      ctx.fill();
    } else if (s.type === "pen" && s.points && s.points.length >= 4) {
      ctx.beginPath();
      ctx.moveTo(s.points[0], s.points[1]);
      for (let i = 2; i < s.points.length - 2; i += 2) {
        const mx = (s.points[i] + s.points[i + 2]) / 2;
        const my = (s.points[i + 1] + s.points[i + 3]) / 2;
        ctx.quadraticCurveTo(s.points[i], s.points[i + 1], mx, my);
      }
      ctx.stroke();
    } else if (s.type === "text" && s.text) {
      ctx.font = `700 ${Math.round(24 * k)}px "Space Grotesk", "DM Sans", sans-serif`;
      ctx.textBaseline = "top";
      ctx.fillText(s.text, s.x1, s.y1);
    } else if (s.type === "counter" && s.text) {
      const r = 15 * k;
      ctx.beginPath();
      ctx.arc(s.x1, s.y1, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.lineWidth = Math.max(1, 2 * k);
      ctx.strokeStyle = "#ffffff";
      ctx.stroke();
      ctx.fillStyle = "#ffffff";
      ctx.font = `700 ${Math.round(r * 1.1)}px "Space Grotesk", "DM Sans", sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(s.text, s.x1, s.y1 + k);
      ctx.textAlign = "start";
      ctx.textBaseline = "alphabetic";
    } else if (s.type === "blur") {
      const [x, w2] = norm(s.x1, s.x2);
      const [y, h2] = norm(s.y1, s.y2);
      if (w2 > 2 && h2 > 2) {
        const tmp = document.createElement("canvas");
        tmp.width = Math.round(w2);
        tmp.height = Math.round(h2);
        const tctx = tmp.getContext("2d");
        if (tctx) {
          tctx.drawImage(ctx.canvas, x, y, w2, h2, 0, 0, w2, h2);
          ctx.beginPath();
          ctx.rect(x, y, w2, h2);
          ctx.clip();
          ctx.filter = `blur(${Math.round(8 * k)}px)`;
          ctx.drawImage(tmp, x, y, w2, h2);
          ctx.filter = "none";
        }
      }
    } else if (s.type === "crop") {
      const [x, w2] = norm(s.x1, s.x2);
      const [y, h2] = norm(s.y1, s.y2);
      ctx.setLineDash([8 * k, 6 * k]);
      ctx.lineWidth = Math.max(1, 2 * k);
      ctx.strokeStyle = "#b8ff2e";
      ctx.strokeRect(x, y, w2, h2);
      ctx.fillStyle = "rgba(10,10,10,0.45)";
      ctx.beginPath();
      ctx.rect(0, 0, ctx.canvas.width, y);
      ctx.rect(0, y + h2, ctx.canvas.width, ctx.canvas.height - y - h2);
      ctx.rect(0, y, x, h2);
      ctx.rect(x + w2, y, ctx.canvas.width - x - w2, h2);
      ctx.fill("evenodd");
    }
    ctx.restore();
  }
};
