import { UserButton } from '@clerk/nextjs';
import Logo from './Logo';
import NavBarItem from './NavBarItem';
import { ThemeSwitcherBtn } from './ThemeSwitcherBtn';

interface NavBarItemsProps {
    navBarItems: { link: string; label: string }[];
}

function DesktopNavBar({ navBarItems }: NavBarItemsProps) {
    return (
        <div className='hidden border-separate border-b bg-background md:block'>
            <nav className='container flex items-center justify-between px-8'>
                <div className='flex h-[80px] min-h-[60px] items-center gap-x-4'>
                    <Logo />
                    <div className='flex h-full'>
                        {navBarItems.map((item) => (
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
