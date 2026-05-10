export interface Product {
  id?: string;
  largo: string;
  alto: string;
  ancho: string;
  peso: string;
  contenido: string;
}

export interface OrderAddress {
  direccion: string;
  departamento: string;
  municipio: string;
  puntoReferencia?: string;
  indicaciones?: string;
}

export interface Recipient {
  nombres: string;
  apellidos: string;
  email: string;
  telefono: string;
}

export interface Order {
  id?: string;
  orderNo?: string;
  recoleccion: {
    direccion: string;
    fecha: string;
  };
  destinatario: Recipient & { direccion: OrderAddress };
  productos: Product[];
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
  createdAt?: string;
}

export interface OrderResponse {
  success: boolean;
  order?: Order;
  message?: string;
}
