import BookingForm from "@/components/bookings/BookingForm";
import BookingSuccess from "@/components/bookings/BookingSuccess";
import PaymentModal from "@/components/bookings/PaymentModal";
import type { BookingFormData, BookingSeed, PaymentMethod } from "@/types/booking";

type Props = {
  seed: BookingSeed;
  step: "form" | "payment" | "success";
  form: BookingFormData;
  method: PaymentMethod;
  error: string;
  isLoading: boolean;
  setForm: (value: BookingFormData) => void;
  setMethod: (value: PaymentMethod) => void;
  setStep: (value: "form" | "payment" | "success") => void;
  onCancel: () => void;
  onContinue: () => void;
  onConfirm: () => void;
};

export default function BookingFlowContent(props: Props) {
  if (props.step === "success") {
    return <BookingSuccess onClose={props.onCancel} />;
  }

  return (
    <>
      <h2 className="mb-4 text-2xl font-semibold text-[#111111]">Request Booking</h2>
      {props.error && <p className="mb-3 text-sm font-semibold text-red-700">{props.error}</p>}
      {props.step === "form" ? (
        <BookingForm
          seed={props.seed}
          value={props.form}
          onChange={props.setForm}
          onCancel={props.onCancel}
          onContinue={props.onContinue}
        />
      ) : (
        <PaymentModal
          seed={props.seed}
          form={props.form}
          method={props.method}
          isLoading={props.isLoading}
          onMethodChange={props.setMethod}
          onBack={() => props.setStep("form")}
          onConfirm={props.onConfirm}
        />
      )}
    </>
  );
}
