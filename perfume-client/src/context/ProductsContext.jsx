import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getItemById, getItems } from '../lib/api';

const ProductsContext = createContext(null);

function titleCase(value) {
  if (!value || typeof value !== 'string') return value;
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

function normalizeItem(item) {
  if (!item) return null;

  const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const id = item._id || item.id;
  const rawImages = Array.isArray(item.images) && item.images.length ? item.images : [];
  const images = rawImages.map((img) => {
    if (!img || typeof img !== 'string') return img;
    return img.startsWith('/') ? `${apiBaseUrl}${img}` : img;
  });
  return {
    ...item,
    id,
    gender: titleCase(item.gender),
    collection: item.collection || 'Collection',
    category: item.category || 'Eau de Parfum',
    images,
    sizes: Array.isArray(item.sizes) && item.sizes.length ? item.sizes : [],
    components:
      Array.isArray(item.components) && item.components.length ? item.components : [],
    stock: typeof item.stock === 'number' ? item.stock : 0,
    rating: typeof item.rating === 'number' ? item.rating : 0,
  };
}

export function useProducts() {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error('useProducts must be used within a ProductsProvider');
  return ctx;
}

export function ProductsProvider({ children }) {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refreshProducts = async () => {
    const items = await getItems();
    setAllProducts(items.map(normalizeItem).filter(Boolean));
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const items = await getItems();
        if (!cancelled) setAllProducts(items.map(normalizeItem).filter(Boolean));
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e : new Error('Failed to load products'));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const products = useMemo(
    () => allProducts.filter((p) => Number(p?.stock ?? 0) > 0),
    [allProducts],
  );

  const byId = useMemo(() => {
    const m = new Map();
    for (const p of allProducts) {
      if (p?.id) m.set(String(p.id), p);
    }
    return m;
  }, [allProducts]);

  const ensureProduct = async (id) => {
    const key = String(id);
    if (byId.has(key)) return byId.get(key);
    const item = await getItemById(id);
    const normalized = normalizeItem(item);
    if (normalized?.id) {
      setAllProducts((prev) => {
        const exists = prev.some((p) => String(p.id) === String(normalized.id));
        return exists ? prev : [normalized, ...prev];
      });
    }
    return normalized;
  };

  const value = useMemo(
    () => ({ products, allProducts, byId, loading, error, ensureProduct, refreshProducts }),
    [products, allProducts, byId, loading, error],
  );

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
}

