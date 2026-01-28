import UsersService from "./users.service.js";

export default class UsersController {
    static async GetListOfUsers(req, res) {
        const { users, error } = await UsersService.GetListOfUsers();
        if (error) {
          res.status(500).send(error);
        } else {
          res.send(users);
        }
    }

    static async GetUserByUuid(req, res) {
       const { user, error } = await UsersService.GetUserByUuid(req.params.uuid);
        if (error) {
          res.status(500).send(error);
        } else {
          res.send(user);
        }
    }
    static async CreateUser(req, res) {
        const { data, error } = await UsersService.CreateUser(req.body);
        if (error) {
          res.status(500).send(error);
        } else {
          res.send(data);
        }
    }
    static async UpdateUser(req, res) {
        const { data, error } = await UsersService.UpdateUser(req.body);
        if (error) {
          res.status(500).send(error);
        } else {
          res.send(data);
        }
    }
    static async DeleteUser(req, res) {
        const { data, error } = await UsersService.DeleteUser(req.params.uuid);
        if (error) {
          res.status(500).send(error);
        } else {
          res.send(data);
        }
    }
}
