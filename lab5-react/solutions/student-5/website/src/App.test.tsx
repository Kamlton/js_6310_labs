import { render, screen, fireEvent } from '@testing-library/react'
import App from './App'

jest.mock('../../ui-library/src/PortfolioCase/', () => ({
  PortfolioCase: ({ onViewDetails, onOrder }: { onViewDetails: () => void; onOrder: () => void }) => (
    <div data-testid="portfolio-case">
      <button onClick={onViewDetails}>Подробнее о кейсе</button>
      <button onClick={onOrder}>Заказать аналогичную услугу</button>
    </div>
  )
}))

describe('App', () => {
  beforeEach(() => {
    global.alert = jest.fn()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('calls handleViewDetails for first case', () => {
    render(<App />)

    const detailsButtons = screen.getAllByText('Подробнее о кейсе')
    fireEvent.click(detailsButtons[0])

    expect(global.alert).toHaveBeenCalledWith('Переход к подробному описанию кейса 1')
  })

  it('calls handleOrder for first case', () => {
    render(<App />)

    const orderButtons = screen.getAllByText('Заказать аналогичную услугу')
    fireEvent.click(orderButtons[0])

    expect(global.alert).toHaveBeenCalledWith('Заказ услуги для кейса 1. Наш менеджер свяжется с вами!')
  })
})
