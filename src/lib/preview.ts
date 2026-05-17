export type BackgroundName = "gradient" | "zebra";
export type BrowserTheme = "dark" | "light" | "liquid";
export type GlassDecorMode = "pair" | "single" | "random";
export type SnapshotAspectRatio = {
  width: number;
  height: number;
};
type BackgroundFlip = "none" | "horizontal" | "vertical";
const PUBLIC_BASE_URL = import.meta.env.BASE_URL;

function publicAssetPath(...segments: string[]) {
  return `${PUBLIC_BASE_URL}${segments.join("/")}`;
}

export type BackgroundPreset =
  | {
      kind: "gradient";
      base: string;
      accent: string;
      accentStrong: string;
      scene: string;
      flip: BackgroundFlip;
    }
  | {
      kind: "image";
      base: string;
      accent: string;
      accentStrong: string;
      scene: string;
      src: string;
      flip: BackgroundFlip;
    };

export type UploadedImage = {
  id: string;
  file: File;
  url: string;
  img: HTMLImageElement;
  previewBackground: BackgroundPreset;
  status?: "loading" | "ready" | "error";
};

type GlassLayoutSlot = {
  id: "top-right" | "bottom-left" | "bottom-right";
  widthScale: [number, number];
  heightScale: [number, number];
  xOffsetScale: [number, number];
  yOffsetScale: [number, number];
  rotation: [number, number];
  opacity: [number, number];
};

export type GlassDecorItem = {
  id: string;
  slot: GlassLayoutSlot;
  src: string;
  scale: number;
  widthScale: number;
  heightScale: number;
  xOffsetScale: number;
  yOffsetScale: number;
  rotation: number;
  opacity: number;
};

export type SnapshotInput = {
  item: UploadedImage | null;
  browserTheme: BrowserTheme;
  aspectRatio: SnapshotAspectRatio;
  glassDecorEnabled: boolean;
  glassDecorItems: GlassDecorItem[];
  background: BackgroundPreset;
  emptyPreviewBackground: BackgroundPreset;
};

type SnapshotDimensions = {
  canvasW: number;
  canvasH: number;
  sceneX: number;
  sceneY: number;
  sceneW: number;
  sceneH: number;
  browserX: number;
  browserY: number;
  browserW: number;
  bodyH: number;
  topbarH: number;
};

export const EXPORT_WIDTH = 1920;
export const SNAPSHOT_WIDTH = 1920;
export const SNAPSHOT_OUTER_MARGIN = 32;
export const SNAPSHOT_SCENE_PADDING = 16;
export const SNAPSHOT_PANEL_RADIUS = 38;
export const SNAPSHOT_STACK_GAP = 24;
export const SNAPSHOT_BROWSER_SCALE = 0.85;
export const SNAPSHOT_WINDOW_TOPBAR_HEIGHT = 56;
export const SNAPSHOT_EMPTY_BODY_HEIGHT = 420;

type BackgroundGroup = {
  label: string;
  base: string;
  accent: string;
  accentStrong: string;
  files: string[];
};

const BACKGROUND_GROUPS = {
  gradient: {
    label: "gradient",
    base: "#120a08",
    accent: "#ffc46b",
    accentStrong: "#ff7a1b",
    files: [
      "Gradient 02.png",
      "Gradient 03.png",
      "Gradient 04.png",
      "Gradient 05.png",
      "Gradient 06.png",
      "Gradient 07.png",
      "Gradient 08.png",
      "Gradient 09.png",
      "Gradient 10.png",
      "Gradient 11.png",
      "Gradient 12.png",
    ],
  },
  zebra: {
    label: "zebra",
    base: "#050505",
    accent: "#f2f5f8",
    accentStrong: "#c7ccd4",
    files: [
      "Group 1.png",
      "Group 2.png",
      "Group 3.png",
      "Group 4.png",
      "Group 5.png",
      "Group 6.png",
      "Group 7.png",
      "Group 8.png",
      "Group 9.png",
      "Group 10.png",
    ],
  },
} as const satisfies Record<BackgroundName, BackgroundGroup>;

