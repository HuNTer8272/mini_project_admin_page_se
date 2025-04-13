"use client";

import { Pencil, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { useRef, useState, useTransition, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter, useParams } from "next/navigation";
import pako from "pako";
import TranslateText from "@/components/TranslateText";
import { useLangStore } from "@/store/store";

// Define our validation schema using Zod.
const sliderSchema = z.object({
  english_title: z.string().min(1, "English title is required"),
  marathi_title: z.string().min(1, "Marathi title is required"),
  image: z.string().min(1, "Image is required"),
});

type SliderFormData = z.infer<typeof sliderSchema>;

/**
 * Helper: Convert Base64 string to Uint8Array.
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

/**
 * Helper: Convert Uint8Array to Base64 string with a MIME prefix.
 */
function uint8ArrayToBase64(
  bytes: Uint8Array,
  mimeType = "image/jpeg"
): string {
  let binary = "";
  bytes.forEach((byte) => (binary += String.fromCharCode(byte)));
  return `data:${mimeType};base64,` + btoa(binary);
}

/**
 * Compress a Base64 image string.
 */
function compressImageBase64(base64: string): string {
  const bytes = base64ToUint8Array(base64);
  const compressed = pako.deflate(bytes);
  return uint8ArrayToBase64(compressed, "image/jpeg");
}

const EditSliderPage = () => {
  const [imageBase64, setImageBase64] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { id } = useParams(); // Extract slider id from route parameters

  const {lang} = useLangStore();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<SliderFormData>({
    resolver: zodResolver(sliderSchema),
  });

  // Fetch the slider data by id on mount and reset the form with default values.
  useEffect(() => {
    const fetchSlider = async () => {
      try {
        const res = await fetch(`/api/event-page-events?id=${id}`);
        if (!res.ok) throw new Error("Failed to fetch events");
        const data = await res.json();
        // Map API fields to our form fields.
        reset({
          english_title: data.title,
          marathi_title: data.m_title,
          image: data.image_url, // image is stored compressed on the server
        });
        setImageBase64(data.image_url);
      } catch (error) {
        console.error("Error fetching slider:", error);
        toast.error("Error fetching slider");
      }
    };
    if (id) fetchSlider();
  }, [id, reset]);

  // Convert file to Base64 URL.
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

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleOpenFileDialog = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
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

  const onSubmit = async (data: SliderFormData) => {
    startTransition(async () => {
      try {
        // Compress the image (if updated) before sending.
        const compressedImage = compressImageBase64(data.image);
        const payload = {
          id: Number(id),
          english_title: data.english_title,
          marathi_title: data.marathi_title,
          image: compressedImage,
        };

        const response = await fetch("/api/event-page-events", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!response.ok) {
          const result = await response.json();
          toast.error(result.error || "Failed to update slider");
          return;
        }
        router.push("/dashboard/about"); // Redirect to slider list page.
        toast.success("Slider updated successfully!");
      } catch (error) {
        console.error("Error updating slider:", error);
        toast.error("Error updating slider");
      }
    });
  };

  return (
    <main className="min-h-[calc(100vh-5.2rem)] px-10 py-5">
      {/* Header */}
      <div className="mb-10 ml-2 font-sans">
        <h1 className="xl:text-xl font-bold">
          <TranslateText english_text="Edit Events" marathi_text="इव्हेंट संपादित करा"> Edit Events</TranslateText>
        </h1>
=        <TranslateText className="text-sm mt-2 text-muted-foreground" english_text="Update the slider details." marathi_text="इव्हेंट तपशील अद्यतनित करा.">Update the event details.</TranslateText>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-w-2xl">
        <div className="flex justify-center items-center h-64 w-full">
          {!imageBase64 ? (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={handleOpenFileDialog}
              className="bg-primary cursor-pointer flex justify-center items-center w-full h-full rounded-lg border border-dashed border-gray-300 hover:bg-primary/90 transition-colors">
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
            <div className="relative  h-64 rounded-md overflow-hidden shadow-lg">
              <div className="absolute inset-0 flex justify-center items-center bg-slate-950 opacity-0    hover:opacity-40 transition-colors duration-200">
                <Button
                  variant="ghost"
                  onClick={handleRemoveImage}
                  className="text-white">
                  <Pencil className="text-2xl" />
                </Button>
              </div>
              <Image
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
          <p className="text-red-500 text-sm mt-2 text-center">
            {errors.image.message}
          </p>
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
            placeholder={lang === "english"? "English title" : "इंग्रजी शीर्षक"}
            className="mt-3 w-[30rem]"
            {...register("english_title")}
          />
          {errors.english_title && (
            <p className="text-red-500 text-sm">
              {errors.english_title.message}
            </p>
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
            placeholder={lang === "english"?"Marathi title": "मराठी शीर्षक"}
            className="mt-3 w-[30rem]"
            {...register("marathi_title")}
          />
          {errors.marathi_title && (
            <p className="text-red-500 text-sm">
              {errors.marathi_title.message}
            </p>
          )}
        </div>
        <Button
          type="submit"
          className="mt-5 px-8 py-2 rounded-full"
          disabled={isPending}>
          {isPending ? lang === "english"? "Saving..." : "सेव्ह करत आहे..." : lang === "english"? "Save" : "बदलावे जतन करा"}  
        </Button>
      </form>
    </main>
  );
};

export default EditSliderPage;
