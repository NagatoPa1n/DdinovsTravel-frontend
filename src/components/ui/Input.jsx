export default function Input({ label, error, hint, as = 'input', id, className = '', ...rest }) {
  const Element = as
  const inputId = id || rest.name

  return (
    <div className={`field ${error ? 'field--error' : ''} ${className}`}>
      {label && (
        <label className="field__label" htmlFor={inputId}>
          {label}
          {rest.required && <span className="field__required"> *</span>}
        </label>
      )}
      <Element id={inputId} className="field__control" {...rest} />
      {error ? (
        <span className="field__error">{error}</span>
      ) : (
        hint && <span className="field__hint">{hint}</span>
      )}
    </div>
  )
}
