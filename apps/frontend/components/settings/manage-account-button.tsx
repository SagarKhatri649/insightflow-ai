"use client";

import { useClerk } from "@clerk/nextjs";
import { Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ManageAccountButton() {
  const { openUserProfile } = useClerk();

  return (
    <Button
      type="button"
      onClick={() => openUserProfile()}
      aria-haspopup="dialog"
      className="h-10 w-full rounded-lg bg-[#111111] px-4 font-heading text-sm font-semibold text-white shadow-sm hover:bg-[#27272A] focus-visible:ring-2 focus-visible:ring-[#111111] focus-visible:ring-offset-2 sm:w-auto"
    >
      <Settings2 aria-hidden="true" className="h-4 w-4" />
      Manage account
    </Button>
  );
}
