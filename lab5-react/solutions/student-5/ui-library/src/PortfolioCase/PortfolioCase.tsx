import React, { useState } from 'react'
import './PortfolioCase.css'

export interface PortfolioCaseProps {
  title: string
  description: string
  client: string
  industry: string
  services: string[]
  results: string[]
  imageUrl: string
  galleryImages?: string[]
  onViewDetails: () => void
  onOrder: () => void
}

export const PortfolioCase: React.FC<PortfolioCaseProps> = ({
  title,
  description,
  client,
  industry,
  services,
  results,
  imageUrl,
  galleryImages = [],
  onViewDetails,
  onOrder
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)

  // Все изображения для слайдера
  const allImages = galleryImages.length > 0 ? galleryImages : [imageUrl]
  const hasMultipleImages = allImages.length > 1

  const handleCardClick = (): void => {
    setIsExpanded(true)
  }

  const handleClose = (): void => {
    setIsExpanded(false)
    setCurrentSlide(0)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>): void => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleCardClick()
    }
  }

  const handleImageError = (): void => {
    setImageError(true)
  }

  const nextSlide = (): void => {
    setCurrentSlide((prev) => (prev + 1) % allImages.length)
  }

  const prevSlide = (): void => {
    setCurrentSlide((prev) => (prev - 1 + allImages.length) % allImages.length)
  }

  const goToSlide = (index: number): void => {
    setCurrentSlide(index)
  }

  return (
    <>
      <div
        className="portfolio-case-card"
        onClick={handleCardClick}
        role="button"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        data-testid="portfolio-case-card"
      >
        <div className="portfolio-case-image">
          {!imageError ? (
            <img
              src={imageUrl}
              alt={`Кейс: ${title}`}
              onError={handleImageError}
            />
          ) : (
            <div className="image-placeholder">
              <span>Изображение не найдено</span>
            </div>
          )}
          <div className="portfolio-case-client">
            <span className="client-badge">Клиент: {client}</span>
          </div>
        </div>

        <div className="portfolio-case-content">
          <h3 className="portfolio-case-title">{title}</h3>
          <p className="portfolio-case-industry">Отрасль: {industry}</p>
          <p className="portfolio-case-description">{description}</p>
          <div className="portfolio-case-services">
            {services.map((service, index) => (
              <span key={index} className="service-tag">
                {service}
              </span>
            ))}
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="portfolio-case-modal">
          <div
            className="modal-overlay"
            onClick={handleClose}
            data-testid="modal-overlay"
          />
          <div className="modal-content">
            <button
              className="modal-close"
              onClick={handleClose}
              aria-label="Закрыть модальное окно"
              data-testid="modal-close"
            >
              ×
            </button>

            <div className="modal-header">
              <h2>{title}</h2>
              <div className="modal-client-info">
                <p><strong>Клиент:</strong> {client}</p>
                <p><strong>Отрасль:</strong> {industry}</p>
              </div>
            </div>

            {/* НОВЫЙ СЛАЙДЕР вместо старой галереи */}
            <div className="modal-gallery-slider">
              <div className="slider-container">
                {!imageError ? (
                  <img
                    src={allImages[currentSlide]}
                    alt={`${title} - Изображение ${currentSlide + 1}`}
                    className="slider-image"
                    onError={handleImageError}
                  />
                ) : (
                  <div className="image-placeholder large">
                    <span>Изображение не найдено</span>
                  </div>
                )}

                {/* Стрелки слайдера */}
                {hasMultipleImages && (
                  <>
                    <button
                      className="slider-arrow slider-arrow-prev"
                      onClick={prevSlide}
                      aria-label="Предыдущее изображение"
                    >
                      ‹
                    </button>
                    <button
                      className="slider-arrow slider-arrow-next"
                      onClick={nextSlide}
                      aria-label="Следующее изображение"
                    >
                      ›
                    </button>
                  </>
                )}

                {/* Индикаторы слайдера */}
                {hasMultipleImages && (
                  <div className="slider-indicators">
                    {allImages.map((_, index) => (
                      <button
                        key={index}
                        className={`slider-indicator ${index === currentSlide ? 'active' : ''}`}
                        onClick={() => goToSlide(index)}
                        aria-label={`Перейти к изображению ${index + 1}`}
                      />
                    ))}
                  </div>
                )}

                {/* Счетчик слайдов */}
                {hasMultipleImages && (
                  <div className="slide-counter">
                    {currentSlide + 1} / {allImages.length}
                  </div>
                )}
              </div>
            </div>

            <div className="modal-description">
              <h4>О проекте</h4>
              <p>{description}</p>
            </div>

            <div className="modal-details">
              <div className="modal-services">
                <h4>Предоставленные услуги:</h4>
                <ul>
                  {services.map((service, index) => (
                    <li key={index}>{service}</li>
                  ))}
                </ul>
              </div>

              <div className="modal-results">
                <h4>Достигнутые результаты:</h4>
                <ul>
                  {results.map((result, index) => (
                    <li key={index}>{result}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="modal-actions">
              <button
                className="btn btn-primary"
                onClick={() => {
                  onViewDetails()
                  handleClose()
                }}
                data-testid="view-details-btn"
              >
                Подробнее о кейсе
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  onOrder()
                  handleClose()
                }}
                data-testid="order-btn"
              >
                Заказать аналогичную услугу
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
