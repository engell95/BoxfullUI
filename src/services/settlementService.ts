import api from '@/lib/axios';

export interface SettlementSummary {
  totalToSettle: number;
  totalCollected: number;
  totalShippingCosts: number;
  totalCommissions: number;
  ordersCount: number;
}

export const settlementService = {
  /**
   * Obtiene el resumen de liquidación para el comercio actual
   */
  async getSummary(): Promise<SettlementSummary> {
    try {
      const response = await api.get('/settlement');
      return response.data;
    } catch (error) {
      console.error('Error fetching settlement summary:', error);
      throw error;
    }
  }
};
