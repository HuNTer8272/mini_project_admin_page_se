"use client";

import { DataTable } from "@/components/tables/committee/data-table";
import { columns, Member } from "./columns";

export function MembersTable({ members }: { members: Member[] }) {
  return (
    <DataTable
      columns={columns}
      data={members}
      href="/dashboard/committee_member/member"
      filterColumn="name"
    />
  );
}