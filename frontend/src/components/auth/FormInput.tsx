import Input from "@/components/ui/Input";

type FormInputProps = {
  label: string;
  name: string;
  type?: string;
  value: string;
  placeholder: string;
  required?: boolean;
  inputClassName?: string;
  onChange: (value: string) => void;
};

export default function FormInput({
  label,
  name,
  type = "text",
  value,
  placeholder,
  required = false,
  inputClassName = "",
  onChange,
}: FormInputProps) {
  return (
    <Input
      label={label}
      name={name}
      type={type}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      required={required}
      className={inputClassName}
    />
  );
}
