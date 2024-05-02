import { getCurrentUser } from '@/lib/getCurrentUser';
import prisma from '@/lib/prisma';
import { Period, Timeframe } from '@/lib/types';
import { getDaysInMonth } from 'date-fns';
import { z } from 'zod';

const getHistoryDataSchema = z.object({
    timeframe: z.enum(['month', 'year']),
    month: z.coerce.number().min(0).max(11).default(0),
    year: z.coerce.number().min(2000).max(3000),
});

export async function GET(request: Request) {
    const user = await getCurrentUser();

    const { searchParams } = new URL(request.url);
    const timeframe = searchParams.get('timeframe');
    const year = searchParams.get('year');
    const month = searchParams.get('month');

    const queryParams = getHistoryDataSchema.safeParse({
        timeframe,
        month,
        year,
    });

    if (!queryParams.success) {
        return Response.json(queryParams.error.message, {
            status: 400,
        });
    }

    const data = await getHistoryData(user.id, queryParams.data.timeframe, {
        month: queryParams.data.month,
        year: queryParams.data.year,
    });

    return Response.json(data);
}

export type GetHistoryDataResponseType = Awaited<
    ReturnType<typeof getHistoryData>
>;

async function getHistoryData(
    userId: string,
    timeframe: Timeframe,
    period: Period
) {
    switch (timeframe) {
        case 'year':
            return await getYearHistoryData(userId, period.year);
        case 'month':
            return await getMonthHistoryData(userId, period.year, period.month);
    }
}

type HistoryData = {
    expense: number;
    income: number;
    year: number;
    month: number;
    day?: number;
};

/**
 * Récupère les données historiques de dépenses et de revenus groupées par mois pour une année spécifiée.
 *
 * Cette fonction utilise Prisma pour interroger la base de données et récupérer les sommes des dépenses et
 * des revenus pour chaque mois de l'année donnée. Si aucune transaction n'est trouvée pour un mois donné,
 * les valeurs par défaut de dépense et de revenu seront de 0.
 *
 * @param {string} userId - L'identifiant de l'utilisateur pour lequel récupérer les données.
 * @param {number} year - L'année pour laquelle les données doivent être récupérées.
 * @returns {Promise<HistoryData[]>} Promesse résolue avec un tableau d'objets contenant les données historiques par mois.
 *
 * @example
 * // Exemple d'utilisation pour récupérer les données historiques de 2023 pour l'utilisateur 'user123'
 * getYearHistoryData('user123', 2023).then(data => {
 *   console.log(data);
 * });
 */
async function getYearHistoryData(userId: string, year: number) {
    const results = await prisma.yearHistory.groupBy({
        by: ['month'], // month does not exist in the YearHistory table, it is a virtual field because groupBy need a by field
        where: {
            userId,
            year,
        },
        _sum: {
            expense: true,
            income: true,
        },
        orderBy: [
            {
                month: 'asc',
            },
        ],
    });

    if (!results || results.length === 0) return [];

    // Table with 12 month by default.
    const history: HistoryData[] = Array.from({ length: 12 }, (_, i) => ({
        year,
        month: i,
        expense: 0,
        income: 0,
    }));

    // update table with results
    results.forEach((result) => {
        const index = result.month;
        history[index].expense = result._sum.expense || 0;
        history[index].income = result._sum.income || 0;
    });

    return history;
}

/**
 * Récupère les données historiques de dépenses et de revenus groupées par jour pour un mois spécifié.
 *
 * Cette fonction utilise Prisma pour interroger la base de données et récupérer les sommes des dépenses et
 * des revenus pour chaque jour du mois spécifié. Si aucune transaction n'est trouvée pour un jour donné,
 * les valeurs par défaut de dépense et de revenu seront de 0. La fonction calcule également le nombre de jours
 * dans le mois spécifié pour s'assurer que les données retournées couvrent tous les jours du mois.
 *
 * @param {string} userId - L'identifiant de l'utilisateur pour lequel récupérer les données.
 * @param {number} year - L'année du mois pour lequel les données doivent être récupérées.
 * @param {number} month - Le mois (1-12) pour lequel les données doivent être récupérées.
 * @returns {Promise<HistoryData[]>} Promesse résolue avec un tableau d'objets contenant les données historiques par jour.
 *
 * @example
 * // Exemple d'utilisation pour récupérer les données historiques pour Janvier 2023 pour l'utilisateur 'user123'
 * getMonthHistoryData('user123', 2023, 1).then(data => {
 *   console.log(data);
 * });
 */
async function getMonthHistoryData(
    userId: string,
    year: number,
    month: number
) {
    const results = await prisma.monthHistory.groupBy({
        by: ['day'],
        where: {
            userId,
            year,
            month,
        },
        _sum: {
            expense: true,
            income: true,
        },
        orderBy: [
            {
                day: 'asc',
            },
        ],
    });

    if (!results || results.length === 0) return [];

    const daysInMonth = getDaysInMonth(new Date(year, month));

    const history: HistoryData[] = Array.from(
        { length: daysInMonth },
        (_, i) => ({
            year,
            month,
            day: i + 1,
            expense: 0,
            income: 0,
        })
    );

    results.forEach((result) => {
        const index = result.day - 1;
        history[index].expense = result._sum.expense || 0;
        history[index].income = result._sum.income || 0;
    });

    return history;
}
