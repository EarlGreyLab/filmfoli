import { useState, type FormEvent } from "react";
import { Camera, Mail } from "lucide-react";
import { RebateStrip } from "../components/RebateStrip";
import { Button } from "../components/ui/button";
import { Seo } from "../components/Seo";

/**
 * Static-site contact: the form composes a mailto: link on submit, so
 * it works with zero backend. Swap the onSubmit for a Formspree/Resend
 * endpoint later if you want real delivery — the UI won't change.
 */
export function Contact() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const url = `mailto:hello@example.com?subject=${encodeURIComponent(subject || "Hello from the site")}&body=${encodeURIComponent(message)}`;
    window.location.href = url;
  };

  const inputClass =
    "w-full border border-line bg-transparent px-4 py-3 text-sm placeholder:text-faded/70 focus:border-mask focus:outline-none transition-colors";

  return (
    <div className="page-enter mx-auto max-w-6xl px-5 pb-8 pt-14 sm:px-8">
      <Seo title="Contact" description="Prints, collabs, or film recommendations — get in touch." />

      <div className="grid grid-cols-1 gap-14 md:grid-cols-12">
        <header className="md:col-span-5">
          <h1 className="font-display text-5xl sm:text-6xl">Say hello</h1>
          <p className="mt-4 max-w-sm leading-relaxed text-faded">
            Prints, collaborations, or an argument about the best budget film
            stock — all welcome. Slowest replies while a roll is at the lab.
          </p>
          <div className="mt-8 space-y-3">
            <a
              href="mailto:hello@example.com"
              className="flex items-center gap-3 font-mono text-[0.74rem] uppercase tracking-[0.14em] text-faded transition-colors hover:text-mask"
            >
              <Mail className="size-4 text-mask" /> hello@example.com
            </a>
            <a
              href="https://instagram.com/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 font-mono text-[0.74rem] uppercase tracking-[0.14em] text-faded transition-colors hover:text-mask"
            >
              <Camera className="size-4 text-mask" /> @yun.shoots.film
            </a>
          </div>
        </header>

        <div className="md:col-span-6 md:col-start-7">
          <RebateStrip label="Contact sheet" frame="01A" />
          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <input
              className={inputClass}
              placeholder="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              aria-label="Subject"
            />
            <textarea
              className={inputClass}
              rows={6}
              placeholder="Your message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              aria-label="Message"
              required
            />
            <Button type="submit" variant="accent">
              Send it to the lab
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
