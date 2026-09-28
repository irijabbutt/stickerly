"use client";

import { useEffect, useState, useRef } from "react";
import { LogOut, Plus, Trash2, ExternalLink, Loader2, X, ImageIcon } from "lucide-react";
import { Product } from "@/lib/products";
import { login, logout, isAdminSession, AdminCredentials } from "@/lib/adminAuth";
import {
  createAdminProduct,
  deleteAdminProduct,
  translateMissingProducts,
  getAdminProducts,
  AdminProductInput,
} from "@/lib/productStorage";
import { buildGumroadProductUrl } from "@/lib/gumroad";
import { processImageFiles, MAX_PRODUCT_IMAGES } from "@/lib/imageUpload";

function LoginForm({ onLogin }: { onLogin: () => void }) {
  const [credentials, setCredentials] = useState<AdminCredentials>({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const result = await login(credentials);
    setSubmitting(false);
    if (result.ok) {
      onLogin();
    } else {
      setError(result.error || "Invalid email or password.");
    }
  };

  return (
    <div className="mx-auto max-w-sm rounded-2xl border border-border bg-background p-8 shadow-sm">
      <h1 className="text-2xl font-bold">Admin Login</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Sign in to manage Stickerly products.
      </p>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={credentials.email}
            onChange={(e) =>
              setCredentials((c) => ({ ...c, email: e.target.value }))
            }
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="email.com"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={credentials.password}
            onChange={(e) =>
              setCredentials((c) => ({ ...c, password: e.target.value }))
            }
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="••••••••"
            required
          />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90 transition disabled:opacity-50"
        >
          {submitting ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}

const emptyInput: AdminProductInput = {
  gumroadUrl: "",
  category: "stickers",
  image: "",
  images: [],
  discountPercent: 0,
  comingSoon: false,
};

function ProductForm({ onSaved }: { onSaved: () => void }) {
  const [input, setInput] = useState<AdminProductInput>(emptyInput);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<Product | null>(null);
  const [processingImages, setProcessingImages] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPreview(null);

    try {
      const created = await createAdminProduct(input);
      if (!created) {
        setError("Invalid Gumroad URL. Use https://seller.gumroad.com/l/PRODUCT_ID");
        return;
      }
      setPreview(created);
      setInput(emptyInput);
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setProcessingImages(true);
    try {
      const results = await processImageFiles(e.target.files, {
        maxTotal: MAX_PRODUCT_IMAGES,
        existingCount: input.images.length,
      });
      if (results.length > 0) {
        setInput((i) => ({
          ...i,
          images: [...i.images, ...results.map((r) => r.url)],
        }));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to process images");
    } finally {
      setProcessingImages(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeImage = (index: number) => {
    setInput((i) => ({
      ...i,
      images: i.images.filter((_, idx) => idx !== index),
    }));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-border bg-background p-6 shadow-sm"
    >
      <h2 className="text-lg font-semibold">Add Product</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Paste a Gumroad product URL. Title, description, price and tags are fetched automatically.
      </p>
      <div className="mt-4 grid gap-4">
        <div>
          <label htmlFor="gumroadUrl" className="block text-sm font-medium">
            Gumroad product URL
          </label>
          <input
            id="gumroadUrl"
            type="url"
            value={input.gumroadUrl}
            onChange={(e) =>
              setInput((i) => ({ ...i, gumroadUrl: e.target.value }))
            }
            placeholder="https://rijabai.gumroad.com/l/stickers1"
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium">
            Category
          </label>
          <select
            id="category"
            value={input.category}
            onChange={(e) =>
              setInput((i) => ({
                ...i,
                category: e.target.value as Product["category"],
              }))
            }
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="stickers">Stickers</option>
            <option value="animated">Animated UI</option>
            <option value="3d">3D Scenes</option>
          </select>
        </div>
        <div>
          <label htmlFor="discountPercent" className="block text-sm font-medium">
            Discount percentage
          </label>
          <input
            id="discountPercent"
            type="number"
            min={0}
            max={100}
            value={input.discountPercent ?? 0}
            onChange={(e) =>
              setInput((i) => ({
                ...i,
                discountPercent: Math.max(0, Math.min(100, parseInt(e.target.value, 10) || 0)),
              }))
            }
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <p className="mt-1 text-xs text-muted-foreground">
            Leave at 0 to use the Gumroad price. The original price will be shown struck through.
          </p>
        </div>
        <div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={input.comingSoon ?? false}
              onChange={(e) =>
                setInput((i) => ({ ...i, comingSoon: e.target.checked }))
              }
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
            />
            <span className="text-sm font-medium">Mark as Coming Soon</span>
          </label>
        </div>
        <div>
          <label className="block text-sm font-medium">
            Product images ({input.images.length}/{MAX_PRODUCT_IMAGES})
          </label>
          <div className="mt-2 flex flex-wrap gap-3">
            {input.images.map((src, idx) => (
              <div
                key={`${src.slice(0, 24)}-${idx}`}
                className="relative h-20 w-20 overflow-hidden rounded-lg border border-border bg-muted"
              >
                <img
                  src={src}
                  alt={`Preview ${idx + 1}`}
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute right-1 top-1 rounded-full bg-background/90 p-1 text-muted-foreground hover:text-red-500"
                  aria-label={`Remove image ${idx + 1}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            {input.images.length < MAX_PRODUCT_IMAGES && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={processingImages}
                className="flex h-20 w-20 flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-border bg-muted/50 text-muted-foreground hover:bg-muted disabled:opacity-50"
              >
                {processingImages ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <ImageIcon className="h-4 w-4" />
                    <span className="text-xs">Add</span>
                  </>
                )}
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="sr-only"
            />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Upload up to {MAX_PRODUCT_IMAGES} images. The first image is used as the catalog cover.
            Large images are resized automatically.
          </p>
        </div>
      </div>
      {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90 transition disabled:opacity-50"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Plus className="h-4 w-4" />
        )}
        {loading ? "Fetching from Gumroad..." : "Add product"}
      </button>

      {preview && (
        <div className="mt-6 rounded-xl border border-border bg-muted/30 p-4">
          <p className="text-sm font-medium text-green-600">Product added</p>
          <p className="mt-1 text-sm font-semibold">{preview.name}</p>
          <p className="text-sm text-muted-foreground">
            {preview.originalPriceUSD ? (
              <>
                <span className="line-through">
                  ${preview.originalPriceUSD.toFixed(2)}
                </span>{" "}
                <span className="font-semibold text-primary">
                  ${preview.priceUSD.toFixed(2)}
                </span>
              </>
            ) : (
              <>${preview.priceUSD.toFixed(2)}</>
            )}{" "}
            · {preview.category} {preview.comingSoon && "· Coming Soon"}
          </p>
          {preview.tags.length > 0 && (
            <p className="mt-1 text-xs text-muted-foreground">
              Tags: {preview.tags.join(", ")}
            </p>
          )}
        </div>
      )}
    </form>
  );
}

function ProductList({
  products,
  onChange,
}: {
  products: Product[];
  onChange: () => void;
}) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [translating, setTranslating] = useState(false);

  const handleTranslate = async () => {
    setTranslating(true);
    try {
      const r = await translateMissingProducts();
      alert(
        r.translated +
          " translated, " +
          r.failed +
          " failed, " +
          r.skipped +
          " already translated." +
          (r.errors && r.errors.length ? "\n\nReason:\n" + r.errors.join("\n") : "")
      );
      onChange();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Translation failed");
    } finally {
      setTranslating(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteAdminProduct(id);
      onChange();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete product");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-background p-6 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">Admin-added products</h2>
        {products.length > 0 && (
          <button
            onClick={handleTranslate}
            disabled={translating}
            className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-sm font-medium hover:bg-muted transition disabled:opacity-50"
          >
            {translating && <Loader2 className="h-4 w-4 animate-spin" />}
            {translating ? "Translating..." : "Translate missing"}
          </button>
        )}
      </div>
      {products.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">
          No admin products yet. Add one above.
        </p>
      ) : (
        <ul className="mt-4 space-y-3">
          {products.map((product) => {
            const url = buildGumroadProductUrl(product);
            return (
              <li
                key={product.id}
                className="flex items-start justify-between gap-4 rounded-xl border border-border p-4"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-muted p-2">
                    <img
                      src={product.images?.[0] || product.image}
                      alt={product.name || product.id}
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{product.name}</p>
                      {product.comingSoon && (
                        <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                          Coming Soon
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {product.originalPriceUSD ? (
                        <>
                          <span className="line-through">
                            ${product.originalPriceUSD.toFixed(2)}
                          </span>{" "}
                          <span className="font-semibold text-primary">
                            ${product.priceUSD.toFixed(2)}
                          </span>
                        </>
                      ) : (
                        <>${product.priceUSD.toFixed(2)}</>
                      )}{" "}
                      · {product.category}
                    </p>
                    {product.tags.length > 0 && (
                      <p className="text-xs text-muted-foreground">
                        {product.tags.join(", ")}
                      </p>
                    )}
                    {url && (
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 inline-flex items-center gap-1 text-sm text-primary hover:underline"
                      >
                        <ExternalLink className="h-3 w-3" />
                        {url}
                      </a>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(product.id)}
                  disabled={deletingId === product.id}
                  className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-red-500 transition disabled:opacity-50"
                  aria-label="Delete product"
                >
                  {deletingId === product.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [adminProducts, setAdminProducts] = useState<Product[]>([]);

  const refresh = async () => {
    setAdminProducts(await getAdminProducts());
  };

  useEffect(() => {
    isAdminSession().then((ok) => {
      setAuthenticated(ok);
      if (ok) refresh();
    });
  }, []);

  const handleLogout = async () => {
    await logout();
    setAuthenticated(false);
  };

  if (authenticated === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6 text-foreground">
      <div className="mx-auto max-w-3xl">
        {!authenticated ? (
          <LoginForm
            onLogin={() => {
              setAuthenticated(true);
              refresh();
            }}
          />
        ) : (
          <>
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">Stickerly Admin</h1>
                <p className="text-sm text-muted-foreground">
                  Manage the live product catalog — changes are visible to every visitor instantly.
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition"
              >
                <LogOut className="h-4 w-4" />
                Log out
              </button>
            </div>
            <div className="space-y-8">
              <ProductForm onSaved={refresh} />
              <ProductList products={adminProducts} onChange={refresh} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
