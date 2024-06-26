import { Button } from '@/components/ui/button';
import { getCurrentUser } from '@/lib/getCurrentUser';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import CreateTransactionDialog from './_components/CreateTransactionDialog';
import History from './_components/History';
import Overview from './_components/Overview';

async function page() {
    const user = await getCurrentUser();
    const userSettings = await prisma.userSettings.findUnique({
        where: {
            userId: user.id,
        },
    });
    if (!userSettings) {
        redirect('/sign-in');
    }
    return (
        <div className='h-full bg-background'>
            <div className='border-b bg-card'>
                <div className='container flex flex-wrap items-center justify-between gap-6 py-8'>
                    <p className='text-3xl font-bold'>
                        Hello {user.firstName}! 👋
                    </p>

                    <div className='flex items-center gap-3'>
                        {/* INCOME */}
                        <CreateTransactionDialog
                            trigger={
                                <Button
                                    variant={'outline'}
                                    className='border-emerald-500 bg-emerald-950 text-white hover:bg-emerald-700 hover:text-white'
                                >
                                    New income 🤑
                                </Button>
                            }
                            type={'income'}
                        ></CreateTransactionDialog>

                        {/* EXPENSE */}
                        <CreateTransactionDialog
                            trigger={
                                <Button
                                    variant={'outline'}
                                    className='border-rose-500 bg-rose-950 text-white hover:bg-rose-700 hover:text-white'
                                >
                                    New expense 😬
                                </Button>
                            }
                            type={'expense'}
                        ></CreateTransactionDialog>
                    </div>
                </div>
            </div>
            <Overview userSettings={userSettings} />
            <History userSettings={userSettings} />
        </div>
    );
}

export default page;
