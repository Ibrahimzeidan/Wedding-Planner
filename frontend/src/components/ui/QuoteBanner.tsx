type QuoteBannerProps = {
  image: string;
};

export default function QuoteBanner({ image }: QuoteBannerProps) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-14">
      <div
        className="flex min-h-56 items-center justify-center bg-cover bg-center px-6 text-center"
        style={{ backgroundImage: `linear-gradient(rgba(255,255,255,.12), rgba(255,255,255,.12)), url(${image})` }}
      >
        <p className="max-w-3xl text-2xl italic text-white drop-shadow">
          “Ready to Turn your dream wedding into reality? Contact us today and let's start planning your perfect days!”
        </p>
      </div>
    </section>
  );
}
