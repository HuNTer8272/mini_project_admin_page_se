"use client";

import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import TranslateText from "@/components/TranslateText";

export type Member = {
  id: number;
  name: string;
  m_name: string;
  position: string;
  m_position: string;
  image_url: string;
};

export const columns: ColumnDef<Member>[] = [
  {
    id: "sr_no",
    header: () => (
      <TranslateText english_text="Sr No" marathi_text="क्रमांक" />
    ),
    cell: ({ row }) => row.index + 1,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "image_url",
    header: () => (
      <TranslateText english_text="Image" marathi_text="प्रतिमा" />
    ),
    cell: ({ row }) => {
      const url = row.getValue("image_url") as string;
      return (
        <Image
          src={url}
          alt="Member Image"
          width={60}
          height={60}
          className="object-cover rounded-full aspect-square border-2"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/placeholder-member.jpg';
          }}
        />
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "name",
    header: () => (
      <TranslateText english_text="Name" marathi_text="नाव" />
    ),
  },
  {
    accessorKey: "m_name",
    header: () => (
      <TranslateText english_text="Marathi Name" marathi_text="मराठी नाव" />
    ),
  },
  {
    accessorKey: "position",
    header: () => (
      <TranslateText english_text="Position" marathi_text="पद" />
    ),
  },
  {
    accessorKey: "m_position",
    header: () => (
      <TranslateText english_text="Marathi Position" marathi_text="मराठी पद" />
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const member = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              <TranslateText english_text="Actions" marathi_text="क्रिया" />
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Link href={`/dashboard/committee_member/member/${member.id}`}>
              <DropdownMenuItem>
                <TranslateText english_text="Edit" marathi_text="संपादित करा" />
              </DropdownMenuItem>
            </Link>
            <DropdownMenuItem >
              {/* <DeleteConfirmDialog
                id={member.id}
                endpoint="/api/home-slider"
              /> */}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
