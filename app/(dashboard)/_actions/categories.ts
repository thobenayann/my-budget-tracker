'use server';

import { getCurrentUser } from '@/lib/getCurrentUser';
import prisma from '@/lib/prisma';
import {
    CreateCategorySchema,
    CreateCategorySchemaType,
    DeleteCategorySchema,
    DeleteCategorySchemaType,
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

export async function DeleteCategory(form: DeleteCategorySchemaType) {
    const parsedBody = DeleteCategorySchema.safeParse(form);
    if (!parsedBody.success) {
        throw new Error('bad request');
    }

    const user = await getCurrentUser();

    return await prisma.category.delete({
        where: {
            name_userId_type: {
                userId: user.id,
                name: parsedBody.data.name,
                type: parsedBody.data.type,
            },
        },
    });
}
