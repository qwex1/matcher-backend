import MatchesService from "./matches.service.js";

export default class MatchesController {
    static async GetTopOfUnpublishedMatches(req, res) {
        const count = req.query.count || 3;
        const period = req.query.period || '24';
        const { matches, error } = await MatchesService.GetTopOfUnpublishedMatches(count, period);
        if (error) {
          res.status(500).send(error);
        } else {
          res.send(matches);
        }
    }

    static async PublishTopOfUnpublishedMatches(req, res) {
        const count = req.body.count || 3;
        const period = req.body.period || '24';
        const { matches, error } = await MatchesService.PublishTopOfUnpublishedMatches(count, period);
        if (error) {
          res.status(500).send(error);
        } else {
          res.send(matches);
        }
    }

    static async CreateMatch(req, res) {
        const { data: match, error } = await MatchesService.CreateMatch({ firstIntroUuid: req.body.firstIntroUuid, secondIntroUuid: req.body.secondIntroUuid});
        if (error) {
          res.status(500).send(error);
        } else {
          res.send(match);
        }
    }

    static async PublishMatch(req, res) {
        const uuid = req.params.uuid;
        const { match, error } = await MatchesService.PublishMatch(uuid);
        if (error) {
          res.status(500).send(error);
        } else {
          res.send(match);
        }
    }
}
