import { Zap, Shield, Sparkles, TrendingUp } from "lucide-react";

export default function BrandStory() {
  const features = [
    {
      icon: Zap,
      title: "Innovative Design",
      description:
        "Cutting-edge technology meets timeless aesthetics in every pair",
    },
    {
      icon: Shield,
      title: "Premium Quality",
      description:
        "Handcrafted with the finest materials for lasting durability",
    },
    {
      icon: Sparkles,
      title: "Comfort First",
      description: "Advanced cushioning systems engineered for all-day wear",
    },
    {
      icon: TrendingUp,
      title: "Sustainable Future",
      description:
        "Committed to eco-friendly practices and responsible manufacturing",
    },
  ];

  return (
    <section className="py-24 px-4 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">
            Why Choose SoleMate
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            We&apos;re not just selling shoes—we&apos;re crafting experiences
            that elevate your every step
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="flex flex-col items-center text-center group"
              >
                <div className="mb-4 p-4 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <Icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
