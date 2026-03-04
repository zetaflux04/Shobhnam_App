import { createContext, useCallback, useContext, useMemo, useState } from 'react';

/**
 * @typedef {Object} BagItem
 * @property {string} id
 * @property {string} [artistId]
 * @property {string} serviceName
 * @property {string} packageTitle
 * @property {number} price
 * @property {string} dateTime
 * @property {string} [date] - ISO date for API
 * @property {string} [address]
 * @property {string} [city]
 * @property {string} [pinCode]
 * @property {string} addressId
 * @property {string} addressLabel
 * @property {string} addressDetail
 * @property {string[]} gradient
 * @property {import('react-native').ImageSourcePropType} [image]
 */

const OrderContext = createContext(null);

const generateId = () => `bag-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

export function OrderProvider({ children }) {
  const [bagItems, setBagItems] = useState([]);
  const [selectedIds, setSelectedIds] = useState(new Set());

  const addToBag = useCallback((item) => {
    const newItem = {
      id: generateId(),
      ...item,
    };
    setBagItems((prev) => [...prev, newItem]);
    setSelectedIds((prev) => new Set([...prev, newItem.id]));
  }, []);

  const removeFromBag = useCallback((id) => {
    setBagItems((prev) => prev.filter((i) => i.id !== id));
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const toggleSelection = useCallback((id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const clearBag = useCallback(() => {
    setBagItems([]);
    setSelectedIds(new Set());
  }, []);

  const clearSelectedAfterOrder = useCallback(() => {
    setBagItems((prev) => prev.filter((i) => !selectedIds.has(i.id)));
    setSelectedIds(new Set());
  }, [selectedIds]);

  const selectedItems = useMemo(
    () => bagItems.filter((i) => selectedIds.has(i.id)),
    [bagItems, selectedIds],
  );

  const selectedTotal = useMemo(
    () => selectedItems.reduce((sum, i) => sum + (i.price ?? 0), 0),
    [selectedItems],
  );

  const value = useMemo(
    () => ({
      bagItems,
      selectedIds,
      selectedItems,
      selectedTotal,
      selectedCount: selectedItems.length,
      addToBag,
      removeFromBag,
      toggleSelection,
      clearBag,
      clearSelectedAfterOrder,
    }),
    [
      bagItems,
      selectedIds,
      selectedItems,
      selectedTotal,
      addToBag,
      removeFromBag,
      toggleSelection,
      clearBag,
      clearSelectedAfterOrder,
    ],
  );

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}

export function useOrder() {
  const ctx = useContext(OrderContext);
  if (!ctx) {
    throw new Error('useOrder must be used within OrderProvider');
  }
  return ctx;
}
