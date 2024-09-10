'use client';
import { EyeOff, EyeOn } from '@/app/components/icons/Eye';
import clsx from 'clsx';
import { VariantProps, cva } from 'cva';
import { HTMLAttributes, useEffect, useState } from 'react';
import { Control, useWatch } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

const labelStyle = cva(
  ['mx-3 mb-2 font-semibold leading-loose tracking-wider text-gray-400'],
  {
    variants: {
      labelSize: {
        large: ['text-[1.1rem]'],
        medium: ['text-[1rem]'],
        small: ['text-[0.9rem]'],
      },
    },
    defaultVariants: {
      labelSize: 'medium',
    },
  },
);

const inputFieldStyle = cva(
  [
    'rounded-2xl w-full border-2 border-night-850 bg-night-925 px-4 py-2 text-night-100 placeholder-night-600 placeholder:font-medium focus:outline-none focus:border-night-750 box-border leading-loose tracking-wider transition font-medium text-lg',
  ],
  {
    variants: {
      size: { md: 'py-5 px-2 text-sm' },
    },
  },
);

type InputFieldProps = HTMLAttributes<HTMLInputElement> &
  VariantProps<typeof inputFieldStyle> &
  VariantProps<typeof labelStyle> & {
    placeholder?: string;
    label?: string;
    register: any;
    errors: any;
    name: string;
    disabled?: boolean;
    onChangeCallback?: () => void;
  };

//* === Text Field === *//
export function InputField({
  className,
  size = 'md',
  label,
  name,
  placeholder,
  register,
  errors,
  onChangeCallback,
  disabled,
  labelSize,
  ...rest
}: InputFieldProps) {
  const [error, setError] = useState<any>('');
  const [hasError, setHasError] = useState(false);
  useEffect(() => {
    if (!errors[name]) return;
    setError(errors[name].message);
    setHasError(true);
  }, [errors, name]);

  return (
    <div className="relative w-full">
      <p className={twMerge(clsx(labelStyle({ labelSize })))}>{label}</p>
      <div className="relative overflow-hidden">
        <ShowError error={error} hasError={hasError} />
        <div className="flex w-full">
          <input
            className={inputFieldStyle({ size, className })}
            placeholder={placeholder}
            name={name}
            {...register(name, {
              onChange: () => {
                setHasError(false);
                onChangeCallback && onChangeCallback();
              },
            })}
            disabled={disabled}
            {...rest}
          />
        </div>
      </div>
    </div>
  );
}

//* === Password Field === *//
type PasswordFieldProps = HTMLAttributes<HTMLInputElement> &
  VariantProps<typeof inputFieldStyle> &
  VariantProps<typeof labelStyle> & {
    placeholder?: string;
    label?: string;
    register: any;
    errors: any;
    name?: string;
    control: any;
    passwordStrengthMeter?: boolean;
    disabled?: boolean;
    onChangeCallback?: () => void;
  };
export function PasswordField({
  className,
  size = 'md',
  label,
  name = 'password',
  placeholder,
  register,
  control,
  errors,
  passwordStrengthMeter = true,
  disabled,
  labelSize,
  onChangeCallback,
  ...rest
}: PasswordFieldProps) {
  const [error, setError] = useState<any>('');
  const [hasError, setHasError] = useState(false);
  useEffect(() => {
    if (!errors[name]) return;
    setError(errors[name].message);
    setHasError(true);
  }, [errors, name]);

  const [type, setType] = useState('password');
  const [icon, setIcon] = useState(() => EyeOff);

  const handleToggle = () => {
    if (type === 'password') {
      setIcon(EyeOn);
      setType('text');
    } else {
      setIcon(EyeOff);
      setType('password');
    }
  };

  return (
    <div className="relative my-4">
      <p className={twMerge(clsx(labelStyle({ labelSize })))}>{label}</p>
      <div className="relative overflow-hidden">
        <ShowError error={error} hasError={hasError} />
        <div className="flex w-full">
          <input
            className={inputFieldStyle({ size, className })}
            type={type}
            autoComplete="current-password"
            placeholder={placeholder}
            {...register(name, {
              onChange: () => {
                setHasError(false);
                onChangeCallback && onChangeCallback();
              },
            })}
            disabled={disabled}
            {...rest}
          />

          <span
            onClick={handleToggle}
            className="z-10 flex items-center justify-around"
          >
            {type === 'password' ? (
              <EyeOn className="absolute mr-14 cursor-pointer text-night-600 transition hover:text-night-500" />
            ) : (
              <EyeOff className="absolute mr-14 cursor-pointer text-night-600 transition hover:text-night-500" />
            )}
          </span>
        </div>
      </div>
      {passwordStrengthMeter && (
        <PasswordStrengthMeter name={name} control={control} />
      )}
    </div>
  );
}

function ShowError({ error, hasError }: { error: any; hasError: boolean }) {
  return (
    <>
      {hasError ? (
        <div className="absolute right-5 top-0 px-2 text-[0.85rem] font-medium text-red-500 opacity-60 transition-all duration-200 ease-in-out">
          {error}
        </div>
      ) : (
        <div className="absolute -top-6 right-5 px-2 text-[0.85rem] font-medium text-red-500 opacity-60 transition-all duration-200 ease-in-out">
          {error}
        </div>
      )}
    </>
  );
}

function PasswordStrengthMeter({
  control,
  name,
}: {
  control: Control;
  name: string;
}) {
  const password = useWatch({
    control,
    name,
    defaultValue: '',
  });

  let scores = {
    numberScore: false,
    UppercaseScore: false,
    lowercaseScore: false,
    lengthScore: false,
    specialCharScore: false,
  };
  if (password.match(/\d+/g)) {
    scores.numberScore = true;
  }

  if (password.match(/[A-Z]+/g)) {
    scores.UppercaseScore = true;
  }

  if (password.match(/[a-z]+/g)) {
    scores.lowercaseScore = true;
  }

  if (password.length > 7) {
    scores.lengthScore = true;
  }

  if (password.match(/^(.*[!@#$%&*():''><?/;}{])/)) {
    scores.specialCharScore = true;
  }
  const strength = Object.values(scores).reduce(
    (acc, item) => acc + Number(item),
    0,
  );

  const feedback = {
    1: 'Too weak',
    2: 'Weak',
    3: 'Good',
    4: 'Strong',
  }[strength];

  return (
    <div className="absolute -bottom-6 right-0 mx-2 opacity-50">
      {strength > 0 ? (
        <div className="flex items-center justify-center gap-2 align-middle">
          {Array.from({ length: strength }).map((score, index) => (
            <div
              key={index}
              className={`h-1 w-4 rounded-lg ${strength == 1 && 'bg-gray-400'}
              ${strength == 2 && 'bg-yellow-400'}
              ${strength == 3 && 'bg-blue-400'}
              ${strength == 4 && 'bg-green-400'}
              `}
            ></div>
          ))}
          <div
            className={`text-[0.8rem] font-medium ${strength == 1 && 'text-gray-400'}
              ${strength == 2 && 'text-yellow-400'}
              ${strength == 3 && 'text-blue-400'}
              ${strength == 4 && 'text-green-400'} `}
          >
            {feedback}
          </div>
        </div>
      ) : null}
    </div>
  );
}
