"use client";

import { IconCirclePlusFilled } from "@tabler/icons-react";
import { motion } from "framer-motion";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"; // ShadCN dropdown
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@radix-ui/react-collapsible";
import { Calendar, ChevronRight, House, UserRound } from "lucide-react";
import { useState } from "react";
import TranslateText from "../TranslateText";
import ScrollToAnotherPage from "../ScrollToAnotherPage";
import Link from "next/link";

export function NavMain() {
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col mt-8 gap-2">
        <SidebarMenu>
          <QuickCreate />
        </SidebarMenu>
        <SidebarMenu>
          <CollapsibleMenu 
            title={{ english_text: "Home Page", marathi_text: "मुख्यपृष्ठ", hindi_text: "मुखपृष्ठ" }}
            Icon={House} 
            items={[
              { english_text: "Slider", marathi_text: "स्लायडर", hindi_text: "स्लाइडर", href: "/dashboard", elementId: "slider" }, 
              { english_text: "Events", marathi_text: "कार्यक्रम", hindi_text: "कार्यक्रम", href: "/dashboard", elementId: "events" }, 
              { english_text: "Upcoming Events", marathi_text: "आगामी कार्यक्रम", hindi_text: "आगामी कार्यक्रम", href: "/dashboard", elementId: "upcoming-events" }, 
              // { english_text: "Content", marathi_text: "सामग्री", hindi_text: "सामग्री", href: "/dashboard", elementId: "content" },
            ]}
          />
          <CollapsibleMenu 
            title={{ english_text: "About Us Page", marathi_text: "आमच्याबद्दल पृष्ठ", hindi_text: "हमारे बारे में पृष्ठ" }}
            Icon={UserRound} 
            items={[
              { english_text: "Events", marathi_text: "कार्यक्रम", hindi_text: "कार्यक्रम", href: "/dashboard/about", elementId: "events" },
              { english_text: "Slider", marathi_text: "स्लायडर", hindi_text: "स्लाइडर", href: "/dashboard/about", elementId: "slider" },
              // { english_text: "Content", marathi_text: "सामग्री", hindi_text: "सामग्री", href: "/dashboard/about", elementId: "content" },
            ]}
          />
          <CollapsibleMenu 
            title={{ english_text: "Events Page", marathi_text: "कार्यक्रम पृष्ठ", hindi_text: "कार्यक्रम पृष्ठ" }}
            Icon={Calendar} 
            items={[
              { english_text: "Events", marathi_text: "कार्यक्रम", hindi_text: "कार्यक्रम", href: "/dashboard/events", }
            ]} 
          />
          <SidebarMenuItem>
            <Link href="/dashboard/committee_member">
            <SidebarMenuButton tooltip="Committee Members">
              <TranslateText
                english_text="Committee Members"
                marathi_text="समितीचे सदस्य"
                hindi_text="समिति के सदस्य"
                isTitle
                >
                Committee Members
              </TranslateText>
            </SidebarMenuButton>
          </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
const QuickCreate = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton tooltip="Quick Create" className="bg-primary mb-6 text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear flex items-center gap-2">
          <IconCirclePlusFilled className="w-5 h-5" />
          <TranslateText
            english_text="Quick Create"
            marathi_text="जलद तयार करा"
            hindi_text="तेजी से बनाएं"
            isTitle
          >
            Quick Create
          </TranslateText>
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 border rounded-md shadow-md">
        <DropdownMenuLabel>
          <TranslateText english_text="Home Page" marathi_text="मुख्यपृष्ठ" hindi_text="मुखपृष्ठ" />
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href="dashboard/home/slider">
          <DropdownMenuItem>
            <TranslateText english_text="Slider" marathi_text="स्लायडर" hindi_text="स्लाइडर" />
          </DropdownMenuItem>
          </Link>
          <Link href="dashboard/home/events">
          <DropdownMenuItem>
            <TranslateText english_text="Events" marathi_text="कार्यक्रम" hindi_text="कार्यक्रम" />
          </DropdownMenuItem>
          </Link>
          <Link href="dashboard/home/upcoming-events">
          <DropdownMenuItem>
            <TranslateText english_text="Upcoming Events" marathi_text="आगामी कार्यक्रम" hindi_text="आगामी कार्यक्रम" />
          </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>
          <TranslateText english_text="About Us Page" marathi_text="आमच्याबद्दल" hindi_text="हमारे बारे में" />
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
        <Link href="/dashboard/about/slider">
          <DropdownMenuItem>
            <TranslateText english_text="Slider" marathi_text="स्लायडर" hindi_text="स्लायडर" />
          </DropdownMenuItem>
          </Link>
          <Link href="/dashboard/about/events">
          <DropdownMenuItem>
            <TranslateText english_text="Events" marathi_text="कार्यक्रम" hindi_text="कार्यक्रम" />
          </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>
          <TranslateText english_text="Events Page" marathi_text="कार्यक्रम पृष्ठ" hindi_text="कार्यक्रम पृष्ठ" />
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link href="/dashboard/events/event">
        <DropdownMenuItem>
          <TranslateText english_text="Event" marathi_text="कार्यक्रम" hindi_text="कार्यक्रम" />
        </DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <Link href="/dashboard/committee_member/member">
        <DropdownMenuItem className="mt-2">
          <TranslateText english_text="Committee Members" marathi_text="समितीचे सदस्य" hindi_text="समिति के सदस्य" />
        </DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

type ContentType = {
  english_text: string;
  marathi_text: string;
  hindi_text: string;
  href?: string;
  elementId?: string;
};

const CollapsibleMenu = ({ title, items, Icon }: { title: ContentType; items: ContentType[]; Icon: React.ElementType }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="group mb-1">
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton className="flex justify-between items-center w-full">
            <span className="flex items-center gap-2">
            <Icon className="size-[18px]" />
              <TranslateText {...title} isTitle>
                {title.english_text}
              </TranslateText>
            </span>
            <motion.span animate={{ rotate: isOpen ? 90 : 0 }} transition={{ duration: 0.2 }} className="ml-2">
              <ChevronRight className="w-4 h-4 text-gray-500 transition-all" />
            </motion.span>
          </SidebarMenuButton>
        </CollapsibleTrigger>
      </SidebarMenuItem>
      <CollapsibleContent className="pl-6 space-y-1">
        {items.map((item, index) => (
          <SidebarMenuItem key={index}>
            <ScrollToAnotherPage href={item.href || "#"} elementId={item.elementId || ""}>
              <SidebarMenuButton className="text-sm text-secondary-foreground/90 dark:text-primary-foreground/90 space-y-2 transition">
                <TranslateText {...item}>
                  {item.english_text}
                </TranslateText>
              </SidebarMenuButton>
            </ScrollToAnotherPage>
          </SidebarMenuItem>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
};
