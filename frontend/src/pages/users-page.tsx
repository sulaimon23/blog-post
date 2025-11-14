import { Loader } from '@/components/loader';
import PageLayout from '@/components/page-layout';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { PAGINATION } from '@/constants';
import { useUsersWithPagination } from '@/hooks/use-users';
import { formatAddress, mapUserResponseToUser } from '@/lib/utils';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function UsersPage() {
    const navigate = useNavigate();
    const [pageNumber, setPageNumber] = useState<number>(PAGINATION.DEFAULT_PAGE_NUMBER);
    const { users, count, isLoading, isError, error } = useUsersWithPagination(
        pageNumber,
        PAGINATION.DEFAULT_PAGE_SIZE
    );

    const totalPages = Math.ceil(count / PAGINATION.DEFAULT_PAGE_SIZE);
    const hasNextPage = pageNumber < totalPages - 1;
    const hasPrevPage = pageNumber > 0;

    const handleRowClick = (userId: string) => {
        navigate(`/users/${userId}/posts`);
    };

    const pageNumbers = useMemo(() => {
        const pages: { number: number; isActive: boolean }[] = [];
        const currentPage = pageNumber + 1;

        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push({ number: i, isActive: i === currentPage });
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 3; i++) {
                    pages.push({ number: i, isActive: i === currentPage });
                }
            } else if (currentPage >= totalPages - 2) {
                for (let i = totalPages - 2; i <= totalPages; i++) {
                    pages.push({ number: i, isActive: i === currentPage });
                }
            } else {
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pages.push({ number: i, isActive: i === currentPage });
                }
            }
        }

        return pages;
    }, [pageNumber, totalPages]);

    const endPageNumbers = useMemo(() => {
        if (totalPages <= 5) return [];
        if (pageNumber + 1 >= totalPages - 2) return [];
        return [totalPages];
    }, [pageNumber, totalPages]);

    const startPageNumbers = useMemo(() => {
        if (totalPages <= 5) return [];
        if (pageNumber + 1 <= 3) return [];
        return [1];
    }, [pageNumber, totalPages]);

    return (
        <PageLayout>
            <div className="flex flex-col items-start gap-10 ">
                <h1 className="text-6xl-medium text-text-base">
                    Users
                </h1>
                <div className="w-full rounded-lg border border-solid border-border-base">
                    <Table>
                        <TableHeader>
                            <TableRow className='border-border-base'>
                                <TableHead className="max-w-96 text-sm-medium text-text-muted">
                                    Full name
                                </TableHead>
                                <TableHead className="max-w-96 text-sm-medium text-text-muted">
                                    Email address
                                </TableHead>
                                <TableHead className="max-w-96 text-sm-medium text-text-muted">
                                    Address
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell className='h-54' colSpan={3}>
                                        <Loader />
                                    </TableCell>
                                </TableRow>
                            ) : isError ? (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center text-destructive">
                                        {error instanceof Error ? error.message : 'Failed to load users'}
                                    </TableCell>
                                </TableRow>
                            ) : users.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center">
                                        No users found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                users.map((userData) => {
                                    const user = mapUserResponseToUser(userData);
                                    const addressText = user.address
                                        ? formatAddress(user.address)
                                        : '';

                                    return (
                                        <TableRow
                                            key={user.id}
                                            className="cursor-pointer border-border-base hover:bg-muted/50"
                                            onClick={() => handleRowClick(user.id)}
                                        >
                                            <TableCell className="text-sm-normal text-text-base max-w-96 truncate" title={user.name}>
                                                {user.name}
                                            </TableCell>
                                            <TableCell className="text-sm-normal text-text-base max-w-96 truncate" title={user.email}>
                                                {user.email}
                                            </TableCell>
                                            <TableCell
                                                className="text-sm-normal text-text-base max-w-96 truncate"
                                                title={addressText}
                                            >
                                                {addressText || 'No address'}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </div>
                <div className="flex flex-col sm:items-end items-center gap-2.5 w-full">
                    <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2 sm:gap-6">
                        <Button
                            variant="ghost"
                            onClick={() => setPageNumber((p) => (p > 0 ? p - 1 : 0))}
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
                            {startPageNumbers.length > 0 && (
                                <>
                                    {startPageNumbers.map((pageNum) => (
                                        <Button
                                            key={pageNum}
                                            variant="ghost"
                                            onClick={() => setPageNumber(pageNum - 1)}
                                            className="w-8 h-8 sm:w-10 sm:h-10 items-center justify-center rounded-md"
                                        >
                                            <span className="text-sm-medium text-text-base">
                                                {pageNum}
                                            </span>
                                        </Button>
                                    ))}
                                    {startPageNumbers.length > 0 && (
                                        <div className="w-7 h-7 sm:w-9 sm:h-9 flex items-center justify-center rounded-md">
                                            <MoreHorizontal className="w-4 h-4 sm:w-6 sm:h-6" />
                                        </div>
                                    )}
                                </>
                            )}
                            {pageNumbers.map((page) => (
                                <Button
                                    key={page.number}
                                    variant={page.isActive ? 'outline' : 'ghost'}
                                    onClick={() => setPageNumber(page.number - 1)}
                                    className={`w-8 h-8 sm:w-10 sm:h-10 items-center justify-center rounded-md ${page.isActive
                                        ? 'bg-background border border-solid border-border-base'
                                        : ''
                                        }`}
                                >
                                    <span className="text-sm-medium text-text-base">
                                        {page.number}
                                    </span>
                                </Button>
                            ))}
                            {endPageNumbers.length > 0 && (
                                <>
                                    <div className="w-7 h-7 sm:w-9 sm:h-9 flex items-center justify-center rounded-md">
                                        <MoreHorizontal className="w-4 h-4 sm:w-6 sm:h-6" />
                                    </div>
                                    {endPageNumbers.map((pageNum) => (
                                        <Button
                                            key={pageNum}
                                            variant="ghost"
                                            onClick={() => setPageNumber(pageNum - 1)}
                                            className="w-8 h-8 sm:w-10 sm:h-10 items-center justify-center rounded-md"
                                        >
                                            <span className="text-sm-medium text-text-base">
                                                {pageNum}
                                            </span>
                                        </Button>
                                    ))}
                                </>
                            )}
                        </div>
                        <Button
                            variant="ghost"
                            onClick={() => setPageNumber((p) => p + 1)}
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
            </div>
        </PageLayout>
    );
}
