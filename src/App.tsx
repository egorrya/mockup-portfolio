import { useEffect, useRef, useState } from "react";
import {
  type BackgroundName,
  type BackgroundPreset,
  type BrowserTheme,
  type GlassDecorItem,
  type GlassDecorMode,
  type SnapshotAspectRatio,
  type UploadedImage,
  applyPreviewBackgrounds,
  createId,
  createSnapshotCanvas,
  exportSnapshotsAsPng,
  formatBytes,
  pickRandomBackground,
  regenerateGlassDecorItems,
  resolveActiveBackground,
  resolveEmptyPreviewBackground,
} from "./lib/preview";

const BACKGROUND_OPTIONS: Array<{ label: string; value: BackgroundName }> = [
  { label: "gradient", value: "gradient" },
  { label: "zebra", value: "zebra" },
];

const THEME_OPTIONS: Array<{ label: string; value: BrowserTheme }> = [
  { label: "Светлая", value: "light" },
  { label: "Тёмная", value: "dark" },
  { label: "Liquid Glass", value: "liquid" },
];

const ASPECT_RATIO_OPTIONS: Array<{ label: string; value: SnapshotAspectRatio }> = [
  { label: "3:2", value: { width: 3, height: 2 } },
  { label: "4:3", value: { width: 4, height: 3 } },
  { label: "1:1", value: { width: 1, height: 1 } },
  { label: "16:9", value: { width: 16, height: 9 } },
  { label: "4:5", value: { width: 4, height: 5 } },
];

const GLASS_MODE_OPTIONS: Array<{ label: string; value: GlassDecorMode }> = [
  { label: "2 объекта: слева снизу и справа сверху", value: "pair" },
  { label: "1 объект: справа снизу", value: "single" },
  { label: "Случайно: 1 или 2 объекта", value: "random" },
];

