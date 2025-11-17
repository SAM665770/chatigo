import { Router } from "express";
import { protectRoute } from "../middlewares/auth.middlewares.js";
import {
  getAllContacts,
  getMessagesByUserId,
  sendMessage,
  getChatPartners,
} from "../controllers/messages.controllers.js";
import { arcjetProtection } from "../middlewares/arcjet.middlewares.js";

const router = Router();

// the middlewares execute in order - so requests get rate-limited first, then authenticated.
// this is actually more efficient since unauthenticated requests get blocked by rate limiting beofre hitting the auth middleware

router.use(arcjetProtection, protectRoute);

router.get("/contacts", getAllContacts);
router.get("/chats", getChatPartners);
router.get("/:id", getMessagesByUserId);
router.post("/send/:id", sendMessage);

export default router;
