import { UserButton } from '@clerk/nextjs';
import Logo from './Logo';
import NavBarItem from './NavBarItem';
import { ThemeSwitcherBtn } from './ThemeSwitcherBtn';

function DesktopNavBar() {
    const items = [
        {
            label: 'Dashboard',
            link: '/',
        },
        {
            label: 'Transactions',
            link: '/transactions',
        },
        {
            label: 'Manage',
            link: '/manage',
        },
    ];

    return (
        <div className='border-separate border-b'>
            <nav className='container flex items-center justify-between px-8'>
                <div className='flex h-[80px] min-h-[60px] items-center gap-x-4'>
                    <Logo />
                    <div className='flex h-full'>
                        {items.map((item) => (
                            <NavBarItem
                                key={item.label}
                                link={item.link}
                                label={item.label}
                            />
                        ))}
                    </div>
                </div>
                <div className='flex items-center gap-2'>
                    <ThemeSwitcherBtn />
                    <UserButton afterSignOutUrl='/sign-in' />
                </div>
            </nav>
        </div>
    );
}

export default DesktopNavBar;
