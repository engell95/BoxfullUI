import * as yup from 'yup';

export const loginSchema = yup.object().shape({
  email: yup.string().email('Email inválido').required('El email es requerido'),
  password: yup.string().required('La contraseña es requerida'),
});

export const registerSchema = yup.object().shape({
  nombre: yup.string().required('El nombre es requerido'),
  apellido: yup.string().required('El apellido es requerido'),
  sexo: yup.string().required('Selecciona tu sexo'),
  fechaNacimiento: yup.date().required('La fecha es requerida'),
  email: yup.string().email('Email inválido').required('El email es requerido'),
  whatsapp: yup.string().required('El número es requerido'),
  password: yup.string().min(6, 'Mínimo 6 caracteres').required('La contraseña es requerida'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], 'Las contraseñas no coinciden')
    .required('Repetir contraseña es requerido'),
});
