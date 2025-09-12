import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Badge } from '../components/badge'

describe('Badge', () => {
  it('renders correctly', () => {
    render(<Badge>Badge</Badge>)
    expect(screen.getByText('Badge')).toBeInTheDocument()
  })

  it('applies default variant classes', () => {
    render(<Badge data-testid="badge">Default</Badge>)
    const badge = screen.getByTestId('badge')

    expect(badge).toHaveClass(
      'inline-flex',
      'items-center',
      'rounded-full',
      'border',
      'px-2.5',
      'py-0.5',
      'text-xs',
      'font-semibold',
      'bg-primary',
      'text-primary-foreground'
    )
  })

  it('applies secondary variant classes', () => {
    render(
      <Badge variant="secondary" data-testid="badge">
        Secondary
      </Badge>
    )
    const badge = screen.getByTestId('badge')

    expect(badge).toHaveClass('bg-secondary', 'text-secondary-foreground')
  })

  it('applies destructive variant classes', () => {
    render(
      <Badge variant="destructive" data-testid="badge">
        Destructive
      </Badge>
    )
    const badge = screen.getByTestId('badge')

    expect(badge).toHaveClass('bg-destructive', 'text-destructive-foreground')
  })

  it('applies outline variant classes', () => {
    render(
      <Badge variant="outline" data-testid="badge">
        Outline
      </Badge>
    )
    const badge = screen.getByTestId('badge')

    expect(badge).toHaveClass('text-foreground')
    expect(badge).not.toHaveClass('bg-primary')
  })

  it('accepts custom className', () => {
    render(
      <Badge className="custom-class" data-testid="badge">
        Custom
      </Badge>
    )
    expect(screen.getByTestId('badge')).toHaveClass('custom-class')
  })

  it('accepts custom props', () => {
    render(
      <Badge data-testid="badge" title="Badge title">
        Badge
      </Badge>
    )
    expect(screen.getByTestId('badge')).toHaveAttribute('title', 'Badge title')
  })
})
