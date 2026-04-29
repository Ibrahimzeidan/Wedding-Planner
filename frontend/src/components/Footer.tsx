import Link from "next/link";
import { FaFacebookF, FaInstagram, FaPinterestP } from "react-icons/fa";

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact Us" },
  { href: "/login", label: "Login" },
  { href: "/register", label: "Register" },
];

const socialLinks = [
  { href: "https://facebook.com", label: "Facebook", icon: FaFacebookF },
  { href: "https://instagram.com", label: "Instagram", icon: FaInstagram },
  { href: "https://pinterest.com", label: "Pinterest", icon: FaPinterestP },
];

export default function Footer() {
  return (
    <footer className="border-t border-[#d8b45f]/30 bg-[#321126]">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <p className="text-lg font-semibold text-[#fff8e7]">Smart Wedding Planner</p>
          <p className="mt-3 max-w-sm text-sm leading-6 text-[#eadde4]">
            A calm, beautiful place to organize dream weddings from the first idea to the final toast.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#f1c76b]">Quick links</p>
          <div className="mt-4 flex flex-col gap-2 text-sm text-[#eadde4]">
            {quickLinks.map((link) => (
              <Link key={link.href} href={link.href} className="transition hover:text-[#f5c7d3]">
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#f1c76b]">Social media</p>
          <div className="mt-4 flex gap-3">
            {socialLinks.map((social) => {
              const Icon = social.icon;

              return (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d8b45f]/60 text-[#f1c76b] transition hover:border-[#fff8e7] hover:bg-[#fff8e7] hover:text-[#42162f]"
                >
                  <Icon />
                </a>
              );
            })}
          </div>
        </div>
      </div>

      <div className="border-t border-[#d8b45f]/25 px-4 py-4 text-center text-sm text-[#d8c6cc]">
        Copyright © {new Date().getFullYear()} Smart Wedding Planner. All rights reserved.
      </div>
    </footer>
  );
}
