import api from '@/lib/axios';
import { Order, OrderResponse } from '@/models/order.model';

class OrderService {
  /**
   * Obtiene la lista de órdenes del usuario
   */
  async getOrders(): Promise<Order[]> {
    try {
      const response = await api.get('/orders');
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
