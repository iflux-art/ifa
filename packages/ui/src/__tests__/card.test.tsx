import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../components/card'

describe('Card Components', () => {
  it('renders card with all components', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Card content goes here</p>
        </CardContent>
        <CardFooter>
          <button type="button">Action</button>
        </CardFooter>
      </Card>
    )

    expect(screen.getByText('Card Title')).toBeInTheDocument()
    expect(screen.getByText('Card Description')).toBeInTheDocument()
    expect(screen.getByText('Card content goes here')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument()
  })

  it('applies correct CSS classes', () => {
    render(
      <Card data-testid="card">
        <CardHeader data-testid="header">
          <CardTitle data-testid="title">Title</CardTitle>
          <CardDescription data-testid="description">
            Description
          </CardDescription>
        </CardHeader>
        <CardContent data-testid="content">Content</CardContent>
        <CardFooter data-testid="footer">Footer</CardFooter>
      </Card>
    )

    expect(screen.getByTestId('card')).toHaveClass(
      'rounded-lg',
      'border',
      'bg-card'
    )
    expect(screen.getByTestId('header')).toHaveClass(
      'flex',
      'flex-col',
      'space-y-1.5',
      'p-6'
    )
    expect(screen.getByTestId('title')).toHaveClass('text-2xl', 'font-semibold')
    expect(screen.getByTestId('description')).toHaveClass(
      'text-sm',
      'text-muted-foreground'
    )
    expect(screen.getByTestId('content')).toHaveClass('p-6', 'pt-0')
    expect(screen.getByTestId('footer')).toHaveClass(
      'flex',
      'items-center',
      'p-6',
      'pt-0'
    )
  })

  it('accepts custom className', () => {
    render(
      <Card className="custom-class" data-testid="card">
        Content
      </Card>
    )
    expect(screen.getByTestId('card')).toHaveClass('custom-class')
  })

  it('renders minimal card structure', () => {
    render(
      <Card data-testid="card">
        <CardContent>Simple content</CardContent>
      </Card>
    )

    expect(screen.getByTestId('card')).toBeInTheDocument()
    expect(screen.getByText('Simple content')).toBeInTheDocument()
  })
})
