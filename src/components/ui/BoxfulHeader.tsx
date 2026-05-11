import React from 'react';
import { Typography } from 'antd';
import { colors } from '@/config/theme';

const { Title, Text } = Typography;

interface BoxfulHeaderProps {
  title: string;
  subtitle?: string;
  titleLevel?: 1 | 2 | 3 | 4 | 5;
  marginBottom?: number;
}

/**
 * Componente reutilizable para los encabezados de página (Título + Subtítulo)
 */
const BoxfulHeader: React.FC<BoxfulHeaderProps> = ({ 
  title, 
  subtitle, 
  titleLevel = 2,
  marginBottom = 40 
}) => {
  return (
    <div style={{ marginBottom }}>
      <Title 
        level={titleLevel} 
        style={{ 
          fontWeight: 800, 
          marginBottom: subtitle ? 8 : 0, 
          fontSize: titleLevel === 2 ? 24 : undefined,
          marginTop: 0
        }}
      >
        {title}
      </Title>
      {subtitle && (
        <Text 
          style={{ 
            fontSize: 14, 
            color: colors.black, 
            display: 'block',
            lineHeight: '1.5'
          }}
        >
          {subtitle}
        </Text>
      )}
    </div>
  );
};

export default BoxfulHeader;
