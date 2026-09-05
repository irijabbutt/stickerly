"use client";

import { useEffect, useState } from "react";
import { LogOut, Plus, Trash2, ExternalLink } from "lucide-react";
import { Product } from "@/lib/products";
import { login, logout, isAdminSession, AdminCredentials } from "@/lib/adminAuth";
import {
  createAdminProduct,
  deleteAdminProduct,
  getAdminProducts,
  AdminProductInput,
} from "@/lib/productStorage";
import { buildGumroadProductUrl } from "@/lib/gumroad";

function LoginForm({ onLogin }: { onLogin: () => void }) {
  const [credentials, setCredentials] = useState<AdminCredentials>({
    email: "",
    password: "",
  });
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(false);
    if (login(credentials)) {
      onLogin();
    } else {
      setError(true);
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
            placeholder="admin@stickerly.com"
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
        {error && (
          <p className="text-sm text-red-500">Invalid email or password.</p>
        )}
        <button
          type="submit"
          className="w-full rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90 transition"
        >
          Sign in
        </button>
      </form>
    </div>
  );
}

const emptyInput: AdminProductInput = {
  name: "",
  description: "",
  priceUSD: 0,
  gumroadUrl: "",
  category: "stickers",
  image: "",
  tags: "",
  isPack: true,
};

function ProductForm({ onSaved }: { onSaved: () => void }) {
  const [input, setInput] = useState<AdminProductInput>(emptyInput);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const created = createAdminProduct(input);
    if (!created) {
      setError("Invalid Gumroad URL. Use https://seller.gumroad.com/l/PRODUCT_ID");
      return;
    }
    setInput(emptyInput);
    onSaved();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-border bg-background p-6 shadow-sm"
    >
      <h2 className="text-lg font-semibold">Add Product</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="name" className="block text-sm font-medium">
            Product name
          </label>
          <input
            id="name"
            value={input.name}
            onChange={(e) => setInput((i) => ({ ...i, name: e.target.value }))}
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="description" className="block text-sm font-medium">
            Description
          </label>
          <textarea
            id="description"
            rows={3}
            value={input.description}
            onChange={(e) =>
              setInput((i) => ({ ...i, description: e.target.value }))
            }
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
        <div>
          <label htmlFor="price" className="block text-sm font-medium">
            Price (USD)
          </label>
          <input
            id="price"
            type="number"
            step="0.01"
            min="0"
            value={input.priceUSD}
            onChange={(e) =>
              setInput((i) => ({ ...i, priceUSD: parseFloat(e.target.value) || 0 }))
            }
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
        <div className="sm:col-span-2">
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
        <div className="sm:col-span-2">
          <label htmlFor="image" className="block text-sm font-medium">
            Image path
          </label>
          <input
            id="image"
            value={input.image}
            onChange={(e) => setInput((i) => ({ ...i, image: e.target.value }))}
            placeholder="/products/kawaii-animals.svg"
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="tags" className="block text-sm font-medium">
            Tags (comma separated)
          </label>
          <input
            id="tags"
            value={input.tags}
            onChange={(e) => setInput((i) => ({ ...i, tags: e.target.value }))}
            placeholder="stickers, png, kawaii"
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="flex items-center gap-2 sm:col-span-2">
          <input
            id="isPack"
            type="checkbox"
            checked={input.isPack}
            onChange={(e) =>
              setInput((i) => ({ ...i, isPack: e.target.checked }))
            }
            className="h-4 w-4 rounded border-border"
          />
          <label htmlFor="isPack" className="text-sm font-medium">
            This product is a pack
          </label>
        </div>
      </div>
      {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
      <button
        type="submit"
        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90 transition"
      >
        <Plus className="h-4 w-4" />
        Add product
      </button>
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
  const handleDelete = (id: string) => {
    deleteAdminProduct(id);
    onChange();
  };

  return (
    <div className="rounded-2xl border border-border bg-background p-6 shadow-sm">
      <h2 className="text-lg font-semibold">Admin-added products</h2>
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
                <div>
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-muted-foreground">
                    ${product.priceUSD.toFixed(2)} · {product.category}
                  </p>
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
                <button
                  onClick={() => handleDelete(product.id)}
                  className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-red-500 transition"
                  aria-label="Delete product"
                >
                  <Trash2 className="h-4 w-4" />
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
  const [authenticated, setAuthenticated] = useState(false);
  const [adminProducts, setAdminProducts] = useState<Product[]>([]);

  useEffect(() => {
    setAuthenticated(isAdminSession());
    setAdminProducts(getAdminProducts());
  }, []);

  const refresh = () => {
    setAdminProducts(getAdminProducts());
  };

  const handleLogout = () => {
    logout();
    setAuthenticated(false);
  };

  return (
    <div className="min-h-screen bg-background p-6 text-foreground">
      <div className="mx-auto max-w-3xl">
        {!authenticated ? (
          <LoginForm onLogin={() => setAuthenticated(true)} />
        ) : (
          <>
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">Stickerly Admin</h1>
                <p className="text-sm text-muted-foreground">
                  Manage products stored in this browser.
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
