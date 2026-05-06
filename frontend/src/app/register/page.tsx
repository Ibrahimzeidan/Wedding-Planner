import Link from "next/link";
import RegisterForm from "@/components/auth/RegisterForm";

const imageUrl =
  "https://images.unsplash.com/photo-1525258946800-98cfd641d0de?auto=format&fit=crop&w=900&q=85";

export default function RegisterPage() {
  return (
    <section className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 xl:px-10">
      <div className="bg-white p-6 shadow-soft sm:p-10">
        <p className="text-sm font-semibold uppercase text-stone-500">Start today</p>
        <h1 className="mt-3 text-3xl font-semibold text-[#111111] sm:text-5xl">Register</h1>
        <RegisterForm />
        <p className="mt-5 text-center text-sm text-stone-600">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-[#111111] underline">
            Login
          </Link>
        </p>
      </div>
      <div className="hidden h-[720px] overflow-hidden lg:block">
        <img src={imageUrl} alt="Bride holding flowers" className="h-full w-full object-cover" />
      </div>
    </section>
  );
}
