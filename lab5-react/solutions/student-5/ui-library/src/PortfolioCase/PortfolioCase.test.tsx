import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { PortfolioCase } from './PortfolioCase'

const mockProps = {
  title: 'Test Project',
  description: 'Test Description',
  client: 'Test Client',
  industry: 'Test Industry',
  services: ['Service 1', 'Service 2'],
  results: ['Result 1', 'Result 2'],
  imageUrl: 'test.jpg',
  onViewDetails: jest.fn(),
  onOrder: jest.fn()
}

describe('PortfolioCase Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders all required information', () => {
    render(<PortfolioCase {...mockProps} />)

    expect(screen.getByText('Test Project')).toBeInTheDocument()
    expect(screen.getByText('Test Description')).toBeInTheDocument()
    expect(screen.getByText('Клиент: Test Client')).toBeInTheDocument()
    expect(screen.getByText('Отрасль: Test Industry')).toBeInTheDocument()
    expect(screen.getByText('Service 1')).toBeInTheDocument()
    expect(screen.getByText('Service 2')).toBeInTheDocument()
  })

  it('opens modal when card is clicked', () => {
    render(<PortfolioCase {...mockProps} />)

    const card = screen.getByRole('button')
    fireEvent.click(card)

    expect(screen.getByText('О проекте')).toBeInTheDocument()
    expect(screen.getByText('Предоставленные услуги:')).toBeInTheDocument()
    expect(screen.getByText('Достигнутые результаты:')).toBeInTheDocument()
  })

  it('closes modal when close button is clicked', () => {
    render(<PortfolioCase {...mockProps} />)

    const card = screen.getByRole('button')
    fireEvent.click(card)

    const closeButton = screen.getByLabelText('Закрыть модальное окно')
    fireEvent.click(closeButton)

    expect(screen.queryByText('О проекте')).not.toBeInTheDocument()
  })

  it('closes modal when overlay is clicked', () => {
    render(<PortfolioCase {...mockProps} />)

    const card = screen.getByRole('button')
    fireEvent.click(card)

    const overlay = screen.getByTestId('modal-overlay')
    fireEvent.click(overlay)

    expect(screen.queryByText('О проекте')).not.toBeInTheDocument()
  })

  it('calls onViewDetails when details button is clicked', () => {
    render(<PortfolioCase {...mockProps} />)

    const card = screen.getByRole('button')
    fireEvent.click(card)

    const detailsButton = screen.getByTestId('view-details-btn')
    fireEvent.click(detailsButton)

    expect(mockProps.onViewDetails).toHaveBeenCalledTimes(1)
  })

  it('calls onOrder when order button is clicked', () => {
    render(<PortfolioCase {...mockProps} />)

    const card = screen.getByRole('button')
    fireEvent.click(card)

    const orderButton = screen.getByTestId('order-btn')
    fireEvent.click(orderButton)

    expect(mockProps.onOrder).toHaveBeenCalledTimes(1)
  })

  it('handles keyboard events for accessibility', () => {
    render(<PortfolioCase {...mockProps} />)

    const card = screen.getByRole('button')

    fireEvent.keyDown(card, { key: 'Enter', code: 'Enter' })
    expect(screen.getByText('О проекте')).toBeInTheDocument()

    const closeButton = screen.getByLabelText('Закрыть модальное окно')
    fireEvent.click(closeButton)

    fireEvent.keyDown(card, { key: ' ', code: 'Space' })
    expect(screen.getByText('О проекте')).toBeInTheDocument()
  })

  it('switches slides when clicking indicators', () => {
    const propsWithGallery = {
      ...mockProps,
      galleryImages: ['img1.jpg', 'img2.jpg', 'img3.jpg']
    }

    render(<PortfolioCase {...propsWithGallery} />)

    const card = screen.getByRole('button')
    fireEvent.click(card)

    const indicators = screen.getAllByRole('button').filter(btn =>
      btn.className.includes('slider-indicator')
    )

    fireEvent.click(indicators[1])
    const image = screen.getByAltText('Test Project - Изображение 2')
    expect(image).toBeInTheDocument()
  })

  it('navigates slides with next/prev arrows', () => {
    const propsWithGallery = {
      ...mockProps,
      galleryImages: ['img1.jpg', 'img2.jpg', 'img3.jpg']
    }

    render(<PortfolioCase {...propsWithGallery} />)

    const card = screen.getByRole('button')
    fireEvent.click(card)

    const nextArrow = screen.getByLabelText('Следующее изображение')
    fireEvent.click(nextArrow)

    expect(screen.getByText('2 / 3')).toBeInTheDocument()

    const prevArrow = screen.getByLabelText('Предыдущее изображение')
    fireEvent.click(prevArrow)

    expect(screen.getByText('1 / 3')).toBeInTheDocument()
  })
})
