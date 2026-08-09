import { useEffect, useState } from "react";

const listeners = new Set();

export function toast(message, type = "success") {
  const payload = { id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6), message, type };
  listeners.forEach((listener) => listener(payload));
}

export function useToasts() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handle = (payload) => {
      setToasts((current) => [...current, payload]);
      setTimeout(() => {
        setToasts((current) => current.filter((t) => t.id !== payload.id));
      }, 3200);
    };
    listeners.add(handle);
    return () => listeners.delete(handle);
  }, []);

  const dismiss = (id) => setToasts((current) => current.filter((t) => t.id !== id));

  return { toasts, dismiss };
}
