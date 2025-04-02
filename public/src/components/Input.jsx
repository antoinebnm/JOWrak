export default function Input({
  id,
  className,
  type = "text",
  placeholder = null,
  value = undefined,
  onChange = () => {},
  autoComplete = undefined,
  required = false,
  hidden = false,
}) {
  return (
    <input
      type={type}
      id={id}
      className={className}
      placeholder={placeholder}
      autoComplete={autoComplete}
      value={value}
      onChange={onChange}
      required={required}
      hidden={hidden}
    />
  );
}
