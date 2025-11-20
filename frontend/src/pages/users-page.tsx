import { Loader } from '@/components/loader';
import PageLayout from '@/components/page-layout';
import { Pagination } from '@/components/pagination';
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
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function UsersPage() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const pageFromUrl = searchParams.get('page');
    const pageNumber = pageFromUrl
        ? Math.max(0, parseInt(pageFromUrl, 10) - 1)
        : PAGINATION.DEFAULT_PAGE_NUMBER;

    const { users, count, isLoading, isFetching, isError, error } = useUsersWithPagination(
        pageNumber,
        PAGINATION.DEFAULT_PAGE_SIZE
    );

    const totalPages = Math.ceil(count / PAGINATION.DEFAULT_PAGE_SIZE);

    const handleRowClick = (userId: string) => {
        navigate(`/users/${userId}/posts`);
    };

    const handlePageChange = (newPage: number) => {
        const newSearchParams = new URLSearchParams(searchParams);
        if (newPage === PAGINATION.DEFAULT_PAGE_NUMBER) {
            newSearchParams.delete('page');
        } else {
            newSearchParams.set('page', (newPage + 1).toString());
        }
        setSearchParams(newSearchParams);
    };

    return (
        <PageLayout>
            <div className="flex flex-col items-start gap-10 ">
                <h1 className="text-6xl-medium text-text-base">
                    Users
                </h1>
                <div className="w-full rounded-lg border border-solid border-border-base">
                    <Table >
                        <TableHeader>
                            <TableRow className='border-border-base'>
                                <TableHead
                                    style={{ minWidth: '200px' }}
                                    className="w-[30%] text-sm-medium text-text-muted">
                                    Full name
                                </TableHead>
                                <TableHead
                                    style={{ minWidth: '200px' }}
                                    className="w-[35%] text-sm-medium text-text-muted">
                                    Email address
                                </TableHead>
                                <TableHead className="text-sm-medium text-text-muted"
                                    style={{ width: '392px', minWidth: '392px', maxWidth: '392px' }}
                                >
                                    Address
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="h-[216px]">
                            {isLoading || isFetching ? (
                                <TableRow className="h-full">
                                    <TableCell className='h-full' colSpan={3}>
                                        <div className="h-full flex items-center justify-center">
                                            <Loader />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : isError ? (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center py-6">
                                        <p className="text-sm text-destructive">
                                            {error instanceof Error ? error.message : 'Failed to load users'}
                                        </p>
                                    </TableCell>
                                </TableRow>
                            ) : !isLoading && !isFetching && users.length === 0 ? (
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
                                    const displayAddress = userData.formattedAddress || addressText || 'No address';

                                    return (
                                        <TableRow
                                            key={user.id}
                                            className="cursor-pointer border-border-base hover:bg-muted/50"
                                            onClick={() => handleRowClick(user.id)}
                                        >
                                            <TableCell className="w-[30%] text-sm-normal text-text-base truncate" title={user.name}>
                                                {user.name}
                                            </TableCell>
                                            <TableCell className="w-[35%] text-sm-normal text-text-base truncate" title={user.email}>
                                                {user.email}
                                            </TableCell>
                                            <TableCell
                                                className="text-sm-normal text-text-base truncate"
                                                title={displayAddress}
                                                style={{ width: '392px', minWidth: '392px', maxWidth: '392px' }}
                                            >
                                                {displayAddress}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </div>
                <Pagination
                    currentPage={pageNumber}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            </div>
        </PageLayout>
    );
}
