import localforage from 'localforage';

// Configure the main database instance for quotations (IndexedDB)
// localforage automatically falls back to WebSQL or localStorage if IndexedDB is unavailable
export const quotationStore = localforage.createInstance({
  name: 'AmmanEarthMovers',
  storeName: 'quotations',
  description: 'Stores draft and finalized quotation records'
});

export const challanStore = localforage.createInstance({
  name: 'AmmanEarthMovers',
  storeName: 'challans',
  description: 'Stores draft and finalized delivery challan records'
});
