
import { PortfolioCase } from '../../ui-library/src/PortfolioCase/'
import './App.css'

const portfolioCases = [
  {
    id: 1,
    title: 'Комплексная рекламная кампания для бренда косметики',
    description: 'Разработка и реализация полного цикла рекламной кампании в digital-пространстве с акцентом на визуальный контент и influencer-маркетинг.',
    client: 'Luxury Cosmetics',
    industry: 'Косметика и красота',
    services: ['SMM', 'Таргетированная реклама', 'Контент-маркетинг', 'Influencer-маркетинг'],
    results: ['Увеличение охвата на 150% за 3 месяца', 'Рост продаж на 45%', 'Привлечение 5000+ подписчиков'],
    imageUrl: '/images/cosmetics.jpg',
    galleryImages: [
      '/images/cosm2.jpg',
      '/images/cosm3.jpg'
    ]
  },
  {
    id: 2,
    title: 'Rebranding и запуск digital-стратегии для ресторанной сети',
    description: 'Полный ребрендинг сети ресторанов с разработкой новой digital-стратегии. Включало создание нового логотипа, фирменного стиля и стратегии продвижения.',
    client: 'GastroHub Restaurants',
    industry: 'Ресторанный бизнес',
    services: ['Rebranding', 'Digital-стратегия', 'SMM', 'Фото/Видео производство'],
    results: ['Увеличение онлайн-бронирования на 120%', 'Рост упоминаний в соцсетях на 200%', 'Увеличение среднего чека на 25%'],
    imageUrl: '/images/rest.jpg',
    galleryImages: [
      '/images/rest1.jpg',
      '/images/rest2.jpg'
    ]
  },
  {
    id: 3,
    title: 'SEO-продвижение и контекстная реклама для IT-компании',
    description: 'Комплексное продвижение IT-компании в поисковых системах и запуск эффективной контекстной рекламы.',
    client: 'TechSolutions Inc.',
    industry: 'IT и технологии',
    services: ['SEO-оптимизация', 'Контекстная реклама', 'Контент-маркетинг', 'Аналитика'],
    results: ['Рост органического трафика на 300% за 6 месяцев', 'Снижение стоимости лида на 40%', 'Увеличение конверсии на 2.5x'],
    imageUrl: '/images/it.jpg',
    galleryImages: [
      '/images/it1.jpg',
      '/images/it2.jpg'
    ]
  }
]

function App() {
  const handleViewDetails = (caseId: number) => {
    alert(`Переход к подробному описанию кейса ${caseId}`)
  }

  const handleOrder = (caseId: number) => {
    alert(`Заказ услуги для кейса ${caseId}. Наш менеджер свяжется с вами!`)
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Рекламное агентство AdPro</h1>
        <p>Наши лучшие работы - ваш успех</p>
      </header>

      <main className="portfolio-grid">
        {portfolioCases.map((caseItem) => (
          <PortfolioCase
            key={caseItem.id}
            title={caseItem.title}
            description={caseItem.description}
            client={caseItem.client}
            industry={caseItem.industry}
            services={caseItem.services}
            results={caseItem.results}
            imageUrl={caseItem.imageUrl}
            galleryImages={caseItem.galleryImages}
            onViewDetails={() => handleViewDetails(caseItem.id)}
            onOrder={() => handleOrder(caseItem.id)}
          />
        ))}
      </main>
    </div>
  )
}

export default App
