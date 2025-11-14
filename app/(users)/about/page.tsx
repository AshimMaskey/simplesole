export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background pt-20">
      <section className="container mx-auto px-4 py-12">
        {/* Heading */}
        <h1 className="text-3xl font-bold mb-6">About Us</h1>

        {/* Intro */}
        <p className="text-muted-foreground max-w-2xl mb-10">
          At SimpleSole, we believe great footwear should blend comfort, style,
          and durability. Our mission is to provide high-quality shoes for every
          step you take—crafted with care and designed for everyday life.
        </p>

        {/* Grid Sections */}
        <div className="grid gap-10 md:grid-cols-3">
          {/* Mission */}
          <div>
            <h2 className="text-xl font-semibold mb-3">Our Mission</h2>
            <p className="text-muted-foreground">
              To make premium footwear accessible to everyone by combining
              thoughtful design, modern craftsmanship, and fair pricing.
            </p>
          </div>

          {/* Story */}
          <div>
            <h2 className="text-xl font-semibold mb-3">Our Story</h2>
            <p className="text-muted-foreground">
              SimpleSole started with a simple idea: create shoes that feel
              great from the moment you put them on. What began as a small
              passion project has grown into a trusted footwear brand.
            </p>
          </div>

          {/* Quality */}
          <div>
            <h2 className="text-xl font-semibold mb-3">Quality First</h2>
            <p className="text-muted-foreground">
              Every pair is made using carefully selected materials and tested
              for comfort and durability—so you can move confidently every day.
            </p>
          </div>
        </div>

        {/* Footer statement */}
        <div className="mt-12 border-t pt-8">
          <p className="text-sm text-muted-foreground">
            Thank you for choosing SimpleSole. We’re here to support you every
            step of the way.
          </p>
        </div>
      </section>
    </div>
  );
}
