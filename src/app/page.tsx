import DrawCardButton from "@/components/DrawCardButton";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 to-indigo-900 text-white flex flex-col items-center justify-center py-10">
      <h1 className="text-4xl font-bold mb-8">タロット占い</h1>
      <div className="relative mb-8 aspect-square w-[90%] max-w-[500px]">
        <Image
          src="/assets/cover.png"
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
