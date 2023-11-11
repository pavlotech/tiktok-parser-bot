import { TTScraper } from "../tiktok/src/main";

export default async function getTikTokInfo(firstDate: string, secondDate: string, nameOrUrl: string, attempt: number = 1) {
  try {
    const TikTokScraper = new TTScraper();

    const usernames = nameOrUrl.split(/\s+/).map(username => {
      // Извлекаем имя пользователя из ссылки
      const match = username.match(/@(.+?)(\?|\/|$)/);
      return match ? match[1] : username;
    });

    const userDataArray = [];
    for (const username of usernames) {
      const getAllVideosFromUser = await TikTokScraper.getAllVideosFromUser(username);
      const combinedArray = getAllVideosFromUser.map(obj => {
        return {
          createdAt: obj.createdAt || '',
          directVideoUrl: obj.directVideoUrl || '',
          playCount: obj.playCount || 0
        };
      });

      // Фильтруем видео по датам
      const firstDateParts = firstDate.split(".");
      const secondDateParts = secondDate.split(".");
      const startDate = `${firstDateParts[1]}.${firstDateParts[0]}.${firstDateParts[2]}`;
      const endDate = `${secondDateParts[1]}.${secondDateParts[0]}.${secondDateParts[2]}`;
  
      const filteredArray = combinedArray.filter(obj => {
        const createdAtDate = obj.createdAt;
        return new Date(createdAtDate) >= new Date(startDate) && new Date(createdAtDate) <= new Date(endDate);
      });
      const filterPlayCount = filteredArray.reduce((accumulator, obj) => accumulator + obj.playCount, 0);

      userDataArray.push({
        username: username,
        videos: filteredArray,
        playCount: filterPlayCount
      });
    }

    const resultsArray = [];
    for (const userData of userDataArray) {
      const combinedArray = userData.videos;

      if (combinedArray.length > 0) {
        const firstVideo = combinedArray[0];
        const lastVideo = combinedArray[combinedArray.length - 1];
        const filterPlayCount = userData.playCount

        const userResultText = `*[${firstDate} - ${secondDate}] - ${userData.username}\n${firstVideo.directVideoUrl || ''} | ${firstVideo.createdAt || ''} | ${firstVideo.playCount || ''}\n${lastVideo.directVideoUrl || ''} | ${lastVideo.createdAt || ''} | ${lastVideo.playCount || ''}\nВидео за период: ${combinedArray.length}\nПросмотров за период: ${filterPlayCount || ''}\n*`;

        resultsArray.push(userResultText);
      } else resultsArray.push(`*Нет видео пользователя ${userData.username} за период*`);
    }

    return resultsArray.join('\n');
  } catch (error) {
    switch (true) {
      case error instanceof TypeError && error.message.includes("Cannot read properties of undefined (reading 'users')"):
        console.error(`[ERROR]`, error)
        return '*Пользователь не найден!*';
      default:
        console.error(`[ERROR]`, error);
        await new Promise(resolve => setTimeout(resolve, 30 * 1000));
        // Повторный вызов функции
        console.log(`[ERROR] restarting function`)
        return getTikTokInfo(firstDate, secondDate, nameOrUrl, attempt + 1);
    }
  }
}

