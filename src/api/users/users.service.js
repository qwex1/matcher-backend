import { supabase } from "../../common/utils/supabase.js";

export default class UsersService {
    static async GetListOfUsers() {
        let { data: users, error } = await supabase
            .from('users')
            .select('*')
        return { users, error };
    }

    static async GetListOfUsersWithSelectedChat(chatUuid) {
        let { data: users, error } = await supabase
            .from('users')
            .select('*')
            .eq('chat_uuid', chatUuid)
        return { users, error };
    }

    static async GetUserByUuid(uuid) {
        let { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('uuid', uuid)
            .limit(1)
            .maybeSingle()
        return { user, error };
    }

    static async GetUserByTgId(tgId) {
        let { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('tg_id', tgId)
            .limit(1)
            .maybeSingle()
        return { user, error };
    }

    static async CreateUser(user) {
        let { data, error } = await supabase
            .from('users')
            .insert(user)
            .select('*')
            .single()
        return { data, error };
    }

    static async UpdateUser(user) {
        let { data, error } = await supabase
            .from('users')
            .update(user)
            .eq('uuid', user.uuid)
        return { data, error };
    }

    static async DeleteUser(uuid) {
        let { data, error } = await supabase
            .from('users')
            .delete()
            .eq('uuid', uuid)
        return { data, error };
    }
}