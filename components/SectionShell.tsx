import PublicNav from './PublicNav';

export default function SectionShell({ eyebrow, title, description, children }: { eyebrow: string; title: string; description: string; children: React.ReactNode }) {
  return (
    <main className="container-page py-6 sm:py-10">
      <PublicNav />
      <section className="mb-8 text-center sm:mb-12">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-rosegold">{eyebrow}</p>
        <h1 className="mt-3 section-title">{title}</h1>
        <p className="mx-auto mt-4 max-w-2xl leading-8 text-cocoa/70">{description}</p>
      </section>
      {children}
    </main>
  );
}
