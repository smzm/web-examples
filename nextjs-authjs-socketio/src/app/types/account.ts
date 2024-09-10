import { optional, z } from 'zod';

// * ID Schema
export const idSchema = z.object({
  id: z.string().regex(/^[a-z][0-9a-z]{24}$/, {
    message: 'Invalid id',
  }),
});
export type TIdSchema = z.infer<typeof idSchema>;

// * Email Schema
export const emailSchema = z.object({
  email: z.string().email({ message: 'Enter a valid email address' }).trim(),
});
export type TEmailSchema = z.infer<typeof emailSchema>;

// * Username Schema
const prohibitedUsernames = ['admin', 'administrator', 'moderator', 'user'];
export const usernameSchema = z.object({
  username: z
    .string({ required_error: 'Please enter your username' })
    .min(3, { message: 'At least 3 character' })
    .max(100, { message: 'username must be less than 100 characters' })
    .trim()
    .toLowerCase()
    .regex(/^[a-zA-Z0-9_.]+$/, {
      message: 'Only letters, numbers, underscores, and dots',
    })
    .refine(
      (value) => !prohibitedUsernames.includes(value),
      'Username is not allowed',
    ),
});
export type TUsernameSchema = z.infer<typeof usernameSchema>;

// * Password Verification Schema
export const passwordVerificationSchema = z
  .object({
    password: z
      .string({ required_error: 'Please enter your password' })
      .min(6, { message: 'At least 6 characters' })
      .max(100, { message: 'password must be less than 100 characters' }),
    confirmPassword: z.string({
      required_error: 'Please confirm your password',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });
export type TPasswordVerificationSchema = z.infer<
  typeof passwordVerificationSchema
>;

//* Password Schema
export const passwordSchema = z.object({
  password: z
    .string({ required_error: 'Please enter your password' })
    .min(6, { message: 'At least 6 characters' })
    .max(100, { message: 'password must be less than 100 characters' }),
});
export type TPasswordSchema = z.infer<typeof passwordSchema>;

// * Signup By Email Schema
export const signupByEmailSchema = z
  .object({
    email: z.string().email({ message: 'Enter a valid email address' }).trim(),
    password: z
      .string({ required_error: 'Please enter your password' })
      .min(6, { message: 'At least 6 characters' })
      .max(100, { message: 'password must be less than 100 characters' }),
    confirmPassword: z.string({
      required_error: 'Please confirm your password',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });
export type TSignupByEmailSchema = z.infer<typeof signupByEmailSchema>;

// * Phone number Schema
export const phoneNumberSchema = z.object({
  phoneNumber: z
    .string()
    .min(10, { message: 'Enter a valid phone number' })
    // .max(11, { message: 'Enter a valid phone number' })
    //   test phone number with regex which should be all number and dont start with 0
    .superRefine((value, ctx) => {
      const isAllDigits = /^[+]*[0-9]\d+$/.test(value);
      if (!isAllDigits) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Enter a valid phone number',
        });
      }
      if ((value[0] === '0' && value[1] === '0') || value[0] === '+') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Do not enter country code',
        });
      }
      if (value[0] === '0' && value.length !== 11) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Enter a valid phone number',
        });
      }
      if (value[0] !== '0' && value.length !== 10) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Enter a valid phone number',
        });
      }
    }),
});
export type TPhoneNumberSchema = z.infer<typeof phoneNumberSchema>;

// * Name Schema
export const nameSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'required' })
    .max(100, { message: 'first name must be less than 100 characters' }),
});
export type TNameSchema = z.infer<typeof nameSchema>;

