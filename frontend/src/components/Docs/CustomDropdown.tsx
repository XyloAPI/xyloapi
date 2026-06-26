import { useState, useEffect, useRef } from 'react';

export type DropdownOption = string | { value: string; label: string; };
export interface CustomDropdownProps {
  value: string;
  options: DropdownOption[];
  onChange: (val: string) => void;
}

export default function CustomDropdown({ value, options, onChange }: CustomDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  
  const normalizedOptions = options.map(o => 
    typeof o === 'string' ? { value: o, label: o } : o
  );
  
  const selectedLabel = normalizedOptions.find(o => o.value === value)?.label ?? value;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative', width: '100%', userSelect: 'none' }}>
      {/* Trigger */}
      <div
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px',
          backgroundColor: 'var(--black)',
          border: open ? '1px solid var(--gold)' : '1px solid #2B2B2B',
          cursor: 'pointer',
          fontFamily: 'var(--font-mono)',
          fontSize: '12px',
          color: 'var(--white)',
          transition: 'border-color 0.2s',
        }}
        onMouseOver={(e) => { if (!open) e.currentTarget.style.borderColor = '#555'; }}
        onMouseOut={(e) => { if (!open) e.currentTarget.style.borderColor = '#2B2B2B'; }}
      >
        <span>{selectedLabel}</span>
        <svg
          width="10" height="10" viewBox="0 0 10 10" fill="none"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', flexShrink: 0 }}
        >
          <path d="M1 3L5 7L9 3" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="square" />
        </svg>
      </div>

      {/* Dropdown list */}
      {open && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 2px)',
          left: 0,
          right: 0,
          backgroundColor: '#0e0e0e',
          border: '1px solid var(--gold)',
          zIndex: 9999,
          maxHeight: '260px',
          overflowY: 'auto',
        }}>
          {normalizedOptions.map(opt => {
            const isActive = opt.value === value;
            return (
              <div
                key={opt.value}
                onClick={() => { onChange(opt.value); setOpen(false); }}
                style={{
                  padding: '10px 14px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  cursor: 'pointer',
                  color: isActive ? 'var(--gold-text)' : 'var(--white)',
                  backgroundColor: isActive ? 'rgba(255,192,0,0.07)' : 'transparent',
                  borderLeft: isActive ? '2px solid var(--gold)' : '2px solid transparent',
                  transition: 'background 0.15s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
                onMouseOver={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)'; }}
                onMouseOut={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                <span>{opt.label}</span>
                {isActive && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="square" />
                  </svg>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
