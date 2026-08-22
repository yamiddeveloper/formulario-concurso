export default function Button({
  variant = "primary",
  loading = false,
  disabled = false,
  children,
  ...props
}) {
  return (
    <button
      className={`button button-${variant}`}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading && <span className="spinner" aria-hidden="true" />}
      {children}
    </button>
  );
}
