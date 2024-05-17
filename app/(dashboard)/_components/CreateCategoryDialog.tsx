'use client';

import { CreateCategory } from '@/app/(dashboard)/_actions/categories';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { useMediaQuery } from '@/hooks/use-media-query';
import { TransactionType } from '@/lib/types';
import { cn } from '@/lib/utils';
import {
    CreateCategorySchema,
    CreateCategorySchemaType,
} from '@/schema/categories';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Category } from '@prisma/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CircleOff, Loader2, PlusSquare } from 'lucide-react';
import { useTheme } from 'next-themes';
import { ReactNode, useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface CreateCategoryDialogProps {
    type: TransactionType;
    successCallback: (category: Category) => void;
    trigger?: ReactNode;
}

function CreateCategoryDialog({
    type,
    successCallback,
    trigger,
}: CreateCategoryDialogProps) {
    const [open, setOpen] = useState(false);
    const [selectEmojiOpen, setSelectEmojiOpen] = useState(false);
    const form = useForm<CreateCategorySchemaType>({
        resolver: zodResolver(CreateCategorySchema),
        defaultValues: {
            type,
        },
    });

    const isDesktop = useMediaQuery('(min-width: 768px)');
    const theme = useTheme();
    const queryClient = useQueryClient();

    // CREATE CATEGORY
    const { mutate, isPending } = useMutation({
        mutationFn: CreateCategory,
        onSuccess: async (data: Category) => {
            setOpen(false);
            form.reset({ name: '', icon: '', type });

            toast.success(`Category ${data.name} created successfully 🎉`, {
                id: 'create-category',
            });

            successCallback(data);

            await queryClient.invalidateQueries({
                queryKey: ['categories'],
            }); // to refetch categories

            setOpen((prev) => !prev); // close the dialog
        },
        onError: (error) => {
            toast.error('Failed to create category', {
                id: 'create-category',
            });
        },
    });

    const onSubmit = useCallback(
        (values: CreateCategorySchemaType) => {
            toast.loading('Creating category...', {
                id: 'create-category',
            });
            mutate(values);
        },
        [mutate]
    );

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger ? (
                    trigger
                ) : (
                    <Button
                        variant={'ghost'}
                        className='flex border-separate items-center justify-start roudned-none border-b px-3 py-3 text-muted-foreground'
                    >
                        <PlusSquare className='mr-2 h-4 w-4' />
                        Create new
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Create
                        <span
                            className={cn(
                                'm-1',
                                type === 'income'
                                    ? 'text-emerald-500'
                                    : 'text-red-500'
                            )}
                        >
                            {type}
                        </span>
                        category
                    </DialogTitle>
                    <DialogDescription>
                        Categories are used to group your transactions
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className='space-y-8'
                    >
                        <FormField
                            control={form.control}
                            name='name'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder='Category'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        This is how your category will appear in
                                        the app
                                    </FormDescription>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name='icon'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Icon</FormLabel>
                                    <FormControl>
                                        <Popover
                                            open={selectEmojiOpen}
                                            onOpenChange={setSelectEmojiOpen}
                                        >
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant={'outline'}
                                                    className='h-[100px] w-full'
                                                >
                                                    {form.watch('icon') ? (
                                                        <div className='flex flex-col items-center gap-2'>
                                                            <span
                                                                className='text-5xl'
                                                                role='img'
                                                            >
                                                                {field.value}
                                                            </span>
                                                            <p className='text-xs text-muted-foreground'>
                                                                Click to change
                                                            </p>
                                                        </div>
                                                    ) : (
                                                        <div className='flex flex-col items-center gap-2'>
                                                            <CircleOff className='h-[48px] w-[48px]' />
                                                            <p className='text-xs text-muted-foreground'>
                                                                Click to select
                                                            </p>
                                                        </div>
                                                    )}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent
                                                sideOffset={
                                                    isDesktop ? 0 : -150
                                                }
                                                className='w-full'
                                            >
                                                <Picker
                                                    data={data}
                                                    theme={theme.resolvedTheme}
                                                    onEmojiSelect={(emoji: {
                                                        native: string;
                                                    }) => {
                                                        field.onChange(
                                                            emoji.native
                                                        );
                                                        setSelectEmojiOpen(
                                                            false
                                                        );
                                                    }}
                                                    maxFrequentRows={1}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </FormControl>
                                    <FormDescription>
                                        This is how your category will appear in
                                        the app
                                    </FormDescription>
                                </FormItem>
                            )}
                        />
                    </form>
                </Form>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button
                            type='button'
                            variant={'secondary'}
                            onClick={() => {
                                form.reset();
                            }}
                        >
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button
                        onClick={form.handleSubmit(onSubmit)}
                        disabled={isPending}
                    >
                        {!isPending && 'Create'}
                        {isPending && <Loader2 className='animate-spin' />}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default CreateCategoryDialog;
