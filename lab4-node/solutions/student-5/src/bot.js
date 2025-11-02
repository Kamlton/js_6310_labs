import { BOT_STATES } from './states.js';


export const userStates = new Map();

const SERVICES = {
  context_ads: { name: 'Контекстная реклама', basePrice: 15000, description: 'Настройка Яндекс.Директ и Google Ads' },
  smm: { name: 'SMM продвижение', basePrice: 20000, description: 'Ведение соцсетей и контент-стратегия' },
  seo: { name: 'SEO оптимизация', basePrice: 30000, description: 'Поисковая оптимизация сайта' },
  web_design: { name: 'Веб-дизайн', basePrice: 25000, description: 'Создание дизайна сайта или лендинга' }
};

export function handleMessage(bot, msg, command = null) {
  const chatId = msg.chat.id;
  const text = msg.text;
  const userState = userStates.get(chatId) || { state: BOT_STATES.IDLE, data: {} };

  if (command === 'create_campaign') {
    startCampaignCreation(bot, chatId);
    return;
  }

  if (command === 'analytics') {
    showAnalytics(bot, chatId);
    return;
  }


  switch (userState.state) {
  case BOT_STATES.AWAITING_CAMPAIGN_NAME:
    handleCampaignName(bot, chatId, text);
    break;
    
  case BOT_STATES.AWAITING_SERVICES:
    handleServicesSelection(bot, chatId, text);
    break;
    
  case BOT_STATES.AWAITING_BUDGET:
    handleBudget(bot, chatId, text);
    break;
    
  case BOT_STATES.AWAITING_AUDIENCE:
    handleAudience(bot, chatId, text);
    break;
    
  case BOT_STATES.AWAITING_PLATFORMS:
    handlePlatforms(bot, chatId, text);
    break;
  }
}

function startCampaignCreation(bot, chatId) {
  userStates.set(chatId, { 
    state: BOT_STATES.AWAITING_CAMPAIGN_NAME, 
    data: { selectedServices: [] }
  });
  bot.sendMessage(chatId, '🎪 Введите название рекламной кампании:');
}

function handleCampaignName(bot, chatId, name) {
  if (!name || name.length < 2) {
    bot.sendMessage(chatId, '❌ Название должно быть не короче 2 символов.');
    return;
  }

  const userState = userStates.get(chatId);
  userState.data.name = name;
  userState.state = BOT_STATES.AWAITING_SERVICES;
  userStates.set(chatId, userState);

  showServicesKeyboard(bot, chatId);
}

function showServicesKeyboard(bot, chatId) {
  const servicesList = Object.values(SERVICES).map(service => 
    `${service.name} - ${service.basePrice.toLocaleString()} ₽`
  ).join('\n');

  const keyboard = {
    reply_markup: {
      keyboard: [
        ['Контекстная реклама', 'SMM продвижение'],
        ['SEO оптимизация', 'Веб-дизайн'],
        ['✅ Завершить выбор услуг']
      ],
      one_time_keyboard: true
    }
  };

  const message = `
💰 ВЫБЕРИТЕ УСЛУГИ ДЛЯ КАМПАНИИ:

${servicesList}

Выбирайте услуги по одной, затем нажмите "✅ Завершить выбор услуг"
  `;

  bot.sendMessage(chatId, message.trim(), keyboard);
}

function handleServicesSelection(bot, chatId, serviceName) {
  const userState = userStates.get(chatId);

  if (serviceName === '✅ Завершить выбор услуг') {
    if (userState.data.selectedServices.length === 0) {
      bot.sendMessage(chatId, '❌ Выберите хотя бы одну услугу!');
      return;
    }
    
    userState.state = BOT_STATES.AWAITING_BUDGET;
    userStates.set(chatId, userState);
    
    const total = calculateTotalPrice(userState.data.selectedServices);
    const servicesText = userState.data.selectedServices.map(service => 
      `• ${service.name} - ${service.price.toLocaleString()} ₽`
    ).join('\n');
    
    const budgetMessage = `
✅ Выбранные услуги:
${servicesText}

💰 Общая стоимость: ${total.toLocaleString()} ₽

💵 Введите бюджет кампании (рекомендуется от ${total.toLocaleString()} ₽):
    `;
    
    bot.sendMessage(chatId, budgetMessage.trim());
    return;
  }


  const selectedService = Object.values(SERVICES).find(service => service.name === serviceName);
  
  if (!selectedService) {
    bot.sendMessage(chatId, '❌ Услуга не найдена. Выберите из списка.');
    return;
  }


  const alreadySelected = userState.data.selectedServices.find(s => s.name === serviceName);
  if (alreadySelected) {
    bot.sendMessage(chatId, `❌ Услуга "${serviceName}" уже выбрана!`);
    return;
  }


  userState.data.selectedServices.push({
    id: Object.keys(SERVICES).find(key => SERVICES[key].name === serviceName),
    name: selectedService.name,
    price: selectedService.basePrice
  });

  userStates.set(chatId, userState);

  const selectedCount = userState.data.selectedServices.length;
  const total = calculateTotalPrice(userState.data.selectedServices);
  
  bot.sendMessage(chatId, 
    `✅ Добавлено: ${serviceName}\n` +
    `📊 Выбрано услуг: ${selectedCount}\n` +
    `💰 Текущая сумма: ${total.toLocaleString()} ₽\n\n` +
    'Продолжайте выбор или нажмите "✅ Завершить выбор услуг"'
  );
}

