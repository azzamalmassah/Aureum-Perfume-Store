import React, { useEffect, useMemo, useState } from 'react';
import { createItem, deleteItem, getItems, getOrders, updateItem } from '../lib/api';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const emptyForm = {
  name: '',
  brand: '',
  gender: 'unisex',
  description: '',
  price: '',
  sizes: '50ml,100ml',
  components: '',
  stock: '',
};

function resolveImageUrl(url) {
  if (!url || typeof url !== 'string') return null;
  return url.startsWith('/') ? `${API_BASE_URL}${url}` : url;
}

function toFormData(values) {
  const fd = new FormData();
  Object.entries(values).forEach(([k, v]) => {
    if (v === undefined || v === null) return;
    if (k === 'sizes') {
      String(v)
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
        .forEach((s) => fd.append('sizes', s));
      return;
    }
    if (k === 'components') {
      String(v)
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
        .forEach((s) => fd.append('components', s));
      return;
    }
    fd.append(k, String(v));
  });
  return fd;
}

export default function AdminDashboard() {
  const [items, setItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const [query, setQuery] = useState('');
  const [sortKey, setSortKey] = useState('newest');
  const [genderFilter, setGenderFilter] = useState('all');
  const [images, setImages] = useState([]);

  const title = useMemo(
    () => (editingId ? 'Update Item' : 'Create New Item'),
    [editingId],
  );

  const stats = useMemo(() => {
    const count = items.length;
    const lowStock = items.filter((i) => Number(i.stock ?? 0) <= 10).length;
    const avgPrice =
      count === 0
        ? 0
        : Math.round(
            (items.reduce((sum, i) => sum + Number(i.price || 0), 0) / count) * 10,
          ) / 10;
    const completedOrders = orders.filter((order) => order.status !== 'cancelled');
    const totalSales = completedOrders.reduce(
      (sum, order) => sum + Number(order.totalPrice || 0),
      0,
    );
    return {
      count,
      lowStock,
      avgPrice,
      totalOrders: orders.length,
      totalSales: Math.round(totalSales * 100) / 100,
    };
  }, [items, orders]);

  const refresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const [list, orderList] = await Promise.all([getItems(), getOrders()]);
      setItems(list);
      setOrders(orderList);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = q
      ? items.filter((it) => {
          const name = String(it.name || '').toLowerCase();
          const brand = String(it.brand || '').toLowerCase();
          const gender = String(it.gender || '').toLowerCase();
          return name.includes(q) || brand.includes(q) || gender.includes(q);
        })
      : items.slice();

    if (genderFilter !== 'all') {
      const wanted = genderFilter.toLowerCase();
      list = list.filter((it) => String(it.gender || '').toLowerCase() === wanted);
    }

    if (sortKey === 'price-asc') list.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
    if (sortKey === 'price-desc') list.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
    if (sortKey === 'stock-asc') list.sort((a, b) => Number(a.stock || 0) - Number(b.stock || 0));
    if (sortKey === 'stock-desc') list.sort((a, b) => Number(b.stock || 0) - Number(a.stock || 0));
    if (sortKey === 'name') list.sort((a, b) => String(a.name || '').localeCompare(String(b.name || '')));
    if (sortKey === 'gender') list.sort((a, b) => String(a.gender || '').localeCompare(String(b.gender || '')));
    return list;
  }, [items, query, sortKey, genderFilter]);

  const lowStockItems = useMemo(() => {
    const list = items
      .filter((it) => Number(it.stock ?? 0) <= 10)
      .slice()
      .sort((a, b) => Number(a.stock ?? 0) - Number(b.stock ?? 0));
    return list;
  }, [items]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        stock: form.stock === '' ? undefined : Number(form.stock),
      };
      const fd = toFormData(payload);
      images.forEach((file) => fd.append('images', file));

      if (editingId) {
        await updateItem(editingId, fd);
      } else {
        await createItem(fd);
      }
      setForm(emptyForm);
      setEditingId(null);
      setImages([]);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    }
  };

  const startEdit = (item) => {
    setEditingId(item._id || item.id);
    setForm({
      name: item.name || '',
      brand: item.brand || '',
      gender: (item.gender || 'unisex').toLowerCase(),
      description: item.description || '',
      price: item.price ?? '',
      sizes: Array.isArray(item.sizes) ? item.sizes.join(',') : '',
      components: Array.isArray(item.components) ? item.components.join(',') : '',
      stock: item.stock ?? '',
    });
    setImages([]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onDelete = async (id) => {
    setBusyId(id);
    setError(null);
    try {
      const ok = window.confirm('Delete this item? This cannot be undone.');
      if (!ok) return;
      await deleteItem(id);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.12),_transparent_30%),linear-gradient(180deg,#faf8f4_0%,#f5f1ea_100%)] px-6 pb-24 pt-32 md:px-12">
      <div className="mx-auto max-w-7xl space-y-10">
        <div className="rounded-[28px] border border-white/80 bg-white/75 p-8 shadow-[0_20px_60px_rgba(120,113,108,0.12)] backdrop-blur-sm md:p-10">
          <span className="mb-4 inline-block rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.5em] text-amber-700">
            Admin
          </span>
          <h2 className="text-4xl font-serif leading-tight text-stone-900 md:text-6xl">
            Dashboard
          </h2>
          <p className="mt-4 max-w-2xl text-stone-500">
            Create, update, and manage your store with a cleaner view of inventory and sales.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-[24px] border border-white/80 bg-white/85 p-6 shadow-[0_18px_40px_rgba(120,113,108,0.10)]">
            <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Total Items</p>
            <p className="mt-3 text-3xl font-serif text-stone-900">{stats.count}</p>
          </div>
          <div className="rounded-[24px] border border-amber-100 bg-gradient-to-br from-white to-amber-50 p-6 shadow-[0_18px_40px_rgba(120,113,108,0.10)]">
            <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Low Stock (&lt;= 10)</p>
            <p className="mt-3 text-3xl font-serif text-stone-900">{stats.lowStock}</p>
          </div>
          <div className="rounded-[24px] border border-white/80 bg-white/85 p-6 shadow-[0_18px_40px_rgba(120,113,108,0.10)]">
            <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Avg Price</p>
            <p className="mt-3 text-3xl font-serif text-stone-900">${stats.avgPrice}</p>
          </div>
          <div className="rounded-[24px] border border-amber-200 bg-gradient-to-br from-stone-950 to-stone-800 p-6 shadow-[0_22px_50px_rgba(28,25,23,0.28)]">
            <p className="text-[10px] font-bold uppercase tracking-widest text-amber-200">Total Sales</p>
            <p className="mt-3 text-3xl font-serif text-amber-300">${stats.totalSales}</p>
            <p className="mt-2 text-xs text-stone-300">{stats.totalOrders} total orders</p>
          </div>
        </div>

        <div className="rounded-[28px] border border-white/80 bg-white/85 p-8 shadow-[0_20px_60px_rgba(120,113,108,0.12)]">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h3 className="text-xl font-serif text-stone-900">Sales Overview</h3>
              <p className="mt-2 text-sm text-stone-500">
                Total sales are calculated from all non-cancelled orders.
              </p>
            </div>
            <span className="rounded-full border border-stone-200 bg-stone-50 px-3 py-2 text-xs text-stone-500">
              {loading ? 'Loading...' : `${stats.totalOrders} orders tracked`}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-[24px] border border-amber-100 bg-gradient-to-br from-amber-50 to-white p-6">
              <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Gross Sales</p>
              <p className="mt-3 text-4xl font-serif text-amber-700">${stats.totalSales}</p>
            </div>
            <div className="rounded-[24px] border border-stone-200 bg-stone-50/80 p-6">
              <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Orders</p>
              <p className="mt-3 text-4xl font-serif text-stone-900">{stats.totalOrders}</p>
            </div>
            <div className="rounded-[24px] border border-stone-200 bg-stone-50/80 p-6">
              <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Avg Order Value</p>
              <p className="mt-3 text-4xl font-serif text-stone-900">
                ${stats.totalOrders ? Math.round((stats.totalSales / stats.totalOrders) * 100) / 100 : 0}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[28px] border border-white/80 bg-white/85 p-8 shadow-[0_20px_60px_rgba(120,113,108,0.12)]">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h3 className="text-xl font-serif text-stone-900">Low Stock</h3>
              <p className="mt-2 text-sm text-stone-500">Items with stock 10 or less.</p>
            </div>
            <span className="rounded-full border border-stone-200 bg-stone-50 px-3 py-2 text-xs text-stone-500">
              {loading ? 'Loading...' : `${lowStockItems.length} items`}
            </span>
          </div>

          {lowStockItems.length === 0 && !loading ? (
            <div className="rounded-2xl border border-dashed border-stone-200 bg-stone-50/70 p-6 text-sm text-stone-500">
              No low-stock items.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[10px] uppercase tracking-widest text-stone-400">
                    <th className="py-3">Image</th>
                    <th className="py-3">Name</th>
                    <th className="py-3">Brand</th>
                    <th className="py-3">Gender</th>
                    <th className="py-3">Stock</th>
                    <th className="py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {lowStockItems.map((it) => {
                    const id = it._id || it.id;
                    const img = Array.isArray(it.images) ? it.images[0] : null;
                    const imgUrl = resolveImageUrl(img);
                    return (
                      <tr key={id} className="border-t border-stone-100">
                        <td className="py-4">
                          <div className="h-14 w-12 overflow-hidden rounded-md border border-stone-100 bg-stone-50">
                            {imgUrl ? (
                              <img src={imgUrl} alt={it.name} className="h-full w-full object-cover" />
                            ) : null}
                          </div>
                        </td>
                        <td className="py-4 font-medium text-stone-900">{it.name}</td>
                        <td className="py-4 text-stone-600">{it.brand}</td>
                        <td className="py-4 text-stone-600">{it.gender}</td>
                        <td className="py-4">
                          <span className="font-bold text-red-700">{it.stock ?? 0}</span>
                        </td>
                        <td className="py-4 text-right">
                          <button
                            onClick={() => startEdit(it)}
                            className="rounded-full border border-stone-200 px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-stone-700 transition-colors hover:border-amber-400 hover:text-amber-700"
                          >
                            Restock / Edit
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="rounded-[28px] border border-white/80 bg-white/85 p-8 shadow-[0_20px_60px_rgba(120,113,108,0.12)]">
          <h3 className="mb-6 text-xl font-serif text-stone-900">{title}</h3>
          <form onSubmit={onSubmit} className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Name</label>
              <input
                className="w-full rounded-2xl border border-stone-200 bg-stone-50/60 px-4 py-3 outline-none transition-colors focus:border-amber-400"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Brand</label>
              <input
                className="w-full rounded-2xl border border-stone-200 bg-stone-50/60 px-4 py-3 outline-none transition-colors focus:border-amber-400"
                value={form.brand}
                onChange={(e) => setForm((p) => ({ ...p, brand: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Gender</label>
              <select
                className="w-full rounded-2xl border border-stone-200 bg-stone-50/60 px-4 py-3 outline-none transition-colors focus:border-amber-400"
                value={form.gender}
                onChange={(e) => setForm((p) => ({ ...p, gender: e.target.value }))}
              >
                <option value="unisex">Unisex</option>
                <option value="women">Women</option>
                <option value="men">Men</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Price</label>
              <input
                type="number"
                className="w-full rounded-2xl border border-stone-200 bg-stone-50/60 px-4 py-3 outline-none transition-colors focus:border-amber-400"
                value={form.price}
                onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Description</label>
              <input
                className="w-full rounded-2xl border border-stone-200 bg-stone-50/60 px-4 py-3 outline-none transition-colors focus:border-amber-400"
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Sizes (comma separated)</label>
              <input
                className="w-full rounded-2xl border border-stone-200 bg-stone-50/60 px-4 py-3 outline-none transition-colors focus:border-amber-400"
                value={form.sizes}
                onChange={(e) => setForm((p) => ({ ...p, sizes: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Stock</label>
              <input
                type="number"
                className="w-full rounded-2xl border border-stone-200 bg-stone-50/60 px-4 py-3 outline-none transition-colors focus:border-amber-400"
                value={form.stock}
                onChange={(e) => setForm((p) => ({ ...p, stock: e.target.value }))}
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Components (comma separated)</label>
              <input
                className="w-full rounded-2xl border border-stone-200 bg-stone-50/60 px-4 py-3 outline-none transition-colors focus:border-amber-400"
                value={form.components}
                onChange={(e) => setForm((p) => ({ ...p, components: e.target.value }))}
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Images</label>
              <input
                type="file"
                accept="image/*"
                multiple
                className="mt-2 w-full rounded-2xl border border-dashed border-stone-300 bg-stone-50/60 p-4"
                onChange={(e) => setImages(Array.from(e.target.files || []))}
              />
              {images.length > 0 && (
                <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {images.map((file) => (
                    <div key={file.name} className="aspect-[4/5] overflow-hidden rounded-2xl border border-stone-200 bg-stone-50">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
              {editingId && images.length === 0 && (
                <p className="mt-2 text-xs text-stone-400">
                  Leave empty to keep existing images. Uploading new images will replace the old ones.
                </p>
              )}
            </div>

            <div className="flex gap-4 pt-2 md:col-span-2">
              <button
                type="submit"
                className="rounded-full border border-stone-900 bg-stone-900 px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-white transition-colors hover:border-amber-600 hover:bg-amber-600"
              >
                {editingId ? 'Update' : 'Create'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setForm(emptyForm);
                    setImages([]);
                  }}
                  className="rounded-full border border-stone-200 px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-stone-700 transition-colors hover:border-amber-400 hover:text-amber-700"
                >
                  Cancel
                </button>
              )}
              <button
                type="button"
                onClick={refresh}
                className="ml-auto rounded-full border border-stone-200 px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-stone-700 transition-colors hover:border-amber-400 hover:text-amber-700"
              >
                Refresh
              </button>
            </div>
          </form>
          {error && (
            <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}
        </div>

        <div className="rounded-[28px] border border-white/80 bg-white/85 p-8 shadow-[0_20px_60px_rgba(120,113,108,0.12)]">
          <div className="mb-6 flex items-end justify-between">
            <h3 className="text-xl font-serif text-stone-900">Items</h3>
            <span className="rounded-full border border-stone-200 bg-stone-50 px-3 py-2 text-xs text-stone-500">
              {loading ? 'Loading...' : `${filteredItems.length} items`}
            </span>
          </div>
          <div className="mb-6 flex flex-col gap-4 md:flex-row">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, brand, gender..."
              className="flex-1 rounded-2xl border border-stone-200 bg-stone-50/70 px-4 py-3 outline-none transition-colors focus:border-amber-400"
            />
            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
              className="rounded-2xl border border-stone-200 bg-stone-50/70 px-4 py-3 outline-none transition-colors focus:border-amber-400"
            >
              <option value="all">Gender: All</option>
              <option value="men">Gender: Men</option>
              <option value="women">Gender: Women</option>
              <option value="unisex">Gender: Unisex</option>
            </select>
            <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value)}
              className="rounded-2xl border border-stone-200 bg-stone-50/70 px-4 py-3 outline-none transition-colors focus:border-amber-400"
            >
              <option value="newest">Sort: Default</option>
              <option value="name">Sort: Name</option>
              <option value="gender">Sort: Gender</option>
              <option value="price-asc">Sort: Price (Low to High)</option>
              <option value="price-desc">Sort: Price (High to Low)</option>
              <option value="stock-asc">Sort: Stock (Low to High)</option>
              <option value="stock-desc">Sort: Stock (High to Low)</option>
            </select>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[10px] uppercase tracking-widest text-stone-400">
                  <th className="py-3">Image</th>
                  <th className="py-3">Name</th>
                  <th className="py-3">Brand</th>
                  <th className="py-3">Gender</th>
                  <th className="py-3">Price</th>
                  <th className="py-3">Stock</th>
                  <th className="py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((it) => {
                  const id = it._id || it.id;
                  const img = Array.isArray(it.images) ? it.images[0] : null;
                  const imgUrl = resolveImageUrl(img);
                  return (
                    <tr key={id} className="border-t border-stone-100">
                      <td className="py-4">
                        <div className="h-14 w-12 overflow-hidden rounded-md border border-stone-100 bg-stone-50">
                          {imgUrl ? (
                            <img src={imgUrl} alt={it.name} className="h-full w-full object-cover" />
                          ) : null}
                        </div>
                      </td>
                      <td className="py-4 font-medium text-stone-900">{it.name}</td>
                      <td className="py-4 text-stone-600">{it.brand}</td>
                      <td className="py-4 text-stone-600">{it.gender}</td>
                      <td className="py-4 text-stone-900">${it.price}</td>
                      <td className="py-4 text-stone-600">{it.stock ?? '-'}</td>
                      <td className="space-x-3 py-4 text-right">
                        <button
                          onClick={() => startEdit(it)}
                          className="rounded-full border border-stone-200 px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-stone-700 transition-colors hover:border-amber-400 hover:text-amber-700"
                        >
                          Edit
                        </button>
                        <button
                          disabled={busyId === id}
                          onClick={() => onDelete(id)}
                          className="rounded-full border border-red-200 px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-red-600 transition-colors hover:border-red-300 hover:text-red-700 disabled:opacity-50"
                        >
                          {busyId === id ? 'Deleting...' : 'Delete'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