function createBackgroundPreset(group: BackgroundName, fileName: string): BackgroundPreset {
  const config = BACKGROUND_GROUPS[group];
  const src = publicAssetPath("assets", "backgrounds", group, encodeURIComponent(fileName));
  return {
    kind: "image",
    src,
    base: config.base,
    accent: config.accent,
    accentStrong: config.accentStrong,
    flip: "none",
    scene: `url("${src}") top center/cover no-repeat`,
  };
}

const BACKGROUND_PRESETS: Record<BackgroundName, BackgroundPreset[]> = {
  gradient: BACKGROUND_GROUPS.gradient.files.map((fileName) => createBackgroundPreset("gradient", fileName)),
  zebra: BACKGROUND_GROUPS.zebra.files.map((fileName) => createBackgroundPreset("zebra", fileName)),
};

const GLASS_DECOR_ASSETS = [
  "1.png",
  "2.png",
  "3.png",
  "5.png",
  "6.png",
  "7.png",
  "8.png",
  "Object.png",
  "dispersion glass (1).png",
  "dispersion glass (4).png",
  "dispersion glass (7)1.png",
  "dispersion glass (7)1-1.png",
  "dispersion glass (8).png",
  "dispersion glass (9).png",
  "dispersion glass (10).png",
  "dispersion glass (10)-1.png",
  "dispersion glass (13).png",
  "dispersion glass (14).png",
  "dispersion glass (16).png",
  "dispersion glass (19).png",
  "dispersion glass (21).png",
  "dispersion glass (22).png",
  "dispersion glass (23).png",
  "dispersion glass (24).png",
  "dispersion glass (25).png",
].map((name) => publicAssetPath("assets", "glass", encodeURIComponent(name)));

const GLASS_DECOR_LAYOUTS: Record<
  "pair" | "single",
  GlassLayoutSlot[]
> = {
  pair: [
    {
      id: "top-right",
      widthScale: [0.09, 0.12],
      heightScale: [0.13, 0.18],
      xOffsetScale: [0.82, 0.94],
      yOffsetScale: [-0.24, -0.06],
      rotation: [-10, 8],
      opacity: [0.88, 1],
    },
    {
      id: "bottom-left",
      widthScale: [0.09, 0.13],
      heightScale: [0.14, 0.2],
      xOffsetScale: [-0.18, -0.05],
      yOffsetScale: [0.82, 1.02],
      rotation: [-8, 12],
      opacity: [0.88, 1],
    },
  ],
  single: [
    {
      id: "bottom-right",
      widthScale: [0.08, 0.11],
      heightScale: [0.12, 0.17],
      xOffsetScale: [0.84, 0.96],
      yOffsetScale: [0.76, 0.94],
      rotation: [-8, 10],
      opacity: [0.9, 1],
    },
  ],
};

const imageCache = new Map<string, Promise<HTMLImageElement>>();

export function createId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `id-${Math.random().toString(36).slice(2, 10)}`;
}

export function pickRandomBackground(background: BackgroundName): BackgroundPreset {
  const pool = BACKGROUND_PRESETS[background].length ? BACKGROUND_PRESETS[background] : BACKGROUND_PRESETS.gradient;
  const fallback = pool[0] ?? BACKGROUND_PRESETS.gradient[0];
  return withRandomFlip(pool[Math.floor(Math.random() * pool.length)] ?? fallback);
}

function isBackgroundFromGroup(background: BackgroundName, preset: BackgroundPreset) {
  return preset.kind === "image" && preset.src.includes(publicAssetPath("assets", "backgrounds", background, ""));
}

export function resolveActiveBackground(
  background: BackgroundName,
  randomBackground: BackgroundPreset | null,
): BackgroundPreset {
  if (randomBackground && isBackgroundFromGroup(background, randomBackground)) {
    return randomBackground;
  }
  return pickRandomBackground(background);
}

function backgroundSignature(bg: BackgroundPreset) {
  return bg.kind === "image" ? `image:${bg.src}:${bg.flip}` : `gradient:${bg.base}`;
}

function buildBackgroundSequence(background: BackgroundName, randomBackground: BackgroundPreset | null) {
  const active = resolveActiveBackground(background, randomBackground);
  const activeSignature = backgroundSignature(active);
  const others = BACKGROUND_PRESETS[background].filter((bg) => backgroundSignature(bg) !== activeSignature);
  return [active, ...others];
}

