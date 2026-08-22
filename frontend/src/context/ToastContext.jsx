import { createContext, useCallback, useContext, useState } from 'react';

const ToastContext = createContext(null);
let idc = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const push = useCallback((message, type = 'success') => {
    const id = ++idc;
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
  }, []);

  return (
    <ToastContext.Provider value={push}>
      {children}
      <div className="fixed bottom-6 left-1/2 z-[100] flex -translate-x-1/2 flex-col items-center gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`ambient-shadow flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white ${
              t.type === 'error' ? 'bg-error' : t.type === 'info' ? 'bg-secondary' : 'bg-primary'
            }`}
          >
            <span className="material-symbols-outlined text-lg">
              {t.type === 'error' ? 'error' : t.type === 'info' ? 'info' : 'check_circle'}
            </span>
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
