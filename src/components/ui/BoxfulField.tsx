import React from 'react';
import { Form, Input, Typography, Space, Select, DatePicker } from 'antd';
import { Controller, Control, FieldValues, Path } from 'react-hook-form';
import { colors } from '@/config/theme';

const { Text } = Typography;

interface BoxfulFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  placeholder?: string;
  error?: string;
  type?: 'text' | 'password' | 'select' | 'date';
  required?: boolean;
  addonBefore?: React.ReactNode;
  options?: { label: string; value: string | number }[];
}

/**
 * Componente reutilizable para campos de formulario con el estilo de Boxful
 */
export function BoxfulField<T extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  error,
  type = 'text',
  required = false,
  addonBefore,
  options = [],
}: BoxfulFieldProps<T>) {
  const inputStyle = {
    borderRadius: 8,
    border: '1px solid #EDEDED',
    height: 45,
    fontSize: 14,
  };

  return (
    <Form.Item
      label={
        label ? (
          <Text strong style={{ fontSize: 12, color: colors.black }}>
            {label} {required && <span style={{ color: colors.primary }}>*</span>}
          </Text>
        ) : null
      }
      validateStatus={error ? 'error' : ''}
      help={error}
      style={{ marginBottom: 20 }}
    >
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          type === 'password' ? (
            <Input.Password
              {...field}
              placeholder={placeholder}
              style={inputStyle}
            />
          ) : type === 'select' ? (
            <Select
              {...field}
              placeholder={placeholder}
              options={options}
              style={{ ...inputStyle, width: '100%' }}
            />
          ) : type === 'date' ? (
            <DatePicker
              {...field}
              placeholder={placeholder}
              style={{ ...inputStyle, width: '100%' }}
              format="YYYY-MM-DD"
            />
          ) : (
            addonBefore ? (
              <Space.Compact style={{ width: '100%' }}>
                {addonBefore}
                <Input
                  {...field}
                  placeholder={placeholder}
                  style={{ ...inputStyle, borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                />
              </Space.Compact>
            ) : (
              <Input
                {...field}
                placeholder={placeholder}
                style={inputStyle}
              />
            )
          )
        )}
      />
    </Form.Item>
  );
}
