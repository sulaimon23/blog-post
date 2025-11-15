import { Loader } from '@/components/loader';
import { NewPostCard } from '@/components/new-post-card';
import PageLayout from '@/components/page-layout';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
} from '@/components/ui/card';
import { useCreatePost, useDeletePost, usePosts } from '@/hooks/use-posts';
import { useUsersWithPagination } from '@/hooks/use-users';
import { mapUserResponseToUser } from '@/lib/utils';
import { ChevronRight, Trash2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

export default function UserPostsPage() {
    const { userId } = useParams<{ userId: string }>();
    const navigate = useNavigate();

    const { data: posts, isLoading: postsLoading, isFetching: postsFetching, isError: postsError } = usePosts(
        userId
    );
    const { users } = useUsersWithPagination(0, 1000);
    const userData = Array.isArray(users) ? users.find((u) => u.id === userId) : undefined;
    const user = userData ? mapUserResponseToUser(userData) : undefined;
    const createPostMutation = useCreatePost();
    const deletePostMutation = useDeletePost(userId || '');

    const handleCreatePost = async (title: string, body: string) => {
        if (!userId) return;

        await createPostMutation.mutateAsync({
            title,
            body,
            userId,
        });
    };

    const handleDeletePost = async (postId: string) => {
        await deletePostMutation.mutateAsync(postId);
    };

    return (
        <PageLayout>
            <div className="flex flex-col items-start justify-center gap-11">
                <header className="flex flex-col w-full  items-start gap-6">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink
                                    onClick={() => navigate('/')}
                                    className="text-sm-normal text-text-muted cursor-pointer"
                                >
                                    Users
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator>
                                <ChevronRight className="w-3.5 h-3.5" />
                            </BreadcrumbSeparator>
                            <BreadcrumbItem>
                                <BreadcrumbPage className="text-sm-normal text-text-base">
                                    {user?.name || 'User'}
                                </BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                    <h1 className="w-full text-4xl-medium text-text-base">
                        {user?.name || 'User'}
                    </h1>
                    <p className="w-full text-sm-normal">
                        <span className="text-text-muted">{user?.email || ''} </span>
                        <span className="text-text-base">• {Array.isArray(posts) ? posts.length : 0} {Array.isArray(posts) && posts.length === 1 ? 'Post' : 'Posts'}</span>
                    </p>
                </header>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full">
                    {userId && (
                        <NewPostCard
                            userId={userId}
                            onCreatePost={handleCreatePost}
                            isCreating={createPostMutation.isPending}
                            disabled={postsLoading || postsFetching}
                        />
                    )}
                    {postsLoading || postsFetching ? (
                        <div className="col-span-full">
                            <Loader />
                        </div>
                    ) : postsError ? (
                        <Card className="col-span-full">
                            <CardContent className="py-8 text-center text-destructive">
                                Failed to load posts
                            </CardContent>
                        </Card>
                    ) : Array.isArray(posts) && posts.length > 0 ? (
                        posts.map((post) => (
                            <Card
                                key={post.id}
                                className="flex flex-col h-[293px] w-full md:w-[270px] bg-white rounded-lg border shadow-custom! border-border-base relative"
                            >
                                <CardContent className="flex flex-col overflow-hidden items-start gap-4 p-6 h-full">
                                    <h2 className="text-lg-medium line-clamp-3 text-text-base">
                                        {post.title}
                                    </h2>
                                    <p className="flex-1 text-sm-regular text-text-base overflow-hidden overflow-ellipsis"
                                        title={post.body}
                                    >
                                        {post.body}
                                    </p>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleDeletePost(post.id)}
                                        disabled={deletePostMutation.isPending}
                                        className="text-destructive hover:text-destructive hover:bg-destructive/10 absolute top-1 right-1 z-10"                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </CardContent>
                            </Card>
                        ))
                    ) : !postsLoading && !postsFetching && Array.isArray(posts) && posts.length === 0 ? (
                        <Card className="flex flex-col h-[293px] w-full md:w-[270px] bg-white rounded-lg border shadow-custom border-border-base relative">
                            <CardContent className="py-8 h-full flex items-center justify-center text-center text-muted-foreground">
                                No posts yet. Create your first post!
                            </CardContent>
                        </Card>
                    ) : null}
                </div>
            </div>
        </PageLayout>
    );
}

