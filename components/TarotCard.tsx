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
        <div className="flex flex-col items-center">
          <div className="relative aspect-[2/3] w-64 mb-6">
            <Image
              src={card.image}
              alt={card.name}
              fill
              className="rounded-lg object-cover shadow-lg"
              priority
            />
          </div>
          <h3 className="text-3xl font-bold mb-3">{card.name}</h3>
          <p className="text-xl text-gray-200">{card.meaning}</p>
        </div>
      );
    }
