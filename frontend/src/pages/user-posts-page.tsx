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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { useCreatePost, useDeletePost, usePosts } from '@/hooks/use-posts';
import { useUser } from '@/hooks/use-users';
import { mapUserResponseToUser } from '@/lib/utils';
import { AlertTriangle, ChevronRight, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function UserPostsPage() {
    const { userId } = useParams<{ userId: string }>();
    const navigate = useNavigate();
    const [postToDelete, setPostToDelete] = useState<{ id: string; title: string } | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const { data: posts, isLoading: postsLoading, isFetching: postsFetching, isError: postsError } = usePosts(
        userId
    );
    const { data: userData, isLoading: userLoading, isFetching: userFetching, isError: userError } = useUser(userId);
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

    const handleDeleteClick = (postId: string, postTitle: string) => {
        setPostToDelete({ id: postId, title: postTitle });
        setIsDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!postToDelete) return;

        await deletePostMutation.mutateAsync(postToDelete.id);
        setIsDeleteDialogOpen(false);
        setPostToDelete(null);
    };

    const handleDeleteCancel = () => {
        setIsDeleteDialogOpen(false);
        setPostToDelete(null);
    };

    if (postsLoading || postsFetching || userLoading || userFetching) {
        return (
            <div className="flex items-center justify-center min-h-screen w-full">
                <Loader />
            </div>
        );
    }

    return (
        <PageLayout>
            <div className="flex flex-col items-start justify-center gap-11">
                <header className="flex flex-col w-full  items-start gap-6">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink
                                    onClick={() => navigate(-1)}
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
                    {(postsError || userError) ? (
                        <Card className="col-span-full">
                            <CardContent className="py-6 text-center">
                                <p className="text-sm text-destructive">
                                    {postsError ? 'Failed to load posts' : 'Failed to load user information'}
                                </p>
                            </CardContent>
                        </Card>
                    ) : Array.isArray(posts) && posts.length > 0 ? (
                        posts.map((post) => (
                            <Card
                                key={post.id}
                                className="flex flex-col h-[293px] w-full md:w-[270px] bg-white rounded-lg border hover:shadow-custom border-border-base relative transition-shadow"
                            >
                                <CardContent className="flex flex-col overflow-hidden items-start gap-4 p-6 h-full relative">
                                    <h2 className="text-lg-medium text-ellipsis line-clamp-3 text-text-base pr-8 wrap-anywhere">
                                        {post.title}
                                    </h2>
                                    <p
                                        className="flex-1 text-sm-regular text-text-base overflow-hidden line-clamp-4 wrap-anywhere"
                                        title={post.body}
                                    >
                                        {post.body}
                                    </p>

                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleDeleteClick(post.id, post.title)}
                                        disabled={deletePostMutation.isPending}
                                        className="text-destructive hover:text-destructive hover:bg-destructive/10 absolute top-1 right-1 z-20 bg-white/80 backdrop-blur-sm"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </CardContent>
                            </Card>
                        ))
                    ) : !postsLoading && !postsFetching && Array.isArray(posts) && posts.length === 0 ? (
                        <Card className="flex flex-col h-[293px] w-full md:w-[270px] bg-white rounded-lg border hover:shadow-custom border-border-base relative transition-shadow">
                            <CardContent className="py-8 h-full flex items-center justify-center text-center text-muted-foreground">
                                No posts yet. Create your first post!
                            </CardContent>
                        </Card>
                    ) : null}
                </div>
            </div>

            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <div className="flex items-start gap-4">
                            <div className="flex p-2 shrink-0 items-center justify-center rounded-full bg-destructive/10 ring-4 ring-destructive/5">
                                <AlertTriangle className="h-5 w-5 text-destructive" strokeWidth={2} />
                            </div>
                            <div className="flex-1 space-y-2 pt-0.5">
                                <DialogTitle className="text-left text-xl font-medium leading-tight">Delete Post</DialogTitle>
                                <DialogDescription className="text-left text-sm text-muted-foreground">
                                    This action cannot be undone as post will be permanently removed.
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>
                    <DialogFooter className="flex-row justify-end pt-4 gap-3">
                        <Button
                            variant="outline"
                            onClick={handleDeleteCancel}
                            disabled={deletePostMutation.isPending}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDeleteConfirm}
                            disabled={deletePostMutation.isPending}
                        >
                            {deletePostMutation.isPending ? 'Deleting...' : 'Delete post'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </PageLayout>
    );
}

