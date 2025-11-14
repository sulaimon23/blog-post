import { Router, Request, Response } from "express";
import { getPosts, createPost, deletePost } from "../db/posts/posts";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId?.toString();
    if (!userId) {
      res.status(400).send({ error: "userId is required" });
      return;
    }
    const posts = await getPosts(userId);
    res.send(posts);
  } catch (error) {
    res.status(500).send({ message: "Failed to fetch posts" });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const { title, body, userId } = req.body;

    if (!title || !body || !userId) {
      res.status(400).send({ error: "title, body, and userId are required" });
      return;
    }

    if (typeof title !== "string" || typeof body !== "string" || typeof userId !== "string") {
      res.status(400).send({ error: "Invalid data types" });
      return;
    }

    if (title.trim().length === 0 || body.trim().length === 0) {
      res.status(400).send({ error: "title and body cannot be empty" });
      return;
    }

    const post = await createPost({ title: title.trim(), body: body.trim(), userId });
    res.status(201).send(post);
  } catch (error) {
    res.status(500).send({ message: "Failed to create post" });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const postId = req.params.id;
    if (!postId) {
      res.status(400).send({ error: "Post ID is required" });
      return;
    }

    await deletePost(postId);
    res.status(204).send();
  } catch (error) {
    if (error instanceof Error && error.message === "Post not found") {
      res.status(404).send({ error: "Post not found" });
      return;
    }
    res.status(500).send({ message: "Failed to delete post" });
  }
});

export default router;
