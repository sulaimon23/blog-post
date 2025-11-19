import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
} from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle } from 'lucide-react';
import { Fragment, useState } from 'react';

const MAX_TITLE_LENGTH = 150;
const MAX_BODY_LENGTH = 1000;

interface NewPostCardProps {
    userId: string;
    onCreatePost: (title: string, body: string) => Promise<void>;
    isCreating?: boolean;
    disabled?: boolean;
}

export function NewPostCard({ userId, onCreatePost, isCreating, disabled }: NewPostCardProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleCreatePost = async () => {
        setError(null);

        if (!userId || !title.trim() || !body.trim()) {
            setError('Title and body are required');
            return;
        }

        const trimmedTitle = title.trim();
        const trimmedBody = body.trim();

        if (trimmedTitle.length > MAX_TITLE_LENGTH) {
            setError(`Title exceeds maximum length of ${MAX_TITLE_LENGTH} characters. Current length: ${trimmedTitle.length}`);
            return;
        }

        if (trimmedBody.length > MAX_BODY_LENGTH) {
            setError(`Body exceeds maximum length of ${MAX_BODY_LENGTH} characters. Current length: ${trimmedBody.length}`);
            return;
        }

        try {
            await onCreatePost(trimmedTitle, trimmedBody);
            setTitle('');
            setBody('');
            setError(null);
            setIsDialogOpen(false);
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to create post';
            setError(errorMessage);
        }
    };

    const handleCardClick = () => {
        if (!disabled) {
            setIsDialogOpen(true);
            setError(null);
        }
    };

    const handleDialogClose = (open: boolean) => {
        if (!open) {
            setTitle('');
            setBody('');
            setError(null);
        }
        setIsDialogOpen(open);
    };

    const titleLength = title.length;
    const bodyLength = body.length;
    const isTitleOverLimit = titleLength > MAX_TITLE_LENGTH;
    const isBodyOverLimit = bodyLength > MAX_BODY_LENGTH;

    return (
        <Fragment>
            <Card
                className={`flex flex-col h-[293px] w-full md:w-[270px] items-center justify-center gap-2 bg-white rounded-lg border-dashed shadow-none border-border-base transition-colors ${disabled
                    ? 'opacity-50 cursor-not-allowed'
                    : 'cursor-pointer hover:bg-muted'
                    }`}
                onClick={handleCardClick}
            >
                <CardContent className="flex flex-col items-center justify-center gap-2 p-6">
                    <PlusCircle className="w-6 h-6 text-muted-foreground" />
                    <span className="text-sm-semibold text-text-base">
                        New Post
                    </span>
                </CardContent>
            </Card>

            <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
                <DialogContent className='max-w-2xl'>
                    <DialogHeader>
                        <DialogTitle className="text-left text-4xl font-medium">New Post</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <Label htmlFor="title">
                                    Post Title
                                </Label>
                                <span className={`text-xs ${isTitleOverLimit ? 'text-destructive' : 'text-muted-foreground'}`}>
                                    {titleLength}/{MAX_TITLE_LENGTH}
                                </span>
                            </div>
                            <Input
                                id="title"
                                value={title}
                                onChange={(e) => {
                                    setTitle(e.target.value);
                                    setError(null);
                                }}
                                placeholder="Give your post a title"
                                maxLength={MAX_TITLE_LENGTH + 10}
                                className={isTitleOverLimit ? 'border-destructive' : ''}
                            />
                            {isTitleOverLimit && (
                                <p className="text-xs text-destructive mt-1">
                                    Title exceeds maximum length of {MAX_TITLE_LENGTH} characters
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <Label htmlFor="body">
                                    Post Body
                                </Label>
                                <span className={`text-xs ${isBodyOverLimit ? 'text-destructive' : 'text-muted-foreground'}`}>
                                    {bodyLength}/{MAX_BODY_LENGTH}
                                </span>
                            </div>
                            <Textarea
                                id="body"
                                value={body}
                                onChange={(e) => {
                                    setBody(e.target.value);
                                    setError(null);
                                }}
                                placeholder="Write something mind-blowing"
                                rows={6}
                                maxLength={MAX_BODY_LENGTH + 10}
                                className={isBodyOverLimit ? 'border-destructive' : ''}
                            />
                            {isBodyOverLimit && (
                                <p className="text-xs text-destructive mt-1">
                                    Body exceeds maximum length of {MAX_BODY_LENGTH} characters
                                </p>
                            )}
                        </div>
                        {error && (
                            <div className="px-3 py-2 rounded-md bg-destructive/5 border border-destructive/10">
                                <p className="text-xs text-destructive">{error}</p>
                            </div>
                        )}
                    </div>
                    <DialogFooter className="flex-row justify-end gap-4">
                        <Button
                            variant="outline"
                            onClick={() => handleDialogClose(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleCreatePost}
                            disabled={!title.trim() || !body.trim() || isCreating || isTitleOverLimit || isBodyOverLimit}
                        >
                            {isCreating ? 'Publishing...' : 'Publish'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Fragment>
    );
}

