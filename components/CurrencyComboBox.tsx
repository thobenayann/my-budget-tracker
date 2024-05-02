'use client';

import * as React from 'react';

import { UpdateUserCurrency } from '@/app/wizard/_actions/userSettings';
import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { useMediaQuery } from '@/hooks/use-media-query';
import { Currencies, Currency } from '@/lib/constants/currencies';
import { UserSettings } from '@prisma/client';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import SkeletonWrapper from './SkeletonWrapper';

export function CurrencyComboBox() {
    const [open, setOpen] = React.useState(false);
    const isDesktop = useMediaQuery('(min-width: 768px)');
    const [selectedOption, setSelectedOption] = React.useState<Currency | null>(
        null
    );

    // GET user settings
    const userSettings = useQuery<UserSettings>({
        queryKey: ['userSettings'],
        queryFn: () => fetch('/api/user-settings').then((res) => res.json()),
    });

    // Apply the user currency from his settings
    React.useEffect(() => {
        if (!userSettings.data) return;
        const userCurrency = Currencies.find(
            (currency) => currency.value === userSettings.data.currency
        );
        if (userCurrency) {
            setSelectedOption(userCurrency);
        }
    }, [userSettings.data]);

    // UPDATE user currency
    const mutateUserCurrency = useMutation({
        mutationFn: UpdateUserCurrency,
        onSuccess: (data: UserSettings) => {
            toast.success('Currency updated successfully 🎉', {
                id: 'update-currency',
            });

            setSelectedOption(
                Currencies.find(
                    (currency) => currency.value === data.currency
                ) || null
            );
        },
        onError: (error: Error) => {
            toast.error('Something went wrong', {
                id: 'update-currency',
            });
        },
    });

    // This function called a mutation wich is basically a hook and can change over time
    // So we use useCallback in this case (to avoid infinite loop of re-renders)
    const selectOption = React.useCallback(
        (currency: Currency | null) => {
            if (!currency) {
                toast.error('Please select a currency');
                return;
            }

            toast.loading('Updating currency...', {
                id: 'update-currency',
            });

            mutateUserCurrency.mutate(currency.value);
        },
        [mutateUserCurrency]
    );

    if (isDesktop) {
        return (
            <SkeletonWrapper isLoading={userSettings.isLoading}>
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant='outline'
                            className='w-full justify-start'
                            disabled={mutateUserCurrency.isPending}
                        >
                            {selectedOption ? (
                                <>{selectedOption.label}</>
                            ) : (
                                <>Set currency</>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className='w-[200px] p-0' align='start'>
                        <OptionList
                            setOpen={setOpen}
                            setSelectedOption={selectOption}
                        />
                    </PopoverContent>
                </Popover>
            </SkeletonWrapper>
        );
    }

    return (
        <SkeletonWrapper isLoading={userSettings.isLoading}>
            <Drawer open={open} onOpenChange={setOpen}>
                <DrawerTrigger asChild>
                    <Button
                        variant='outline'
                        className='w-full justify-start'
                        disabled={mutateUserCurrency.isPending}
                    >
                        {selectedOption ? (
                            <>{selectedOption.label}</>
                        ) : (
                            <>Set currency</>
                        )}
                    </Button>
                </DrawerTrigger>
                <DrawerContent>
                    <div className='mt-4 border-t'>
                        <OptionList
                            setOpen={setOpen}
                            setSelectedOption={selectOption}
                        />
                    </div>
                </DrawerContent>
            </Drawer>
        </SkeletonWrapper>
    );
}

function OptionList({
    setOpen,
    setSelectedOption,
}: {
    setOpen: (open: boolean) => void;
    setSelectedOption: (currency: Currency | null) => void;
}) {
    return (
        <Command>
            <CommandInput placeholder='Filter status...' />
            <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup>
                    {Currencies.map((currency: Currency) => (
                        <CommandItem
                            key={currency.value}
                            value={currency.value}
                            onSelect={(value) => {
                                setSelectedOption(
                                    Currencies.find(
                                        (priority) => priority.value === value
                                    ) || null
                                );
                                setOpen(false);
                            }}
                        >
                            {currency.label}
                        </CommandItem>
                    ))}
                </CommandGroup>
            </CommandList>
        </Command>
    );
}
