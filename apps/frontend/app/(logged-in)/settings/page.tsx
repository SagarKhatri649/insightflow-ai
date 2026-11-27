import { currentUser } from "@clerk/nextjs/server";
import { CalendarDays, Mail, UserRound } from "lucide-react";
import { redirect } from "next/navigation";
import ManageAccountButton from "@/components/settings/manage-account-button";

function formatAccountCreatedAt(createdAt: number | null) {
  if (!createdAt) return null;

  const accountCreatedAt = new Date(createdAt);

  if (Number.isNaN(accountCreatedAt.getTime())) return null;

  return accountCreatedAt.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function SettingsPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const fullName =
    user.fullName?.trim() ||
    [user.firstName, user.lastName].filter(Boolean).join(" ").trim() ||
    null;
  const primaryEmail = user.primaryEmailAddress?.emailAddress?.trim() || null;
  const accountCreatedAt = formatAccountCreatedAt(user.createdAt);

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:py-10">
      <header className="max-w-2xl">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-[#111111] sm:text-3xl">
          Settings
        </h1>
        <p className="mt-2 text-sm leading-6 text-[#5f6368] sm:text-base">
          Manage your account details and sign-in settings.
        </p>
      </header>

      <section
        aria-labelledby="profile-settings-heading"
        className="mt-6 overflow-hidden rounded-xl border border-[#dee1e6] bg-white shadow-sm sm:mt-8"
      >
        <div className="flex flex-col gap-4 border-b border-[#dee1e6] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#F4F4F5] text-[#111111]">
              <UserRound aria-hidden="true" className="h-5 w-5" />
            </span>
            <div>
              <h2
                id="profile-settings-heading"
                className="font-heading text-base font-bold text-[#111111] sm:text-lg"
              >
                Profile
              </h2>
              <p className="mt-0.5 text-xs leading-5 text-[#5f6368] sm:text-sm">
                Update your name, email, password, and connected accounts.
              </p>
            </div>
          </div>
          <ManageAccountButton />
        </div>

        <dl className="divide-y divide-[#dee1e6] px-5 sm:px-6">
          <div className="grid gap-1 py-4 sm:grid-cols-[minmax(0,12rem)_minmax(0,1fr)] sm:items-center sm:gap-6 sm:py-5">
            <dt className="flex items-center gap-2 text-xs font-semibold text-[#5f6368] sm:text-sm">
              <UserRound aria-hidden="true" className="h-4 w-4 shrink-0" />
              Full name
            </dt>
            <dd
              className={`break-words text-sm font-semibold ${
                fullName ? "text-[#202124]" : "text-[#979797]"
              }`}
            >
              {fullName ?? "Not provided"}
            </dd>
          </div>

          <div className="grid gap-1 py-4 sm:grid-cols-[minmax(0,12rem)_minmax(0,1fr)] sm:items-center sm:gap-6 sm:py-5">
            <dt className="flex items-center gap-2 text-xs font-semibold text-[#5f6368] sm:text-sm">
              <Mail aria-hidden="true" className="h-4 w-4 shrink-0" />
              Primary email
            </dt>
            <dd
              className={`break-words text-sm font-semibold ${
                primaryEmail ? "text-[#202124]" : "text-[#979797]"
              }`}
            >
              {primaryEmail ?? "Not provided"}
            </dd>
          </div>

          <div className="grid gap-1 py-4 sm:grid-cols-[minmax(0,12rem)_minmax(0,1fr)] sm:items-center sm:gap-6 sm:py-5">
            <dt className="flex items-center gap-2 text-xs font-semibold text-[#5f6368] sm:text-sm">
              <CalendarDays aria-hidden="true" className="h-4 w-4 shrink-0" />
              Member since
            </dt>
            <dd
              className={`text-sm font-semibold ${
                accountCreatedAt ? "text-[#202124]" : "text-[#979797]"
              }`}
            >
              {accountCreatedAt ?? "Not available"}
            </dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
