import type { UiMessage } from "@/types/admin";

export default function AdminNotice({ message }: { message: UiMessage }) {
  const styles =
    message.type === "success"
      ? "border-green-200 bg-green-50 text-green-700"
      : "border-red-200 bg-red-50 text-red-700";

  return <p className={`mb-4 rounded-2xl border px-4 py-3 text-sm ${styles}`}>{message.text}</p>;
}
