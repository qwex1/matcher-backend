import cron from 'node-cron';
import MatchesService from '../../api/matches/matches.service.js';
import ChatsService from '../../api/chats/chats.service.js';

class Scheduler {
  constructor() {
    this.jobs = {};
  }

  async scheduleMatchPublishing() {
    const schedulePublishing = async () => {
      const { data } = await ChatsService.GetListOfChats();
      for (const chat of data) {
        if (chat.active && chat.automatching) {
          this.scheduleJobForChat(chat.uuid, chat.max_matches, chat.publishing_interval);
        }
      }
    }
    schedulePublishing();
    cron.schedule(`30 */1 * * *`, schedulePublishing)
  }
  scheduleJobForChat(chatUuid, max, interval) {
    console.log(`Scheduling job for chat ${chatUuid}`);
    if (this.jobs[chatUuid]) {
      this.jobs[chatUuid].stop();
    }

    this.jobs[chatUuid] = cron.schedule(`0 */${interval} * * * `, async () => {
      const { count: publishedMatchesCount, error } = await MatchesService.GetCountOfPublishedMatches(chatUuid, interval);

      if (publishedMatchesCount >= max) {
        console.log(`Max matches reached for chat ${chatUuid}. Skipping publishing.`);
        return;
      }

      const { matches, error: fetchError } = await MatchesService.GetTopOfUnpublishedMatches(chatUuid, 1);

      if (fetchError) {
        console.error(`Error fetching matches for chat ${chatUuid}:`, error);
      } else {
        for (const match of matches) {
          console.log(`Publishing match ${match.uuid} for chat ${chatUuid}`);
          await MatchesService.PublishMatch(match.uuid);
        }
      }
    });

    console.log(`Scheduled match publishing for chat ${chatUuid} with interval ${interval}`);
  }
}

export default new Scheduler();