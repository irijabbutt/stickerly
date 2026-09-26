export const MAX_PRODUCT_IMAGES = 5;
export const MAX_IMAGE_FILE_SIZE = 5 * 1024 * 1024; // 5 MB raw file limit

export interface ImageUploadResult {
  url: string;
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

async function compressImageToBlob(dataUrl: string, maxDimension = 1600, quality = 0.85): Promise<Blob> {
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

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Failed to compress image"))),
      "image/webp",
      quality
    );
  });
}

async function uploadImage(blob: Blob, filename: string): Promise<string> {
  const formData = new FormData();
  formData.append("file", blob, filename);
  const response = await fetch("/api/admin/upload", {
    method: "POST",
    credentials: "include",
    body: formData,
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || `Upload failed (${response.status})`);
  }
  const data = await response.json();
  return data.url as string;
}

/**
 * Resizes/compresses each image to WebP client-side (keeps uploads small and
 * fast), then uploads it to the product-images bucket in Supabase Storage and
 * returns its public URL — replacing the old approach of stuffing base64 data
 * into localStorage, which only worked in the admin's own browser and bloated
 * every page load.
 */
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
    const blob = await compressImageToBlob(dataUrl);
    const webpName = file.name.replace(/\.[^.]+$/, "") + ".webp";
    const url = await uploadImage(blob, webpName);
    results.push({ url, name: file.name });
  }

  return results;
}
