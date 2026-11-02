import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addProduct, deleteProduct, setQuery, setSort, updateProduct } from './store.js';

function PlusListIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 3H5.5A2.5 2.5 0 0 0 3 5.5v13A2.5 2.5 0 0 0 5.5 21h13a2.5 2.5 0 0 0 2.5-2.5V12"/><path d="M7 8h6M7 12h4M7 16h2M18 3v6M15 6h6"/></svg>;
}

function ProductArtwork({ variant }) {
  const layouts = [
    ['64,67 95,43 143,57 151,103 122,131 63,112 55,84', '64,67 95,43', '143,57 151,103', '63,112 122,131'],
    ['76,56 80,77', '111,61 131,43', '147,82 167,88', '55,102 78,110', '91,133 108,117', '133,130 128,105'],
    ['69,67 98,44 142,56 153,101 119,133 68,113 60,82', '69,67 98,44', '142,56 153,101', '68,113 119,133'],
    ['63,73 94,49 146,63 153,106 117,130 65,113 57,87', '63,73 94,49', '146,63 153,106', '65,113 117,130'],
  ];
  return <div className="artwork"><svg viewBox="0 0 220 180" role="img" aria-label="Geometrik ürün çizimi">{layouts[variant % layouts.length].map((points, index) => <polyline key={index} points={points} />)}</svg></div>;
}

function ProductCard({ product, index, onEdit, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return <article className="product-card">
    <ProductArtwork variant={index} />
    <div className="card-menu-wrap">
      <button className="more-button" aria-label={`${product.name} işlemleri`} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>•••</button>
      {menuOpen && <div className="card-menu" role="menu">
        <button role="menuitem" onClick={() => { setMenuOpen(false); onEdit(product); }}>Güncelle</button>
        <button role="menuitem" onClick={() => { setMenuOpen(false); onDelete(product.id); }}>Sil</button>
      </div>}
    </div>
    <div className="product-info"><h2>{product.name}</h2><p>{product.price}€</p></div>
  </article>;
}

function ProductDialog({ product, onClose, onSave }) {
  const [name, setName] = useState(product?.name ?? '');
  const [price, setPrice] = useState(product?.price ?? '');
  const [error, setError] = useState('');

  function submit(event) {
    event.preventDefault();
    const cleanName = name.trim();
    const numericPrice = Number(price);
    if (!cleanName) return setError('Lütfen ürün adı gir.');
    if (!Number.isFinite(numericPrice) || numericPrice <= 0) return setError('Fiyat sıfırdan büyük olmalı.');
    onSave({ id: product?.id, name: cleanName, price: numericPrice });
    onClose();
  }

  return <div className="dialog-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section className="dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title">
      <div className="dialog-heading"><h2 id="dialog-title">{product ? 'Ürünü güncelle' : 'Yeni ürün ekle'}</h2><button className="close-button" aria-label="Kapat" onClick={onClose}>×</button></div>
      <form onSubmit={submit}>
        <label>Ürün adı<input autoFocus value={name} onChange={(event) => { setName(event.target.value); setError(''); }} placeholder="Örn. Yeni ürün" maxLength={48} /></label>
        <label>Fiyat (€)<input type="number" min="0.01" step="0.01" value={price} onChange={(event) => { setPrice(event.target.value); setError(''); }} placeholder="90" /></label>
        {error && <p className="form-error" role="alert">{error}</p>}
        <div className="dialog-actions"><button type="button" className="cancel-button" onClick={onClose}>Vazgeç</button><button type="submit" className="save-button">{product ? 'Değişiklikleri kaydet' : 'Ürün ekle'}</button></div>
      </form>
    </section>
  </div>;
}

export default function App() {
  const dispatch = useDispatch();
  const { products, query, sort } = useSelector((state) => state.catalog);
  const [editingProduct, setEditingProduct] = useState(null);
  const [addingProduct, setAddingProduct] = useState(false);

  const visibleProducts = useMemo(() => {
    const filtered = products.filter((product) => product.name.toLocaleLowerCase('tr').includes(query.trim().toLocaleLowerCase('tr')));
    return [...filtered].sort((a, b) => sort === 'asc' ? a.price - b.price : b.price - a.price);
  }, [products, query, sort]);

  function saveProduct(product) {
    if (product.id) dispatch(updateProduct(product));
    else dispatch(addProduct(product));
  }

  return <main className="app-shell">
    <header className="toolbar">
      <h1>REACT UYGULAMA</h1>
      <div className="toolbar-controls">
        <label className="sort-label"><span className="sr-only">Fiyata göre sırala</span><select value={sort} onChange={(event) => dispatch(setSort(event.target.value))}><option value="asc">ARTAN</option><option value="desc">AZALAN</option></select><span className="select-arrow">⌄</span></label>
        <label className="search-label"><span className="sr-only">Ürün ara</span><input type="search" value={query} onChange={(event) => dispatch(setQuery(event.target.value))} placeholder="Arama yapınız..." /></label>
        <button className="add-button" title="Yeni ürün ekle" aria-label="Yeni ürün ekle" onClick={() => setAddingProduct(true)}><PlusListIcon /></button>
      </div>
    </header>
    <section className="product-grid" aria-label="Ürünler">
      {visibleProducts.map((product, index) => <ProductCard key={product.id} product={product} index={index} onEdit={setEditingProduct} onDelete={(id) => dispatch(deleteProduct(id))} />)}
      {visibleProducts.length === 0 && <div className="empty-state"><strong>Ürün bulunamadı.</strong><span>Arama kelimesini değiştir veya yeni ürün ekle.</span></div>}
    </section>
    {(addingProduct || editingProduct) && <ProductDialog product={editingProduct} onClose={() => { setAddingProduct(false); setEditingProduct(null); }} onSave={saveProduct} />}
  </main>;
}