function withRandomFlip(bg: BackgroundPreset): BackgroundPreset {
  if (bg.kind !== "image") {
    return bg;
  }

  const flip = Math.random() < 0.5 ? "horizontal" : "vertical";
  return {
    ...bg,
    flip,
  };
}

export function applyPreviewBackgrounds(
  images: UploadedImage[],
  background: BackgroundName,
  randomBackground: BackgroundPreset | null,
) {
  const sequence = buildBackgroundSequence(background, randomBackground);
  return images.map((image, index) => ({
    ...image,
    previewBackground: sequence[index % sequence.length] ?? sequence[0],
  }));
}

export function resolveEmptyPreviewBackground(
  background: BackgroundName,
  randomBackground: BackgroundPreset | null,
) {
  return resolveActiveBackground(background, randomBackground);
}

export function formatBytes(bytes: number) {
  if (!Number.isFinite(bytes)) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function imageFromFile(file: File) {
  return new Promise<{ file: File; url: string; img: HTMLImageElement }>((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => resolve({ file, url, img });
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(`Не удалось загрузить файл ${file.name}`));
    };
    img.src = url;
  });
}

function loadImage(src: string) {
  if (!imageCache.has(src)) {
    imageCache.set(
      src,
      new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`Не удалось загрузить изображение ${src}`));
        img.src = src;
      }),
    );
  }
  return imageCache.get(src)!;
}

export function isRenderableImage(img: HTMLImageElement | null | undefined) {
  return Boolean(img && img.naturalWidth > 0 && img.naturalHeight > 0);
}

export function regenerateGlassDecorItems(mode: GlassDecorMode) {
  const resolvedMode = mode === "random" ? (Math.random() < 0.5 ? "pair" : "single") : mode;
  const slots = GLASS_DECOR_LAYOUTS[resolvedMode];
  const pool = [...GLASS_DECOR_ASSETS];
  const selected: string[] = [];

  for (let index = 0; index < slots.length; index += 1) {
    const sourcePool = pool.length ? pool : GLASS_DECOR_ASSETS;
    const pickIndex = Math.floor(Math.random() * sourcePool.length);
    const asset = sourcePool[pickIndex];
    selected.push(asset);
    if (pool.length) {
      pool.splice(pickIndex, 1);
    }
  }

  return {
    resolvedMode,
    items: slots.map((slot, index) => ({
      id: createId(),
      slot,
      src: selected[index],
      scale: randomBetween(0.88, 1.12),
      widthScale: randomBetween(slot.widthScale[0], slot.widthScale[1]),
      heightScale: randomBetween(slot.heightScale[0], slot.heightScale[1]),
      xOffsetScale: randomBetween(slot.xOffsetScale[0], slot.xOffsetScale[1]),
      yOffsetScale: randomBetween(slot.yOffsetScale[0], slot.yOffsetScale[1]),
      rotation: randomBetween(slot.rotation[0], slot.rotation[1]),
      opacity: randomBetween(slot.opacity[0], slot.opacity[1]),
    })),
  };
}

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function getSnapshotDimensions(aspectRatio: SnapshotAspectRatio): SnapshotDimensions {
  const ratio = aspectRatio.width / aspectRatio.height;
  const canvasW = SNAPSHOT_WIDTH;
  const canvasH = Math.round(canvasW / ratio);
  const availableWidth = canvasW - (SNAPSHOT_OUTER_MARGIN + SNAPSHOT_SCENE_PADDING) * 2;
  const availableHeight = canvasH - SNAPSHOT_OUTER_MARGIN * 2;
  const browserWidthLimitByHeight = Math.max(
    0,
    Math.floor(((availableHeight - SNAPSHOT_SCENE_PADDING * 2 - SNAPSHOT_WINDOW_TOPBAR_HEIGHT) * 16) / 9),
  );
  const browserW = Math.max(
    0,
    Math.min(Math.round(availableWidth * SNAPSHOT_BROWSER_SCALE), browserWidthLimitByHeight),
  );
  const bodyH = Math.round((browserW * 9) / 16);
  const sceneW = canvasW - SNAPSHOT_OUTER_MARGIN * 2;
  const sceneH = SNAPSHOT_SCENE_PADDING * 2 + SNAPSHOT_WINDOW_TOPBAR_HEIGHT + bodyH;
  const sceneY = Math.max(SNAPSHOT_OUTER_MARGIN, Math.round((canvasH - sceneH) / 2));
  const browserX = Math.round((canvasW - browserW) / 2);

  return {
    canvasW,
    canvasH,
    sceneX: SNAPSHOT_OUTER_MARGIN,
    sceneY,
    sceneW,
    sceneH,
    browserX,
    browserY: sceneY + SNAPSHOT_SCENE_PADDING,
    browserW,
    bodyH,
    topbarH: SNAPSHOT_WINDOW_TOPBAR_HEIGHT,
  };
}

