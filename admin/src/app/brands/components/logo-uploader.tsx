"use client";

import { Button } from "@/src/components/ui/button";
import { deleteFile, getFilePath, uploadFile } from "@/src/lib/utils";
import { ImageIcon, Loader2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface Props {
  value?: string;
  className?: string;
  onChange: (url: string) => void;
}

export default function LogoUploader({ value, className, onChange }: Props) {
  const [logoUrl, setLogoUrl] = useState(value || "");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!fileInputRef.current) return;
    const files = e.target.files;

    if (files && files.length > 0) {
      setSelectedFile(files[0]);
      e.target.value = "";
    }
  };

  const removeLogo = async () => {
    if (!logoUrl) return;
    if (deleting) return;

    try {
      setDeleting(true);
      const path = getFilePath(logoUrl);
      await deleteFile(path);
    } finally {
      setDeleting(false);
      setLogoUrl("");
    }
  };

  useEffect(() => {
    const uploadLogo = async () => {
      if (!selectedFile) return;
      if (uploading) return;

      try {
        setUploading(true);
        const res = await uploadFile(selectedFile);
        if (!res) return toast.error("Failed to upload image!");
        setLogoUrl(res.public_url);
        onChange(res.public_url);
      } finally {
        setUploading(false);
      }
    };

    uploadLogo();
  }, [selectedFile]);

  return (
    <div className="flex items-center gap-4">
      {/* Logo Preview Square */}
      <div className="relative group flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 overflow-hidden">
        {logoUrl ? (
          <>
            <img
              src={logoUrl}
              alt="Logo preview"
              className="h-full w-full object-contain p-1"
            />
            {/* Overlay for quick remove */}
            <button
              type="button"
              onClick={removeLogo}
              className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={16} className="text-white" />
            </button>
          </>
        ) : (
          <>
            {uploading ? (
              <Loader2
                size={16}
                className="animate-spin text-muted-foreground"
              />
            ) : (
              <ImageIcon size={20} className="text-gray-300" />
            )}
          </>
        )}
      </div>

      {/* Action Buttons */}
      <div className="grid gap-1">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/png, image/jpeg"
          className="hidden"
        />
        <div className="flex flex-col items-start gap-0">
          <Button
            disabled={uploading || deleting}
            type="button"
            variant="link"
            onClick={() => fileInputRef.current?.click()}
            className="h-auto p-0 text-[13px] text-blue-600 justify-start font-medium cursor-pointer hover:underline"
          >
            {logoUrl ? "Change logo" : "Upload PNG or JPG"}
          </Button>

          {logoUrl && (
            <button
              type="button"
              disabled={deleting}
              onClick={removeLogo}
              className="text-[12px] text-red-500 hover:text-red-600 font-medium text-left"
            >
              Remove
            </button>
          )}

          {!logoUrl && (
            <p className="text-[12px] text-gray-400">Recommended: 200x200px</p>
          )}
        </div>
      </div>
    </div>
  );
}
