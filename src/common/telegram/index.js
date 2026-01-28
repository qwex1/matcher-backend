import TelegramBot from "node-telegram-bot-api";
import UsersService from "../../api/users/users.service.js";
import IntrosService from "../../api/intros/intros.service.js";
import ChatsService from "../../api/chats/chats.service.js";
import { welcomeMessage, introMessage, invitationMessage } from "./messages.js";
import { checkIfIntro } from "../openai/index.js";

const commands = [
    { command: "start", description: "Запуск бота" },
]

class TgBot {
    constructor() {
        this.bot = new TelegramBot(process.env.TG_BOT_TOKEN, { polling: true });
    }

    init() {
        this.bot.setMyCommands(commands);

        this.bot.on('message', async (msg) => {
            const chatType = msg.chat.type;
            const chatId = msg.chat.id;

            if (chatType !== 'private') {
                let { data: chat, error: getChatError } = await ChatsService.GetChatByTgId(chatId);
                if (!chat) {
                    const { data, error } = await ChatsService.CreateChat({
                        tg_id: chatId,
                        name: msg.chat.title,
                        active: false
                    })
                    chat = data;
                    await this.bot.sendMessage(chatId, welcomeMessage);
                }

                if (!chat.active) {
                    return
                }

                const username = msg.from.username;
                const firstName = msg.from.first_name;
                const lastName = msg.from.last_name;
                const userTgId = msg.from.id;
                let { user, error: userError } = await UsersService.GetUserByTgId(userTgId);

                if (!user) {
                    const { data, error } = await UsersService.CreateUser({ tg_id: userTgId, username, first_name: firstName, last_name: lastName, chat_uuid: chat.uuid });
                    user = data;
                }

                if (msg.text && msg.text.split(' ').length > 10) {
                    const result = await checkIfIntro(msg.text)
                    if (result.isIntro) {
                        await IntrosService.UpdateIntroStateByUserUuid(user.uuid, false);
                        await IntrosService.CreateIntro({
                            user_uuid: user.uuid,
                            text: msg.text,
                            active: true
                        });
                        // await this.bot.sendMessage(chatId, introMessage);
                        // await this.bot.sendMessage(chatId, invitationMessage);
                    }
                }
            } 
            // else {
            //     const username = msg.from.username;
            //     const firstName = msg.from.first_name;
            //     const lastName = msg.from.last_name;
    
            //     const { user: result, error } = await UsersService.GetUserByTgId(chatId);
            //     let user = result[0];
            //     console.log('GetUserByTgId', user, error)
            //     if (error) {
            //         await this.bot.sendMessage(chatId, 'Произошла ошибка');
            //         return;
            //     }
    
            //     if(msg && msg.text && msg.text.startsWith('/start')) {
            //         const startParameter = msg.text.split(' ')[1];
            //         console.log('startParameter', startParameter)
    
            //         const { data: chat, error } = await ChatsService.GetChatByTgId(startParameter);
    
            //         if (user) {
            //             const { data, error } = await UsersService.UpdateUser({
            //                 uuid: user.uuid,
            //                 username, 
            //                 first_name: firstName, 
            //                 last_name: lastName, 
            //                 tg_id: chatId,
            //                 chat_uuid: chat.uuid
            //             })
            //             console.log('UpdateUser', data, error)
            //         } else {
            //             const { data, error } = await UsersService.CreateUser({ 
            //                 username, 
            //                 first_name: firstName, 
            //                 last_name: lastName, 
            //                 tg_id: chatId,
            //                 chat_uuid: chat.uuid
            //             });
            //             user = data;
            //             console.log('CreateUser', data, error)
            //         }
            //         await this.bot.sendMessage(chatId, welcomeMessage);
    
            //         this.bot.setMyCommands([]);
            //     } else if (msg && msg.text) {
            //         if (!user) {
            //             const { data, error } = await UsersService.CreateUser({ 
            //                 username, 
            //                 first_name: firstName, 
            //                 last_name: lastName, 
            //                 tg_id: chatId,
            //                 chat_uuid: chat.uuid
            //             });
            //             user = data;
            //             console.log('CreateUser', data, error)
            //         }
            //         // await IntrosService.UpdateIntroStateByUserUuid(user.uuid, false);
            //         const { intros, error } = await IntrosService.GetIntrosByUserUuid(user.uuid);
            //         console.log('GetIntrosByUserUuid', intros, error)
            //         if (intros.length === 0) {
            //             await IntrosService.CreateIntro({
            //                 user_uuid: user.uuid,
            //                 text: msg.text,
            //                 active: true
            //             });
            //             await this.bot.sendMessage(chatId, introMessage);
            //             await this.bot.sendMessage(chatId, invitationMessage);
            //         }
            //     }
            // }
        });
    }

    async sendMessage(chatId, text) {
        await this.bot.sendMessage(chatId, text, {
            parse_mode: 'html'
        });
    }

}

const tgBotInstance = new TgBot();
export default tgBotInstance;