function createCanvas(width: number, height: number) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  radius: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  ctx.lineTo(x + radius, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function drawTopRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  radius: number,
) {
  const r = Math.min(radius, h / 2, w / 2);
  ctx.beginPath();
  ctx.moveTo(x, y + h);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h);
  ctx.closePath();
}

function drawCover(ctx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, w: number, h: number) {
  const scale = Math.max(w / img.width, h / img.height);
  const sw = w / scale;
  const sh = h / scale;
  const sx = (img.width - sw) / 2;
  const sy = 0;
  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
}

function drawContain(ctx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, w: number, h: number) {
  const scale = Math.min(w / img.width, h / img.height);
  const dw = img.width * scale;
  const dh = img.height * scale;
  const dx = x + (w - dw) / 2;
  const dy = y + (h - dh) / 2;
  ctx.drawImage(img, dx, dy, dw, dh);
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

async function drawBackground(ctx: CanvasRenderingContext2D, bg: BackgroundPreset, width: number, height: number) {
  ctx.fillStyle = bg.base;
  ctx.fillRect(0, 0, width, height);

  if (bg.kind === "image") {
    try {
      const img = await loadImage(bg.src);
      if (isRenderableImage(img)) {
        ctx.save();
        if (bg.flip === "horizontal") {
          ctx.translate(width, 0);
          ctx.scale(-1, 1);
        } else if (bg.flip === "vertical") {
          ctx.translate(0, height);
          ctx.scale(1, -1);
        }
        drawCover(ctx, img, 0, 0, width, height);
        ctx.restore();
      }
    } catch {
      ctx.fillStyle = bg.base;
      ctx.fillRect(0, 0, width, height);
    }
    return;
  }

  const glowOne = ctx.createRadialGradient(width * 0.18, height * 0.18, 0, width * 0.18, height * 0.18, width * 0.62);
  glowOne.addColorStop(0, hexToRgba(bg.accent, 0.34));
  glowOne.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = glowOne;
  ctx.fillRect(0, 0, width, height);

  const glowTwo = ctx.createRadialGradient(width * 0.84, height * 0.16, 0, width * 0.84, height * 0.16, width * 0.56);
  glowTwo.addColorStop(0, hexToRgba(bg.accentStrong, 0.18));
  glowTwo.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = glowTwo;
  ctx.fillRect(0, 0, width, height);

  const wash = ctx.createLinearGradient(0, 0, 0, height);
  wash.addColorStop(0, "rgba(255, 255, 255, 0.03)");
  wash.addColorStop(0.55, "rgba(255, 255, 255, 0.01)");
  wash.addColorStop(1, "rgba(0, 0, 0, 0.24)");
  ctx.fillStyle = wash;
  ctx.fillRect(0, 0, width, height);
}

function hexToRgba(hex: string, alpha: number) {
  const value = hex.replace("#", "");
  const normalized = value.length === 3 ? value.replace(/(.)/g, "$1$1") : value;
  const parsed = Number.parseInt(normalized, 16);
  const r = (parsed >> 16) & 255;
  const g = (parsed >> 8) & 255;
  const b = parsed & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function getBrowserThemeColors(theme: BrowserTheme) {
  if (theme === "light") {
    return {
      windowBg: "rgba(255, 255, 255, 0.99)",
      windowBorder: "rgba(15, 23, 42, 0.05)",
      topbarBg: "rgba(255, 255, 255, 0.98)",
      topbarBorder: "rgba(15, 23, 42, 0.06)",
      titleText: "#0f172a",
      bodyBg: "rgba(255, 255, 255, 0.08)",
      bodyText: "#0f172a",
      emptyBg: "#ffffff",
      emptyBorder: "rgba(15, 23, 42, 0.12)",
      emptyIconBg: "rgba(255, 255, 255, 0.1)",
      emptyIconColor: "#6b7280",
      scrollThumb: "rgba(15, 23, 42, 0.16)",
      shadow: "rgba(255, 255, 255, 0.08)",
    };
  }

  if (theme === "liquid") {
    return {
      windowBg: "rgba(255, 255, 255, 0.2)",
      windowBorder: "rgba(255, 255, 255, 0.28)",
      topbarBg: "rgba(255, 255, 255, 0.1)",
      topbarBorder: "rgba(255, 255, 255, 0.12)",
      titleText: "#0b1730",
      bodyBg: "rgba(255, 255, 255, 0.04)",
      bodyText: "#0b1730",
      emptyBg: "transparent",
      emptyBorder: "rgba(255, 255, 255, 0.34)",
      emptyIconBg: "rgba(255, 255, 255, 0.58)",
      emptyIconColor: "#d1d5db",
      scrollThumb: "rgba(11, 23, 48, 0.2)",
      shadow: "rgba(255, 255, 255, 0.1)",
    };
  }

  return {
    windowBg: "rgba(0, 0, 0, 0.8)",
    windowBorder: "rgba(255, 255, 255, 0.08)",
    topbarBg: "rgba(0, 0, 0, 0.56)",
    topbarBorder: "rgba(255, 255, 255, 0.055)",
    titleText: "rgba(255, 255, 255, 0.84)",
    bodyBg: "rgba(0, 0, 0, 0.08)",
    bodyText: "rgba(255, 255, 255, 0.94)",
    emptyBg: "rgba(0, 0, 0, 0.68)",
    emptyBorder: "rgba(255, 255, 255, 0.1)",
    emptyIconBg: "rgba(255, 255, 255, 0.08)",
    emptyIconColor: "#f2f5f8",
    scrollThumb: "rgba(255, 255, 255, 0.12)",
    shadow: "rgba(255, 255, 255, 0.1)",
  };
}

function drawBrowserWindowCanvas(
  ctx: CanvasRenderingContext2D,
  rect: { x: number; y: number; w: number; bodyH: number },
  options: {
    theme: BrowserTheme;
    image: HTMLImageElement | null;
    empty: boolean;
    backdropSource?: HTMLCanvasElement;
    backdropBlur?: number;
  },
) {
  const { x, y, w, bodyH } = rect;
  const { theme, image, empty, backdropSource, backdropBlur = 26 } = options;
  const colors = getBrowserThemeColors(theme);
  const topbarH = 56;
  const radius = 40;
  const shadowBlur = theme === "liquid" ? 96 : theme === "dark" ? 84 : 68;

  ctx.save();
  ctx.shadowColor = colors.shadow;
  ctx.shadowBlur = shadowBlur;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  ctx.fillStyle = colors.windowBg;
  drawRoundedRect(ctx, x, y, w, topbarH + bodyH, radius);
  ctx.fill();
  ctx.restore();

  ctx.strokeStyle = colors.windowBorder;
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.save();
  drawRoundedRect(ctx, x, y, w, topbarH + bodyH, radius);
  ctx.clip();

  if (backdropSource) {
    ctx.save();
    if (theme === "liquid") {
      ctx.filter = `blur(${backdropBlur}px)`;
      ctx.drawImage(backdropSource, 0, 0);
    } else {
      drawTopRoundedRect(ctx, x, y, w, topbarH, radius);
      ctx.clip();
      ctx.filter = `blur(${backdropBlur}px)`;
      ctx.drawImage(backdropSource, 0, 0);
    }
    ctx.restore();
  }

  ctx.save();
  ctx.globalCompositeOperation = "source-atop";
  ctx.fillStyle = colors.topbarBg;
  ctx.fillRect(x, y, w, topbarH);
  ctx.fillStyle = colors.bodyBg;
  ctx.fillRect(x, y + topbarH, w, bodyH);
  ctx.restore();

  ctx.strokeStyle = colors.topbarBorder;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x, y + topbarH + 0.5);
  ctx.lineTo(x + w, y + topbarH + 0.5);
  ctx.stroke();

  const buttonInset = topbarH / 2;
  const lightY = y + buttonInset;
  const lightXs = [x + buttonInset, x + buttonInset + 22, x + buttonInset + 44];
  const lights = ["#ff5f57", "#febc2e", "#28c840"];
  lightXs.forEach((lx, index) => {
    ctx.fillStyle = lights[index];
    ctx.beginPath();
    ctx.arc(lx, lightY, 7, 0, Math.PI * 2);
    ctx.fill();
  });

  if (empty) {
    const emptyCenterX = x + w / 2;
    const emptyCenterY = y + topbarH + bodyH / 2;
    const emptyIconY = emptyCenterY - 26;
    const emptyTextY = emptyCenterY + 34;

    ctx.save();
    ctx.strokeStyle = colors.emptyBorder;
    ctx.setLineDash([10, 10]);
    ctx.lineWidth = 2;
    drawRoundedRect(ctx, x + 16, y + topbarH + 16, w - 32, bodyH - 32, 28);
    ctx.stroke();
    ctx.restore();

    ctx.fillStyle = colors.emptyIconBg;
    ctx.beginPath();
    ctx.arc(emptyCenterX, emptyIconY, 34, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = colors.emptyIconColor;
    ctx.font = '600 26px "SF Pro Text", "Segoe UI", sans-serif';
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("⌥", emptyCenterX, emptyIconY + 8);
    ctx.font = '700 28px "SF Pro Display", "Segoe UI", sans-serif';
    const emptyTitle = "Перетащи сюда скриншоты";
    ctx.fillStyle = colors.titleText;
    ctx.fillText(emptyTitle, emptyCenterX, emptyTextY);
    ctx.textAlign = "start";
    ctx.textBaseline = "alphabetic";
  } else if (image && isRenderableImage(image)) {
    ctx.save();
    drawCover(ctx, image, x, y + topbarH, w, bodyH);
    ctx.restore();
  }

  ctx.restore();
}

function getGlassDecorRect(
  slot: GlassDecorItem,
  browserRect: { x: number; y: number; w: number; h: number },
) {
  const sizeMultiplier = 1.5;
  const width = browserRect.w * slot.widthScale * slot.scale * sizeMultiplier;
  const height = browserRect.h * slot.heightScale * slot.scale * sizeMultiplier;
  switch (slot.slot.id) {
    case "top-right":
      return {
        x: browserRect.x + browserRect.w - width * 0.5,
        y: browserRect.y,
        width,
        height,
        rotation: slot.rotation,
        opacity: slot.opacity,
      };
    case "bottom-left":
      return {
        x: browserRect.x - width * 0.5,
        y: browserRect.y + browserRect.h - height,
        width,
        height,
        rotation: slot.rotation,
        opacity: slot.opacity,
      };
    case "bottom-right":
    default:
      return {
        x: browserRect.x + browserRect.w - width * 0.5,
        y: browserRect.y + browserRect.h - height,
        width,
        height,
        rotation: slot.rotation,
        opacity: slot.opacity,
      };
  }
}

async function drawSnapshot(ctx: CanvasRenderingContext2D, input: SnapshotInput, dims: SnapshotDimensions) {
  const { item, browserTheme, glassDecorEnabled, glassDecorItems, background, emptyPreviewBackground } = input;
  const bg = item?.previewBackground ?? emptyPreviewBackground ?? background;

  const backdropCanvas = createCanvas(dims.canvasW, dims.canvasH);
  const backdropCtx = backdropCanvas.getContext("2d");
  if (!backdropCtx) {
    throw new Error("Backdrop canvas context is unavailable");
  }

  await drawBackground(backdropCtx, bg, dims.canvasW, dims.canvasH);

  ctx.clearRect(0, 0, dims.canvasW, dims.canvasH);
  ctx.drawImage(backdropCanvas, 0, 0);

  const browserRect = {
    x: dims.browserX,
    y: dims.browserY,
    w: dims.browserW,
    bodyH: dims.bodyH,
  };

  try {
    drawBrowserWindowCanvas(ctx, browserRect, {
      theme: browserTheme,
      image: item?.img ?? null,
      empty: !item,
      backdropSource: backdropCanvas,
      backdropBlur: browserTheme === "liquid" ? 38 : browserTheme === "dark" ? 24 : 0,
    });
  } catch (error) {
    console.error("Primary browser snapshot render failed", error);
  }

  if (glassDecorEnabled && glassDecorItems.length) {
    const browserHeight = dims.topbarH + dims.bodyH;
    const browserBounds = {
      x: dims.browserX,
      y: dims.browserY,
      w: dims.browserW,
      h: browserHeight,
    };
    for (const decorItem of glassDecorItems) {
      const rect = getGlassDecorRect(decorItem, browserBounds);

      try {
        const image = await loadImage(decorItem.src);
        if (isRenderableImage(image)) {
          ctx.save();
          ctx.globalAlpha = rect.opacity;
          ctx.translate(rect.x + rect.width / 2, rect.y + rect.height / 2);
          ctx.rotate((rect.rotation * Math.PI) / 180);
          drawContain(ctx, image, -rect.width / 2, -rect.height / 2, rect.width, rect.height);
          ctx.restore();
        }
      } catch {
        // Skip missing assets without breaking the export.
      }
    }
  }
}

export async function createSnapshotCanvas(input: SnapshotInput) {
  const dims = getSnapshotDimensions(input.aspectRatio);
  const canvas = createCanvas(dims.canvasW, dims.canvasH);
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Canvas context is unavailable");
  }

  await drawSnapshot(ctx, input, dims);
  return canvas;
}

export async function exportSnapshotsAsPng(input: {
  items: UploadedImage[];
  browserTheme: BrowserTheme;
  aspectRatio: SnapshotAspectRatio;
  glassDecorEnabled: boolean;
  glassDecorItems: GlassDecorItem[];
  activeBackground: BackgroundPreset;
  emptyPreviewBackground: BackgroundPreset;
}) {
  const items = input.items.length ? input.items : [null];
  if (items.length > 1) {
    const fileNameWidth = Math.max(2, String(items.length).length);
    const snapshots = await Promise.all(
      items.map((item, index) =>
        createSnapshotCanvas({
          item,
          browserTheme: input.browserTheme,
          aspectRatio: input.aspectRatio,
          glassDecorEnabled: input.glassDecorEnabled,
          glassDecorItems: input.glassDecorItems,
          background: input.activeBackground,
          emptyPreviewBackground: input.emptyPreviewBackground,
        }).then(async (canvas) => {
          const blob = await canvasToBlob(canvas, "image/png");
          return blob
            ? { name: `portfolio-shot-${String(index + 1).padStart(fileNameWidth, "0")}.png`, blob }
            : null;
        }),
      ),
    );

    const files = snapshots.filter((snapshot): snapshot is { name: string; blob: Blob } => snapshot !== null);
    if (!files.length) {
      return;
    }

    const zipBlob = await createZipBlob(files);
    triggerDownload(zipBlob, `portfolio-shots-${Date.now()}.zip`);
    return;
  }

  const canvas = await createSnapshotCanvas({
    item: items[0],
    browserTheme: input.browserTheme,
    aspectRatio: input.aspectRatio,
    glassDecorEnabled: input.glassDecorEnabled,
    glassDecorItems: input.glassDecorItems,
    background: input.activeBackground,
    emptyPreviewBackground: input.emptyPreviewBackground,
  });

  const blob = await canvasToBlob(canvas, "image/png");
  if (!blob) {
    return;
  }

  triggerDownload(blob, `portfolio-shot-${Date.now()}.png`);
}

async function canvasToBlob(canvas: HTMLCanvasElement, type: "image/png") {
  return new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type));
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

