import type { ReactNode } from 'react';

type LegalPageLayoutProps = {
  eyebrow: string;
  title: string;
  description: string;
  updated: string;
  children: ReactNode;
};

export default function LegalPageLayout({
  eyebrow,
  title,
  description,
  updated,
  children,
}: LegalPageLayoutProps) {
  return (
    <main className="bg-white px-6 py-14 text-[#3c4043] sm:py-20 lg:py-24">
      <div className="mx-auto max-w-4xl">
        <header className="border-b border-[#dee1e6] pb-10 sm:pb-12">
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-[#064e3b]">
            {eyebrow}
          </p>
          <h1 className="mb-6 text-4xl font-bold leading-[1.08] tracking-[-0.03em] text-[#064e3b] sm:text-5xl lg:text-[56px]">
            {title}
          </h1>
          <p className="max-w-2xl text-base leading-7 text-[#5f6368] sm:text-lg sm:leading-8">
            {description}
          </p>
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.12em] text-[#979797]">
            Last updated · {updated}
          </p>
        </header>
        <div className="mt-10 max-w-3xl text-[15px] leading-7 text-[#3c4043] sm:mt-12 sm:text-base sm:leading-8 [&_a]:font-semibold [&_a]:text-[#064e3b] [&_a]:underline [&_a]:underline-offset-4 [&_h2]:mb-3 [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:leading-7 [&_h2]:tracking-[-0.01em] [&_h2]:text-[#064e3b] [&_h2:first-child]:mt-0 [&_li]:pl-2 [&_li]:leading-7 [&_li]:marker:text-[#10b981] [&_ol]:my-5 [&_ol]:space-y-2 [&_p]:my-5 [&_p:first-child]:mt-0 [&_ul]:my-5 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6">
          {children}
        </div>
      </div>
    </main>
  );
}
