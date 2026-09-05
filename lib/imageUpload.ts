export const MAX_PRODUCT_IMAGES = 5;
export const MAX_IMAGE_FILE_SIZE = 5 * 1024 * 1024; // 5 MB raw file limit

export interface ImageUploadResult {
  dataUrl: string;
  name: string;
}

function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error(`Failed to read ${file.name}`));
    reader.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = src;
  });
}

async function compressImage(dataUrl: string, maxDimension = 1200, quality = 0.8): Promise<string> {
  const img = await loadImage(dataUrl);
  const canvas = document.createElement("canvas");
  let { width, height } = img;

  if (width > maxDimension || height > maxDimension) {
    if (width > height) {
      height = Math.round((height * maxDimension) / width);
      width = maxDimension;
    } else {
      width = Math.round((width * maxDimension) / height);
      height = maxDimension;
    }
  }

  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas context not available");
  ctx.drawImage(img, 0, 0, width, height);

  // Prefer WebP when the browser supports it to keep localStorage size down.
  const mimeType = canvas.toDataURL("image/webp").startsWith("data:image/webp") ? "image/webp" : "image/jpeg";
  return canvas.toDataURL(mimeType, quality);
}

export async function processImageFiles(
  files: FileList | null,
  options?: { maxTotal?: number; existingCount?: number }
): Promise<ImageUploadResult[]> {
  const { maxTotal = MAX_PRODUCT_IMAGES, existingCount = 0 } = options ?? {};
  if (!files || files.length === 0) return [];

  const remaining = Math.max(0, maxTotal - existingCount);
  const toProcess = Array.from(files).slice(0, remaining);
  const results: ImageUploadResult[] = [];

  for (const file of toProcess) {
    if (!file.type.startsWith("image/")) {
      throw new Error(`${file.name} is not an image file.`);
    }
    if (file.size > MAX_IMAGE_FILE_SIZE) {
      throw new Error(`${file.name} is too large. Maximum size is 5 MB.`);
    }

    const dataUrl = await readFileAsDataURL(file);
    const compressed = await compressImage(dataUrl);
    results.push({ dataUrl: compressed, name: file.name });
  }

  return results;
}
