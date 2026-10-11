import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Section'
import { Seo } from '@/components/ui/Seo'
import { notFoundMeta } from '@/lib/seo'

export default function NotFoundPage() {
  return (
    <section className="relative flex min-h-[80vh] items-center pt-24">
      <Container className="text-center">
        <Seo {...notFoundMeta()} />
        <p className="font-mono text-sm tracking-[0.25em] text-accent uppercase">Error 404</p>
        <h1 className="mt-4 text-5xl font-semibold sm:text-7xl">This data point is an outlier.</h1>
        <p className="mx-auto mt-5 max-w-md text-lg text-muted">
          The page you are looking for doesn't exist or has moved. Let's get you back to the main dataset.
        </p>
        <Button href="/" className="mt-10" leadingIcon={<ArrowLeft aria-hidden="true" className="size-4" />}>
          Back to home
        </Button>
      </Container>
    </section>
  )
}
