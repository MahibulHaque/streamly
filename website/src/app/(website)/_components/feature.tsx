import { Camera, Zap, Share2 } from 'lucide-react'

const features = [
  {
    name: 'Easy Recording',
    description: 'Record your screen, camera, or both with just a few clicks.',
    icon: Camera,
  },
  {
    name: 'AI-Powered',
    description: 'Our AI enhances your videos, providing captions, summaries, and more.',
    icon: Zap,
  },
  {
    name: 'Instant Sharing',
    description: 'Share your videos instantly with teammates or customers via a simple link.',
    icon: Share2,
  },
]

export default function Features() {
  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-primary font-semibold tracking-wide uppercase">Features</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-foreground sm:text-4xl">
            A better way to communicate
          </p>
          <p className="mt-4 max-w-2xl text-xl text-muted-foreground lg:mx-auto">
            Streamly provides you with all the tools you need to create, share, and collaborate on video messages.
          </p>
        </div>

        <div className="mt-10">
          <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
            {features.map((feature) => (
              <div key={feature.name} className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary text-primary-foreground">
                    <feature.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-foreground">{feature.name}</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-muted-foreground">{feature.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}

