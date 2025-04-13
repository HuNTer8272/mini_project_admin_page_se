"use client";

import { useEffect, useState } from "react";
import { MembersTable } from "@/components/tables/committee/members-table";
import TranslateText from "@/components/TranslateText";
import { Member } from "@/components/tables/committee/columns";

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch("/api/committee");
        if (!response.ok) throw new Error("Failed to fetch members");
        const data = await response.json();
        setMembers(data);
      } catch (error) {
        console.error("Error fetching members:", error);
      }
    };

    fetchMembers();
  }, []);

  return (
    <main className="p-5">
      <section id="members">
        <h2 className="font-semibold ml-7 my-5 text-xl">
          <TranslateText
            english_text="Committee Members"
            marathi_text="समिती सदस्य"
          />
        </h2>
        <MembersTable members={members} />
      </section>
    </main>
  );
}