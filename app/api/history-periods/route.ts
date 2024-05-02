import { getCurrentUser } from '@/lib/getCurrentUser';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
    const user = await getCurrentUser();

    const periods = await getHistoryPeriods(user.id);
    return Response.json(periods);
}

export type GetHistoryPeriodsResponseType = Awaited<
    ReturnType<typeof getHistoryPeriods>
>;

async function getHistoryPeriods(userId: string) {
    const result = await prisma.monthHistory.findMany({
        where: {
            userId,
        },
        select: {
            year: true,
        },
        distinct: ['year'],
        orderBy: [
            {
                year: 'asc',
            },
        ],
    });

    const years = result.map((el) => el.year);
    if (years.length === 0) {
        // Return the current year
        return [new Date().getFullYear()];
    }

    return years;
}
