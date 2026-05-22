import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AppState, Product, ViewMode } from './types';

interface StoreActions {
  init: () => (() => void);
  setViewMode: (mode: ViewMode) => void;
  adjustQuantity: (productId: string, amount: number) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  toggleComplete: (productId: string) => Promise<void>;
  resetQuantity: (productId: string) => Promise<void>;
  wipeSide: () => Promise<void>;
  seedProducts: () => Promise<void>;
  clearError: () => void;
}

const INITIAL_PRODUCTS: Product[] = [
  { id: '1', name: 'Saga Hard Seltzer', category: 'Beer', sortOrder: 1, active: true },
  { id: '2', name: 'Carlsberg Pilsner', category: 'Beer', sortOrder: 2, active: true },
  { id: '3', name: 'Sommersby Pear', category: 'Cider', sortOrder: 3, active: true },
  { id: '4', name: 'Corona', category: 'Beer', sortOrder: 4, active: true },
  { id: '5', name: 'Mer Appelsin', category: 'Juice', sortOrder: 5, active: true },
  { id: '6', name: 'Mer Jordbær & Eple', category: 'Juice', sortOrder: 6, active: true },
  { id: '7', name: 'Balholm Eple & Bringebær', category: 'Juice', sortOrder: 7, active: true },
  { id: '8', name: 'Balholm Eple', category: 'Juice', sortOrder: 8, active: true },
  { id: '9', name: 'Imsdal', category: 'Water', sortOrder: 9, active: true },
  { id: '10', name: 'Frus Bringebær', category: 'Soda', sortOrder: 10, active: true },
  { id: '11', name: 'Frus Eple & Kiwi', category: 'Soda', sortOrder: 11, active: true },
  { id: '12', name: 'Erdinger', category: 'Beer', sortOrder: 12, active: true },
  { id: '13', name: 'Lite Pils', category: 'Beer', sortOrder: 13, active: true },
  { id: '14', name: 'East Ipa', category: 'Beer', sortOrder: 14, active: true },
  { id: '15', name: 'Breezer Orange', category: 'Cider', sortOrder: 15, active: true },
  { id: '16', name: 'Guinnes', category: 'Beer', sortOrder: 16, active: true },
  { id: '17', name: 'Tonic Water Raspberry', category: 'Mixer', sortOrder: 17, active: true },
  { id: '18', name: 'Tonic Water Fentimans', category: 'Mixer', sortOrder: 18, active: true },
  { id: '19', name: 'Ginger Beer', category: 'Mixer', sortOrder: 19, active: true },
  { id: '20', name: 'Red Bull', category: 'Energy', sortOrder: 20, active: true },
  { id: '35', name: 'Red Bull Zero Sugar', category: 'Energy', sortOrder: 35, active: true },
  { id: '21', name: 'Mont-Ferrant', category: 'Sparkling', sortOrder: 21, active: true },
  { id: '22', name: 'Prosecco', category: 'Sparkling', sortOrder: 22, active: true },
  { id: '23', name: 'Cola Glass', category: 'Soda', sortOrder: 23, active: true },
  { id: '24', name: 'Cola Zero Glass', category: 'Soda', sortOrder: 24, active: true },
  { id: '25', name: 'Carlsberg Alcohol Free', category: 'Non-Alcoholic', sortOrder: 25, active: true },
  { id: '26', name: 'Munkholm', category: 'Non-Alcoholic', sortOrder: 26, active: true },
  { id: '27', name: 'Brooklyn Special Effects', category: 'Non-Alcoholic', sortOrder: 27, active: true },
  { id: '28', name: 'Eplemost', category: 'Juice', sortOrder: 28, active: true },
  { id: '29', name: 'Farris Naturell', category: 'Water', sortOrder: 29, active: true },
  { id: '30', name: 'Farris Lime', category: 'Water', sortOrder: 30, active: true },
  { id: '31', name: 'Melk', category: 'Dairy', sortOrder: 31, active: true },
  { id: '32', name: 'Krem Pisket', category: 'Dairy', sortOrder: 32, active: true },
  { id: '33', name: 'Iste', category: 'Tea', sortOrder: 33, active: true },
  { id: '34', name: 'Appelsin Juice Stor', category: 'Juice', sortOrder: 34, active: true },
];

export const useStore = create<AppState & StoreActions>()(
  persist(
    (set, get) => ({
      products: INITIAL_PRODUCTS,
      items: {},
      viewMode: 'list',
      loading: false,
      error: null,
      clearError: () => set({ error: null }),

      init: () => {
        // Local state doesn't need external listeners
        return () => {};
      },

      setViewMode: (viewMode) => set({ viewMode }),

      adjustQuantity: async (productId, amount) => {
        const { items } = get();
        const current = items[productId] || { quantity: 0, completed: false };
        const newQty = Math.max(0, current.quantity + amount);
        
        set({
          items: {
            ...items,
            [productId]: { ...current, quantity: newQty, completed: false }
          }
        });
      },

      updateQuantity: async (productId, quantity) => {
        const { items } = get();
        const current = items[productId] || { quantity: 0, completed: false };
        const newQty = Math.max(0, quantity);
        
        set({
          items: {
            ...items,
            [productId]: { ...current, quantity: newQty, completed: false }
          }
        });
      },

      toggleComplete: async (productId) => {
        const { items } = get();
        const current = items[productId] || { quantity: 0, completed: false };
        set({
          items: {
            ...items,
            [productId]: { ...current, completed: !current.completed }
          }
        });
      },

      resetQuantity: async (productId) => {
        const { items } = get();
        set({
          items: {
            ...items,
            [productId]: { quantity: 0, completed: false }
          }
        });
      },

      seedProducts: async () => {
        // In local mode, products are pre-seeded in initial state
      },

      wipeSide: async () => {
        const { items } = get();
        const newItems = { ...items };
        Object.keys(newItems).forEach(id => {
          newItems[id] = { quantity: 0, completed: false };
        });
        set({ items: newItems });
      }
    }),
    {
      name: 'drink-restock-storage-v3',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
