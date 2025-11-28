import z from "zod";

export const loginSchema = z.object({
    email: z.email(),
    password: z.string().min(6)
})

export const signUpSchema = z.object({
    username: z.string().min(5),
    email:z.email(),
    password:z.string().min(6),
})

export const teamCreateSchema = z.object({
    name:z.string(),
    description:z.string().optional(),
    groupAdmin: z.uuid(),
    members: z.array(z.string())
})

export const taskCreateSchema = z.object({
    title: z.string(),
    description: z.string(),
    priority: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"),
    teamId: z.uuid(),
    assigneeId: z.uuid(),
    dueDate: z.iso.date().optional()
})
