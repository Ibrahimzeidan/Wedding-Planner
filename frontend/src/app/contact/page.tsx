import ContactForm from "@/components/contact/ContactForm";
import ContactInfoPanel from "@/components/contact/ContactInfoPanel";
import WeddingHero from "@/components/ui/WeddingHero";
import { images } from "@/lib/weddingData";

export default function ContactPage() {
  return (
    <div className="bg-[#efefef]">
      <WeddingHero image={images.contactHero} title="Contact Us" />
      <section className="px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <p className="text-sm font-semibold uppercase text-stone-500">Say Hello</p>
            <h1 className="mt-2 text-4xl font-semibold text-[#111111]">Tell us about your wedding plans</h1>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-stone-600">
              Send your question, request, or idea and our team will help you find the right next step.
            </p>
          </div>
          <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
            <ContactInfoPanel />
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  );
}
