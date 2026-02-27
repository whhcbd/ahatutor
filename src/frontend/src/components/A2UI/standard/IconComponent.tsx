import React from 'react';

interface IconComponentProps {
  name?: string;
  color?: string;
  size?: number;
  className?: string;
}

export function IconComponent({
  name = 'error',
  color = '#F44336',
  size = 48,
  className = ''
}: IconComponentProps) {
  const getIcon = (iconName: string): string => {
    const icons: Record<string, string> = {
      error: '⚠️',
      warning: '⚠️',
      info: 'ℹ️',
      success: '✅',
      error_circle: '🔴',
      warning_circle: '🟡',
      info_circle: '🔵',
      success_circle: '🟢',
    };

    return icons[iconName] || icons.error;
  };

  const iconStyle: React.CSSProperties = {
    fontSize: `${size}px`,
    color: color,
    display: 'inline-block',
    textAlign: 'center',
  };

  return (
    <span className={`a2ui-icon ${className}`} style={iconStyle}>
      {getIcon(name)}
    </span>
  );
}