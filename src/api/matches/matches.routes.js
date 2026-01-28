import express from "express";
import MatchesController from "./matches.controller.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Matches
 * /matches/top:
 *   get:
 *     summary: Get top of unpublished matches
 *     tags: [Matches]
 *     parameters:
 *       - in: query
 *         name: count
 *         schema:
 *           type: integer
 *         description: The number of matches to return
 *       - in: query
 *         name: period
 *         schema:
 *           type: integer
 *         description: The count of hours to look back for matches
 *     responses:
 *       200:
 *         description: List of matches
 *         content:
 *           application/json:
 *             schema:
 *                type: array
 * /matches/publish-top:
 *   post:
 *     summary: Publish top of unpublished matches
 *     tags: [Matches]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               count:
 *                 type: integer
 *               period:
 *                 type: integer
 *     responses:
 *       200:
 *         description: List of matches
 *         content:
 *           application/json:
 *             schema:
 *                type: array
 * /matches/create:
 *   post:
 *     summary: Create match between first intro and second intro
 *     tags: [Matches]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstIntroUuid:
 *                 type: string
 *               secondIntroUuid:
 *                 type: string
 *     responses:
 *       200:
 *         description: List of matches
 *         content:
 *           application/json:
 *             schema:
 *                type: array
 * /matches/publish/{uuid}:
 *   post:
 *     summary: Publish top of unpublished matches
 *     tags: [Matches]
 *     parameters:
 *      - in: path
 *        name: uuid
 *        schema:
 *          type: string
 *          required: true
 *          description: The match uuid
 *     responses:
 *       200:
 *         description: List of matches
 *         content:
 *           application/json:
 *             schema:
 *                type: array
 */

router.get("/top", MatchesController.GetTopOfUnpublishedMatches);
router.post("/publish-top", MatchesController.PublishTopOfUnpublishedMatches);
router.post("/create", MatchesController.CreateMatch);
router.post("/publish/:uuid", MatchesController.PublishMatch);

export default router;