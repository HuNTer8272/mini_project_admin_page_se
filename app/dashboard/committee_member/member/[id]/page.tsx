"use client";

import { Pencil, Image as ImageIcon, Trash } from "lucide-react";
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
import { useLangStore } from "@/store/store";
import TranslateText from "@/components/TranslateText";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogPortal,
  AlertDialogOverlay,
} from "@radix-ui/react-alert-dialog";

const memberSchema = z.object({
  name: z.string().min(1, "English name is required"),
  m_name: z.string().min(1, "Marathi name is required"),
  position: z.string().min(1, "Position is required"),
  m_position: z.string().min(1, "Marathi position is required"),
  image: z.string().min(1, "Image is required"),
});

type MemberFormData = z.infer<typeof memberSchema>;

// Helper functions remain the same
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

const DeleteConfirmButton = ({ id }: { id: number }) => {
  const router = useRouter();
  const { lang } = useLangStore();

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/committee?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success(lang === "english" 
          ? "Member deleted successfully!" 
          : "सदस्य यशस्वीरित्या हटवला!");
        router.push("/dashboard/committee_member");
      } else {
        const error = await res.json();
        router.push("/dashboard/committee_member")
        toast.error(error?.message || "Delete failed");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(lang === "english" 
        ? "Error deleting member" 
        : "सदस्य हटवताना त्रुटी");
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="h-10 px-8 rounded-full">
          <Trash className="mr-2 h-4 w-4" />
          {lang === "english" ? "Delete" : "हटवा"}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogPortal>
        <AlertDialogOverlay className="fixed inset-0 " />
        <AlertDialogContent className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-xl focus:outline-none z-50 max-w-md w-full">
          <AlertDialogTitle className="text-lg font-bold mb-4">
            {lang === "english" 
              ? "Are you absolutely sure?" 
              : "तुम्हाला खात्री आहे?"}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-gray-600 mb-6">
            {lang === "english"
              ? "This action cannot be undone. This will permanently delete the committee member."
              : "ही क्रिया पूर्ववत केली जाऊ शकत नाही. हे समिती सदस्य कायमस्वरूपी हटवेल."}
          </AlertDialogDescription>
          <div className="flex justify-end gap-4">
            <AlertDialogCancel asChild>
              <Button variant="outline">
                {lang === "english" ? "Cancel" : "रद्द करा"}
              </Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button variant="destructive" onClick={handleDelete}>
                {lang === "english" ? "Confirm" : "पुष्टी करा"}
              </Button>
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialogPortal>
    </AlertDialog>
  );
};

const EditMemberPage = () => {
  const [imageBase64, setImageBase64] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { id } = useParams();
  const { lang } = useLangStore();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<MemberFormData>({
    resolver: zodResolver(memberSchema),
  });

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const res = await fetch(`/api/committee?id=${id}`);
        if (!res.ok) throw new Error("Failed to fetch member");
        const data = await res.json();
        reset({
          name: data.name,
          m_name: data.m_name,
          position: data.position,
          m_position: data.m_position,
          image: data.image_url,
        });
        setImageBase64(data.image_url);
      } catch (error) {
        console.error("Error fetching member:", error);
        toast.error("Error fetching member");
      }
    };
    if (id) fetchMember();
  }, [id, reset]);

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
    if (e.target.files?.[0]) {
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
    startTransition(async () => {
      try {
        const compressedImage = compressImageBase64(data.image);
        const payload = {
          id: Number(id),
          ...data,
          image: compressedImage,
        };

        const response = await fetch("/api/committee", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const result = await response.json();
          toast.error(result.error || "Failed to update member");
          return;
        }

        toast.success("Member updated successfully!");
        router.push("/dashboard/committee_member");
      } catch (error) {
        console.error("Error updating member:", error);
        toast.error("Error updating member");
      }
    });
  };

  return (
    <main className="min-h-[calc(100vh-5.2rem)] px-10 py-5">
      <div className="mb-10 ml-2 font-sans">
        <h1 className="xl:text-xl font-bold">
          <TranslateText 
            english_text="Edit Member" 
            marathi_text="सदस्य संपादित करा" 
          />
        </h1>
        <TranslateText 
          className="text-sm mt-2 text-muted-foreground" 
          english_text="Update the member details." 
          marathi_text="सदस्य तपशील अद्यतनित करा." 
        />
      </div>

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
          <p className="text-red-500 text-sm text-center">{errors.image.message}</p>
        )}

        <div>
          <Label htmlFor="name">
            <TranslateText english_text="Name" marathi_text="नाव" />
          </Label>
          <Input
            id="name"
            {...register("name")}
            placeholder={lang === "english" ? "Name" : "नाव"}
            className="mt-3 w-full"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </div>

        <div>
          <Label htmlFor="m_name">
            <TranslateText english_text="Marathi Name" marathi_text="मराठी नाव" />
          </Label>
          <Input
            id="m_name"
            {...register("m_name")}
            placeholder={lang === "english" ? "Marathi Name" : "मराठी नाव"}
            className="mt-3 w-full"
          />
          {errors.m_name && <p className="text-red-500 text-sm">{errors.m_name.message}</p>}
        </div>

        <div>
          <Label htmlFor="position">
            <TranslateText english_text="Position" marathi_text="पद" />
          </Label>
          <Input
            id="position"
            {...register("position")}
            placeholder={lang === "english" ? "Position" : "पद"}
            className="mt-3 w-full"
          />
          {errors.position && <p className="text-red-500 text-sm">{errors.position.message}</p>}
        </div>

        <div>
          <Label htmlFor="m_position">
            <TranslateText english_text="Marathi Position" marathi_text="मराठी पद" />
          </Label>
          <Input
            id="m_position"
            {...register("m_position")}
            placeholder={lang === "english" ? "Marathi Position" : "मराठी पद"}
            className="mt-3 w-full"
          />
          {errors.m_position && <p className="text-red-500 text-sm">{errors.m_position.message}</p>}
        </div>

        <div className="mt-10 flex items-center gap-4">
          <Button 
            type="submit" 
            className="px-8 py-2 rounded-full h-10" 
            disabled={isPending}
          >
            {isPending
              ? lang === "english" ? "Saving..." : "सेव्ह करत आहे..."
              : lang === "english" ? "Save" : "बदलावे जतन करा"}
          </Button>
          {id && <DeleteConfirmButton id={Number(id)} />}
        </div>
      </form>
    </main>
  );
};

export default EditMemberPage;