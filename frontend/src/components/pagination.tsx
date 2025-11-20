import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { useMemo } from 'react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    const hasNextPage = currentPage < totalPages - 1;
    const hasPrevPage = currentPage > 0;

    const pageNumbers = useMemo(() => {
        const pages: number[] = [];
        const currentPageNumber = currentPage + 1;

        if (totalPages <= 5) {
            // Show all pages if 5 or fewer
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Always show first page
            if (currentPageNumber > 3) {
                pages.push(1);
            }

            // Calculate start and end of visible page range
            let startPage = Math.max(1, currentPageNumber - 1);
            let endPage = Math.min(totalPages, currentPageNumber + 1);

            // Adjust if we're at the beginning
            if (currentPageNumber <= 3) {
                startPage = 1;
                endPage = Math.min(4, totalPages);
            }

            // Adjust if we're at the end
            if (currentPageNumber >= totalPages - 2) {
                startPage = Math.max(1, totalPages - 3);
                endPage = totalPages;
            }

            // Add pages in range
            for (let i = startPage; i <= endPage; i++) {
                if (!pages.includes(i)) {
                    pages.push(i);
                }
            }

            // Always show last page if we have space
            if (currentPageNumber < totalPages - 2 && !pages.includes(totalPages)) {
                pages.push(totalPages);
            }
        }

        return pages.sort((a, b) => a - b).map(page => ({
            number: page,
            isActive: page === currentPageNumber,
        }));
    }, [currentPage, totalPages]);

    const handlePageClick = (pageNumber: number) => {
        onPageChange(pageNumber - 1);
    };

    return (
        <div className="flex flex-col sm:items-end items-center gap-2.5 w-full">
            <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2 sm:gap-6">
                <Button
                    variant="ghost"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={!hasPrevPage}
                    className="inline-flex gap-1 pl-2.5 pr-4 py-0 items-center justify-center rounded-md"
                >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline text-sm-medium text-text-base">
                        Previous
                    </span>
                    <span className="sm:hidden text-sm-medium text-text-base">
                        Prev
                    </span>
                </Button>
                <div className="flex items-center gap-0.5">
                    {pageNumbers.map((page, index) => {
                        const prevPage = index > 0 ? pageNumbers[index - 1].number : 0;
                        const nextPage = index < pageNumbers.length - 1 ? pageNumbers[index + 1].number : totalPages + 1;

                        const showStartEllipsis = index === 0 && page.number > 2 && totalPages > 5;
                        const showEllipsisBefore = prevPage > 0 &&
                            prevPage === 1 &&
                            page.number - prevPage > 1 &&
                            totalPages > 5 &&
                            !(index < pageNumbers.length - 1 && pageNumbers[index + 1].number === totalPages);
                        const showTrailingEllipsis = index < pageNumbers.length - 1 &&
                            nextPage - page.number > 1 &&
                            nextPage === totalPages &&
                            totalPages > 5;

                        return (
                            <div key={page.number} className="flex items-center gap-0.5">
                                {showStartEllipsis && (
                                    <>
                                        <Button
                                            variant="ghost"
                                            onClick={() => handlePageClick(1)}
                                            className="w-8 h-8 sm:w-10 sm:h-10 items-center justify-center rounded-md"
                                        >
                                            <span className="text-sm-medium text-text-base">1</span>
                                        </Button>
                                        <div className="w-7 h-7 sm:w-9 sm:h-9 flex items-center justify-center rounded-md">
                                            <MoreHorizontal className="w-4 h-4 sm:w-6 sm:h-6" />
                                        </div>
                                    </>
                                )}
                                {showEllipsisBefore && (
                                    <div className="w-7 h-7 sm:w-9 sm:h-9 flex items-center justify-center rounded-md">
                                        <MoreHorizontal className="w-4 h-4 sm:w-6 sm:h-6" />
                                    </div>
                                )}
                                <Button
                                    variant={page.isActive ? 'outline' : 'ghost'}
                                    onClick={() => handlePageClick(page.number)}
                                    className={`w-8 h-8 sm:w-10 sm:h-10 items-center justify-center rounded-md ${page.isActive
                                        ? 'bg-background border border-solid border-border-base'
                                        : ''
                                        }`}
                                >
                                    <span className="text-sm-medium text-text-base">
                                        {page.number}
                                    </span>
                                </Button>
                                {showTrailingEllipsis && (
                                    <div className="w-7 h-7 sm:w-9 sm:h-9 flex items-center justify-center rounded-md">
                                        <MoreHorizontal className="w-4 h-4 sm:w-6 sm:h-6" />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
                <Button
                    variant="ghost"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={!hasNextPage}
                    className="inline-flex items-center justify-center gap-1 pl-4 pr-2.5 py-0 rounded-md"
                >
                    <span className="text-sm-medium text-text-base">
                        Next
                    </span>
                    <ChevronRight className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
}
