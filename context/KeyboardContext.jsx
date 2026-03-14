import { createContext, useContext } from 'react';

export const KeyboardVisibleContext = createContext(false);

export function useKeyboardVisible() {
  return useContext(KeyboardVisibleContext);
}
