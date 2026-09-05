interface ContactCardProps {
  title: string;
  phoneNumber: number;
  gmail: string;
}

export default function ContactCard({
  title,
  phoneNumber,
  gmail,
}: ContactCardProps) {
  return (
    <article className="max-w-md mt-[20px] mx-[10px] p-6 bg-blue-50 border border-blue-200 rounded-2xl shadow-lg hover:scale-102 transition-transform duration-300">
      <h3 className="text-2xl font-bold text-blue-900 mb-4">{title}</h3>

      <div className="space-y-3 text-gray-700">
        <p> {phoneNumber}</p>
        <p> {gmail}</p>
      </div>
    </article>
  );
}