// * Identifier Schema
export const identifierSchema = z.object({
  // Choose either email or username or phone number
  identifier: z.union([
    // Validate as email if chosen
    z.string().email({
      message: 'Email address or username or phone number',
    }),
    // Validate as username if chosen
    z.string().min(3, {
      message: 'Username should be at least 3 characters',
    }),
    // Validate as phone number if chosen
    z
      .string()
      .min(10, { message: 'Enter a valid phone number' })
      .max(11, { message: 'Enter a valid phone number' })
      //   test phone number with regex which should be all number and dont start with 0
      .superRefine((value, ctx) => {
        const isAllDigits = /^[0-9]\d+$/.test(value);
        if (!isAllDigits) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Enter a valid phone number',
          });
        }
        if (value[0] === '0' && value[1] === '0') {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Do not enter country code',
          });
        }
        if (value[0] === '0' && value.length !== 11) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Enter a valid phone number',
          });
        }
        if (value[0] !== '0' && value.length !== 10) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Enter a valid phone number',
          });
        }
      }),
  ]),
});
export type TIdentifierSchema = z.infer<typeof identifierSchema>;

// * Signin Schema
export const signInByCredentialsSchema = z.object({
  identifier: z.union([
    z.string().email({
      message: 'Enter a valid email address or username',
    }), // Validate as email if chosen
    z.string().min(3, {
      message: 'Username should be at least 3 characters',
    }), // Validate as username if chosen
  ]),
  password: z
    .string({ required_error: 'Please enter your password' })
    .min(6, { message: 'At least 6 characters' })
    .max(100, { message: 'password must be less than 100 characters' }),
});
export type TSignInByCredentialsSchema = z.infer<
  typeof signInByCredentialsSchema
>;

// * Verfication Token
export const verificationTokenSchema = z.object({
  id: z.string().nullable(),
  name: z
    .string()
    .max(100, { message: 'first name must be less than 100 characters' })
    .nullable(),
  identifier: z.union([
    z.string().email({
      message: 'Enter a valid email address or username',
    }), // Validate as email if chosen
    z.string().min(3, {
      message: 'Username should be at least 3 characters',
    }), // Validate as username if chosen
  ]),
  redirectPath: z.string({
    required_error: 'redirect path is required',
  }),
  type: z.enum(['signup', 'changeEmail', 'forgetPassword']),
});
export type TVerificationTokenSchema = z.infer<typeof verificationTokenSchema>;

// * 2FA Schema
export const twoFactorSchema = z.object({
  token: z
    .string()
    .min(6, { message: 'Enter a valid 6-digit code' })
    .max(6, { message: 'Enter a valid 6-digit code' }),
});
export type TTwoFactorSchema = z.infer<typeof twoFactorSchema>;

// * Signup Completion Schema
export const signupCompletionSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'required' })
    .max(100, { message: 'first name must be less than 100 characters' }),
  username: z
    .string({ required_error: 'Please enter your username' })
    .min(3, { message: 'At least 3 character' })
    .max(100, { message: 'username must be less than 100 characters' })
    .trim()
    .toLowerCase()
    .regex(/^[a-zA-Z0-9_-]+$/, {
      message:
        'Username can only contain letters, numbers, underscores and hyphens',
    })
    .refine(
      (value) => !prohibitedUsernames.includes(value),
      'Username is not allowed',
    ),
});
export type TSignupCompletionSchema = z.infer<typeof signupCompletionSchema>;

// *  Login By email Schema
export const signInByEmailSchema = z.object({
  password: z
    .string({ required_error: 'Please enter your password' })
    .min(6, { message: 'At least 6 characters' })
    .max(100, { message: 'password must be less than 100 characters' }),
  name: z.optional(
    z
      .string()
      .min(1, { message: 'required' })
      .max(100, { message: 'first name must be less than 100 characters' }),
  ),
  username: z.optional(
    z
      .string({ required_error: 'Please enter your username' })
      .min(3, { message: 'At least 3 character' })
      .max(100, { message: 'username must be less than 100 characters' })
      .trim()
      .toLowerCase()
      .regex(/^[a-zA-Z0-9_-]+$/, {
        message:
          'Username can only contain letters, numbers, underscores and hyphens',
      })
      .refine(
        (value) => !prohibitedUsernames.includes(value),
        'Username is not allowed',
      ),
  ),
});

export type TSignInByEmailSchema = z.infer<typeof signInByEmailSchema>;
