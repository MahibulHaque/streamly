import { Button } from "@/components/ui/button"

export default function CTA() {
  return (
    <div className="bg-secondary">
      <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-foreground sm:text-4xl">
          <span className="block">Boost your productivity today.</span>
          <span className="block">Start using Streamly for free.</span>
        </h2>
        <p className="mt-4 text-lg leading-6 text-muted-foreground">
          Join thousands of teams who have already transformed their communication with Streamly.
        </p>
        <Button size="lg" className="mt-8">
          Get started for free
        </Button>
      </div>
    </div>
  )
}

