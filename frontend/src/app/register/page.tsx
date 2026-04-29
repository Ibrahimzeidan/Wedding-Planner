import Link from "next/link";

export default function RegisterPage() {
  return (
    <section className="mx-auto flex max-w-5xl items-center justify-center px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="w-full max-w-md rounded-[2rem] border border-blush-100 bg-white p-6 shadow-soft">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-champagne-700">Start today</p>
        <h1 className="mt-3 text-3xl font-bold text-stone-950">Register</h1>
        <form className="mt-8 grid gap-5">
          <label className="grid gap-2 text-sm font-medium text-stone-700">
            Full name
            <input
              type="text"
              placeholder="Your name"
              className="rounded-2xl border border-blush-100 px-4 py-3 outline-none transition focus:border-blush-300"
            />
          </label>
          <label className="grid gap-2 text-sm font-medium text-stone-700">
            Email address
            <input
              type="email"
              placeholder="you@example.com"
              className="rounded-2xl border border-blush-100 px-4 py-3 outline-none transition focus:border-blush-300"
            />
          </label>
          <label className="grid gap-2 text-sm font-medium text-stone-700">
            Password
            <input
              type="password"
              placeholder="Create a password"
              className="rounded-2xl border border-blush-100 px-4 py-3 outline-none transition focus:border-blush-300"
            />
          </label>
          <button
            type="submit"
            className="rounded-full bg-blush-500 px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-blush-300"
          >
            Create Account
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-stone-600">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-blush-500">
            Login
          </Link>
        </p>
      </div>
    </section>
  );
}
