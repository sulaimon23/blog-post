import { Request, Response, Router } from "express";
import { createPost, deletePost, getPostById, getPosts } from "../db/posts/posts";

const router = Router();

const MAX_TITLE_LENGTH = 150;
const MAX_BODY_LENGTH = 1000;

router.get("/", async (req: Request, res: Response) => {
    try {
        const userId = req.query.userId?.toString();
        if (!userId) {
            res.status(400).send({ error: "userId query parameter is required" });
            return;
        }
        const posts = await getPosts(userId);
        res.send(posts);
    } catch (error) {
        console.error(`Error fetching posts for user ${req.query.userId}: `, error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
        res.status(500).send({ error: `Failed to fetch posts: ${errorMessage} ` });
    }
});

router.get("/:id", async (req: Request, res: Response) => {
    try {
        const postId = req.params.id;
        if (!postId) {
            res.status(400).send({ error: "Post ID is required" });
            return;
        }

        const post = await getPostById(postId);
        if (!post) {
            res.status(404).send({ error: `Post with ID ${postId} not found` });
            return;
        }

        res.send(post);
    } catch (error) {
        console.error(`Error fetching post ${req.params.id}: `, error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
        res.status(500).send({ error: `Failed to fetch post: ${errorMessage} ` });
    }
});

router.post("/", async (req: Request, res: Response) => {
    try {
        const { title, body, userId } = req.body;

        if (!title || !body || !userId) {
            res.status(400).send({ error: "title, body, and userId are required fields" });
            return;
        }

        if (typeof title !== "string" || typeof body !== "string" || typeof userId !== "string") {
            res.status(400).send({ error: "Invalid data types. Title, body, and userId must be strings." });
            return;
        }

        const trimmedTitle = title.trim();
        const trimmedBody = body.trim();

        if (trimmedTitle.length === 0 || trimmedBody.length === 0) {
            res.status(400).send({ error: "Title and body cannot be empty" });
            return;
        }

        if (trimmedTitle.length > MAX_TITLE_LENGTH) {
            res.status(400).send({
                error: `Title exceeds maximum length of ${MAX_TITLE_LENGTH} characters.Current length: ${trimmedTitle.length} `
            });
            return;
        }

        if (trimmedBody.length > MAX_BODY_LENGTH) {
            res.status(400).send({
                error: `Body exceeds maximum length of ${MAX_BODY_LENGTH} characters.Current length: ${trimmedBody.length} `
            });
            return;
        }

        const post = await createPost({ title: trimmedTitle, body: trimmedBody, userId });
        res.status(201).send(post);
    } catch (error) {
        console.error("Error creating post:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
        res.status(500).send({ error: `Failed to create post: ${errorMessage} ` });
    }
});

router.delete("/:id", async (req: Request, res: Response) => {
    const postId = req.params.id;
    try {
        if (!postId) {
            res.status(400).send({ error: "Post ID is required" });
            return;
        }

        await deletePost(postId);
        res.status(204).send();
    } catch (error) {
        if (error instanceof Error && error.message === "Post not found") {
            res.status(404).send({ error: `Post with ID ${postId} not found` });
            return;
        }
        console.error(`Error deleting post ${postId}: `, error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
        res.status(500).send({ error: `Failed to delete post: ${errorMessage} ` });
    }
});

export default router;
