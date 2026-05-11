import api from '@/lib/axios';

export interface LocationItem {
  id: string;
  name: string;
}

class LocationService {
  /**
   * Obtiene la lista de departamentos
   */
  async getDepartments(): Promise<LocationItem[]> {
    try {
      const response = await api.get('/locations/departments');
      return response.data;
    } catch (error) {
      console.error('Error fetching departments:', error);
      throw error;
    }
  }

  /**
   * Obtiene la lista de municipios de un departamento
   */
  async getMunicipalities(departmentId: string): Promise<LocationItem[]> {
    try {
      const response = await api.get(`/locations/departments/${departmentId}/municipalities`);
      return response.data;
    } catch (error) {
      console.error('Error fetching municipalities:', error);
      throw error;
    }
  }
}

export const locationService = new LocationService();
