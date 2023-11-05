import { TTScraper } from "../tiktok/src/main";

export default async function getTikTokInfo(firstDate: string, secondDate: string, nameOrUrl: string) {
  try {
    const TikTokScraper = new TTScraper();

    const match = nameOrUrl.match(/@(.+?)(\?|\/|$)/);
    let username = match ? match[1] : nameOrUrl;

    const fetchUser = await TikTokScraper.user(username);

    const getAllVideosFromUser = await TikTokScraper.getAllVideosFromUser(username);
    
    const startDate = new Date(firstDate);
    const endDate = new Date(secondDate);

    const filteredVideos = getAllVideosFromUser.filter((obj) => {
      const createdAtDate = obj.createdAt;
      const reversedCreatedAtDate = reverseDateFormat(createdAtDate);
      const date = new Date(reversedCreatedAtDate);
      return date >= startDate && date <= endDate;
    });

    if (filteredVideos.length === 0) {
      return '*За указанный период ничего не найдено*';
    }

    const filterPlayCount = filteredVideos.reduce((accumulator, obj) => accumulator + obj.playCount, 0);

    return `*${filteredVideos[0].directVideoUrl || ''} | ${filteredVideos[0].createdAt || ''} | ${filteredVideos[0].playCount || ''}\n${filteredVideos[filteredVideos.length - 1].directVideoUrl || ''} | ${filteredVideos[filteredVideos.length - 1].createdAt || ''} | ${filteredVideos[filteredVideos.length - 1].playCount || ''}\nВидео за этот период: ${filteredVideos.length}\nПросмотров за этот период: ${filterPlayCount}*`;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes("Cannot read properties of undefined (reading 'users')")) {
      console.log(error);
      return '*Пользователь не найден!*';
    } else if (error instanceof Error && error.message.includes("invalid json response body at")) {
      console.log(error);
      return '*TikTok выдал временную блокировку. Попробуйте немного позже!*';
    } else {
      console.log(error);
      return '*Произошла ошибка. Попробуйте позже!*';
    }
  }
}

function reverseDateFormat(dateString: string) {
  const [day, month, year] = dateString.split('.');
  return `${month}.${day}.${year}`;
}
