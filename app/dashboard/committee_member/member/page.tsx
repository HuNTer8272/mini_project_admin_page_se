"use client";

import { useEffect, useRef, useState } from "react";
import { Pencil, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
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

// Define our schema using Zod for member_details
const memberSchema = z.object({
  name: z.string().min(1, "English name is required"),
  m_name: z.string().min(1, "Marathi name is required"),
  position: z.string().min(1, "Position is required"),
  m_position: z.string().min(1, "Marathi position is required"),
  image: z.string().min(1, "Image is required"),
});

type MemberFormData = z.infer<typeof memberSchema>;

/**
 * Helper functions to convert between Base64 and Uint8Array.
 */
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

/**
 * Compress the Base64 image string.
 */
function compressImageBase64(base64: string): string {
  const bytes = base64ToUint8Array(base64);
  const compressed = pako.deflate(bytes);
  return uint8ArrayToBase64(compressed, "image/jpeg");
}

const Page = () => {
  // All hooks are called unconditionally.
  const [mounted, setMounted] = useState(false);
  const [imageBase64, setImageBase64] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();
  const { lang } = useLangStore();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<MemberFormData>({
    resolver: zodResolver(memberSchema),
  });

  // Set mounted flag in useEffect.
  useEffect(() => {
    setMounted(true);
  }, []);

  // Until mounted, return a fallback placeholder.
  if (!mounted) return <div style={{ visibility: "hidden" }} />;

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

  const onSubmit = async (data: MemberFormData) => {
    setIsSaving(true);
    try {
      const compressedImage = compressImageBase64(data.image);
      const payload = {
        name: data.name,
        m_name: data.m_name,
        position: data.position,
        m_position: data.m_position,
        image: compressedImage,
      };

      const response = await fetch("/api/committee", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const result = await response.json();
        toast.error(result.error || "Failed to create member");
        setIsSaving(false);
        return;
      }
      toast.success("Member created successfully!");
      router.push("/dashboard/committee_member");
    } catch (error) {
      console.error("Error creating member:", error);
      toast.error("Error creating member");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-5.2rem)] px-10 py-5">
      {/* Header */}
      <div className="mb-10 ml-2 font-sans">
        <h1 className="xl:text-xl font-bold">
          <TranslateText english_text="Create Member" marathi_text="सदस्य तयार करा">
            Create Member
          </TranslateText>
        </h1>
        <TranslateText
          className="text-sm mt-2 text-muted-foreground"
          english_text="Fill in the details to create a new member."
          marathi_text="नवीन सदस्य तयार करण्यासाठी तपशील भरा."
        >
          Fill in the details to create a new member.
        </TranslateText>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-w-2xl">
        {/* Image Section */}
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

        {/* English Name */}
        <div>
          <Label htmlFor="name">
            <TranslateText english_text="English Name" marathi_text="इंग्रजी नाव">
              English Name
            </TranslateText>
          </Label>
          <Input
            id="name"
            type="text"
            placeholder={lang === "english" ? "English name" : "इंग्रजी नाव"}
            className="mt-3 w-[30rem]"
            {...register("name")}
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </div>

        {/* Marathi Name */}
        <div>
          <Label htmlFor="m_name" className="mt-5">
            <TranslateText english_text="Marathi Name" marathi_text="मराठी नाव">
              Marathi Name
            </TranslateText>
          </Label>
          <Input
            id="m_name"
            type="text"
            placeholder={lang === "english" ? "Marathi name" : "मराठी नाव"}
            className="mt-3 w-[30rem]"
            {...register("m_name")}
          />
          {errors.m_name && <p className="text-red-500 text-sm">{errors.m_name.message}</p>}
        </div>

        {/* Position */}
        <div>
          <Label htmlFor="position" className="mt-5">
            <TranslateText english_text="Position" marathi_text="पद">
              Position
            </TranslateText>
          </Label>
          <Input
            id="position"
            type="text"
            placeholder={lang === "english" ? "Position" : "पद"}
            className="mt-3 w-[30rem]"
            {...register("position")}
          />
          {errors.position && <p className="text-red-500 text-sm">{errors.position.message}</p>}
        </div>

        {/* Marathi Position */}
        <div>
          <Label htmlFor="m_position" className="mt-5">
            <TranslateText english_text="Marathi Position" marathi_text="मराठी पद">
              Marathi Position
            </TranslateText>
          </Label>
          <Input
            id="m_position"
            type="text"
            placeholder={lang === "english" ? "Marathi position" : "मराठी पद"}
            className="mt-3 w-[30rem]"
            {...register("m_position")}
          />
          {errors.m_position && <p className="text-red-500 text-sm">{errors.m_position.message}</p>}
        </div>

        {/* Submit Button */}
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
