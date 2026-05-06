type FormMessageProps = {
  message: string;
  type: "success" | "error";
};

export default function FormMessage({ message, type }: FormMessageProps) {
  if (!message) {
    return null;
  }

  const styles =
    type === "success"
      ? "border-green-200 bg-green-50 text-green-700"
      : "border-red-200 bg-red-50 text-red-700";

  return (
    <p className={`break-words rounded-2xl border px-4 py-2.5 text-sm font-medium leading-6 ${styles}`}>
      {message}
    </p>
  );
}
