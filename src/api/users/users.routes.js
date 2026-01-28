import express from "express";
import UsersController from "./users.controller.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 * /users/list:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of alert actions
 *         content:
 *           application/json:
 *             schema:
 *                type: array
 * /users/{uuid}:
 *   get:
 *     summary: Get user by uuid
 *     tags: [Users]
 *     parameters:
 *      - in: path
 *        name: uuid
 *        schema:
 *          type: string
 *          required: true
 *          description: The user uuid
 *     responses:
 *       200:
 *         description: User by uuid
 *         content:
 *           application/json:
 *             schema:
 *                type: array
 * /users/create:
 *   post:
 *     summary: Create user
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: User created
 *         content:
 *           application/json:
 *             schema:
 *                type: array
 * /users/update:
 *   put:
 *     summary: Update user
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: User updated
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 * /users/delete/{uuid}:
 *   delete:
 *     summary: Delete user
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: User deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 */

router.get("/list", UsersController.GetListOfUsers);
router.get("/:uuid", UsersController.GetUserByUuid);
router.post("/create", UsersController.CreateUser);
router.put("/update", UsersController.UpdateUser);
router.delete("/delete/:uuid", UsersController.DeleteUser);

export default router;