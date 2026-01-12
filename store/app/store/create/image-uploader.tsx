import { Button } from "@/components/ui/button";
import {
  cn,
  deleteFile,
  getFilePath,
  getPublicUrl,
  uploadFile,
} from "@/lib/utils";
import { ImagePlus, Loader2, Trash2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface ImageUploaderProps {
  onFileChange: (url: string) => void;
  value: string;
}

export default function ImageUploader({
  onFileChange,
  value,
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selected, setSelected] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");

  const onDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    setSelected(file);
  };

  const deleteFileFromStorage = async () => {
    if (!value) return;
    if (deleting) return;

    try {
      setDeleting(true);

      const path = getFilePath(value);

      const res = await deleteFile(path);
      onFileChange("");
    } catch (error) {
      console.log(error);
      return toast.error("Failed to delete image!");
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    if (!selected) return;

    const uploadFileToStorage = async () => {
      try {
        setUploading(true);

        const res = await uploadFile(selected);
        if (!res) return;
        onFileChange(res.public_url);
      } catch (error) {
        console.log(error);
        return toast.error("Failed to upload image!");
      } finally {
        setUploading(false);
      }
    };

    uploadFileToStorage();
  }, [selected]);

  useEffect(() => {
    setImageUrl(value);
  }, [value]);

  if (imageUrl) {
    return (
      <div className="w-full lg:w-xs aspect-video">
        <Button
          type="button"
          onClick={deleteFileFromStorage}
          variant={"destructive"}
          className="block ml-auto cursor-pointer"
        >
          {deleting ? (
            <Loader2 className="animate-spin text-muted-foreground" />
          ) : (
            <Trash2 className="size-4" />
          )}
        </Button>
        <Image
          src={imageUrl}
          alt=""
          width={200}
          height={200}
          className="w-full h-full object-contain"
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "w-full lg:w-xs aspect-video border-2 border-dotted border-[#D1D5DB] rounded-lg bg-white cursor-pointer hover:border-solid",
        {
          "hover:border-[#D1D5DB]": uploading,
          "border-solid border-primary bg-primary/10": isDragging && !uploading,
        }
      )}
    >
      <label
        htmlFor="logo-input"
        onDrop={onDrop}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragging(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragging(false);
        }}
        className={cn(
          "w-full h-full text-center flex flex-col items-center justify-center space-y-2 cursor-pointer",
          {
            "cursor-not-allowed": uploading,
          }
        )}
      >
        {uploading ? (
          <Loader2 className="animate-spin text-muted-foreground" />
        ) : (
          <>
            <ImagePlus className="size-12 text-body mx-auto" />
            <p className="text-xs text-gray-500">PNG, JPG, WEBP up to 10MB</p>
          </>
        )}

        <input
          disabled={uploading}
          onChange={(e) =>
            setSelected(e.target.files ? e.target.files[0] : null)
          }
          id="logo-input"
          type="file"
          accept="image/*"
          className="hidden"
        />
      </label>
    </div>
  );
}
