import IntrosService from "./intros.service.js";

export default class IntrosController {
    static async GetListOfUsers(req, res) {
        const { users, error } = await IntrosService.GetListOfUsers();
        if (error) {
          res.status(500).send(error);
        } else {
          res.send(users);
        }
    }

    static async GetUserByUuid(req, res) {
       const { user, error } = await IntrosService.GetUserByUuid(req.params.uuid);
        if (error) {
          res.status(500).send(error);
        } else {
          res.send(user);
        }
    }
    static async CreateUser(req, res) {
        const { data, error } = await IntrosService.CreateUser(req.body);
        if (error) {
          res.status(500).send(error);
        } else {
          res.send(data);
        }
    }
    static async UpdateUser(req, res) {
        const { data, error } = await IntrosService.UpdateUser(req.body);
        if (error) {
          res.status(500).send(error);
        } else {
          res.send(data);
        }
    }
    static async DeleteUser(req, res) {
        const { data, error } = await IntrosService.DeleteUser(req.params.uuid);
        if (error) {
          res.status(500).send(error);
        } else {
          res.send(data);
        }
    }
}
