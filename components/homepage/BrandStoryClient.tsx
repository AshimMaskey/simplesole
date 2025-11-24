"use client";

import * as LucideIcons from "lucide-react";
import type { BrandStoryFeature } from "@/app/actions/brand-story";

interface Props {
  features: BrandStoryFeature[];
}

export default function BrandStoryClient({ features }: Props) {
  return (
    <section className="py-24 px-4 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">
            Why Choose SoleMate
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            We&apos;re not just selling shoes—we&apos;re crafting experiences
            that elevate your every step
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => {
            // Ensure we get only valid icon components
            const Icon = LucideIcons[
              feature.icon as keyof typeof LucideIcons
            ] as React.ComponentType<LucideIcons.LucideProps> | undefined;

            return (
              <div
                key={feature.id}
                className="flex flex-col items-center text-center group"
              >
                <div className="mb-4 p-4 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  {Icon && <Icon className="w-8 h-8 text-primary" />}
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
