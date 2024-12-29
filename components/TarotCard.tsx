import Image from 'next/image';

    interface TarotCardProps {
      card: {
        id: number;
        name: string;
        image: string;
        meaning: string;
      };
    }

    export default function TarotCard({ card }: TarotCardProps) {
      return (
        <div className="bg-white/10 backdrop-blur-sm rounded-lg shadow-lg p-6 max-w-sm text-center">
          <div className="relative aspect-[2/3] w-48 mx-auto">
            <Image
              src={card.image}
              alt={card.name}
              fill
              className="rounded-lg object-cover"
              priority
            />
          </div>
          <h3 className="text-2xl font-semibold mt-4">{card.name}</h3>
          <p className="text-gray-200 mt-2">{card.meaning}</p>
        </div>
      );
    }
