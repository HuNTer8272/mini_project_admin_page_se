"use client"
import { Languages } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { useLangStore } from "@/store/store";

const LanguageMode = () => {
    const {setLang} = useLangStore();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Languages />
        </Button>
      </DropdownMenuTrigger>       
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setLang("english")}>
            English
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLang("marathi")}>
            Marathi
        </DropdownMenuItem>
        {/* <DropdownMenuItem onClick={() => setLang("hindi")}>
            Hindi
        </DropdownMenuItem> */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageMode;
