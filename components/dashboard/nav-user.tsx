"use client";

import { useState, useEffect } from "react";
import { IconDotsVertical, IconLogout } from "@tabler/icons-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useUserStore } from "@/store/store";
import TranslateText from "../TranslateText";
import { useRouter } from "next/navigation";

export function NavUser() {
  const { isMobile } = useSidebar();
  const { name, email } = useUserStore();
  const router = useRouter();

  // Prevent hydration mismatch by waiting until mounted
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleLogout = () => {
    // Clear the "loggedIn" cookie
    document.cookie =
      "loggedIn=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    // Redirect to the login page (or home)
    router.push("/");
  };

  if (!isMounted) {
    return null; // Prevent rendering until mounted
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size="lg">
              <Avatar className="h-8 w-8 rounded-full grayscale">
                <AvatarImage
                  src={"    "}
                  alt={name ? name : "avatar"}
                />
                <AvatarFallback className="rounded-lg">
                  {name ? name[0] : "CN"}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{name}</span>
                <span className="text-muted-foreground truncate text-xs">
                  {email}
                </span>
              </div>
              <IconDotsVertical className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="min-w-[8rem] rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuItem onClick={handleLogout}>
              <IconLogout className="mr-2" />
              <TranslateText
                english_text="Log out"
                marathi_text="लॉगआउट"
                hindi_text="लॉग आउट"
              >
                Log out
              </TranslateText>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
