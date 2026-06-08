export default function Marquee({ text = "Website \u263A Mobile \u263A Development \u263A AI Solutions \u263A Branding \u263A SEO \u263A" }: { text?: string }) {
  return (
    <div className="bg-black py-3 overflow-hidden border-y-2 border-black">
      <div className="animate-marquee whitespace-nowrap flex">
        <span className="text-yellow font-bold text-lg mx-8 font-space tracking-wide">
          {text}
        </span>
        <span className="text-yellow font-bold text-lg mx-8 font-space tracking-wide">
          {text}
        </span>
      </div>
    </div>
  );
}
