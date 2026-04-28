/**
 * Centralized utility functions for formatting data across the PropEx application.
 */

/**
 * Formats a number as a currency string in Indian Rupees (INR) using the en-IN locale.
 * Example: 100000 -> ₹ 1,00,000
 * 
 * @param amount - The numeric value to format
 * @returns A formatted currency string
 */
export const formatCurrency = (amount: number | undefined | null): string => {
    if (amount === undefined || amount === null) return 'N/A';
    
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(amount);
};
