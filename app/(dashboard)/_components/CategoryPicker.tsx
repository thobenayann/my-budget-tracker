'use client';

import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { useMediaQuery } from '@/hooks/use-media-query';
import { TransactionType } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Category } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import CategoryRow from './CategoryRow';
import CreateCategoryDialog from './CreateCategoryDialog';

interface CategoryPickerProps {
    type: TransactionType;
    onChange: (value: string) => void;
}

function CategoryPicker({ type, onChange }: CategoryPickerProps) {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState('');
    const isDesktop = useMediaQuery('(min-width: 768px)');

    useEffect(() => {
        if (!value) return;
        // when the value changes, call onChange callback
        onChange(value);
    }, [onChange, value]);

    const categoriesQuery = useQuery({
        queryKey: ['categories', type],
        queryFn: () =>
            fetch(`/api/categories?type=${type}`).then((res) => res.json()),
    });

    const selectedCategory = categoriesQuery.data?.find(
        (category: Category) => category.name === value
    );

    const successCallback = useCallback(
        (category: Category) => {
            setValue(category.name);
            setOpen((prev) => !prev);
        },
        [setValue, setOpen]
    );

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant={'outline'}
                    role='combobox'
                    aria-expanded={open}
                    className='w-[200px] justify-between'
                >
                    {selectedCategory ? (
                        <CategoryRow category={selectedCategory} />
                    ) : (
                        'Select category'
                    )}
                    <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className='w-[200px] p-0'
                sideOffset={isDesktop ? 0 : 50}
            >
                <Command
                    onSubmit={(e) => {
                        e.preventDefault();
                    }}
                >
                    <CommandInput placeholder='Search category...' />
                    <CreateCategoryDialog
                        type={type}
                        successCallback={successCallback}
                    />
                    <CommandEmpty>
                        <p>Category not found</p>
                        <p className='text-xs text-muted-foreground'>
                            Tip: Create a new category
                        </p>
                    </CommandEmpty>
                    <CommandGroup>
                        <CommandList>
                            {categoriesQuery.data &&
                                categoriesQuery.data.map(
                                    (category: Category) => (
                                        <CommandItem
                                            key={category.name}
                                            onSelect={() => {
                                                setValue(category.name);
                                                setOpen((prev) => !prev);
                                            }}
                                        >
                                            <CategoryRow category={category} />
                                            <Check
                                                className={cn(
                                                    'mr-2 w-4 h-4 opacity-0',
                                                    value === category.name &&
                                                        'opacity-100'
                                                )}
                                            />
                                        </CommandItem>
                                    )
                                )}
                        </CommandList>
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    );
}

export default CategoryPicker;
