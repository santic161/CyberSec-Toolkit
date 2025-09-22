import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import CSVDashboard from '../web_dashboard'

// Mock fetch for testing
global.fetch = vi.fn()

describe('CSVDashboard', () => {
  beforeEach(() => {
    fetch.mockClear()
  })

  it('renders loading state initially', () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      text: () => Promise.resolve('Command,Cmd,Page,Tags\nTest Command,test cmd,test page,Test Tag'),
    })
    
    render(<CSVDashboard />)
    expect(screen.getByText('Loading dashboard data...')).toBeInTheDocument()
  })

  it('renders error state when fetch fails', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'))
    
    render(<CSVDashboard />)
    
    // Wait for error state
    await screen.findByText(/Error Loading Data/)
    expect(screen.getByText(/Failed to load data/)).toBeInTheDocument()
  })
})
