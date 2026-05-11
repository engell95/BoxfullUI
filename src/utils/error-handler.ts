/**
 * Interfaz para respuestas de error siguiendo el estándar RFC 9457
 * (Problem Details for HTTP APIs)
 */
export interface ProblemDetails {
  type?: string;
  title: string;
  status: number;
  detail: string;
  instance?: string;
  timestamp?: string;
  // Campos adicionales para errores de validación, etc.
  errors?: Record<string, string[] | string>;
  [key: string]: any;
}

/**
 * Utilidad para extraer el mensaje de error de una respuesta RFC 9457 o estándar
 */
export const getErrorMessage = (error: any): string => {
  const data = error.response?.data as ProblemDetails;
  
  if (data) {
    // Prioridad: detail -> title -> message (fallback para errores no RFC)
    return data.detail || data.title || data.message || 'Ocurrió un error inesperado';
  }
  
  return error.message || 'Error de conexión con el servidor';
};
