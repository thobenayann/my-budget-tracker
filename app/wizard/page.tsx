import { CurrencyComboBox } from '@/components/CurrencyComboBox';
import Logo from '@/components/Logo';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { getCurrentUser } from '@/lib/getCurrentUser';
import Link from 'next/link';

async function page() {
    const user = await getCurrentUser();
    return (
        <div className='container flex max-w-2xl flex-col items-center justify-center gap-4'>
            <header>
                <h1 className='text-center text-3xl'>
                    Welcome,{' '}
                    <span className='first-letter:uppercase ml-2 font-bold'>
                        {user.firstName}! 👋
                    </span>
                </h1>
                <h2 className='mt-4 text-center text-base text-muted-foreground'>
                    Let&apos;s get started by setting up your currency
                </h2>

                <h3 className='mt-2 text-center text-sm text-muted-foreground'>
                    You can change these settings at any time
                </h3>
            </header>
            <Separator />
            <Card className='w-full'>
                <CardHeader>
                    <CardTitle>Currency</CardTitle>
                    <CardDescription>
                        Set you default currency for transactions
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <CurrencyComboBox />
                </CardContent>
            </Card>
            <Separator />
            <Button className='w-full'>
                <Link href='/'>I&apos;m done! Take me to the dashboard</Link>
            </Button>
            <div className='mt-8'>
                <Logo />
            </div>
        </div>
    );
}

export default page;
