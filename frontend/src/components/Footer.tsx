import Link from "next/link";
import { FaFacebookF, FaInstagram, FaPinterestP, FaTwitter } from "react-icons/fa";

const columns = [
  {
    title: "Venues",
    links: ["Maldives", "India", "Dubai", "Paris"],
  },
  {
    title: "Services",
    links: ["Photographers", "Decorations", "Designers", "Makeup Artists"],
  },
  {
    title: "Support",
    links: ["About Us", "Careers", "Contact Us", "Terms & Conditions"],
  },
];

const socials = [
  { href: "https://facebook.com", label: "Facebook", icon: FaFacebookF },
  { href: "https://twitter.com", label: "Twitter", icon: FaTwitter },
  { href: "https://instagram.com", label: "Instagram", icon: FaInstagram },
  { href: "https://pinterest.com", label: "Pinterest", icon: FaPinterestP },
];

export default function Footer() {
  return (
    <footer className="bg-[#111111] text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_2fr] lg:px-8 xl:px-10">
        <div>
          <p className="text-2xl font-semibold italic">Happily Ever Afters</p>
          <p className="mt-1 text-sm text-white/55">wedding events</p>
          <p className="mt-5 max-w-sm text-sm leading-6 text-white/60">
            A calm planning space for venues, vendors, inspiration, and every detail that makes the day feel personal.
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-3">
          {columns.map((column) => (
            <div key={column.title}>
              <p className="font-semibold">{column.title}</p>
              <div className="mt-4 grid gap-3 text-sm text-white/60">
                {column.links.map((label) => (
                  <Link key={label} href={label === "Contact Us" ? "/contact" : "#"} className="hover:text-white">
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mx-auto flex max-w-7xl flex-col gap-4 border-t border-white/10 px-4 py-5 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8 xl:px-10">
          <p>&copy; {new Date().getFullYear()} Fashion Store. All rights reserved.</p>
        <div className="flex gap-4">
          {socials.map((social) => {
            const Icon = social.icon;
            return (
              <a key={social.label} href={social.href} aria-label={social.label} className="hover:text-white">
                <Icon />
              </a>
            );
          })}
        </div>
      </div>
    </footer>
  );
}
