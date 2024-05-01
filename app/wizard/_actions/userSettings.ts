'use server';

import { getCurrentUser } from '@/lib/getCurrentUser';
import prisma from '@/lib/prisma';
import { UpdateUserCurrencyShema } from '@/schema/userSettings';

export async function UpdateUserCurrency(currency: string) {
    const parsedBody = UpdateUserCurrencyShema.safeParse({ currency });
    if (!parsedBody.success) {
        throw new Error(parsedBody.error.message);
    }

    const user = await getCurrentUser();

    const userSettings = await prisma.userSettings.update({
        where: {
            userId: user.id,
        },
        data: {
            currency,
        },
    });

    return userSettings;
}
