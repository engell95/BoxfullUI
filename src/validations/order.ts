import * as yup from 'yup';

export const orderStep1Schema = yup.object().shape({
  direccionRecoleccion: yup.string().required('La dirección de recolección es requerida'),
  fechaProgramada: yup.date().nullable().required('La fecha es requerida'),
  nombres: yup.string().required('El nombre es requerido'),
  apellidos: yup.string().required('El apellido es requerido'),
  email: yup.string().email('Email inválido').required('El email es requerido'),
  telefono: yup.string().required('El teléfono es requerido'),
  direccionDestinatario: yup.string().required('La dirección de destino es requerida'),
  departamento: yup.string().required('El departamento es requerido'),
  municipio: yup.string().required('El municipio es requerido'),
  puntoReferencia: yup.string().optional(),
  indicaciones: yup.string().optional(),
  isCOD: yup.boolean().default(false),
  expectedAmount: yup.number()
    .transform((value, originalValue) => originalValue === '' ? 0 : value)
    .when('isCOD', {
      is: true,
      then: (schema) => schema.required('El monto es requerido').min(0.01, 'Monto inválido'),
      otherwise: (schema) => schema.optional().nullable(),
    }),
});

export const orderStep2Schema = yup.object().shape({
  productos: yup.array().of(
    yup.object().shape({
      largo: yup.string().required('Requerido'),
      alto: yup.string().required('Requerido'),
      ancho: yup.string().required('Requerido'),
      peso: yup.string().required('Requerido'),
      contenido: yup.string().required('Requerido'),
    })
  ).min(1, 'Agrega al menos un producto'),
});
