import * as yup from 'yup';

export const orderStep1Schema = yup.object().shape({
  direccionRecoleccion: yup.string().required('Campo requerido'),
  fechaProgramada: yup.date().required('Campo requerido'),
  nombres: yup.string().required('Campo requerido'),
  apellidos: yup.string().required('Campo requerido'),
  email: yup.string().email('Inválido').required('Campo requerido'),
  telefono: yup.string().required('Campo requerido'),
  direccionDestinatario: yup.string().required('Campo requerido'),
  departamento: yup.string().required('Campo requerido'),
  municipio: yup.string().required('Campo requerido'),
  puntoReferencia: yup.string().required('Campo requerido'),
  indicaciones: yup.string(),
  isCOD: yup.boolean().default(false),
  expectedAmount: yup.number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .when('isCOD', {
      is: true,
      then: (schema) => schema.required('El monto es requerido cuando PCE está activo').min(0.01, 'Monto inválido'),
      otherwise: (schema) => schema.optional().nullable(),
    }),
});

export const orderStep2Schema = yup.object().shape({
  productos: yup.array().of(
    yup.object().shape({
      largo: yup.string().required(),
      alto: yup.string().required(),
      ancho: yup.string().required(),
      peso: yup.string().required(),
      contenido: yup.string().required(),
    })
  ).min(1, 'Agrega al menos un producto'),
});
