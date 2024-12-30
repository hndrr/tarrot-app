import DrawCardButton from "@/components/DrawCardButton";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 to-indigo-900 text-white flex flex-col items-center justify-center py-10">
      <h1 className="text-4xl font-bold mb-8">タロット占い</h1>
      <div className="relative w-[500px] h-[500px] mb-8">
        <Image
          src="/assets/cover.webp"
          alt="タロットカード"
          fill
          className="rounded-lg object-cover"
          priority
        />
      </div>
      <p className="text-xl mb-8 text-purple-200">今日のあなたの運勢は...?</p>
      <DrawCardButton />
    </main>
  );
}
