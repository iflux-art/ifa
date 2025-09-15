'use client'

import Link from 'next/link'

export const Logo = () => (
  <Link
    href="https://www.iflux.art/"
    className="inline-block"
    aria-label="iFluxArt - 访问官网"
    target="_blank"
    rel="noopener noreferrer"
  >
    <h2 className="sm:text-md text-sm font-bold tracking-wide transition-colors hover:text-primary md:text-lg">
      iFluxArt
    </h2>
  </Link>
)
