import { clsx, type ClassValue } from "clsx";
import { jwtVerify } from "jose";
import { NextRequest } from "next/server";
import { twMerge } from "tailwind-merge";
import { supabase } from "../config/storage.config";
import { v4 } from "uuid";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const checkAuth = async (req: NextRequest) => {
  const refresh_token = req.cookies.get("refresh_token")?.value || "";

  if (!refresh_token) return null;
  if (refresh_token.split(".").length !== 3) return null;

  try {
    const key = new TextEncoder().encode(process.env.REFRESH_TOKEN_SECRET!);
    const isValidToken = await jwtVerify(refresh_token, key);

    if (!isValidToken) return null;

    const userId = isValidToken.payload.userId;

    return { user_id: userId, authenticated: true };
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const uploadFile = async (
  file: File,
): Promise<{ public_url: string; path: string } | null> => {
  try {
    const path = v4() + Date.now() + "." + file.type.split("/")[1];
    const res = await supabase.storage
      .from("Images")
      .upload(`store-logo/${path}`, file, {
        cacheControl: "no-cache",
      });

    if (res.error) throw new Error(res.error.message);

    const public_url = supabase.storage
      .from("Images")
      .getPublicUrl(res.data.path).data.publicUrl;

    return { public_url, path: res.data.path };
  } catch (error) {
    console.log(error);
    return null
  }
};

export const deleteFile = async (path: string) =>
  await supabase.storage.from("Images").remove([path]);

export const getPublicUrl = (path: string) =>
  supabase.storage.from("Images").getPublicUrl(path).data.publicUrl;

export const getFilePath = (url: string) => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const storageLocation = supabaseUrl + "/storage/v1/object/public/Images/";
  const path = url.replace(storageLocation, "");
  return path;
};
