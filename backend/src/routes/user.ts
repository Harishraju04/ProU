import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { auth } from "../middleware/authMiddleware";
import { loginSchema, signUpSchema } from "../types/types";
import jwt from "jsonwebtoken";
const router = Router();

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || "qwert";

router.post("/login", async (req, res) => {
    const body = req.body;

    try {
        const parseResult = loginSchema.safeParse(body);
        console.log(JWT_SECRET);
        if (!parseResult.success) {
            return res.status(400).json({ msg: "Invalid inputs" });
        }

        const user = await prisma.user.findFirst({
            where: {
                email: body.email,
                password: body.password      
            },
            select: { id: true, email: true }
        });

        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        const token = jwt.sign({ id: user.id }, JWT_SECRET);

        return res.json({ token });
    } catch (err) {
        console.error("Signin error:", err);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
});

router.post("/signup", async (req, res) => {
    const body = req.body;

    try {
        const parseResult = signUpSchema.safeParse(body); 
        console.log(parseResult);
        if (!parseResult.success) {
            return res.status(400).json({ msg: "Invalid signup details" });
        }

        const userExists = await prisma.user.findFirst({
            where: { email: body.email }
        });

        if (userExists) {
            return res.status(400).json({ msg: "Email already used" });
        }

        const user = await prisma.user.create({
            data: {
                name: body.username,
                email: body.email,
                password: body.password     
            }
        });

        return res.json({ msg: "User created successfully" });
    } catch (err) {
        console.error("Signup error:", err);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
});


router.get("/", auth, async (req, res) => {
    const userId = (req as any).user.id;

    const user = await prisma.user.findFirst({
        where: { id: userId },
        select: { id: true, name: true, email: true }
    });

    return res.json({ user });
});

router.get("/me", auth, async (req, res) => {
    try {
        const userId = (req as any).user; // your auth middleware sets this

        if (!userId) {
            return res.status(401).json({ msg: "Unauthorized" });
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true
            }
        });

        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        return res.json({ user });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: "Internal server error" });
    }
});

router.get("/search", auth, async (req, res) => {
    try {
        const q = req.query.q as string;

        const users = await prisma.user.findMany({
            where: {
                name: {
                    contains: q,
                    mode: "insensitive"
                }
            },
            select: { id: true, name: true, email: true }
        });

        res.json({ users });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Internal server error" });
    }
});



export const userRouter = router;