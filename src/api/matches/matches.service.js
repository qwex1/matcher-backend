import { supabase } from "../../common/utils/supabase.js";
import IntrosService from "../intros/intros.service.js";
import dayjs from "dayjs";
import TgBot from "../../common/telegram/index.js";
import { matchGroupChatMessage, matchMessage } from "../../common/telegram/messages.js";

export default class MatchesService {
    static async GetMatch(firstIntroUuid, secondIntroUuid) {
        let { data: match, error } = await supabase 
            .from('matches')
            .select('*')
            .eq('first_intro_uuid', firstIntroUuid)
            .eq('second_intro_uuid', secondIntroUuid)
            .maybeSingle()
        let { data: match2, error: error2 } = await supabase 
            .from('matches')
            .select('*')
            .eq('first_intro_uuid', secondIntroUuid)
            .eq('second_intro_uuid', firstIntroUuid)
            .maybeSingle()
        const result = match || match2;
        return { data: result, error: error || error2 };
    }

    static async CreateMatch(match) {
        // check if match already exists
        const { data: existingMatch, error: existingMatchError } = await this.GetMatch(match.firstIntroUuid, match.secondIntroUuid);
        if (existingMatch) return { data: existingMatch, error: null };
        const similarity = await IntrosService.GetSimilarity(match.firstIntroUuid, match.secondIntroUuid);
        let { data, error } = await supabase
            .from('matches')
            .insert({
                first_intro_uuid: match.firstIntroUuid,
                second_intro_uuid: match.secondIntroUuid,
                similarity: similarity
            })
            .select()
            .maybeSingle()
        return { data, error };
    }

    static async CreateMatches(introUuid) {
        const { intro } = await IntrosService.GetIntroByUuid(introUuid);
        if (!intro || !intro.active || !intro.user.chat_uuid) return { intros: [], error: null };
        const { intros, error } = await IntrosService.GetListOfActiveIntrosWithSelectedChat(intro.user.chat_uuid, introUuid);
        //create matches for each intro
        for (let intro of  intros) {
            if (intro.uuid === introUuid) continue;
            await this.CreateMatch({
               firstIntroUuid: introUuid,
               secondIntroUuid: intro.uuid
            });
        }
        return { intros, error };
    }

    static async GetTopOfUnpublishedMatches(chatUuid, count) {
        let { data: matches, error } = await supabase
            .from('matches')
            .select('*, first_intro:intros!matches_first_intro_uuid_fkey(text, user_uuid, user:users!intros_user_uuid_fkey(*)), second_intro:intros!matches_second_intro_uuid_fkey(text, user_uuid, user:users!intros_user_uuid_fkey(*))')
            .eq('published', false)
            .eq('first_intro.user.chat_uuid', chatUuid)
            .order('similarity', { ascending: false })
            .limit(count)

        return { matches, error };
    }

    static async PublishTopOfUnpublishedMatches(count, period = '24') {
        const { matches, error } = await this.GetTopOfUnpublishedMatches(count, period);

        const { data, error: updateError } = await supabase
            .from('matches')
            .update({ published: true, published_at: new Date().toISOString() })
            .in('uuid', matches.map(match => match.uuid))

        for (let match of matches) {
            await TgBot.sendMessage(match.first_intro.user.tg_id, matchMessage(match.second_intro.user.username, match.second_intro.text, match.similarity));
            await TgBot.sendMessage(match.second_intro.user.tg_id, matchMessage(match.first_intro.user.username, match.first_intro.text, match.similarity));
        }

        return { matches: data, error: updateError };
    }

    static async PublishMatch(uuid) {
        const { data: fetchedMatch, error: fetchError } = await supabase
            .from('matches')
            .select('*')
            .eq('uuid', uuid)
            .maybeSingle()

        if (fetchedMatch.published) return;

        const { data: match, error: updateError } = await supabase
            .from('matches')
            .update({ published: true, published_at: new Date().toISOString() })
            .eq('uuid', uuid)
            .select('*, first_intro:intros!matches_first_intro_uuid_fkey(text, user_uuid, user:users!intros_user_uuid_fkey(*)), second_intro:intros!matches_second_intro_uuid_fkey(text, user_uuid, user:users!intros_user_uuid_fkey(*))')
            .maybeSingle()
        
        const { data: chat, error } = await supabase
            .from('chats')
            .select('*')
            .eq('uuid', match.first_intro.user.chat_uuid)
            .maybeSingle()

        await TgBot.sendMessage(chat.tg_id, matchGroupChatMessage(match.first_intro, match.second_intro, match.similarity));

        return { match, error: updateError };
    }

    static async GetCountOfPublishedMatches(chatUuid, period = 24) {
        const date = dayjs().startOf('day').toISOString();
        const { count, error } = await supabase
            .from('matches')
            .select('*', { count: 'exact' })
            .eq('chat_uuid', chatUuid)
            .eq('published', true)
            .gte('published_at', date);
        
        return { count, error };
    }
}