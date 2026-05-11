import api from '@/lib/axios';
import { Order, OrderResponse } from '@/models/order.model';

export interface OrderFilters {
  status?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
  page?: number;
  limit?: number;
}

class OrderService {
  /**
   * Obtiene la lista de órdenes con filtros opcionales
   */
  async getOrders(filters?: OrderFilters): Promise<Order[]> {
    try {
      const params = new URLSearchParams();
      if (filters) {
        if (filters.status) params.append('status', filters.status);
        if (filters.startDate) params.append('startDate', filters.startDate);
        if (filters.endDate) params.append('endDate', filters.endDate);
        if (filters.search) params.append('search', filters.search);
        if (filters.page) params.append('page', filters.page.toString());
        if (filters.limit) params.append('limit', filters.limit.toString());
      }

      const response = await api.get(`/orders?${params.toString()}`);
      return response.data?.data;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  }

  /**
   * Crea una nueva orden
   */
  async createOrder(orderData: Partial<Order>): Promise<Order> {
    try {
      const response = await api.post('/orders', orderData);
      return response.data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  /**
   * Obtiene el detalle de una orden por ID
   */
  async getOrderById(id: string): Promise<Order> {
    try {
      const response = await api.get(`/orders/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching order detail:', error);
      throw error;
    }
  }

  /**
   * Exporta las órdenes seleccionadas a CSV
   */
  async exportOrders(ids?: string[]): Promise<Blob> {
    try {
      const query = ids && ids.length > 0 ? `?ids=${ids.join(',')}` : '';
      const response = await api.get(`/orders/export/csv${query}`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error exporting orders:', error);
      throw error;
    }
  }
}

export const orderService = new OrderService();
