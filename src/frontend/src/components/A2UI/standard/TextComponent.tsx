interface TextComponentProps {
  content: string;
  variant?: 'heading' | 'subheading' | 'body' | 'caption' | 'small';
  className?: string;
}

export function TextComponent({ content, variant = 'body', className = '' }: TextComponentProps) {
  const variantClasses: Record<string, string> = {
    heading: 'text-2xl font-bold text-gray-900',
    subheading: 'text-lg font-semibold text-gray-800',
    body: 'text-sm text-gray-700 leading-relaxed',
    caption: 'text-xs text-gray-600',
    small: 'text-xs text-gray-500',
  };

  return (
    <p className={`${variantClasses[variant]} ${className}`}>
      {content}
    </p>
  );
}
