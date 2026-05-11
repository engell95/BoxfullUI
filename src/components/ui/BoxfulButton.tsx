import React from 'react';
import { Button, ButtonProps } from 'antd';
import { colors } from '@/config/theme';

interface BoxfulButtonProps extends Omit<ButtonProps, 'type' | 'size' | 'variant'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'middle' | 'large';
  children: React.ReactNode;
  fullWidth?: boolean;
}

/**
 * Componente de botón reutilizable con los estilos de Boxful
 */
const BoxfulButton: React.FC<BoxfulButtonProps> = ({ 
  variant = 'primary', 
  size = 'middle', 
  children, 
  fullWidth = true,
  style,
  ...props 
}) => {
  
  // Configuración de colores según variante
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: 'var(--color-bg-pattern)',
          borderColor: 'var(--color-bg-pattern)',
          color: '#fff',
        };
      case 'secondary':
        return {
          backgroundColor: 'var(--color-border-button)',
          borderColor: 'var(--color-border-button)',
          color: '#fff',
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderColor: 'var(--color-border-button)',
          color: 'var(--color-border-button)',
        };
      case 'danger':
        return {
          backgroundColor: 'var(--color-error)',
          borderColor: 'var(--color-error)',
          color: '#fff',
        };
      default:
        return {};
    }
  };

  const customStyle: React.CSSProperties = {
    height: size === 'large' ? 50 : 45,
    borderRadius: 8,
    fontSize: size === 'large' ? 16 : 14,
    fontWeight: size === 'large' ? 600 : 700,
    textTransform: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: fullWidth ? '100%' : 'auto',
    ...getVariantStyles(),
    ...style
  };

  return (
    <Button 
      {...props} 
      style={customStyle}
    >
      {children}
    </Button>
  );
};

export default BoxfulButton;
