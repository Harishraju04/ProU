import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { auth } from "../middleware/authMiddleware";

const prisma = new PrismaClient();
const router = Router();


router.get("/team/:teamId", auth, async (req, res) => {
    try {
        const { teamId } = req.params;
        const userId = (req as any).user;

        if (!teamId) {
            return res.status(400).json({ msg: "Team ID is required" });
        }

        
        const member = await prisma.membership.findFirst({
            where: { teamId, userId }
        });

        if (!member) {
            return res.status(403).json({ msg: "Not a team member" });
        }

        
        const totalTasks = await prisma.task.count({
            where: { teamId }
        });

       
        const tasksByStatus = await prisma.task.groupBy({
            by: ["status"],
            where: { teamId },
            _count: { status: true }
        });


        const overdue = await prisma.task.count({
            where: {
                teamId,
                dueDate: { lt: new Date() },
                status: { not: "COMPLETED" }
            }
        });

    
        const membersCount = await prisma.membership.count({
            where: { teamId }
        });

        return res.json({
            totalTasks,
            tasksByStatus,
            overdue,
            membersCount
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: "Internal server error" });
    }
});

router.get("/productivity/me", auth, async (req, res) => {
    try {
        const userId = (req as any).user;

        // Completed tasks last 7 days
        const completed7 = await prisma.task.count({
            where: {
                assigneeId: userId,
                status: "COMPLETED",
                completedAt: {
                    gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                }
            }
        });

        // Total completed tasks
        const totalCompleted = await prisma.task.count({
            where: {
                assigneeId: userId,
                status: "COMPLETED"
            }
        });

        // Average completion time
        const completedTasks = await prisma.task.findMany({
            where: {
                assigneeId: userId,
                status: "COMPLETED",
                startedAt: { not: null },
                completedAt: { not: null }
            }
        });

        let avgDuration = 0;
        if (completedTasks.length > 0) {
            const total = completedTasks.reduce((sum, t) => {
                return sum + (new Date(t.completedAt!).getTime() - new Date(t.startedAt!).getTime());
            }, 0);
            avgDuration = total / completedTasks.length;
        }

        return res.json({
            completedLast7Days: completed7,
            totalCompleted,
            averageCompletionTimeMs: avgDuration
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Internal server error" });
    }
});


export const analyticRouter = router;