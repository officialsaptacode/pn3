import { Button } from "@workspace/ui/components/button";
import { TypographyH1, TypographyP } from "../lib/typography";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
      <main className="max-w-3xl space-y-6">
        <TypographyH1 className="text-4xl md:text-6xl font-bold tracking-tight">
          Welcome to <span className="text-primary">pn3 Boilerplate</span>
        </TypographyH1>
        
        <TypographyP className="text-xl text-muted-foreground">
          A high-performance monorepo boilerplate built with Next.js, NestJS, and TanStack.
          Standardized with Biome, Turbo, and Tailwind CSS 4.
        </TypographyP>

        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <Button size="lg" asChild>
            <a href="/about">Learn More</a>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <a href="https://github.com/google-gemini/gemini-cli" target="_blank" rel="noreferrer">
              Documentation
            </a>
          </Button>
        </div>
      </main>

      <section className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 text-left container">
        <div className="p-6 rounded-xl border bg-card shadow-sm space-y-2">
          <h3 className="text-xl font-semibold">Modern Stack</h3>
          <p className="text-muted-foreground">Next.js 16, NestJS 11, React 19, and Tailwind CSS 4.</p>
        </div>
        <div className="p-6 rounded-xl border bg-card shadow-sm space-y-2">
          <h3 className="text-xl font-semibold">Type Safe</h3>
          <p className="text-muted-foreground">End-to-end type safety with shared Prisma schemas and API clients.</p>
        </div>
        <div className="p-6 rounded-xl border bg-card shadow-sm space-y-2">
          <h3 className="text-xl font-semibold">Developer UX</h3>
          <p className="text-muted-foreground">Lightning fast development with Turbo, Biome, and pnpm workspaces.</p>
        </div>
      </section>
    </div>
  );
}
