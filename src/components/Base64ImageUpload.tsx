"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { XIcon, UploadIcon } from "lucide-react";

interface Base64ImageUploadProps {
  value: string;
  onChange: (base64: string) => void;
}

export default function Base64ImageUpload({ value, onChange }: Base64ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      onChange(base64);
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  if (value) {
    return (
      <div className="relative w-32 h-32">
        <img 
          src={value} 
          alt="Profile" 
          className="w-32 h-32 rounded-full object-cover border-2 border-border"
        />
        <button
          onClick={() => onChange("")}
          className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full shadow-sm hover:bg-red-600"
          type="button"
        >
          <XIcon className="h-4 w-4 text-white" />
        </button>
      </div>
    );
  }

  return (
    <div className="w-32 h-32 border-2 border-dashed border-border rounded-full flex items-center justify-center">
      <label className="cursor-pointer flex flex-col items-center">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          disabled={isUploading}
        />
        <UploadIcon className="h-8 w-8 text-muted-foreground mb-2" />
        <span className="text-xs text-muted-foreground text-center">
          {isUploading ? "Uploading..." : "Upload Image"}
        </span>
      </label>
    </div>
  );
}