import AudioPlayer from "@/components/ui/audio-player";

export default function AudioPage() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-sacred">Bhajans & Mantras</h1>
          <p className="text-muted-foreground">Listen to sacred tracks while you browse.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 place-items-center">
          <AudioPlayer
            src="https://youtu.be/FpjJgHkroDI?si=54gjcyJP0pcz1dEr"
            title="Bhajan"
          />
        </div>
      </div>
    </section>
  );
}
