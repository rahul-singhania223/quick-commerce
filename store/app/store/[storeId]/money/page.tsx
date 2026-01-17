import Image from "next/image";

export default function MoneyPage() {
  return (
    <div>
      <div className="text-lg font-semibold bg-white p-4 flex items-center gap-4">
        <Image
          src="/images/logo.png"
          className="w-10"
          alt="logo"
          width={150}
          height={150}
        />
        <h1>Money</h1>
      </div>

      money page
    </div>
  );
}
