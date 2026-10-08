import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div
        style={{
          position: 'fixed',
          bottom: '1.5rem',
          right: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.6rem',
          zIndex: 9999,
          maxWidth: '380px',
          width: 'calc(100% - 3rem)'
        }}
      >
        {toasts.map((toast) => {
          let borderColor = 'var(--border-strong)';
          let bg = 'var(--bg-dark)';
          let color = 'var(--text-inverse)';

          if (toast.type === 'error') {
            borderColor = 'var(--error)';
            bg = '#2A1212';
          } else if (toast.type === 'success') {
            borderColor = 'var(--success)';
            bg = '#12261A';
          }

          return (
            <div
              key={toast.id}
              className="animate-fade-in"
              style={{
                backgroundColor: bg,
                color,
                border: `1px solid ${borderColor}`,
                borderRadius: 'var(--radius-xs)',
                padding: '0.85rem 1.15rem',
                fontSize: '0.88rem',
                boxShadow: 'var(--shadow-hover)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.8rem'
              }}
            >
              <div style={{ flex: 1, fontFamily: 'var(--font-body)', fontWeight: 500 }}>
                {toast.message}
              </div>
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'inherit',
                  fontSize: '1.1rem',
                  lineHeight: 1,
                  opacity: 0.7,
                  cursor: 'pointer'
                }}
              >
                ×
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
