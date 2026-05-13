type Props = {
  onClose: () => void;
};

export default function BookingSuccess({ onClose }: Props) {
  return (
    <div className="space-y-4 text-center">
      <h2 className="text-2xl font-semibold text-[#111111]">Booking request sent</h2>
      <p className="text-sm text-stone-600">Your provider can now accept, reject, or complete it.</p>
      <button onClick={onClose} className="bg-[#111111] px-5 py-3 text-sm font-semibold text-white">
        Done
      </button>
    </div>
  );
}
