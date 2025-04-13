"use client";

import { Pencil, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import pako from "pako";
import { useLangStore } from "@/store/store";
import TranslateText from "@/components/TranslateText";

// Define our schema using Zod.
const eventSchema = z.object({
  english_title: z.string().min(1, "English title is required"),
  marathi_title: z.string().min(1, "Marathi title is required"),
  image: z.string().min(1, "Image is required"),
});

type EventFormData = z.infer<typeof eventSchema>;

// Helper functions...
function base64ToUint8Array(base64: string): Uint8Array {   
  const cleaned = base64.includes(",") ? base64.split(",")[1] : base64;
  const binaryString = atob(cleaned);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

function uint8ArrayToBase64(bytes: Uint8Array, mimeType = "image/jpeg"): string {
  let binary = "";
  bytes.forEach((byte) => (binary += String.fromCharCode(byte)));
  return `data:${mimeType};base64,` + btoa(binary);
}

function compressImageBase64(base64: string): string {
  const bytes = base64ToUint8Array(base64);
  const compressed = pako.deflate(bytes);
  return uint8ArrayToBase64(compressed, "image/jpeg");
}

const Page = () => {
  const [imageBase64, setImageBase64] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();
  const { lang } = useLangStore();

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
  });

  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer?.files?.[0]) {
      const file = e.dataTransfer.files[0];
      try {
        const base64 = await fileToBase64(file);
        setImageBase64(base64);
        setValue("image", base64);
      } catch (error) {
        console.error("Error converting file:", error);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();
  const handleOpenFileDialog = () => fileInputRef.current?.click();

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      try {
        const base64 = await fileToBase64(file);
        setImageBase64(base64);
        setValue("image", base64);
      } catch (error) {
        console.error("Error converting file:", error);
      }
    }
  };

  const handleRemoveImage = () => {
    setImageBase64("");
    setValue("image", "");
  };

  const onSubmit = async (data: EventFormData) => {
    setIsSaving(true);
    try {
      const compressedImage = compressImageBase64(data.image);
      const payload = {
        english_title: data.english_title,
        marathi_title: data.marathi_title,
        image: compressedImage,
      };

      const response = await fetch("/api/event-page-events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const result = await response.json();
        toast.error(result.error || "Failed to create event");
        setIsSaving(false);
        return;
      }
      router.push("/dashboard/events");
      toast.success("Event created successfully!");
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error("Error creating event");
      setIsSaving(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-5.2rem)] px-10 py-5">
      {/* Header */}
      <div className="mb-10 ml-2 font-sans">
        <h1 className="xl:text-xl font-bold">
          <TranslateText english_text="Create Event" marathi_text="कार्यक्रम तयार करा">
            Create Event
          </TranslateText>
        </h1>
        <span className="text-sm mt-2 text-muted-foreground">
          <TranslateText english_text="Fill in the details to create a new event." marathi_text="नवीन कार्यक्रम तयार करण्यासाठी तपशील भरा.">
            Fill in the details to create a new event.
          </TranslateText>
        </span>
      </div>
      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-w-2xl">
        <div className="flex justify-center items-center h-64 w-full">
          {!imageBase64 ? (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={handleOpenFileDialog}
              className="bg-primary cursor-pointer flex justify-center items-center w-full h-full rounded-lg border border-dashed border-gray-300 hover:bg-primary/90 transition-colors"
            >
              <input
                type="file"
                className="hidden"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileInputChange}
              />
              <ImageIcon className="text-6xl text-gray-200" />
            </div>
          ) : (
            <div className="relative h-64 rounded-md overflow-hidden shadow-lg">
              <div className="absolute inset-0 flex justify-center items-center bg-slate-950 opacity-0 hover:opacity-20 transition-colors duration-200">
                <Button variant="ghost" onClick={handleRemoveImage} className="text-white">
                  <Pencil className="text-2xl" />
                </Button>
              </div>
              <Image
                unoptimized
                className="object-cover w-full h-full"
                width={300}
                height={300}
                src={imageBase64}
                alt="Uploaded Image"
              />
            </div>
          )}
        </div>
        {errors.image && (
          <p className="text-red-500 text-sm mt-5 text-center">{errors.image.message}</p>
        )}
        <div>
          <Label htmlFor="e_title">
            <TranslateText english_text="English Title" marathi_text="इंग्रजी शीर्षक">
              English Title
            </TranslateText>
          </Label>
          <Input
            id="e_title"
            type="text"
            placeholder={lang === "english" ? "English title" : "इंग्रजी शीर्षक"}
            className="mt-3 w-[30rem]"
            {...register("english_title")}
          />
          {errors.english_title && (
            <p className="text-red-500 text-sm">{errors.english_title.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="m_title" className="mt-5">
            <TranslateText english_text="Marathi Title" marathi_text="मराठी शीर्षक">
              Marathi Title
            </TranslateText>
          </Label>
          <Input
            id="m_title"
            type="text"
            placeholder={lang === "english" ? "Marathi title" : "मराठी शीर्षक"}
            className="mt-3 w-[30rem]"
            {...register("marathi_title")}
          />
          {errors.marathi_title && (
            <p className="text-red-500 text-sm">{errors.marathi_title.message}</p>
          )}
        </div>
        <Button type="submit" className="mt-5 px-8 py-2 rounded-full" disabled={isSaving}>
          {isSaving
            ? lang === "english"
              ? "Saving..."
              : "सेव्ह करत आहे..."
            : lang === "english"
            ? "Save"
            : "बदलावे जतन करा"}
        </Button>
      </form>
    </main>
  );
};

export default Page;
