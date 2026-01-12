import { useEffect, useRef } from "react";
import { TablePagination } from "@eyeseetea/d2-ui-components";

/**
 * Custom hook that modifies pagination text to show "of many" instead of total count.
 * Uses MutationObserver to detect and update pagination text changes.
 */
export function usePaginationTextModifier(
    pagination: Partial<TablePagination>,
    isLoading: boolean
) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const updatePaginationText = () => {
            if (!containerRef.current) return;

            const paginationElements = containerRef.current.querySelectorAll(
                ".MuiTablePagination-caption, .MuiTablePagination-root .MuiTypography-body2, .MuiTablePagination-displayedRows"
            );

            paginationElements.forEach(element => {
                const text = element.textContent || "";
                const newText = text.replace(/\sof\s[\d,]+$/i, " of many");
                if (newText !== text && newText.includes("of many")) {
                    element.textContent = newText;
                }
            });
        };

        const timeoutId = setTimeout(updatePaginationText, 10);

        return () => {
            clearTimeout(timeoutId);
        };
    }, [pagination, isLoading]);

    return containerRef;
}
