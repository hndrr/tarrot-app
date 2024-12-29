'use client';
    import { useState } from 'react';
    import { tarotCards } from '../data/tarotCards';
    import TarotCard from '../components/TarotCard';

    interface TarotCard {
      id: number;
      name: string;
      image: string;
      meaning: string;
    }

    export default function Home() {
      const [selectedCard, setSelectedCard] = useState<TarotCard | null>(null);

      const drawCard = () => {
        const randomIndex = Math.floor(Math.random() * tarotCards.length);
        setSelectedCard(tarotCards[randomIndex]);
      };

      return (
        <main className="min-h-screen bg-gradient-to-b from-purple-900 to-indigo-900 text-white flex flex-col items-center py-10">
          <h1 className="text-4xl font-bold mb-8">タロット占い</h1>
          <button 
            onClick={drawCard}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-full mb-8 transition duration-300"
          >
            カードを引く
          </button>
          {selectedCard && <TarotCard card={selectedCard} />}
        </main>
      );
    }
