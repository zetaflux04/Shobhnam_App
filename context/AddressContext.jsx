import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './AuthContext';
import { addressApi } from '../lib/api';

const AddressContext = createContext(null);

const normalizeAddress = (address) => ({
  _id: address?._id,
  addressType: String(address?.addressType ?? 'HOME').trim().toUpperCase(),
  saveAs: String(address?.saveAs ?? '').trim(),
  houseFloor: String(address?.houseFloor ?? '').trim(),
  towerBlock: String(address?.towerBlock ?? '').trim(),
  landmark: String(address?.landmark ?? '').trim(),
  recipientName: String(address?.recipientName ?? '').trim(),
  recipientPhone: String(address?.recipientPhone ?? '').trim(),
  city: String(address?.city ?? '').trim(),
  state: String(address?.state ?? '').trim(),
  pinCode: String(address?.pinCode ?? '').trim(),
  isDefault: Boolean(address?.isDefault),
});

export const buildAddressLine = (address) =>
  [address?.houseFloor, address?.towerBlock, address?.landmark].filter(Boolean).join(', ');

export function AddressProvider({ children }) {
  const { isAuthenticated, userType } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadAddresses = useCallback(async () => {
    if (!isAuthenticated || userType !== 'user') {
      setAddresses([]);
      return [];
    }

    setLoading(true);
    try {
      const data = await addressApi.list();
      const normalized = (Array.isArray(data) ? data : []).map(normalizeAddress);
      setAddresses(normalized);
      return normalized;
    } catch {
      setAddresses([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, userType]);

  useEffect(() => {
    loadAddresses();
  }, [loadAddresses]);

  const addAddress = useCallback(
    async (payload) => {
      const created = await addressApi.create(payload);
      const normalized = normalizeAddress(created);
      setAddresses((prev) => {
        const next = [normalized, ...prev.filter((item) => item._id !== normalized._id)];
        if (!normalized.isDefault) return next;
        return next.map((item) => (item._id === normalized._id ? item : { ...item, isDefault: false }));
      });
      return normalized;
    },
    []
  );

  const editAddress = useCallback(async (id, payload) => {
    const updated = await addressApi.update(id, payload);
    const normalized = normalizeAddress(updated);
    setAddresses((prev) =>
      prev.map((item) => {
        if (item._id === normalized._id) return normalized;
        if (normalized.isDefault) return { ...item, isDefault: false };
        return item;
      })
    );
    return normalized;
  }, []);

  const removeAddress = useCallback(async (id) => {
    await addressApi.remove(id);
    setAddresses((prev) => prev.filter((item) => item._id !== id));
  }, []);

  const value = useMemo(
    () => ({
      addresses,
      loading,
      loadAddresses,
      addAddress,
      editAddress,
      removeAddress,
    }),
    [addresses, loading, loadAddresses, addAddress, editAddress, removeAddress]
  );

  return <AddressContext.Provider value={value}>{children}</AddressContext.Provider>;
}

export function useAddresses() {
  const ctx = useContext(AddressContext);
  if (!ctx) {
    throw new Error('useAddresses must be used within AddressProvider');
  }
  return ctx;
}
