import PublicNav from './PublicNav';
import PreviewBanner from './PreviewBanner';

export default function SectionShell({
  eyebrow,
  title,
  description,
  preview = false,
  children
}: {
  eyebrow: string;
  title: string;
  description: string;
  preview?: boolean;
  children: React.ReactNode;
}) {
  return (
    <main className="container-page min-h-dvh py-6 sm:py-10">
      <PublicNav preview={preview} />
      {preview && <PreviewBanner />}
      <section className="mb-8 text-center sm:mb-12">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-3 section-title">{title}</h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-muted">{description}</p>
      </section>
      {children}
    </main>
  );
}
