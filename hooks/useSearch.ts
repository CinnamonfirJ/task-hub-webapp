import { useMemo } from "react";

/**
 * A hook for client-side filtering of data based on a search query and specified fields.
 * 
 * @param data The array of data to filter
 * @param query The search query string
 * @param fields The keys of the data objects to search within
 * @returns The filtered array of data
 */
export function useSearch<T>(data: T[], query: string, fields: (keyof T | string)[]) {
  return useMemo(() => {
    if (!query || !data) return data || [];
    
    const lowerQuery = query.toLowerCase().trim();
    
    return data.filter((item: any) => {
      return fields.some((field) => {
        // Handle nested fields if necessary (e.g., 'profile.name')
        const value = typeof field === 'string' && field.includes('.') 
          ? field.split('.').reduce((obj, key) => obj?.[key], item)
          : item[field as keyof T];

        if (value === null || value === undefined) return false;
        
        return String(value).toLowerCase().includes(lowerQuery);
      });
    });
  }, [data, query, fields]);
}
