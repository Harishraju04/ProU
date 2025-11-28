import { Router } from "express";
const router = Router();
import { loginSchema } from "../types/types";
import { PrismaClient } from "@prisma/client";
import { auth } from "../middleware/authMiddleware";
import jwt from 'jsonwebtoken'
const JWT_SECRET = process.env.JWT_SECRET || "qwert";


const prisma = new PrismaClient();

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

router.post('/:userid',auth , async (req, res)=>{
    try{
        const userid = req.params.userid;
        if(!userid?.trim()){
            return res.json({
                msg:"need a valid userid"
            })
        }
        const adminId = (req as any).user;
        console.log(adminId);
        const role = await prisma.user.findFirst({
            where: {
                id: adminId
            },
            select:{
                role:true
            }
        })

        if (role?.role !== 'ADMIN') {
            return res.status(403).json({ msg: "Forbidden" });
        }

        const result = await prisma.user.update({
            where:{
                id:userid
            },
            data:{
                role:"TEAM_LEAD"
            }
        })
        
        res.status(200).json({
            msg:`${result.name} is now a teamlead`
        })
    }
    catch(err){
        console.error(err);
    }
})


export const adminRouter = router;