import { Router } from "express";
import { auth } from "../middleware/authMiddleware";
import { taskCreateSchema } from "../types/types";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = Router();

enum TaskStatus {
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  DONE = "DONE"
}

enum TaskPriority{
    LOW = "LOW",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH",
    CRITICAL = "CRITICAL"
}



router.post("/create", auth, async (req, res) => {
    try {
        const parsed = taskCreateSchema.safeParse(req.body);

        if (!parsed.success) {
            return res.status(400).json({ msg: "Invalid inputs" });
        }

        const { title, description, teamId, assigneeId, priority, dueDate } = parsed.data;

        const creatorId = (req as any).user;

        
        const lead = await prisma.membership.findFirst({
            where: {
                userId: creatorId,
                teamId,
                isLead: true
            }
        });

        if (!lead) {
            return res.status(403).json({
                msg: "You are not a team lead for this team"
            });
        }

        
        const member = await prisma.membership.findFirst({
            where: {
                userId: assigneeId,
                teamId
            }
        });

        if (!member) {
            return res.status(400).json({
                msg: "Assignee is not a member of this team"
            });
        }

       
        const task = await prisma.task.create({
            data: {
                title,
                description,
                teamId,
                assigneeId,
                creatorId,
                priority, 
                dueDate: dueDate ? new Date(dueDate) : null,
            }
        });

        return res.status(201).json({
            msg: "Task assigned successfully",
            task
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            msg: "Internal server error"
        });
    }
});



router.put("/:taskId/status", auth, async (req, res) => {
    try {
        const userId = (req as any).user;
        const { status } = req.body;
        const { taskId } = req.params;

        if(!taskId){
            return res.status(400).json({ msg: "Invalid task" });
        }
        if (!["TODO", "IN_PROGRESS", "DONE"].includes(status)) {
            return res.status(400).json({ msg: "Invalid status value" });
        }

       
        const task = await prisma.task.findUnique({ where: { id: taskId } });

        if (!task) return res.status(404).json({ msg: "Task not found" });

        
        if (task.assigneeId !== userId) {
            return res.status(403).json({ msg: "Not authorized" });
        }

        const updatedTask = await prisma.task.update({
            where: { id: taskId },
            data: {
                status,
                startedAt: status === "IN_PROGRESS" && !task.startedAt ? new Date() : task.startedAt,
                completedAt: status === "DONE" ? new Date() : null
            }
        });

        
        await prisma.auditLog.create({
            data: {
                userId,
                taskId,
                action: "STATUS_CHANGE",
                details: { oldStatus: task.status, newStatus: status }
            }
        });

        return res.json({
            msg: "Task status updated",
            task: updatedTask
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Internal server error" });
    }
});


router.get("/:teamId/tasks", auth, async (req, res) => {
    try {
        const userId = (req as any).user;
        const { teamId } = req.params;

        if(!teamId){
             return res.status(400).json({ msg: "Invalid team" });
        }

        const tasks = await prisma.task.findMany({
            where: { teamId },
            include: {
                assignee: { select: { id: true, name: true, email: true } }
            },
            orderBy: { createdAt: "desc" }
        });

        return res.json({ tasks });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Internal server error" });
    }
});


router.get("/my", auth, async (req, res) => {
    try {
        const userId = (req as any).user;

        const tasks = await prisma.task.findMany({
            where: {
                assigneeId: userId
            },
            orderBy: { createdAt: "desc" }
        });

        return res.json({ tasks });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Internal server error" });
    }
});



export const taskRouter = router;