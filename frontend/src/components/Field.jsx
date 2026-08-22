export default function Field({ label, htmlFor, error, hint, required, counter, children }) {
  return (
    <div className="field">
      <label className="field-label" htmlFor={htmlFor}>
        {label}
        {required && (
          <span className="field-required" aria-hidden="true">
            {" "}
            *
          </span>
        )}
      </label>
      {hint && (
        <p className="field-hint" id={`${htmlFor}-hint`}>
          {hint}
        </p>
      )}
      {children}
      {counter}
      {error && (
        <p className="field-error" id={`${htmlFor}-error`} role="alert">
          <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor" aria-hidden="true" focusable="false">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M10 2a8 8 0 100 16 8 8 0 000-16zM9 6a1 1 0 112 0v4a1 1 0 11-2 0V6zm1 8.25a1 1 0 100-2 1 1 0 000 2z"
            />
          </svg>
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}

export function describedBy(htmlFor, { hint, error } = {}) {
  const ids = [];
  if (hint) ids.push(`${htmlFor}-hint`);
  if (error) ids.push(`${htmlFor}-error`);
  return ids.length ? ids.join(" ") : undefined;
}
