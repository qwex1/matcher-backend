import express from "express";
import ChatsController from "./chats.controller.js";
import multer from "multer";
import path from "path";

const __dirname = path.resolve();
const storage = multer.diskStorage({ 
    destination: path.join(__dirname, "../../uploads/"),
    filename: (req, file, cb) => {
        console.log('file', file);
        file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8');
        console.log('file', file);
        cb(null, file.originalname);
    } 
});
const upload = multer({ storage: storage })

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Chats
 * /chats/list:
 *  get:
 *     summary: Get list of chats
 *     tags: [Chats]
 *     responses:
 *       200:
 *         description: List of chats
 * /chats/{uuid}:
 *   get:
 *     summary: Get chat by uuid
 *     tags: [Chats]
 *     parameters:
 *      - in: path
 *        name: uuid
 *        schema:
 *          type: string
 *          required: true
 *     responses:
 *       200:
 *         description: Chat object by uuid
 * /chats/send-invitation/{uuid}:
 *   post:
 *     summary: Send invitation to chat by uuid
 *     tags: [Chats]
 *     parameters:
 *      - in: path
 *        name: uuid
 *        schema:
 *          type: string
 *          required: true
 *     responses:
 *       200:
 *         description: Chat object by uuid
 * /chats/tg/{tgId}:
 *   get:
 *     summary: Get chat by tg id
 *     tags: [Chats]
 *     parameters:
 *      - in: path
 *        name: tgId
 *        schema:
 *          type: string
 *          required: true
 *     responses:
 *       200:
 *         description: Chat object by tg id
 * /chats/create:
 *   post:
 *     summary: Get chat by tg id
 *     tags: [Chats]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tg_id:
 *                 type: string
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Chat object by tg id
 * /chats/import-users/{uuid}:
 *   post:
 *     summary: 
 *     tags: [Chats]
 *     parameters:
 *      - in: path
 *        name: uuid
 *        schema:
 *          type: string
 *          required: true
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Chat object by tg id
 */

router.get("/list", ChatsController.GetListOfChats);
router.get("/:uuid", ChatsController.GetChatByUuid);
router.post("/send-invitation/:uuid", ChatsController.SendInvitationToChat);
router.get("/tg/:tgId", ChatsController.GetChatByTgId);
router.post("/create", ChatsController.CreateChat);
router.post("/import-users/:uuid", upload.single('file'), ChatsController.ImportUsers);

export default router;