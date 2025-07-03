import { z } from 'zod';

export const InvoiceSchema = z.object({
    invoiceNumber: z.string().min(1),
    date: z.string().refine(val => !isNaN(Date.parse(val)), {
        message: 'Invalid date format',
    }),
    amount: z.number().nonnegative(),
    customer: z.object({
        name: z.string().min(1),
        email: z.string().email().optional()
    }),
});