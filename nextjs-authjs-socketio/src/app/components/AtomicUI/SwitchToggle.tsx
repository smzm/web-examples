'use client';
import * as Switch from '@radix-ui/react-switch';
import clsx from 'clsx';

export default function SwitchToggle() {
  return (
    <Switch.Root
      className={clsx(
        // Size and Shape
        'w-12 p-px',
        'rounded-full',
        'shadow-inner shadow-night-925/30',
        'duration-400 transition',
        // Color
        'bg-night-600',
        'data-[state=checked]:bg-night-100',
        // State : Active
        'active:bg-night-500 active:data-[state=checked]:bg-night-200',
        // State : Focus
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ',
        'focus-visible:outline-night-500',
      )}
    >
      <Switch.Thumb
        className={clsx(
          // Size and Shape
          'h-4 w-4',
          'block rounded-full',
          'duration-400 shadow-sm transition',
          'data-[state=checked]:translate-x-[27px] data-[state=unchecked]:translate-x-[4px]',
          // Color
          'data-[state=unchecked]:bg-night-925',
          ' data-[state=checked]:bg-night-800',
        )}
      />
    </Switch.Root>
  );
}
