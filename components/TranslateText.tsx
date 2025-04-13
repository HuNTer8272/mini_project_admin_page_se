"use client";

import { useEffect, useState, useTransition } from "react";
import { Skeleton } from "./ui/skeleton";
import { useLangStore } from "@/store/store";

interface TranslateTextProps {
  english_text: string;
  marathi_text: string;
  hindi_text?: string;
  isTitle?: boolean;
  children?: React.ReactNode;
  className?: string;
}

const TranslateText = ({
  children,
  english_text,
  marathi_text,
  hindi_text,
  className
}: TranslateTextProps) => {
  const [translatedText, setTranslatedText] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { lang } = useLangStore();

  useEffect(() => {
    startTransition(() => {
      const storedLang = localStorage.getItem("langStore");
      let lang = "english"; 

      if (storedLang) {
        try {
          lang = JSON.parse(storedLang).lang; // Extract language value safely
        } catch (error) {
          console.error("Invalid langStore format:", error);
        }
      }

      switch (lang) {
        case "marathi":
          setTranslatedText(marathi_text);
          break;
        case "hindi":
          setTranslatedText(hindi_text?hindi_text:"");
          break;
        case "english":
          setTranslatedText(english_text);
          break;
        default:
          setTranslatedText(null); 
      }
    });
  }, [marathi_text, hindi_text,english_text,lang]);

if (isPending) return <span><Skeleton as="span" /></span> ;

  return <span className={`${className}`}>{translatedText ?? children}</span>;
};

export default TranslateText;
