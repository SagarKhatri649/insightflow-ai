import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <section className="flex min-h-[calc(100vh-5rem)] items-center justify-center bg-[#f8faf9] px-4 py-12 sm:py-16">
      <div className="flex w-full justify-center">
        <SignUp />
      </div>
    </section>
  );
}
