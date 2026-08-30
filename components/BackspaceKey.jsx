export default function BackspaceKey({ className }) {
  return (
    <kbd
      className={`key-cap backspace-key ${className || ''}`}
      aria-label="退格键"
      title="退格键"
    >
      <span className="backspace-key-icon" aria-hidden="true" />
    </kbd>
  )
}
