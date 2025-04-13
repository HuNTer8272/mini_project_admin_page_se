  "use client";

  import React from "react";
  import { useRouter } from "next/navigation";
  import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogCancel,
    AlertDialogAction,
    AlertDialogFooter,
  } from "@/components/ui/alert-dialog";
  import { toast } from "sonner";
  import { Button } from "./ui/button";
  import TranslateText from "./TranslateText";

  interface DeleteConfirmDialogProps {
    id: number;
    endpoint?: string;
  }

  export default function DeleteConfirmDialog({
    id,
    endpoint = "/api/home-slider",
  }: DeleteConfirmDialogProps) {
    const router = useRouter();

    const handleDelete = async () => {
      try {
        const res = await fetch(endpoint, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });
        if (res.ok) {
          toast.success("Event deleted successfully!");
          router.refresh(); // Refresh the page or table after deletion
        } else {
          toast.error("Failed to delete event");
        }
      } catch (error) {
        console.error("Error deleting event:", error);
        toast.error("Error deleting event");
      }
    };

    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="ghost" className="text-red-500">
            <TranslateText english_text="Delete" marathi_text="हटवा">
              Delete
            </TranslateText>
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              <TranslateText
                english_text="Are you absolutely sure?"
                marathi_text="तुम्हाला नक्की खात्री आहे का?">
                Are you absolutely sure?
              </TranslateText>
            </AlertDialogTitle>
            <AlertDialogDescription>
              <span>
                <TranslateText
                  english_text="This action cannot be undone. This will permanently delete your account and remove your data from our servers."
                  marathi_text="ही क्रिया पूर्ववत केली जाऊ शकत नाही. हे तुमचे कायमचे हटवेल खाते आणि तुमचा डेटा आमच्या सर्व्हरवरून काढून टाका.">
                  This action cannot be undone. This will permanently delete your
                  account and remove your data from our servers.
                </TranslateText>
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              <TranslateText english_text="Cancel" marathi_text="रद्द करा">
                Cancel
              </TranslateText>
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              <TranslateText english_text="Continue" marathi_text="चालू ठेवा">
                Continue
              </TranslateText>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }
