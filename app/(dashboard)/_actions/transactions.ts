'use server';

import { getCurrentUser } from '@/lib/getCurrentUser';
import prisma from '@/lib/prisma';
import {
    CreateTransactionSchema,
    CreateTransactionSchemaType,
} from '@/schema/transaction';

export async function CreateTransaction(form: CreateTransactionSchemaType) {
    const parsedBody = CreateTransactionSchema.safeParse(form);
    if (!parsedBody.success) {
        throw new Error(parsedBody.error.message);
    }

    const user = await getCurrentUser();

    const { amount, category, date, description, type } = parsedBody.data;
    const categoryRow = await prisma.category.findFirst({
        where: {
            userId: user.id,
            name: category,
        },
    });

    if (!categoryRow) {
        throw new Error('category not found');
    }

    // NOTE: don't make confusion between $transaction (prisma as sql transaction) and prisma.transaction (table of our budget tracker)

    await prisma.$transaction([
        // Create user transaction
        prisma.transaction.create({
            data: {
                userId: user.id,
                amount,
                date,
                description: description || '',
                type,
                category: categoryRow.name,
                categoryIcon: categoryRow.icon,
            },
        }),

        // Update month aggregate table
        prisma.monthHistory.upsert({
            // check if this unique key exists
            where: {
                userId_day_month_year: {
                    userId: user.id,
                    day: date.getUTCDate(),
                    month: date.getUTCMonth(),
                    year: date.getUTCFullYear(),
                },
            },
            // if it doesn't exist, create it
            create: {
                userId: user.id,
                day: date.getUTCDate(),
                month: date.getUTCMonth(),
                year: date.getUTCFullYear(),
                expense: type === 'expense' ? amount : 0,
                income: type === 'income' ? amount : 0,
            },
            // if it exists, update it
            update: {
                expense: {
                    increment: type === 'expense' ? amount : 0,
                },
                income: {
                    increment: type === 'income' ? amount : 0,
                },
            },
        }),

        // Update year aggreate
        prisma.yearHistory.upsert({
            where: {
                userId_month_year: {
                    userId: user.id,
                    month: date.getUTCMonth(),
                    year: date.getUTCFullYear(),
                },
            },
            create: {
                userId: user.id,
                month: date.getUTCMonth(),
                year: date.getUTCFullYear(),
                expense: type === 'expense' ? amount : 0,
                income: type === 'income' ? amount : 0,
            },
            update: {
                expense: {
                    increment: type === 'expense' ? amount : 0,
                },
                income: {
                    increment: type === 'income' ? amount : 0,
                },
            },
        }),
    ]);
}
