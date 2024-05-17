import { PiggyBank } from 'lucide-react';

function Logo() {
    return (
        <a href='/' className='flex items-center gap-2'>
            <PiggyBank className='stroke h-11 w-11 stroke-purple-500' />
            <p className='bg-gradient-to-r from-purple-400 to-violet-600 bg-clip-text text-3xl font-bold leading-tight tracking-tighter text-transparent'>
                MyBudgetTracker
            </p>
        </a>
    );
}

export function LogoMobile() {
    return (
        <a href='/' className='flex items-center gap-2'>
            <p className='bg-gradient-to-r from-purple-400 to-violet-600 bg-clip-text text-2xl md:text-3xl font-bold leading-tight tracking-tighter text-transparent'>
                MyBudgetTracker
            </p>
        </a>
    );
}

export default Logo;