function App() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const imagesRef = useRef<UploadedImage[]>([]);
  const dragDepthRef = useRef(0);
  const mountedRef = useRef(true);

  const [background, setBackground] = useState<BackgroundName>("gradient");
  const [randomBackground, setRandomBackground] = useState<BackgroundPreset | null>(() =>
    pickRandomBackground("gradient"),
  );
  const [browserTheme, setBrowserTheme] = useState<BrowserTheme>("dark");
  const [aspectRatio, setAspectRatio] = useState<SnapshotAspectRatio>(ASPECT_RATIO_OPTIONS[0].value);
  const [glassDecorEnabled, setGlassDecorEnabled] = useState(false);
  const [glassDecorMode, setGlassDecorMode] = useState<GlassDecorMode>("pair");
  const [glassDecorItems, setGlassDecorItems] = useState<GlassDecorItem[]>([]);
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const activeBackground = resolveActiveBackground(background, randomBackground);
  const emptyPreviewBackground = resolveEmptyPreviewBackground(background, randomBackground);
  const displayImages = images.length ? images : [null];

  useEffect(() => {
    const root = document.documentElement.style;
    root.setProperty("--page-bg", activeBackground.base);
    root.setProperty("--scene-bg", "transparent");
    root.setProperty("--accent", activeBackground.accent);
    root.setProperty("--accent-strong", activeBackground.accentStrong);
    document.body.style.backgroundColor = activeBackground.base;
  }, [activeBackground]);

  useEffect(() => {
    setImages((prev) => applyPreviewBackgrounds(prev, background, randomBackground));
  }, [background, randomBackground]);

  useEffect(() => {
    if (!glassDecorEnabled) {
      setGlassDecorItems([]);
      return;
    }

    const { items } = regenerateGlassDecorItems(glassDecorMode);
    setGlassDecorItems(items);
  }, [glassDecorEnabled, glassDecorMode]);

  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
      revokeImageUrls(imagesRef.current);
    };
  }, []);

  useEffect(() => {
    const preventDefault = (event: DragEvent) => {
      event.preventDefault();
    };

    window.addEventListener("dragover", preventDefault);
    window.addEventListener("drop", preventDefault);

    return () => {
      window.removeEventListener("dragover", preventDefault);
      window.removeEventListener("drop", preventDefault);
    };
  }, []);

  async function handleFiles(files: FileList | File[]) {
    const acceptedFiles = Array.from(files).filter(isImageFile);
    if (!acceptedFiles.length) {
      return;
    }

    const additions = acceptedFiles.map((file) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      return {
        id: createId(),
        file,
        url,
        img,
        previewBackground: activeBackground,
        status: "loading" as const,
      };
    });

    if (!mountedRef.current) {
      additions.forEach(({ url }) => URL.revokeObjectURL(url));
      return;
    }

    setImages((prev) => applyPreviewBackgrounds([...prev, ...additions], background, randomBackground));

    additions.forEach((item) => {
      item.img.onload = () => {
        if (!mountedRef.current) {
          URL.revokeObjectURL(item.url);
          return;
        }

        setImages((prev) =>
          prev.map((image) =>
            image.id === item.id
              ? {
                  ...image,
                  img: item.img,
                  status: "ready" as const,
                }
              : image,
          ),
        );
      };

      item.img.onerror = () => {
        if (!mountedRef.current) {
          URL.revokeObjectURL(item.url);
          return;
        }

        setImages((prev) => {
          const next = prev.filter((image) => image.id !== item.id);
          URL.revokeObjectURL(item.url);
          return applyPreviewBackgrounds(next, background, randomBackground);
        });
      };

      item.img.src = item.url;
    });
  }

  function handleFileInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.currentTarget.files ?? []);
    void handleFiles(files);
    event.currentTarget.value = "";
  }

  function handleRemoveImage(id: string) {
    setImages((prev) => {
      const next = prev.filter((item) => item.id !== id);
      const removed = prev.find((item) => item.id === id);
      if (removed) {
        URL.revokeObjectURL(removed.url);
      }
      return applyPreviewBackgrounds(next, background, randomBackground);
    });
  }

  function handleClear() {
    revokeImageUrls(imagesRef.current);
    setImages([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function handleExport() {
    setIsExporting(true);
    try {
      await exportSnapshotsAsPng({
        items: images,
        browserTheme,
        aspectRatio,
        glassDecorEnabled,
        glassDecorItems,
        activeBackground,
        emptyPreviewBackground,
      });
    } finally {
      if (mountedRef.current) {
        setIsExporting(false);
      }
    }
  }

  function showDragOverlay(event: React.DragEvent<HTMLElement>) {
    event.preventDefault();
    dragDepthRef.current += 1;
    setIsDragging(true);
  }

  function hideDragOverlay(event: React.DragEvent<HTMLElement>) {
    event.preventDefault();
    dragDepthRef.current = Math.max(0, dragDepthRef.current - 1);
    if (dragDepthRef.current === 0) {
      setIsDragging(false);
    }
  }

  function handleDragOver(event: React.DragEvent<HTMLElement>) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
  }

  async function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    dragDepthRef.current = 0;
    setIsDragging(false);
    const files = event.dataTransfer.files;
    if (files.length) {
      await handleFiles(files);
    }
  }

  return (
    <main className="app">
      <aside className="panel">
        <div className="brand">
          <h1>Portfolio Maker</h1>
          <p>Красивые macOS и Safari-превью из загруженных изображений.</p>
        </div>

        <div className="field">
          <label htmlFor="backgroundSelect">Фон</label>
          <select
            id="backgroundSelect"
            value={background}
            onChange={(event) => {
              const value = event.currentTarget.value as BackgroundName;
              setRandomBackground(pickRandomBackground(value));
              setBackground(value);
            }}
          >
            {BACKGROUND_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="browserThemeSelect">Тема окна</label>
          <select
            id="browserThemeSelect"
            value={browserTheme}
            onChange={(event) => setBrowserTheme(event.currentTarget.value as BrowserTheme)}
          >
            {THEME_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="aspectRatioSelect">Соотношение сторон</label>
          <select
            id="aspectRatioSelect"
            value={`${aspectRatio.width}:${aspectRatio.height}`}
            onChange={(event) => {
              const selected = ASPECT_RATIO_OPTIONS.find((option) => option.label === event.currentTarget.value);
              if (selected) {
                setAspectRatio(selected.value);
              }
            }}
          >
            {ASPECT_RATIO_OPTIONS.map((option) => (
              <option key={option.label} value={option.label}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <label className="toggle-field">
          <input
            type="checkbox"
            checked={glassDecorEnabled}
            onChange={(event) => setGlassDecorEnabled(event.currentTarget.checked)}
          />
          <span>
            <strong>Glass-объекты</strong>
            <small>Накладывать случайные PNG из `assets/glass` на углы окна.</small>
          </span>
        </label>

        <div className="field" hidden={!glassDecorEnabled}>
          <label htmlFor="glassDecorModeSelect">Расположение</label>
          <select
            id="glassDecorModeSelect"
            value={glassDecorMode}
            disabled={!glassDecorEnabled}
            onChange={(event) => setGlassDecorMode(event.currentTarget.value as GlassDecorMode)}
          >
            {GLASS_MODE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="actions">
          <button className="button button--primary" type="button" onClick={handleExport} disabled={isExporting}>
            {isExporting ? "Сохраняю..." : images.length > 1 ? "Скачать ZIP" : "Скачать PNG"}
          </button>
          <button className="button" type="button" onClick={handleClear}>
            Очистить
          </button>
        </div>

        <label className="upload-zone">
          <input
            ref={fileInputRef}
            id="fileInput"
            type="file"
            accept="image/*"
            multiple
            className="upload-zone__input"
            onChange={handleFileInputChange}
          />
          <strong>Перетащи изображения сюда</strong>
          <span>или нажми, чтобы выбрать файлы</span>
        </label>

        <div className="meta">
          <span>
            {images.length} {pluralize(images.length, ["изображение", "изображения", "изображений"])}
          </span>
          <span>Можно загрузить много файлов за раз</span>
        </div>

        <div className="file-list-wrap">
          <div className="file-list-title">Загруженные файлы</div>
          <ul className="file-list">
            {images.map((item) => (
              <li key={item.id} className="file-item">
                <img className="file-item__thumb" src={item.url} alt={item.file.name} />
                <div className="file-item__copy">
                  <div className="file-item__name" title={item.file.name}>
                    {item.file.name}
                  </div>
                  <div className="file-item__size">{formatBytes(item.file.size)}</div>
                </div>
                <button
                  className="file-item__remove"
                  type="button"
                  aria-label={`Удалить ${item.file.name}`}
                  onClick={() => handleRemoveImage(item.id)}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <section className="stage" onDragEnter={showDragOverlay} onDragLeave={hideDragOverlay} onDragOver={handleDragOver} onDrop={handleDrop}>
        <div className="preview-shell">
          <div className="scene">
            <div className={`drop-overlay${isDragging ? " is-visible" : ""}`} aria-hidden="true">
              <div className="drop-overlay__card">
                <div className="drop-overlay__title">Отпускай файлы</div>
                <div className="drop-overlay__text">Изображения будут добавлены в окно браузера</div>
              </div>
            </div>

            <div className="preview-stack" aria-live="polite">
              {displayImages.map((item) => (
                <PreviewCanvas
                  key={item?.id ?? "empty"}
                  item={item}
                  browserTheme={browserTheme}
                  aspectRatio={aspectRatio}
                  glassDecorEnabled={glassDecorEnabled}
                  glassDecorItems={glassDecorItems}
                  activeBackground={activeBackground}
                  emptyPreviewBackground={emptyPreviewBackground}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

type PreviewCanvasProps = {
  item: UploadedImage | null;
  browserTheme: BrowserTheme;
  aspectRatio: SnapshotAspectRatio;
  glassDecorEnabled: boolean;
  glassDecorItems: GlassDecorItem[];
  activeBackground: BackgroundPreset;
  emptyPreviewBackground: BackgroundPreset;
};

function PreviewCanvas({
  item,
  browserTheme,
  aspectRatio,
  glassDecorEnabled,
  glassDecorItems,
  activeBackground,
  emptyPreviewBackground,
}: PreviewCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function renderSnapshot() {
      const snapshot = await createSnapshotCanvas({
        item,
        browserTheme,
        aspectRatio,
        glassDecorEnabled,
        glassDecorItems,
        background: activeBackground,
        emptyPreviewBackground,
      });

      if (cancelled || !canvasRef.current) {
        return;
      }

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        return;
      }

      canvas.width = snapshot.width;
      canvas.height = snapshot.height;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(snapshot, 0, 0);
    }

    void renderSnapshot();

    return () => {
      cancelled = true;
    };
  }, [activeBackground, aspectRatio, browserTheme, emptyPreviewBackground, glassDecorEnabled, glassDecorItems, item]);

  return <canvas ref={canvasRef} className="snapshot-canvas" aria-label="Preview snapshot" />;
}

function pluralize(count: number, forms: [string, string, string]) {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return forms[0];
  if (mod10 >= 2 && mod10 <= 4 && !(mod100 >= 12 && mod100 <= 14)) return forms[1];
  return forms[2];
}

function isImageFile(file: File) {
  if (file.type.startsWith("image/")) {
    return true;
  }

  return /\.(avif|bmp|gif|heic|heif|jpeg|jpg|png|svg|tif|tiff|webp)$/i.test(file.name);
}

function revokeImageUrls(items: UploadedImage[]) {
  for (const item of items) {
    URL.revokeObjectURL(item.url);
  }
}

export default App;
