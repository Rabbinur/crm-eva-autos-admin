import { useEffect, useState } from "react";

export const useCategories = () => {
    const [categories, setCategories] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL_LARAVEL;

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch(`${BASE_URL}/categories`);

                if (!res.ok) {
                    throw new Error("Failed to fetch categories");
                }

                const data = await res.json();
                console.log(data.data)
                setCategories(data?.data || data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCategories();
    }, [BASE_URL]);

    return { categories, isLoading, error };
};