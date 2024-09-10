'use client';

import clsx from 'clsx';
import { cva, VariantProps } from 'cva';
import { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

const buttonStyle = cva(
  [
    'inline-flex',
    'items-center',
    'justify-center',
    'relative',
    'cursor-pointer',
    'disabled:cursor-auto',
    'tracking-wide',
    'rounded-xl',
    'outline-none',
    'active:scale-[0.97]',
  ],
  {
    variants: {
      variant: {
        primary: [
          'font-semibold',
          'shadow',
          'hover:shadow-md',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
          'focus-visible:ring-2',
          'transition duration-200',
          'w-full',
        ],
        secondary: [
          'font-medium',
          'shadow shadow-night-850/50',
          'ring-offset-2',
          'focus-visible:ring-2',
        ],
        ghost: [
          'font-medium',
          'focus-visible:ring-2 focus-visible:ring-gray-600',
          'disabled:text-gray-700',
          'bg-night-950 hover:bg-night-925',
          'border-2 border-night-800 hover:border-night-700',
        ],
        link: [
          'font-medium',
          'disabled:no-underline',
          // 'hover:underline',
          'focus-visible:ring-1',
        ],
      },
      size: {
        small: ['text-sm', 'py-2', 'px-4'],
        medium: ['text-base', 'py-2', 'px-6'],
        large: ['text-base', 'py-4', 'px-12'],
        larger: ['text-lg', 'py-4', 'px-12'],
      },
      color: {
        night: [
          'bg-night-800',
          'hover:bg-night-750',
          'ring-night-500/70',
          'border-night-750 border-2 hover:border-night-700',
        ],
        light: [
          'bg-night-50',
          'hover:bg-night-100',
          'disabled:bg-night-100',
          'text-night-950',
          'border-night-500/20',
          'focus-visible:outline-night-500',
        ],
        red: [
          'bg-red-500',
          'hover:bg-red-600',
          'disabled:bg-red-500/50',
          'text-white',
          'ring-red-500',
        ],
        link: ['text-night-300 hover:text-night-100'],
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'medium',
      color: 'night',
    },
  },
);

const loading = cva(['absolute', 'inline-flex', 'items-center'], {
  variants: {
    variant: {
      primary: ['border-white'],
      secondary: ['border-gray-950'],
      destructive: ['border-white'],
      ghost: ['border-gray-950'],
      link: ['border-indigo-500'],
    },
  },
});
const Loading = ({ variant }: VariantProps<typeof loading>) => (
  <div className={loading({ variant })}>
    <div className="h-4 w-4 animate-spin rounded-full border-2 border-[inherit] border-b-transparent" />
  </div>
);

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonStyle> & {
    loading?: boolean;
    waiting?: boolean;
    isSubmitting?: boolean;
    asChild?: boolean;
  };

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      color,
      children,
      loading,
      waiting,
      isSubmitting,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        className={twMerge(
          clsx(buttonStyle({ variant, size, color, className }), {
            'opacity-50 hover:bg-inherit': loading,
            'animate-pulse cursor-auto': waiting,
          }),
        )}
        disabled={isSubmitting || waiting || loading}
        {...props}
      >
        {loading && <Loading variant={variant} />}
        <span
          className={clsx('transition', {
            'opacity-0': loading,
            'opacity-100': !loading,
          })}
        >
          {children}
        </span>
      </button>
    );
  },
);

Button.displayName = 'Button';
export default Button;
