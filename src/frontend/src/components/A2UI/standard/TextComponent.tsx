import React from 'react';

export interface TextComponentProps {
  text?: string;
  style?: 'body' | 'heading1' | 'heading2' | 'heading3' | 'subtitle' | 'caption';
  color?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  align?: 'left' | 'center' | 'right';
  className?: string;
  children?: React.ReactNode;
}

export function TextComponent({
  text,
  style = 'body',
  color,
  size = 'md',
  weight = 'normal',
  align = 'left',
  className,
  children
}: TextComponentProps): React.ReactElement {
  const styleClasses = {
    heading1: 'text-4xl font-bold mb-4',
    heading2: 'text-3xl font-bold mb-3',
    heading3: 'text-2xl font-bold mb-2',
    subtitle: 'text-lg font-semibold mb-2',
    body: 'text-base',
    caption: 'text-sm text-gray-600'
  };

  const sizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl'
  };

  const weightClasses = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold'
  };

  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  };

  const classes = [
    'a2ui-text',
    styleClasses[style],
    sizeClasses[size],
    weightClasses[weight],
    alignClasses[align],
    className
  ].filter(Boolean).join(' ');

  const inlineStyle: React.CSSProperties = {};
  if (color) {
    inlineStyle.color = color;
  }

  return (
    <div className={classes} style={inlineStyle}>
      {children || text}
    </div>
  );
}
