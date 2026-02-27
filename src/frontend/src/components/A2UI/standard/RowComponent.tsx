import React from 'react';

export interface RowComponentProps {
  children?: React.ReactNode;
  align?: 'start' | 'center' | 'end' | 'space-between' | 'space-around' | 'space-evenly';
  justify?: 'start' | 'center' | 'end' | 'space-between' | 'space-around' | 'space-evenly';
  gap?: '0' | '1' | '2' | '3' | '4' | '6' | '8';
  padding?: '0' | '2' | '4' | '6' | '8';
  className?: string;
}

export function RowComponent({
  children,
  align = 'center',
  justify = 'start',
  gap = '4',
  padding = '0',
  className
}: RowComponentProps): React.ReactElement {
  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    'space-between': 'items-center justify-between',
    'space-around': 'items-center justify-around',
    'space-evenly': 'items-center justify-evenly'
  };

  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    'space-between': 'justify-between',
    'space-around': 'justify-around',
    'space-evenly': 'justify-evenly'
  };

  const gapClasses = {
    '0': 'gap-0',
    '1': 'gap-1',
    '2': 'gap-2',
    '3': 'gap-3',
    '4': 'gap-4',
    '6': 'gap-6',
    '8': 'gap-8'
  };

  const paddingClasses = {
    '0': 'p-0',
    '2': 'p-2',
    '4': 'p-4',
    '6': 'p-6',
    '8': 'p-8'
  };

  const classes = [
    'a2ui-row',
    'flex',
    'flex-row',
    alignClasses[align],
    justifyClasses[justify],
    gapClasses[gap],
    paddingClasses[padding],
    'w-full',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      {children}
    </div>
  );
}
