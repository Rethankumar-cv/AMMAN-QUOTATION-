import localforage from 'localforage';

// Configure the main database instance for quotations (IndexedDB)
// localforage automatically falls back to WebSQL or localStorage if IndexedDB is unavailable
export const quotationStore = localforage.createInstance({
  name: 'AmmanEarthMovers',
  storeName: 'quotations',
  description: 'Stores draft and finalized quotation records'
});

// We can easily instantiate more stores here in the future
// export const equipmentStore = localforage.createInstance({...});
