import { configureStore, createSlice, nanoid } from '@reduxjs/toolkit';

const initialProducts = [
  { id: 'item-1', name: 'deneme1', price: 90 },
  { id: 'item-2', name: 'berky', price: 190 },
  { id: 'item-3', name: 'team', price: 290 },
];

function loadProducts() {
  try {
    const stored = localStorage.getItem('react-uygulama-products');
    return stored ? JSON.parse(stored) : initialProducts;
  } catch {
    return initialProducts;
  }
}

const catalogSlice = createSlice({
  name: 'catalog',
  initialState: { products: loadProducts(), query: '', sort: 'asc' },
  reducers: {
    addProduct: {
      reducer(state, action) { state.products.push(action.payload); },
      prepare(product) { return { payload: { ...product, id: nanoid() } }; },
    },
    updateProduct(state, action) {
      const index = state.products.findIndex((product) => product.id === action.payload.id);
      if (index !== -1) state.products[index] = action.payload;
    },
    deleteProduct(state, action) {
      state.products = state.products.filter((product) => product.id !== action.payload);
    },
    setQuery(state, action) { state.query = action.payload; },
    setSort(state, action) { state.sort = action.payload; },
  },
});

export const { addProduct, updateProduct, deleteProduct, setQuery, setSort } = catalogSlice.actions;
export const store = configureStore({ reducer: { catalog: catalogSlice.reducer } });

store.subscribe(() => {
  try { localStorage.setItem('react-uygulama-products', JSON.stringify(store.getState().catalog.products)); }
  catch { /* The app remains usable if browser storage is unavailable. */ }
});
