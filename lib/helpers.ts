import { Currencies } from './constants/currencies';

/**
 * Convertit un objet Date en un objet Date UTC.
 *
 * Cette fonction prend un objet Date local et retourne un nouvel objet Date
 * représentant la même date et heure en temps universel coordonné (UTC).
 *
 * @param {Date} date - L'objet Date à convertir en UTC.
 * @returns {Date} Un nouvel objet Date qui représente la date et l'heure en UTC.
 *
 * @example
 * // Si vous êtes dans le fuseau horaire UTC-5 et que la date locale est le 1er janvier 2023 à 10:15:30.150
 * const localDate = new Date(2023, 0, 1, 10, 15, 30, 150);
 * const utcDate = DateToUTCDate(localDate);
 * console.log(utcDate); // Affiche "2023-01-01T15:15:30.150Z" dans la console
 */
export function DateToUTCDate(date: Date) {
    return new Date(
        Date.UTC(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            date.getHours(),
            date.getMinutes(),
            date.getSeconds(),
            date.getMilliseconds()
        )
    );
}

/**
 * Crée un formateur de nombres pour une devise spécifique en utilisant l'API Intl.NumberFormat.
 *
 * Cette fonction prend un code de devise (par exemple "USD", "EUR") et retourne un objet
 * Intl.NumberFormat configuré pour formater des nombres dans cette devise et selon les
 * conventions locales associées à cette devise.
 *
 * @param {string} currency - Le code de la devise pour laquelle le formateur est créé.
 * @returns {Intl.NumberFormat} Un nouvel objet Intl.NumberFormat configuré pour la devise spécifiée.
 *
 * @example
 * // Création d'un formateur pour la devise USD
 * const formatterUSD = GetFormatterForCurrency('USD');
 * console.log(formatterUSD.format(123456.789)); // Affiche "$123,456.79" si en locale US
 *
 * @example
 * // Création d'un formateur pour la devise EUR
 * const formatterEUR = GetFormatterForCurrency('EUR');
 * console.log(formatterEUR.format(123456.789)); // Affiche "123 456,79 €" si en locale FR
 */
export function GetFormatterForCurrency(currency: string) {
    const locale = Currencies.find((c) => c.value === currency)?.locale;

    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
    });
}