async function createZipBlob(files: Array<{ name: string; blob: Blob }>) {
  const entries: Array<{
    nameBytes: Uint8Array;
    data: Uint8Array;
    crc32: number;
    size: number;
    offset: number;
  }> = [];
  const encoder = new TextEncoder();
  let offset = 0;

  for (const file of files) {
    const data = new Uint8Array(await file.blob.arrayBuffer());
    const nameBytes = encoder.encode(file.name);
    const crc32 = computeCrc32(data);
    entries.push({
      nameBytes,
      data,
      crc32,
      size: data.byteLength,
      offset,
    });
    offset += 30 + nameBytes.byteLength + data.byteLength;
  }

  const centralDirectory: ArrayBuffer[] = [];
  let centralDirectorySize = 0;

  for (const entry of entries) {
    const record = new Uint8Array(46 + entry.nameBytes.byteLength);
    const view = new DataView(record.buffer);
    writeUint32(view, 0, 0x02014b50);
    writeUint16(view, 4, 20);
    writeUint16(view, 6, 20);
    writeUint16(view, 8, 0);
    writeUint16(view, 10, 0);
    writeUint16(view, 12, getDosTime());
    writeUint16(view, 14, getDosDate());
    writeUint32(view, 16, entry.crc32);
    writeUint32(view, 20, entry.size);
    writeUint32(view, 24, entry.size);
    writeUint16(view, 28, entry.nameBytes.byteLength);
    writeUint16(view, 30, 0);
    writeUint16(view, 32, 0);
    writeUint16(view, 34, 0);
    writeUint16(view, 36, 0);
    writeUint32(view, 38, 0);
    writeUint32(view, 42, entry.offset);
    record.set(entry.nameBytes, 46);
    centralDirectory.push(toArrayBuffer(record));
    centralDirectorySize += record.byteLength;
  }

  const localFileParts: ArrayBuffer[] = [];
  for (const entry of entries) {
    const header = new Uint8Array(30 + entry.nameBytes.byteLength);
    const view = new DataView(header.buffer);
    writeUint32(view, 0, 0x04034b50);
    writeUint16(view, 4, 20);
    writeUint16(view, 6, 0);
    writeUint16(view, 8, 0);
    writeUint16(view, 10, getDosTime());
    writeUint16(view, 12, getDosDate());
    writeUint32(view, 14, entry.crc32);
    writeUint32(view, 18, entry.size);
    writeUint32(view, 22, entry.size);
    writeUint16(view, 26, entry.nameBytes.byteLength);
    writeUint16(view, 28, 0);
    header.set(entry.nameBytes, 30);
    localFileParts.push(toArrayBuffer(header), toArrayBuffer(entry.data));
  }

  const eocd = new Uint8Array(22);
  const eocdView = new DataView(eocd.buffer);
  writeUint32(eocdView, 0, 0x06054b50);
  writeUint16(eocdView, 4, 0);
  writeUint16(eocdView, 6, 0);
  writeUint16(eocdView, 8, entries.length);
  writeUint16(eocdView, 10, entries.length);
  writeUint32(eocdView, 12, centralDirectorySize);
  writeUint32(eocdView, 16, offset);
  writeUint16(eocdView, 20, 0);

  return new Blob([...localFileParts, ...centralDirectory, toArrayBuffer(eocd)], { type: "application/zip" });
}

