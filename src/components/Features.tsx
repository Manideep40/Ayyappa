import { Button } from "@/components/ui/button";
import RadialOrbitalTimeline, { type TimelineItem } from "@/components/ui/radial-orbital-timeline";
import { FeaturesSectionWithHoverEffects } from "@/components/ui/feature-section-with-hover-effects";
import { Calendar, Backpack, Landmark, Footprints, MapPin, AudioLines } from "lucide-react";

const Features = () => {
  return (
    <section className="py-24 px-4 bg-gradient-to-b from-background to-secondary/20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-sacred">
            Sacred Features for Every Devotee
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Comprehensive tools designed to support your spiritual journey and connect you 
            with the global Ayyappa devotee community.
          </p>
        </div>

        <FeaturesSectionWithHoverEffects />

        {/* Interactive Overview */}
        <div className="mt-20">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-2 text-sacred">Sacred Journey Overview</h3>
            <p className="text-muted-foreground">An interactive view of key phases in an Ayyappa devotee's journey.</p>
          </div>
          <div className="rounded-2xl overflow-hidden border border-primary/20 shadow-divine">
            <RadialOrbitalTimeline timelineData={getTimelineData()} />
          </div>
        </div>

        <div className="text-center mt-16">
          <Button variant="sacred" size="lg" className="text-lg px-8 py-4 animate-sacred-glow">
            Explore All Features
          </Button>
        </div>
      </div>
    </section>
  );
};

function getTimelineData(): TimelineItem[] {
  return [
    {
      id: 1,
      title: "Plan",
      date: "Phase 1",
      content: "Choose dates, review routes, and prepare mentally for vratham.",
      category: "Planning",
      icon: Calendar,
      relatedIds: [2],
      status: "completed",
      energy: 90,
    },
    {
      id: 2,
      title: "Vratham",
      date: "Phase 2",
      content: "Begin the 41-day vratham with devotion and discipline.",
      category: "Discipline",
      icon: Backpack,
      relatedIds: [1, 3],
      status: "in-progress",
      energy: 70,
    },
    {
      id: 3,
      title: "Temple Visit",
      date: "Phase 3",
      content: "Seek blessings at local temples and prepare irumudi.",
      category: "Temple",
      icon: Landmark,
      relatedIds: [2, 4],
      status: "pending",
      energy: 50,
    },
    {
      id: 4,
      title: "Trek",
      date: "Phase 4",
      content: "Undertake the sacred trek with chants and guidance.",
      category: "Trek",
      icon: Footprints,
      relatedIds: [3, 5],
      status: "pending",
      energy: 40,
    },
    {
      id: 5,
      title: "Darshan",
      date: "Phase 5",
      content: "Receive Lord Ayyappa's darshan and offer prayers.",
      category: "Darshan",
      icon: MapPin,
      relatedIds: [4, 6],
      status: "pending",
      energy: 60,
    },
    {
      id: 6,
      title: "Bhajans",
      date: "Phase 6",
      content: "Continue devotion with bhajans and community satsangs.",
      category: "Audio",
      icon: AudioLines,
      relatedIds: [5],
      status: "pending",
      energy: 30,
    },
  ];
}

export default Features;
