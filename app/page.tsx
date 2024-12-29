'use client';
    import { useRouter } from 'next/navigation';
    import { tarotCards } from '../data/tarotCards';

    export default function Home() {
      const router = useRouter();

      const drawCard = () => {
        const randomIndex = Math.floor(Math.random() * tarotCards.length);
        const selectedCard = tarotCards[randomIndex];
        router.push(`/reading?cardId=${selectedCard.id}`);
      };

      return (
        <main className="min-h-screen bg-gradient-to-b from-purple-900 to-indigo-900 text-white flex flex-col items-center justify-center py-10">
          <h1 className="text-4xl font-bold mb-8">タロット占い</h1>
          <p className="text-xl mb-8 text-purple-200">今日のあなたの運勢は...?</p>
          <button 
            onClick={drawCard}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-8 rounded-full mb-8 transition duration-300 text-lg"
          >
            カードを引く
          </button>
        </main>
      );
    }
