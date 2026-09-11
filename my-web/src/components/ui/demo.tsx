"use client";
import React from "react";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  Dribbble,
  Globe,
} from "lucide-react";
import { FooterBackgroundGradient, TextHoverEffect } from "@/components/ui/hover-footer";

function HoverFooter() {
  // Footer link data
  const footerLinks = [
    {
      title: "Navigation",
      links: [
        { label: "Prescription Glasses", href: "/shop" },
        { label: "Designer Sunglasses", href: "/shop?gender=SUNGLASSES" },
        { label: "Partner Boutiques", href: "/stores" },
        { label: "Optical Prescriptions", href: "/prescriptions" },
      ],
    },
    {
      title: "Helpful Links",
      links: [
        { label: "FAQs", href: "#" },
        { label: "Support & Warranty", href: "#" },
        {
          label: "Live Optical Chat",
          href: "#",
          pulse: true,
        },
      ],
    },
  ];

  // Contact info data
  const contactInfo = [
    {
      icon: <Mail size={18} className="text-[#3ca2fa]" />,
      text: "support@brighteyes.com",
      href: "mailto:support@brighteyes.com",
    },
    {
      icon: <Phone size={18} className="text-[#3ca2fa]" />,
      text: "1-800-BRIGHT-EYES",
      href: "tel:18002744483",
    },
    {
      icon: <MapPin size={18} className="text-[#3ca2fa]" />,
      text: "BrightEyes NYC Flagship Store",
    },
  ];

  // Social media icons
  const socialLinks = [
    { icon: <Facebook size={20} />, label: "Facebook", href: "#" },
    { icon: <Instagram size={20} />, label: "Instagram", href: "#" },
    { icon: <Twitter size={20} />, label: "Twitter", href: "#" },
    { icon: <Dribbble size={20} />, label: "Dribbble", href: "#" },
    { icon: <Globe size={20} />, label: "Globe", href: "#" },
  ];

  return (
    <footer className="bg-[#0F0F11]/90 relative h-fit rounded-3xl overflow-hidden m-8 border border-neutral-800 text-neutral-300">
      <div className="max-w-7xl mx-auto p-14 z-40 relative pb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8 lg:gap-16">
          {/* Brand section */}
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-2">
              <span className="text-[#3ca2fa] text-3xl font-extrabold">
                &hearts;
              </span>
              <span className="text-white text-3xl font-bold tracking-tight">BRIGHTEYES</span>
            </div>
            <p className="text-sm leading-relaxed text-gray-300">
              BrightEyes is a modern multi-store optical platform with high-precision lens technology and doctor prescription fitting.
            </p>
          </div>

          {/* Footer link sections */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h4 className="text-white text-lg font-semibold mb-6">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label} className="relative">
                    <a
                      href={link.href}
                      className="hover:text-[#3ca2fa] text-gray-300 transition-colors"
                    >
                      {link.label}
                    </a>
                    {link.pulse && (
                      <span className="absolute top-0 right-[-10px] w-2 h-2 rounded-full bg-[#3ca2fa] animate-pulse"></span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact section */}
          <div>
            <h4 className="text-white text-lg font-semibold mb-6">
              Contact Us
            </h4>
            <ul className="space-y-4">
              {contactInfo.map((item, i) => (
                <li key={i} className="flex items-center space-x-3 text-gray-300">
                  {item.icon}
                  {item.href ? (
                    <a
                      href={item.href}
                      className="hover:text-[#3ca2fa] transition-colors"
                    >
                      {item.text}
                    </a>
                  ) : (
                    <span className="hover:text-[#3ca2fa] transition-colors">
                      {item.text}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Text hover effect (Smaller Sleek Size) */}
      <div className="lg:flex hidden h-[10rem] my-2 justify-center items-center relative z-20 overflow-hidden">
        <TextHoverEffect text="BRIGHTEYES" className="z-50" />
      </div>

      {/* Centered Bottom Bar */}
      <div className="relative z-40 max-w-7xl mx-auto px-8 pt-4 pb-10 flex flex-col items-center justify-center space-y-4 border-t border-neutral-800/60">
        {/* Social icons */}
        <div className="flex space-x-6 text-gray-400">
          {socialLinks.map(({ icon, label, href }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              className="hover:text-[#3ca2fa] transition-colors"
            >
              {icon}
            </a>
          ))}
        </div>

        {/* Copyright */}
        <p className="text-center text-xs text-gray-400 tracking-wide font-normal">
          &copy; {new Date().getFullYear()} BRIGHTEYES. All rights reserved.
        </p>
      </div>

      <FooterBackgroundGradient />
    </footer>
  );
}

export default HoverFooter;
