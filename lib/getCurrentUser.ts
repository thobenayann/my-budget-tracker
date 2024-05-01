import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export async function getCurrentUser(redirectPath = '/sign-in') {
    const user = await currentUser();

    if (!user) {
        redirect(redirectPath);
    }

    return user;
}