function toArrayBuffer(bytes: Uint8Array) {
  const buffer = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(buffer).set(bytes);
  return buffer;
}

function writeUint16(view: DataView, offset: number, value: number) {
  view.setUint16(offset, value, true);
}

function writeUint32(view: DataView, offset: number, value: number) {
  view.setUint32(offset, value, true);
}

function getDosDate() {
  const now = new Date();
  const year = clamp(now.getFullYear(), 1980, 2107);
  return ((year - 1980) << 9) | ((now.getMonth() + 1) << 5) | now.getDate();
}

function getDosTime() {
  const now = new Date();
  return (now.getHours() << 11) | (now.getMinutes() << 5) | Math.floor(now.getSeconds() / 2);
}

function computeCrc32(bytes: Uint8Array) {
  let crc = 0xffffffff;

  for (let index = 0; index < bytes.length; index += 1) {
    crc = CRC32_TABLE[(crc ^ bytes[index]) & 0xff] ^ (crc >>> 8);
  }

  return (crc ^ 0xffffffff) >>> 0;
}

const CRC32_TABLE = (() => {
  const table = new Uint32Array(256);

  for (let index = 0; index < 256; index += 1) {
    let crc = index;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = crc & 1 ? 0xedb88320 ^ (crc >>> 1) : crc >>> 1;
    }
    table[index] = crc >>> 0;
  }

  return table;
})();
