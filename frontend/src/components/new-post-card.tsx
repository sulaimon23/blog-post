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

    const handleCreatePost = async () => {
        if (!userId || !title.trim() || !body.trim()) return;

        await onCreatePost(title.trim(), body.trim());

        setTitle('');
        setBody('');
        setIsDialogOpen(false);
    };

    const handleCardClick = () => {
        if (!disabled) {
            setIsDialogOpen(true);
        }
    };

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

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-left text-4xl font-medium">New Post</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">
                                Post Title
                            </Label>
                            <Input
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Give your post a title"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="body">
                                Post Body
                            </Label>
                            <Textarea
                                id="body"
                                value={body}
                                onChange={(e) => setBody(e.target.value)}
                                placeholder="Write something mind-blowing"
                                rows={6}
                            />
                        </div>
                    </div>
                    <DialogFooter className="flex-row justify-end gap-4">
                        <Button
                            variant="outline"
                            onClick={() => setIsDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleCreatePost}
                            disabled={!title.trim() || !body.trim() || isCreating}
                        >
                            {isCreating ? 'Publishing...' : 'Publish'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Fragment>
    );
}
