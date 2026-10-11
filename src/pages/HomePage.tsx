import { Suspense, type ReactNode } from 'react'
import { homeMeta } from '@/lib/seo'
import { Seo } from '@/components/ui/Seo'
import { Hero } from '@/sections/Hero'
import { Stats } from '@/sections/Stats'
import { About } from '@/sections/About'
import { Skills } from '@/sections/Skills'
import { Projects } from '@/sections/Projects'
import { Services } from '@/sections/Services'
import { Experience } from '@/sections/Experience'
import { Testimonials } from '@/sections/Testimonials'
import { Contact } from '@/sections/Contact'

/**
 * Each section is its own Suspense boundary. When React hydrates the
 * pre-rendered page it then works through the sections in separate,
 * interruptible tasks instead of one long main-thread block.
 */
function Boundary({ children }: { children: ReactNode }) {
  return <Suspense fallback={null}>{children}</Suspense>
}

export default function HomePage() {
  return (
    <>
      <Seo {...homeMeta()} />
      <Hero />
      <Boundary>
        <Stats />
      </Boundary>
      <Boundary>
        <About />
      </Boundary>
      <Boundary>
        <Skills />
      </Boundary>
      <Boundary>
        <Projects />
      </Boundary>
      <Boundary>
        <Services />
      </Boundary>
      <Boundary>
        <Experience />
      </Boundary>
      <Boundary>
        <Testimonials />
      </Boundary>
      <Boundary>
        <Contact />
      </Boundary>
    </>
  )
}
