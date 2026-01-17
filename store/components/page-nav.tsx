"use client";

import { useRouter } from "next/navigation";

interface Props {
    title: string
}

export default function PageNav({ title }: Props) {
  const router = useRouter();

  return (
    <div
      style={{
        height: 56,
        padding: "0 16px",
        borderBottom: "1px solid #E5E7EB",
        display: "flex",
        alignItems: "center",
        position: "fixed",
        top: 0,
        width: "100%",
        background: "#FFFFFF",
        zIndex: 10,
      }}
    >
      <button
        aria-label="Go back"
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          border: "none",
          background: "transparent",
          fontSize: 20,
          cursor: "pointer",
        }}
        onClick={() => router.back()}
      >
        ←
      </button>
      <h1
        style={{
          fontSize: 16,
          fontWeight: 600,
          marginLeft: 8,
          color: "#111827",
        }}
      >
        { title }
      </h1>
    </div>
  );
}
