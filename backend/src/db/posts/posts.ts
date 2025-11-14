import { randomUUID } from "crypto";
import { connection } from "../connection";
import { deletePostTemplate, insertPostTemplate, selectPostsTemplate } from "./query-templates";
import { CreatePostData, Post } from "./types";

export const getPosts = (userId: string): Promise<Post[]> =>
    new Promise((resolve, reject) => {
        connection.all(selectPostsTemplate, [userId], (error: any, results: Post[]) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(results as Post[]);
        });
    });

export const createPost = (data: CreatePostData): Promise<Post> =>
    new Promise((resolve, reject) => {
        const id = randomUUID();
        const createdAt = new Date().toISOString();

        connection.run(
            insertPostTemplate,
            [id, data.userId, data.title, data.body, createdAt],
            function (this: { lastID: number }, error: any) {
                if (error) {
                    reject(error);
                    return;
                }
                connection.get<Post>(
                    "SELECT * FROM posts WHERE id = ?",
                    [id],
                    (err: any, row: Post | PromiseLike<Post>) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve(row);
                    }
                );
            }
        );
    });

export const deletePost = (postId: string): Promise<void> =>
    new Promise((resolve, reject) => {
        connection.run(deletePostTemplate, [postId], function (this: { changes: number }, error: any) {
            if (error) {
                reject(error);
                return;
            }
            if (this.changes === 0) {
                reject(new Error("Post not found"));
                return;
            }
            resolve();
        });
    });
