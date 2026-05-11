export interface Package {
  content: string;
  weightInLbs: number;
  width: number;
  height: number;
  length: number;
}

export enum OrderStatus {
  PENDING = 'PENDING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

export interface Order {
  id?: string;
  orderNo?: string;
  userId?: string;
  companyId?: string;
  pickupAddress: string;
  recipientFirstName: string;
  recipientLastName: string;
  recipientEmail: string;
  recipientPhone: string;
  recipientAddress: string;
  recipientMunicipality: string;
  recipientDepartment: string;
  deliveryDate: string | Date;
  instructions?: string;
  isCOD: boolean;
  expectedAmount?: number;
  realAmount?: number;
  packages: Package[];
  createdAt?: string;
}

export interface OrderResponse {
  success: boolean;
  order?: Order;
  message?: string;
}
