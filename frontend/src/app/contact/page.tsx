export default function ContactPage() {
  return (
    <section className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:py-24">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-champagne-700">Contact us</p>
        <h1 className="mt-4 text-4xl font-bold text-stone-950 sm:text-5xl">Tell us about your celebration.</h1>
        <p className="mt-6 text-lg leading-8 text-stone-600">
          Have a question or a wedding planning idea? Send a message and the Smart Wedding Planner team
          will get back to you.
        </p>
      </div>

      <form className="rounded-[2rem] border border-blush-100 bg-white p-6 shadow-soft">
        <div className="grid gap-5">
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
            Message
            <textarea
              rows={5}
              placeholder="How can we help?"
              className="resize-none rounded-2xl border border-blush-100 px-4 py-3 outline-none transition focus:border-blush-300"
            />
          </label>
          <button
            type="submit"
            className="rounded-full bg-blush-500 px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-blush-300"
          >
            Send Message
          </button>
        </div>
      </form>
    </section>
  );
}
