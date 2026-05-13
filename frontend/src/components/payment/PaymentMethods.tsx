import type { PaymentMethod } from "@/types/booking";

type Props = {
  value: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
};

const methods: { value: PaymentMethod; label: string }[] = [
  { value: "cash", label: "Cash" },
  { value: "credit_card", label: "Credit Card" },
  { value: "paypal", label: "PayPal" },
];

export default function PaymentMethods({ value, onChange }: Props) {
  return (
    <div className="grid gap-2 sm:grid-cols-3">
      {methods.map((method) => (
        <button
          type="button"
          key={method.value}
          onClick={() => onChange(method.value)}
          className={`border px-4 py-3 text-sm font-semibold ${
            value === method.value ? "border-[#111111] bg-[#111111] text-white" : "bg-white"
          }`}
        >
          {method.label}
        </button>
      ))}
    </div>
  );
}
