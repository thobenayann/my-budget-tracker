'use client';

import { UserButton } from '@clerk/nextjs';
import { Menu } from 'lucide-react';
import React from 'react';
import Logo, { LogoMobile } from './Logo';
import NavBarItem from './NavBarItem';
import { ThemeSwitcherBtn } from './ThemeSwitcherBtn';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';

interface MovileNavBarProps {
    navBarItems: { link: string; label: string }[];
}

function MovileNavBar({ navBarItems }: MovileNavBarProps) {
    const [isOpen, setIsOpen] = React.useState(false);
    return (
        <div className='block border-separate bg-background md:hidden'>
            <nav className='container flex items-center justify-between px-4'>
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetTrigger asChild>
                        <Button variant={'ghost'} size={'icon'}>
                            <Menu />
                        </Button>
                    </SheetTrigger>
                    <SheetContent
                        className='w-[400px] sm:w-[540px]'
                        side='left'
                    >
                        <Logo />
                        <div className='flex flex-col gap-1 pt-4'>
                            {navBarItems.map((item) => (
                                <NavBarItem
                                    key={item.label}
                                    link={item.link}
                                    label={item.label}
                                    onClickCallback={() =>
                                        setIsOpen((prev) => !prev)
                                    }
                                />
                            ))}
                        </div>
                    </SheetContent>
                </Sheet>
                <div className='flex h-[80px] min-h-[60px] items-center gap-x-4'>
                    <LogoMobile />
                </div>
                <div className='flex items-center gap-2'>
                    <ThemeSwitcherBtn />
                    <UserButton afterSignOutUrl='/sign-in' />
                </div>
            </nav>
        </div>
    );
}

export default MovileNavBar;
