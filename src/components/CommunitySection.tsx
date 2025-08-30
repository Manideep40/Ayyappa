import { motion } from "motion/react";
import { TestimonialsColumn, type Testimonial } from "@/components/ui/testimonials-columns-1";

const CommunitySection = () => {
  const testimonials: Testimonial[] = [
    {
      text: "This platform helped me plan my Sabarimala journey perfectly. The vratham tracker and community support made my pilgrimage deeply meaningful.",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&h=200&fit=crop&auto=format",
      name: "Ravi Kumar",
      role: "Devotee, Bengaluru",
    },
    {
      text: "Being away from home, this app keeps me connected to my spiritual roots. The bhajans and community prayers are a blessing.",
      image: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=200&h=200&fit=crop&auto=format",
      name: "Priya Nair",
      role: "Devotee, Dubai",
    },
    {
      text: "Found amazing temple recommendations and connected with local devotee groups. The festival calendar never lets me miss important dates.",
      image: "https://images.unsplash.com/photo-1542156822-6924d1a71ace?q=80&w=200&h=200&fit=crop&auto=format",
      name: "Suresh Menon",
      role: "Devotee, Mumbai",
    },
    {
      text: "The community here is supportive and respectful. Planning for vratham has become simple and focused.",
      image: "https://images.unsplash.com/photo-1544005316-04ce1f3c95fa?q=80&w=200&h=200&fit=crop&auto=format",
      name: "Anjali",
      role: "Student, Kochi",
    },
    {
      text: "Prayer reminders and temple updates are very timely. It truly feels like a sacred companion.",
      image: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=200&h=200&fit=crop&auto=format",
      name: "Vishnu",
      role: "Engineer, Chennai",
    },
    {
      text: "I met like‑minded devotees and even joined a bhajan group through this app.",
      image: "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?q=80&w=200&h=200&fit=crop&auto=format",
      name: "Keerthi",
      role: "Designer, Hyderabad",
    },
    {
      text: "The interface is simple and serene. Exactly what I needed to focus on devotion.",
      image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=200&h=200&fit=crop&auto=format",
      name: "Rahul",
      role: "Volunteer, Pune",
    },
    {
      text: "Festival schedules and local events are always accurate. Very helpful for planning travel.",
      image: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=200&h=200&fit=crop&auto=format",
      name: "Meera",
      role: "Teacher, Thiruvananthapuram",
    },
    {
      text: "A beautiful way to stay connected with Ayyappa devotees across the world.",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&h=200&fit=crop&auto=format",
      name: "Arjun",
      role: "Photographer, Coimbatore",
    },
  ];

  const firstColumn = testimonials.slice(0, 3);
  const secondColumn = testimonials.slice(3, 6);
  const thirdColumn = testimonials.slice(6, 9);

  return (
    <section className="bg-background py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center max-w-[720px] mx-auto text-center"
        >
          <div className="inline-flex items-center border py-1 px-4 rounded-lg text-sm text-muted-foreground bg-card mb-4">
            Testimonials
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-sacred mb-3">
            Join Our Sacred Community
          </h2>
          <p className="text-base md:text-lg text-muted-foreground">
            Connect with thousands of Ayyappa devotees worldwide. Share experiences, seek guidance,
            and strengthen your spiritual journey together.
          </p>
        </motion.div>

        <div className="flex justify-center gap-6 mt-12 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[740px] overflow-hidden">
          <TestimonialsColumn testimonials={firstColumn} duration={15} />
          <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={19} />
          <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={17} />
        </div>
      </div>
    </section>
  );
};

export default CommunitySection;