function calculateTotalPrice(services) {
  return services.reduce((total, service) => total + service.price, 0);
}

function handleBudget(bot, chatId, budgetText) {
  const budget = parseInt(budgetText);
  const userState = userStates.get(chatId);
  const servicesTotal = calculateTotalPrice(userState.data.selectedServices);
  
  if (isNaN(budget) || budget <= 0) {
    bot.sendMessage(chatId, '❌ Введите корректную сумму бюджета.');
    return;
  }

  if (budget < servicesTotal) {
    bot.sendMessage(chatId, 
      `❌ Бюджет слишком мал! Минимум: ${servicesTotal.toLocaleString()} ₽\n` +
      `(стоимость выбранных услуг: ${servicesTotal.toLocaleString()} ₽)`
    );
    return;
  }

  userState.data.budget = budget;
  userState.state = BOT_STATES.AWAITING_AUDIENCE;
  userStates.set(chatId, userState);

  const keyboard = {
    reply_markup: {
      keyboard: [
        ['Молодежь (18-24)', 'Взрослые (25-40)'],
        ['Семейные (30-45)', 'Бизнес (35-55)']
      ],
      one_time_keyboard: true
    }
  };

  bot.sendMessage(chatId, '🎯 Выберите целевую аудиторию:', keyboard);
}

function handleAudience(bot, chatId, audience) {
  const validAudiences = ['Молодежь (18-24)', 'Взрослые (25-40)', 'Семейные (30-45)', 'Бизнес (35-55)'];
  if (!validAudiences.includes(audience)) {
    bot.sendMessage(chatId, '❌ Выберите аудиторию из предложенных вариантов.');
    return;
  }

  const userState = userStates.get(chatId);
  userState.data.audience = audience;
  userState.state = BOT_STATES.AWAITING_PLATFORMS;
  userStates.set(chatId, userState);

  const keyboard = {
    reply_markup: {
      keyboard: [
        ['Instagram, TikTok', 'VK, YouTube'],
        ['Все платформы', 'Telegram, Facebook']
      ],
      one_time_keyboard: true
    }
  };

  bot.sendMessage(chatId, '📱 Выберите рекламные площадки:', keyboard);
}

function handlePlatforms(bot, chatId, platforms) {
  const userState = userStates.get(chatId);
  userState.data.platforms = platforms;
  
  // Расчет результатов с учетом выбранных услуг
  const calculation = calculateCampaignResults(userState.data);
  
  const servicesText = userState.data.selectedServices.map(service => 
    `• ${service.name} - ${service.price.toLocaleString()} ₽`
  ).join('\n');

  const summary = `
✅ Кампания создана!

📝 Название: ${userState.data.name}

💰 ФИНАНСЫ:
Бюджет: ${userState.data.budget.toLocaleString()} руб.
Стоимость услуг: ${calculation.servicesTotal.toLocaleString()} руб.
На медиапокупки: ${calculation.mediaBudget.toLocaleString()} руб.

🛠 ВЫБРАННЫЕ УСЛУГИ:
${servicesText}

🎯 ПАРАМЕТРЫ:
Аудитория: ${userState.data.audience}
Площадки: ${userState.data.platforms}

📊 ПРОГНОЗ РЕЗУЛЬТАТОВ:
👥 Охват: ~${calculation.estimatedReach.toLocaleString()} чел.
💬 Клики: ~${calculation.estimatedClicks.toLocaleString()}
🎯 CTR: ${calculation.ctr}%
💰 CPC: ~${calculation.cpc} руб.

Для аналитики: /analytics
  `;

  bot.sendMessage(chatId, summary.trim(), { reply_markup: { remove_keyboard: true } });
  
  // Сброс состояния
  userStates.set(chatId, { state: BOT_STATES.IDLE, data: {} });
}

