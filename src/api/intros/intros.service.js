import { supabase } from "../../common/utils/supabase.js";
import { createEmbedding } from "../../common/openai/index.js";
import cosineSimilarity from "../../common/utils/cosineSimilarity.js";
import MatchesService from "../matches/matches.service.js";
import UsersService from "../users/users.service.js";
import MatchQueue from "../../common/queues/match.queue.js";

export default class IntrosService {
    static async GetListOfIntros() {
        let { data: intros, error } = await supabase
            .from('intros')
            .select('*')
        return { intros, error };
    }

    static async GetListOfActiveIntros() {
        let { data: intros, error } = await supabase
            .from('intros')
            .select('*')
            .eq('active', true)
        return { intros, error };
    }

    static async GetListOfActiveIntrosWithSelectedChat(chatUuid, introUuid) {
        let { users } = await UsersService.GetListOfUsersWithSelectedChat(chatUuid);
        let { intro } = await IntrosService.GetIntroByUuid(introUuid);
        let { data: intros, error } = await supabase
            .from('intros')
            .select('*, user:users(*)')
            .eq('active', true)
            .in('user_uuid', users.map(user => user.uuid))
            .lte('created_at', intro.created_at)
        return { intros, error };
    }

    static async GetIntroByUuid(uuid) {
        let { data: intro, error } = await supabase
            .from('intros')
            .select('*, user:users(*)')
            .eq('uuid', uuid)
            .limit(1)
            .maybeSingle()
        return { intro, error };
    }

    static async GetIntrosByUserUuid(userUuid) {
        let { data: intros, error } = await supabase
            .from('intros')
            .select('*')
            .eq('user_uuid', userUuid)
        return { intros, error };
    }

    static async CreateIntro(intro) {
        let { data, error } = await supabase
            .from('intros')
            .insert(intro)
            .select()

        if (!error) {
            await this.VectorizeIntro(data[0].uuid);
        }
    }

    static async UpdateIntroStateByUserUuid(userUuid, active) {
        let { data, error } = await supabase
            .from('intros')
            .update({ active: active })
            .eq('user_uuid', userUuid)
            .select()
        return { data, error };
    }

    static async VectorizeIntro(introUuid) {
        const { intro } = await this.GetIntroByUuid(introUuid);
        const embedding = await createEmbedding(intro.text);
        let { data, error } = await supabase
            .from('intros')
            .update({ vector: embedding })
            .eq('uuid', introUuid)
            .select()
        if (!error) {
            await MatchQueue.addJob(introUuid)
        }
        return { intro, error };
    }

    static async GetSimilarity(introUuid1, introUuid2) {
        const { intro: intro1 } = await this.GetIntroByUuid(introUuid1);
        const { intro: intro2 } = await this.GetIntroByUuid(introUuid2);
        const similarity = cosineSimilarity(intro1.vector, intro2.vector);
        return similarity;
    }
}