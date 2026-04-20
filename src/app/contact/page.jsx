import ContactForm from "./ContactForm";

export const metadata = {
  title: "Contact",
  description:
    "Get in touch with Ayodeji Alalade — Full Stack Developer. Available for freelance projects, collaborations, and full-time opportunities.",
  openGraph: {
    title: "Contact — JaladeDev",
    description: "Get in touch for freelance or full-time opportunities.",
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-ink-900 pt-32 pb-20 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left: info */}
          <div>
            <p className="font-mono text-electric-400 text-sm tracking-widest uppercase mb-4">
              Get in touch
            </p>
            <h1 className="font-display text-5xl sm:text-6xl text-cream-100 mb-6 leading-none">
              Let's work<br />together.
            </h1>
            <p className="text-cream-200/60 text-lg leading-relaxed mb-10">
              I'm open to freelance projects, contract work, and full-time opportunities.
              Have a project in mind? Let's talk about it.
            </p>

            <div className="space-y-5">
              <div className="border border-ink-600 rounded-xl p-5">
                <p className="font-mono text-xs text-cream-200/40 uppercase tracking-widest mb-1">Email</p>
                <a
                  href="mailto:lajadelabs@gmail.com"
                  className="text-cream-100 hover:text-electric-400 transition-colors font-semibold"
                >
                  lajadelabs@gmail.com
                </a>
              </div>
              <div className="border border-ink-600 rounded-xl p-5">
                <p className="font-mono text-xs text-cream-200/40 uppercase tracking-widest mb-1">GitHub</p>
                <a
                  href="https://github.com/jaladedev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cream-100 hover:text-electric-400 transition-colors font-semibold"
                >
                  github.com/JaladeAlan
                </a>
              </div>
              <div className="border border-ink-600 rounded-xl p-5">
                <p className="font-mono text-xs text-cream-200/40 uppercase tracking-widest mb-1">LinkedIn</p>
                <a
                  href="https://linkedin.com/in/ayodejialalade"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cream-100 hover:text-electric-400 transition-colors font-semibold"
                >
                  linkedin.com/in/ayodejialalade
                </a>
              </div>
            </div>
          </div>

          {/* Right: form */}
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
