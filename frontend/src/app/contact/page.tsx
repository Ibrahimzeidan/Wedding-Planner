import PageHeader from "@/components/PageHeader";
import ContactForm from "@/components/contact/ContactForm";

export default function ContactPage() {
  return (
    <section className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10 lg:px-8 lg:py-20 xl:px-10">
      <div>
        <PageHeader
          eyebrow="Contact Us"
          title="Contact Us"
          description="Have a question, idea, or planning request? Send us a message and the Smart Wedding Planner team will help you take the next step."
          align="left"
        />

        <div className="mt-8 border border-[#111111]/10 bg-white p-6 shadow-soft">
          <h2 className="text-lg font-semibold text-[#111111] sm:text-xl">We would love to hear from you.</h2>
          <p className="mt-3 leading-7 text-stone-600">
            Share your wedding planning goals, feature questions, or partnership ideas. Your message goes
            directly to the backend contact endpoint.
          </p>
        </div>
      </div>

      <ContactForm />
    </section>
  );
}
