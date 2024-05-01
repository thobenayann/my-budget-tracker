'use server';

import { getCurrentUser } from '@/lib/getCurrentUser';
import prisma from '@/lib/prisma';
import {
    CreateCategorySchema,
    CreateCategorySchemaType,
} from '@/schema/categories';

export async function CreateCategory(from: CreateCategorySchemaType) {
    const parsedBody = CreateCategorySchema.safeParse(from);
    if (!parsedBody.success) {
        throw new Error('Bad request');
    }

    const user = await getCurrentUser();

    const { name, icon, type } = parsedBody.data;
    return await prisma.category.create({
        data: {
            userId: user.id,
            name,
            icon,
            type,
        },
    });
}