function calculateCampaignResults(campaignData) {
  const servicesTotal = calculateTotalPrice(campaignData.selectedServices);
  const mediaBudget = campaignData.budget - servicesTotal;
  
  const multipliers = {
    'Молодежь (18-24)': { reach: 1.3, ctr: 0.045, cpc: 35 },
    'Взрослые (25-40)': { reach: 1.0, ctr: 0.038, cpc: 45 },
    'Семейные (30-45)': { reach: 0.9, ctr: 0.032, cpc: 40 },
    'Бизнес (35-55)': { reach: 1.2, ctr: 0.028, cpc: 65 }
  };
  
  const multiplier = multipliers[campaignData.audience] || multipliers['Взрослые (25-40)'];
  const estimatedReach = Math.floor((mediaBudget / 150) * 1000 * multiplier.reach);
  const estimatedClicks = Math.floor(estimatedReach * multiplier.ctr);
  const cpc = multiplier.cpc;
  
  return {
    servicesTotal,
    mediaBudget,
    estimatedReach,
    estimatedClicks,
    ctr: (multiplier.ctr * 100).toFixed(1),
    cpc: cpc
  };
}

function showAnalytics(bot, chatId) {
  const report = generateAnalyticsReport();
  
  const analyticsMessage = `
📊 АНАЛИТИКА ADPRO
──────────────────

📈 ОБЩАЯ СТАТИСТИКА
• Активных кампаний: ${report.activeCampaigns}
• Завершенных проектов: ${report.completedCampaigns}
• Общий бюджет: ${report.totalBudget.toLocaleString()} ₽
• Средний ROI: ${report.averageROI}%
• Общий охват: ${report.totalReach.toLocaleString()} чел.

🏆 ТОП КАМПАНИИ ПО ЭФФЕКТИВНОСТИ
1. "${report.topCampaigns[0].name}"
   CTR: ${report.topCampaigns[0].ctr}% | ROI: ${report.topCampaigns[0].roi}%

2. "${report.topCampaigns[1].name}"  
   CTR: ${report.topCampaigns[1].ctr}% | ROI: ${report.topCampaigns[1].roi}%

3. "${report.topCampaigns[2].name}"
   CTR: ${report.topCampaigns[2].ctr}% | ROI: ${report.topCampaigns[2].roi}%

📱 ЭФФЕКТИВНОСТЬ ПО ПЛАТФОРМАМ
• Instagram: CTR ${report.platforms.instagram.ctr}% | Цена клика ${report.platforms.instagram.cpc} ₽
• TikTok: CTR ${report.platforms.tiktok.ctr}% | Цена клика ${report.platforms.tiktok.cpc} ₽
• VK: CTR ${report.platforms.vk.ctr}% | Цена клика ${report.platforms.vk.cpc} ₽

🎯 ЦЕЛЕВЫЕ АУДИТОРИИ
• Молодежь (18-24): Конверсия ${report.audiences.youth.conversion}% | CPA ${report.audiences.youth.cpa} ₽
• Взрослые (25-40): Конверсия ${report.audiences.adults.conversion}% | CPA ${report.audiences.adults.cpa} ₽
• Бизнес: Конверсия ${report.audiences.business.conversion}% | CPA ${report.audiences.business.cpa} ₽

💡 РЕКОМЕНДАЦИИ
${report.recommendations.join('\n• ')}

Для создания новой кампании: /create_campaign
  `;

  bot.sendMessage(chatId, analyticsMessage.trim());
}

function generateAnalyticsReport() {
  return {
    activeCampaigns: 12,
    completedCampaigns: 45,
    totalBudget: 2850000,
    averageROI: 240,
    totalReach: 5230000,
    topCampaigns: [
      { name: 'Black Friday 2024', ctr: '4.8', roi: 320 },
      { name: 'Summer Collection', ctr: '4.2', roi: 280 },
      { name: 'New Product Launch', ctr: '3.9', roi: 260 }
    ],
    platforms: {
      instagram: { ctr: '4.1', cpc: 45 },
      tiktok: { ctr: '3.8', cpc: 38 },
      vk: { ctr: '2.9', cpc: 28 }
    },
    audiences: {
      youth: { conversion: '4.5', cpa: 1200 },
      adults: { conversion: '3.2', cpa: 1800 },
      business: { conversion: '2.1', cpa: 3500 }
    },
    recommendations: [
      '🎯 Увеличить бюджет для кампании "Black Friday" на 25%',
      '📱 Тестировать видео-формат в TikTok для молодежной аудитории',
      '💡 Добавить ретаргетинг для повышения конверсии на 15%',
      '🕒 Оптимизировать время публикации для вечернего охвата',
      '🎨 Протестировать новые креативы для аудитории 25-40 лет'
    ]
  };
}