const fields = ["Card Holder Name", "Card Number", "Expiry Date", "CVV"];

export default function CreditCardForm() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {fields.map((label) => (
        <label key={label} className="text-sm font-semibold text-stone-800">
          {label}
          <input
            type="text"
            placeholder={label}
            className="mt-1 w-full border border-[#111111]/15 px-3 py-2 text-sm outline-none focus:border-[#111111]"
          />
        </label>
      ))}
    </div>
  );
}
