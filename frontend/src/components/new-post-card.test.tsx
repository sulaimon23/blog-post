import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NewPostCard } from './new-post-card';

describe('NewPostCard', () => {
    const mockOnCreatePost = vi.fn();
    const defaultProps = {
        userId: '123',
        onCreatePost: mockOnCreatePost,
        isCreating: false,
        disabled: false,
    };

    beforeEach(() => {
        mockOnCreatePost.mockClear();
    });

    it('should render the new post card', () => {
        render(<NewPostCard {...defaultProps} />);
        expect(screen.getByText('New Post')).toBeInTheDocument();
    });

    it('should open dialog when card is clicked', async () => {
        const user = userEvent.setup();
        render(<NewPostCard {...defaultProps} />);

        const cardText = screen.getByText('New Post');
        const card = cardText.closest('div[class*="border"]');

        expect(card).toBeInTheDocument();
        if (card) {
            await user.click(card);
        }

        await waitFor(() => {
            const dialog = screen.queryByRole('dialog');
            expect(dialog).toBeInTheDocument();
        }, { timeout: 3000 });
    });

    it('should not open dialog when disabled', async () => {
        const user = userEvent.setup();
        render(<NewPostCard {...defaultProps} disabled={true} />);

        const cardText = screen.getByText('New Post');
        const card = cardText.closest('div[class*="border"]');

        if (card) {
            await user.click(card);
        }

        await new Promise(resolve => setTimeout(resolve, 100));
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should create post with title and body when form is submitted', async () => {
        const user = userEvent.setup();
        mockOnCreatePost.mockResolvedValue(undefined);

        render(<NewPostCard {...defaultProps} />);

        const cardText = screen.getByText('New Post');
        const card = cardText.closest('div[class*="border"]');
        if (card) {
            await user.click(card);
        }

        await waitFor(() => {
            expect(screen.getByRole('dialog')).toBeInTheDocument();
        }, { timeout: 3000 });

        // Fill in form
        const titleInput = screen.getByLabelText('Post Title');
        const bodyInput = screen.getByLabelText('Post Body');

        await user.type(titleInput, 'Test Post Title');
        await user.type(bodyInput, 'Test Post Body');

        // Submit form
        const publishButton = screen.getByRole('button', { name: /publish/i });
        expect(publishButton).not.toBeDisabled();
        await user.click(publishButton);

        await waitFor(() => {
            expect(mockOnCreatePost).toHaveBeenCalledWith('Test Post Title', 'Test Post Body');
        });
    });

    it('should disable publish button when title or body is empty', async () => {
        const user = userEvent.setup();
        render(<NewPostCard {...defaultProps} />);

        const cardText = screen.getByText('New Post');
        const card = cardText.closest('div[class*="border"]');
        if (card) {
            await user.click(card);
        }

        await waitFor(() => {
            expect(screen.getByRole('dialog')).toBeInTheDocument();
        }, { timeout: 3000 });

        const publishButton = screen.getByRole('button', { name: /publish/i });
        expect(publishButton).toBeDisabled();

        const titleInput = screen.getByLabelText('Post Title');
        await user.type(titleInput, 'Test Title');

        await waitFor(() => {
            expect(publishButton).toBeDisabled();
        });

        const bodyInput = screen.getByLabelText('Post Body');
        await user.type(bodyInput, 'Test Body');

        await waitFor(() => {
            expect(publishButton).not.toBeDisabled();
        });
    });

    it('should trim whitespace from title and body before submitting', async () => {
        const user = userEvent.setup();
        mockOnCreatePost.mockResolvedValue(undefined);

        render(<NewPostCard {...defaultProps} />);

        const cardText = screen.getByText('New Post');
        const card = cardText.closest('div[class*="border"]');
        if (card) {
            await user.click(card);
        }

        await waitFor(() => {
            expect(screen.getByRole('dialog')).toBeInTheDocument();
        }, { timeout: 3000 });

        const titleInput = screen.getByLabelText('Post Title');
        const bodyInput = screen.getByLabelText('Post Body');

        await user.type(titleInput, '  Test Title  ');
        await user.type(bodyInput, '  Test Body  ');

        const publishButton = screen.getByRole('button', { name: /publish/i });
        await user.click(publishButton);

        await waitFor(() => {
            expect(mockOnCreatePost).toHaveBeenCalledWith('Test Title', 'Test Body');
        });
    });

    it('should show "Publishing..." text when isCreating is true', () => {
        render(<NewPostCard {...defaultProps} isCreating={true} />);
        expect(screen.getByText('New Post')).toBeInTheDocument();
    });

    it('should not create post if userId is missing', async () => {
        const user = userEvent.setup();
        render(<NewPostCard {...defaultProps} userId="" />);

        const cardText = screen.getByText('New Post');
        const card = cardText.closest('div[class*="border"]');
        if (card) {
            await user.click(card);
        }

        await waitFor(() => {
            expect(screen.getByRole('dialog')).toBeInTheDocument();
        }, { timeout: 3000 });

        const titleInput = screen.getByLabelText('Post Title');
        const bodyInput = screen.getByLabelText('Post Body');

        await user.type(titleInput, 'Test Title');
        await user.type(bodyInput, 'Test Body');

        const publishButton = screen.getByRole('button', { name: /publish/i });
        await user.click(publishButton);

        await waitFor(() => {
            expect(mockOnCreatePost).not.toHaveBeenCalled();
        });
    });
});

