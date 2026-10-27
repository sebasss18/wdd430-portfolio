// Tarjeta de contacto que presenta un título, teléfono y correo electrónico.
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
    <article className="max-w-md mt-[20px] mx-[10px] rounded-2xl border border-neutral-200 bg-white p-6 shadow-lg transition-transform duration-300 hover:scale-101">
      <h3 className="mb-4 text-2xl font-bold text-black">{title}</h3>

      <div className="space-y-3 text-neutral-700">
        <p> {phoneNumber}</p>
        <p> {gmail}</p>
      </div>
    </article>
  );
}
