/**
 * Récupère l'utilisateur courant connecté via Clerk et redirige si aucun utilisateur n'est connecté.
 *
 * Cette fonction asynchrone tente de récupérer l'utilisateur courant à l'aide de l'API Clerk.
 * Si aucun utilisateur n'est trouvé (c'est-à-dire non connecté), elle redirige vers une URL spécifiée,
 * par défaut vers la page de connexion.
 *
 * @param {string} [redirectPath='/sign-in'] - Le chemin de redirection si aucun utilisateur n'est trouvé.
 * @returns {Promise<Object|null>} Promesse résolue avec l'objet utilisateur ou null si la redirection a lieu.
 *
 * @example
 * // Utilisation dans une fonction de gestion de page Next.js pour s'assurer que l'utilisateur est connecté
 * export async function getServerSideProps(context) {
 *   const user = await getCurrentUser();
 *   if (!user) {
 *     return { props: {} }; // La redirection est déjà gérée
 *   }
 *   // Retourner les props incluant l'utilisateur si connecté
 *   return { props: { user } };
 * }
 */
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export async function getCurrentUser(redirectPath = '/sign-in') {
    const user = await currentUser();

    if (!user) {
        redirect(redirectPath);
    }

    return user;
}
