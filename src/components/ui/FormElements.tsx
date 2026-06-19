import type { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'

const base = {
  background: 'transparent',
  border: '1px solid rgba(139,107,74,0.3)',
  padding: '8px 12px',
  color: '#f5f2ec',
  fontSize: '0.8rem',
  fontFamily: 'Josefin Sans, sans-serif',
  outline: 'none',
  width: '100%',
}

export function Label({ children }: { children: ReactNode }) {
  return (
    <label
      className="block mb-1"
      style={{ fontSize: '0.55rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: '#8b6b4a' }}
    >
      {children}
    </label>
  )
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} style={{ ...base, ...props.style }} />
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} style={{ ...base, resize: 'vertical', minHeight: 72, ...props.style }} />
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} style={{ ...base, appearance: 'none', ...props.style }} />
}

export function BtnPrimary(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      style={{
        background: '#8b6b4a',
        color: '#f5f2ec',
        border: 'none',
        padding: '8px 20px',
        fontSize: '0.6rem',
        letterSpacing: '0.3em',
        textTransform: 'uppercase',
        cursor: 'pointer',
        fontFamily: 'Josefin Sans, sans-serif',
        ...props.style,
      }}
    />
  )
}

export function BtnSecondary(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      style={{
        background: 'transparent',
        color: '#6b6158',
        border: '1px solid rgba(139,107,74,0.25)',
        padding: '8px 20px',
        fontSize: '0.6rem',
        letterSpacing: '0.3em',
        textTransform: 'uppercase',
        cursor: 'pointer',
        fontFamily: 'Josefin Sans, sans-serif',
        ...props.style,
      }}
    />
  )
}

export function BtnDanger(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      style={{
        background: 'transparent',
        color: '#dc2626',
        border: '1px solid rgba(220,38,38,0.3)',
        padding: '6px 14px',
        fontSize: '0.55rem',
        letterSpacing: '0.25em',
        textTransform: 'uppercase',
        cursor: 'pointer',
        fontFamily: 'Josefin Sans, sans-serif',
        ...props.style,
      }}
    />
  )
}
