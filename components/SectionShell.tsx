import PublicNav from './PublicNav';

export default function SectionShell({ eyebrow, title, description, children }: { eyebrow: string; title: string; description: string; children: React.ReactNode }) {
  return (
    <main className="container-page min-h-dvh py-6 sm:py-10">
      <PublicNav />
      <section className="mb-8 text-center sm:mb-12">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-3 section-title">{title}</h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-muted">{description}</p>
      </section>
      {children}
    </main>
  );
}
