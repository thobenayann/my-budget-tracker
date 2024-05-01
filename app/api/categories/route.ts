import { getCurrentUser } from '@/lib/getCurrentUser';
import prisma from '@/lib/prisma';
import { z } from 'zod';

export async function GET(req: Request) {
    const user = await getCurrentUser();

    const { searchParams } = new URL(req.url);
    const paramType = searchParams.get('type');

    const validator = z.enum(['income', 'expense']);
    const queryParams = validator.safeParse(paramType);
    if (!queryParams.success) {
        return Response.json(queryParams.error, { status: 400 });
    }

    const type = queryParams.data;
    const categories = await prisma.category.findMany({
        where: {
            userId: user.id,
            ...(type && { type }), // <-- This is a new way to conditionally add a key-value pair to an object)
        },
        orderBy: {
            name: 'asc',
        },
    });

    return Response.json(categories);
}
