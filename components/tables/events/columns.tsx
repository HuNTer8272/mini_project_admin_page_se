"use client";

import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
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

// Define the Event type based on your Prisma schema
export type Event = {
  id: number;
  image_url: string;
  title: string;
  m_title: string;
};

export const columns: ColumnDef<Event>[] = [
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
      if (!url) return null;
      return (
        <Image
          src={url}
          alt="Event Image"
          width={40}
          height={40}
          className="object-cover rounded"
        />
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <TranslateText
          english_text="English Title"
          marathi_text="इंग्रजी शीर्षक"
        />
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "m_title",
    header: () => (
      <TranslateText
        english_text="Marathi Title"
        marathi_text="मराठी शीर्षक"
      />
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const event = row.original;
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
              <TranslateText
                english_text="Actions"
                marathi_text="क्रिया"
              />
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Link href={`/dashboard/home/slider/${event.id}`}>
              <DropdownMenuItem>
                <TranslateText
                  english_text="Edit"
                  marathi_text="संपादित करा"
                />
              </DropdownMenuItem>
            </Link>
            <DropdownMenuItem>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
