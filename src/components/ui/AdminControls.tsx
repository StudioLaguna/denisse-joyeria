import type { ReactNode, InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes } from 'react'

export const inputStyle = {
  width: '100%',
  background: 'transparent',
  border: '1px solid rgba(139,107,74,0.3)',
  padding: '8px 12px',
  color: '#f5f2ec',
  fontSize: '0.8rem',
  fontFamily: 'Josefin Sans, sans-serif',
  outline: 'none',
}

export const labelStyle = {
  display: 'block',
  fontSize: '0.55rem',
  letterSpacing: '0.35em',
  textTransform: 'uppercase' as const,
  color: '#8b6b4a',
  marginBottom: 4,
}

export const btnPrimary = {
  background: '#8b6b4a',
  color: '#f5f2ec',
  border: 'none',
  padding: '8px 20px',
  fontSize: '0.6rem',
  letterSpacing: '0.3em',
  textTransform: 'uppercase' as const,
  cursor: 'pointer',
  fontFamily: 'Josefin Sans, sans-serif',
}

export const btnSecondary = {
  background: 'transparent',
  color: '#6b6158',
  border: '1px solid rgba(139,107,74,0.25)',
  padding: '8px 20px',
  fontSize: '0.6rem',
  letterSpacing: '0.3em',
  textTransform: 'uppercase' as const,
  cursor: 'pointer',
  fontFamily: 'Josefin Sans, sans-serif',
}

export const btnDanger = {
  background: 'transparent',
  color: '#dc2626',
  border: '1px solid rgba(220,38,38,0.3)',
  padding: '6px 14px',
  fontSize: '0.55rem',
  letterSpacing: '0.25em',
  textTransform: 'uppercase' as const,
  cursor: 'pointer',
  fontFamily: 'Josefin Sans, sans-serif',
}

export function Label({ children }: { children: ReactNode }) {
  return <label style={labelStyle}>{children}</label>
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input style={inputStyle} {...props} />
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: 72 }} {...props} />
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select style={{ ...inputStyle, appearance: 'none' as const }} {...props} />
}

export function SavedBadge({ show }: { show: boolean }) {
  if (!show) return null
  return (
    <div
      className="mb-4 px-4 py-2 text-xs"
      style={{
        background: 'rgba(139,107,74,0.15)',
        color: '#c4a882',
        border: '1px solid rgba(139,107,74,0.3)',
        letterSpacing: '0.3em',
      }}
    >
      GUARDADO
    </div>
  )
}
