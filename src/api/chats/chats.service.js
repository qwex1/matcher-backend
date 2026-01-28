import { supabase } from "../../common/utils/supabase.js";
import { botInvitationMessage } from "../../common/telegram/messages.js";
import TgBot from "../../common/telegram/index.js";
import { parseFile } from "../../common/officeparser/index.js";
import UsersService from "../users/users.service.js";
import IntrosService from "../intros/intros.service.js";

export default class ChatsService {
    static async CreateChat(chat) {
        let { data, error } = await supabase
            .from('chats')
            .insert(chat)
            .select()
            .single()
        console.log(error)
        return { data, error };
    }

    static async GetChatByTgId(tgId) {
        let { data, error } = await supabase
            .from('chats')
            .select('*')
            .eq('tg_id', tgId)
            .maybeSingle()
        return { data, error };
    }

    static async GetChatByUuid(uuid) {
        let { data, error } = await supabase
            .from('chats')
            .select('*')
            .eq('uuid', uuid)
            .maybeSingle()
        return { data, error };
    }

    static async GetListOfChats() {
        let { data, error } = await supabase
            .from('chats')
            .select('*')
        return { data, error };
    }

    static async SendInvitationToChat(uuid) {
        const { data, error } = await this.GetChatByUuid(uuid);
        if (error) {            
            return { error };
        }
        const { tg_id } = data;
        await TgBot.sendMessage(tg_id, botInvitationMessage(`${process.env.TG_URL}?start=${tg_id}`));
    }

    static async ImportUsers(uuid, file) {
        try {
            const { data, error } = await this.GetChatByUuid(uuid);
            if (error) {            
                return { error };
            }
            const result = await parseFile(file.path);
            for (const user of result) {
                const fullname = user.split('\n', 1)[0];
                const name = fullname.split(' ');
                const intro = user.split(`${fullname}\n`)[1];
                const { data: createdUser, error } = await UsersService.CreateUser({ 
                    first_name: name[0], 
                    last_name: name[1], 
                    chat_uuid: uuid 
                });
                await IntrosService.CreateIntro({ 
                    text: intro, 
                    user_uuid: createdUser.uuid,
                    active: true
                })
            }
        } catch (error) {            
            console.log(error);            
            return { error };         
        }
    }
}