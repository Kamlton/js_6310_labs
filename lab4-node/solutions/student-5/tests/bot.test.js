// tests/bot.test.js
import { describe, it, expect, beforeEach } from '@jest/globals';
import { userStates, handleMessage } from '../src/bot.js';

// Mock Telegram Bot
function createMockBot() {
  const calls = [];
  return {
    sendMessage: (chatId, message) => {
      calls.push({ chatId, message });
    },
    getCalls: () => calls,
    getLastCall: () => calls[calls.length - 1]
  };
}

describe('AdPro Bot', () => {
  beforeEach(() => {
    userStates.clear();
  });

  describe('Campaign Creation', () => {
    it('should start campaign creation', () => {
      const mockBot = createMockBot();
      const msg = { chat: { id: 123 }, text: '/create_campaign' };
      
      handleMessage(mockBot, msg, 'create_campaign');
      
      expect(userStates.get(123).state).toBe('awaiting_name');
      expect(mockBot.getCalls().length).toBeGreaterThan(0);
    });

    it('should handle campaign name', () => {
      const mockBot = createMockBot();
      userStates.set(123, { state: 'awaiting_name', data: {} });
      const msg = { chat: { id: 123 }, text: 'Summer Sale' };
      
      handleMessage(mockBot, msg);
      
      expect(userStates.get(123).state).toBe('awaiting_services');
      expect(userStates.get(123).data.name).toBe('Summer Sale');
    });

    it('should reject short campaign name', () => {
      const mockBot = createMockBot();
      userStates.set(123, { state: 'awaiting_name', data: {} });
      const msg = { chat: { id: 123 }, text: 'A' };
      
      handleMessage(mockBot, msg);
      
      expect(mockBot.getLastCall().message).toContain('❌');
    });

    it('should validate budget correctly', () => {
      const mockBot = createMockBot();
      userStates.set(123, { 
        state: 'awaiting_budget', 
        data: { name: 'Test', selectedServices: [] } 
      });
      const msg = { chat: { id: 123 }, text: 'invalid' };
      
      handleMessage(mockBot, msg);
      
      expect(mockBot.getLastCall().message).toContain('❌');
    });

    it('should reject budget less than services cost', () => {
      const mockBot = createMockBot();
      userStates.set(123, { 
        state: 'awaiting_budget', 
        data: { 
          name: 'Test', 
          selectedServices: [{ name: 'SMM', price: 20000 }] 
        } 
      });
      const msg = { chat: { id: 123 }, text: '10000' };
      
      handleMessage(mockBot, msg);
      
      expect(mockBot.getLastCall().message).toContain('❌');
    });

    it('should accept valid budget', () => {
      const mockBot = createMockBot();
      userStates.set(123, { 
        state: 'awaiting_budget', 
        data: { 
          name: 'Test', 
          selectedServices: [{ name: 'SMM', price: 20000 }] 
        } 
      });
      const msg = { chat: { id: 123 }, text: '50000' };
      
      handleMessage(mockBot, msg);
      
      expect(userStates.get(123).state).toBe('awaiting_audience');
      expect(userStates.get(123).data.budget).toBe(50000);
    });
  });

  describe('Services Selection', () => {
    it('should handle services selection', () => {
      const mockBot = createMockBot();
      userStates.set(123, { 
        state: 'awaiting_services', 
        data: { name: 'Test Campaign', selectedServices: [] }
      });
      const msg = { chat: { id: 123 }, text: 'Контекстная реклама' };
      
      handleMessage(mockBot, msg);
      
      expect(userStates.get(123).data.selectedServices.length).toBe(1);
      expect(userStates.get(123).data.selectedServices[0].name).toBe('Контекстная реклама');
    });

    it('should reject duplicate service selection', () => {
      const mockBot = createMockBot();
      userStates.set(123, { 
        state: 'awaiting_services', 
        data: { 
          name: 'Test Campaign', 
          selectedServices: [{ name: 'Контекстная реклама', price: 15000 }] 
        }
      });
      const msg = { chat: { id: 123 }, text: 'Контекстная реклама' };
      
      handleMessage(mockBot, msg);
      
      expect(mockBot.getLastCall().message).toContain('❌');
    });

    it('should reject unknown service', () => {
      const mockBot = createMockBot();
      userStates.set(123, { 
        state: 'awaiting_services', 
        data: { name: 'Test Campaign', selectedServices: [] }
      });
      const msg = { chat: { id: 123 }, text: 'Неизвестная услуга' };
      
      handleMessage(mockBot, msg);
      
      expect(mockBot.getLastCall().message).toContain('❌');
    });

    it('should complete services selection', () => {
      const mockBot = createMockBot();
      userStates.set(123, { 
        state: 'awaiting_services', 
        data: { 
          name: 'Test Campaign', 
          selectedServices: [{ name: 'SMM', price: 20000 }] 
        }
      });
      const msg = { chat: { id: 123 }, text: '✅ Завершить выбор услуг' };
      
      handleMessage(mockBot, msg);
      
      expect(userStates.get(123).state).toBe('awaiting_budget');
    });

    it('should reject empty services selection', () => {
      const mockBot = createMockBot();
      userStates.set(123, { 
        state: 'awaiting_services', 
        data: { name: 'Test Campaign', selectedServices: [] }
      });
      const msg = { chat: { id: 123 }, text: '✅ Завершить выбор услуг' };
      
      handleMessage(mockBot, msg);
      
      expect(mockBot.getLastCall().message).toContain('❌');
    });
  });

  describe('Audience Selection', () => {
    it('should handle valid audience selection', () => {
      const mockBot = createMockBot();
      userStates.set(123, { 
        state: 'awaiting_audience', 
        data: { name: 'Test', selectedServices: [], budget: 50000 }
      });
      const msg = { chat: { id: 123 }, text: 'Молодежь (18-24)' };
      
      handleMessage(mockBot, msg);
      
      expect(userStates.get(123).state).toBe('awaiting_platforms');
      expect(userStates.get(123).data.audience).toBe('Молодежь (18-24)');
    });

    it('should reject invalid audience', () => {
      const mockBot = createMockBot();
      userStates.set(123, { 
        state: 'awaiting_audience', 
        data: { name: 'Test', selectedServices: [], budget: 50000 }
      });
      const msg = { chat: { id: 123 }, text: 'Неизвестная аудитория' };
      
      handleMessage(mockBot, msg);
      
      expect(mockBot.getLastCall().message).toContain('❌');
    });
  });

  describe('Platforms Selection', () => {
    it('should complete campaign creation', () => {
      const mockBot = createMockBot();
      userStates.set(123, { 
        state: 'awaiting_platforms', 
        data: { 
          name: 'Test Campaign',
          budget: 50000,
          audience: 'Молодежь (18-24)',
          selectedServices: [{ name: 'SMM', price: 20000 }]
        }
      });
      const msg = { chat: { id: 123 }, text: 'Instagram, TikTok' };
      
      handleMessage(mockBot, msg);
      
      expect(userStates.get(123).state).toBe('idle');
      expect(mockBot.getLastCall().message).toContain('✅ Кампания создана');
    });
  });

  describe('Analytics', () => {
    it('should show analytics report', () => {
      const mockBot = createMockBot();
      const msg = { chat: { id: 123 }, text: '/analytics' };
      
      handleMessage(mockBot, msg, 'analytics');
      
      expect(mockBot.getCalls().length).toBeGreaterThan(0);
      const message = mockBot.getCalls()[0].message;
      expect(message).toContain('АНАЛИТИКА ADPRO');
    });
  });

  describe('Unknown Commands', () => {
    it('should ignore unknown commands in idle state', () => {
      const mockBot = createMockBot();
      userStates.set(123, { state: 'idle', data: {} });
      const msg = { chat: { id: 123 }, text: 'random message' };
      
      handleMessage(mockBot, msg);
      
      expect(mockBot.getCalls().length).toBe(0);
    });
  });
});