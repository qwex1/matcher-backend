import ChatsService from "./chats.service.js";

export default class MatchesController {
    static async CreateChat(req, res) {
       const { data, error } = await ChatsService.CreateChat(req.body);
        if (error) {
            res.status(500).send(error);
        } else {
            res.status(200).send(data);
        }
    }

    static async GetChatByTgId(req, res) {
        const { data, error } = await ChatsService.GetChatByTgId(req.params.tgId);
        if (error) {
           res.status(500).send(error);
        } else {
            res.status(200).send(data);
        }
    }

    static async GetChatByUuid(req, res) {
        const { data, error } = await ChatsService.GetChatByUuid(req.params.uuid);
        if (error) {
            res.status(500).send(error);
        } else {
            res.status(200).send(data);
        }
    }

    static async GetListOfChats(req, res) {
        const { data, error } = await ChatsService.GetListOfChats();
        if (error) {
            res.status(500).send(error);
        } else {
            res.status(200).send(data);
        }
    }

    static async SendInvitationToChat(req, res) {
        try {
            await ChatsService.SendInvitationToChat(req.params.uuid);
            res.status(200).send();
        } catch (error) {
            res.status(500).send(error);
        }
    }

    static async ImportUsers(req, res) {
        try {
            await ChatsService.ImportUsers(req.params.uuid, req.file);
            res.status(200).send();
        } catch (error) {
            res.status(500).send(error);
        }
    }
}
