import { Router } from "express";

const router = Router()

router.route("/send").get((req,res)=>{
    res.send("Send message endpoint")
})

export default router;