import { Router } from "express";
import { auth } from "../middleware/authMiddleware";
import { teamCreateSchema } from "../types/types";
import { PrismaClient } from "@prisma/client";
const router = Router();

const prisma = new PrismaClient();
router.post("/createteam", auth, async (req, res) => {
    try {
        const userid = (req as any).user;  // logged-in user is ALWAYS the admin

        const parsed = teamCreateSchema.safeParse(req.body);

        if (!parsed.success) {
            return res.status(400).json({ msg: "Invalid inputs" });
        }

        const { name, description, members } = parsed.data;

        // 1️⃣ Check if current user is TEAM_LEAD
        const role = await prisma.user.findUnique({
            where: { id: userid },
            select: { role: true }
        });

        if (role?.role !== "TEAM_LEAD") {
            return res.status(403).json({ msg: "Only team leads can create teams" });
        }

        // 2️⃣ Create team + auto-insert creator as lead
        const team = await prisma.team.create({
            data: {
                name,
                description: description ?? "",
                createdBy: userid,  // ALWAYS the current user

                members: {
                    create: [
                        // INSERT TEAM LEAD AUTOMATICALLY
                        {
                            userId: userid,
                            isLead: true
                        },

                        // INSERT OTHER MEMBERS PROVIDED BY FRONTEND
                        ...members.map(m => ({
                            userId: m,
                            isLead: false
                        }))
                    ]
                }
            },
            include: {
                members: {
                    include: {
                        user: true
                    }
                }
            }
        });

        return res.status(201).json({
            msg: "Team created successfully",
            team
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: "Internal server error" });
    }
});

router.post("/:teamId/task", auth, async (req, res) => {
  try {
    const userId = (req as any).user; // creator
    const { teamId } = req.params;
    const { title, description, priority, assigneeId, dueDate } = req.body;

    if (!teamId) return res.status(400).json({ msg: "teamId required" });
    if (!title || !assigneeId) return res.status(400).json({ msg: "title and assigneeId required" });
    if (!["LOW", "MEDIUM", "HIGH"].includes(priority)) {
      return res.status(400).json({ msg: "Invalid priority" });
    }

    // 1) verify creator is team lead
    const lead = await prisma.membership.findFirst({
      where: { userId, teamId, isLead: true },
    });
    if (!lead) return res.status(403).json({ msg: "Only team leads can create tasks" });

    // 2) verify assignee is a member of the team
    const assigneeMembership = await prisma.membership.findFirst({
      where: { userId: assigneeId, teamId },
    });
    if (!assigneeMembership) return res.status(400).json({ msg: "Assignee is not a member of this team" });

    // 3) create the task
    const task = await prisma.task.create({
      data: {
        title,
        description,
        priority,
        teamId,
        assigneeId,
        creatorId: userId,
        dueDate: dueDate ? new Date(dueDate) : null,
      },
    });

    // 4) create audit log
    await prisma.auditLog.create({
      data: {
        userId,
        taskId: task.id,
        action: "TASK_CREATED",
        details: { title: task.title, assigneeId, priority },
      },
    });

    return res.status(201).json({ msg: "Task created", task });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Internal server error" });
  }
});

router.get("/details/:teamId", auth, async (req, res) => {
  try {
    const userId = (req as any).user;
    const { teamId } = req.params;

    if (!teamId) return res.status(400).json({ msg: "teamId required" });

    // verify user is a member of the team
    const membership = await prisma.membership.findFirst({
      where: { userId, teamId },
    });
    if (!membership) return res.status(403).json({ msg: "Not a team member" });

    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: {
        members: {
          include: { user: { select: { id: true, name: true, email: true } } },
        },
        tasks: {
          include: {
            assignee: { select: { id: true, name: true, email: true } },
            creator: { select: { id: true, name: true, email: true } },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!team) return res.status(404).json({ msg: "Team not found" });

    // reshape members for easier frontend use
    const members = team.members.map((m) => ({
      id: m.user.id,
      name: m.user.name,
      email: m.user.email,
      isLead: m.isLead,
      joinedAt: m.joinedAt,
    }));

    const tasks = team.tasks.map((t) => ({
      id: t.id,
      title: t.title,
      description: t.description,
      priority: t.priority,
      status: t.status,
      dueDate: t.dueDate,
      startedAt: t.startedAt,
      completedAt: t.completedAt,
      assignee: t.assignee ? { id: t.assignee.id, name: t.assignee.name, email: t.assignee.email } : null,
      creator: t.creator ? { id: t.creator.id, name: t.creator.name, email: t.creator.email } : null,
      createdAt: t.createdAt,
    }));

    return res.json({
      team: {
        id: team.id,
        name: team.name,
        description: team.description,
        createdBy: team.createdBy,
        createdAt: team.createdAt,
      },
      members,
      tasks,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Internal server error" });
  }
});

// GET /api/v1/team/my 
router.get("/my", auth, async (req, res) => {
    try {
        const userId = (req as any).user;

        console.log('userid',userId);
        // Get memberships
        const memberships = await prisma.membership.findMany({
            where: { userId },
            include: {
                team: true
            }
        });

        const teams = memberships.map(m => ({
            id: m.team.id,
            name: m.team.name,
            description: m.team.description,
            isLead: m.isLead,
            createdAt: m.team.createdAt
        }));

        console.log('teamd',teams);

        return res.json({ teams });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: "Internal server error" });
    }
});



export const teamRouter = router;