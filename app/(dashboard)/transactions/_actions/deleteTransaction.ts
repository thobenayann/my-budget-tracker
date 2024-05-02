'use server';

import { getCurrentUser } from '@/lib/getCurrentUser';
import prisma from '@/lib/prisma';

export async function DeleteTransaction(id: string) {
    const user = await getCurrentUser();

    const transaction = await prisma.transaction.findUnique({
        where: {
            userId: user.id,
            id,
        },
    });

    if (!transaction) {
        throw new Error('bad request');
    }

    await prisma.$transaction([
        // Delete transaction from db
        prisma.transaction.delete({
            where: {
                id,
                userId: user.id,
            },
        }),
        // Update month history
        prisma.monthHistory.update({
            where: {
                userId_day_month_year: {
                    userId: user.id,
                    day: transaction.date.getUTCDate(),
                    month: transaction.date.getUTCMonth(),
                    year: transaction.date.getUTCFullYear(),
                },
            },
            data: {
                ...(transaction.type === 'expense' && {
                    expense: {
                        decrement: transaction.amount,
                    },
                }),
                ...(transaction.type === 'income' && {
                    income: {
                        decrement: transaction.amount,
                    },
                }),
            },
        }),
        // Update year history
        prisma.yearHistory.update({
            where: {
                userId_month_year: {
                    userId: user.id,
                    month: transaction.date.getUTCMonth(),
                    year: transaction.date.getUTCFullYear(),
                },
            },
            data: {
                ...(transaction.type === 'expense' && {
                    expense: {
                        decrement: transaction.amount,
                    },
                }),
                ...(transaction.type === 'income' && {
                    income: {
                        decrement: transaction.amount,
                    },
                }),
            },
        }),
    ]);
}
