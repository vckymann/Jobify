import { z } from 'zod';

export const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(8, { message: 'Old password must be at least 8 characters' }),
    newPassword: z.string().min(8, { message: 'New password must be at least 8 characters' }),
  })
  .refine(({ oldPassword, newPassword }) => oldPassword !== newPassword, {
    message: 'New password cannot be the same as old password',
    path: ['newPassword'],
  });

