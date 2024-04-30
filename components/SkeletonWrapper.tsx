import { cn } from '@/lib/utils';
import React from 'react';
import { Skeleton } from './ui/skeleton';

interface SkeletonWrapperProps {
    children: React.ReactNode;
    isLoading: boolean;
    fullWith?: boolean;
}

function SkeletonWrapper({
    children,
    isLoading,
    fullWith,
}: SkeletonWrapperProps) {
    if (!isLoading) return children;

    return (
        <Skeleton className={cn(fullWith && 'w-full')}>
            <div className='opacity-0'>{children}</div>
        </Skeleton>
    );
}

export default SkeletonWrapper;
