import { Request, Response, Router } from "express";
import { getUserById, getUsers, getUsersCount } from "../db/users/users";

const router = Router();

function formatAddress(user: any): any {
    if (!user) return user;

    const parts: string[] = [];
    if (user.street) parts.push(user.street);
    if (user.state) parts.push(user.state);
    if (user.city) parts.push(user.city);
    if (user.zipcode) parts.push(user.zipcode);

    return {
        ...user,
        formattedAddress: parts.length > 0 ? parts.join(', ') : null,
    };
}

router.get("/", async (req: Request, res: Response) => {
    try {
        const pageNumber = Number(req.query.pageNumber) || 0;
        const pageSize = Number(req.query.pageSize) || 4;
        if (pageNumber < 0 || pageSize < 1) {
            res.status(400).send({ error: "Invalid page number or page size. Page number must be >= 0 and page size must be >= 1." });
            return;
        }

        const users = await getUsers(pageNumber, pageSize);
        const formattedUsers = users.map(formatAddress);
        res.send(formattedUsers);
    } catch (error) {
        console.error("Error fetching users:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
        res.status(500).send({ error: `Failed to fetch users: ${errorMessage}` });
    }
});

router.get("/count", async (req: Request, res: Response) => {
    try {
        const count = await getUsersCount();
        res.send({ count });
    } catch (error) {
        console.error("Error fetching users count:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
        res.status(500).send({ error: `Failed to fetch users count: ${errorMessage}` });
    }
});

router.get("/:id", async (req: Request, res: Response) => {
    try {
        const userId = req.params.id;
        if (!userId) {
            res.status(400).send({ error: "User ID is required" });
            return;
        }

        const user = await getUserById(userId);
        if (!user) {
            res.status(404).send({ error: `User with ID ${userId} not found` });
            return;
        }

        const formattedUser = formatAddress(user);
        res.send(formattedUser);
    } catch (error) {
        console.error(`Error fetching user ${req.params.id}:`, error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
        res.status(500).send({ error: `Failed to fetch user: ${errorMessage}` });
    }
});

export default router;
