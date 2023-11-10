import { TTScraper } from "../tiktok/src/main";

export default async function getTikTokInfo(firstDate: string, secondDate: string, nameOrUrl: string) {
  try {
    const TikTokScraper = new TTScraper();

    const match = nameOrUrl.match(/@(.+?)(\?|\/|$)/);
    let username = match ? match[1] : nameOrUrl;

    const getAllVideosFromUser = await TikTokScraper.getAllVideosFromUser(username);
    const combinedArray = getAllVideosFromUser.map(obj => {
      return {
        createdAt: obj.createdAt || '',
        directVideoUrl: obj.directVideoUrl || '',
        playCount: obj.playCount || 0
      };
    });
    //console.table(combinedArray);

    const firstDateParts = firstDate.split(".");
    const secondDateParts = secondDate.split(".");
    const startDate = `${firstDateParts[1]}.${firstDateParts[0]}.${firstDateParts[2]}`;
    const endDate = `${secondDateParts[1]}.${secondDateParts[0]}.${secondDateParts[2]}`;

    const filteredArray = combinedArray.filter(obj => {
      const createdAtDate = obj.createdAt;
      return new Date(createdAtDate) >= new Date(startDate) && new Date(createdAtDate) <= new Date(endDate);
    });
    const filterPlayCount = filteredArray.reduce((accumulator, obj) => accumulator + obj.playCount, 0);
    console.table(filteredArray)

    if (filteredArray.length == 0) return '*За указаный период ничего не найдено*'

    const firstVideo = filteredArray[0];
    const lastVideo = filteredArray[filteredArray.length - 1];
    
    return `*${firstVideo.directVideoUrl || ''} | ${firstVideo.createdAt || ''} | ${firstVideo.playCount || ''}\n${lastVideo.directVideoUrl || ''} | ${lastVideo.createdAt || ''} | ${lastVideo.playCount || ''}\nВидео за этот период: ${filteredArray.length}\nПросмотров за этот период: ${filterPlayCount || ''}*`;

  } catch (error) {
    switch (true) {
      case error instanceof TypeError && error.message.includes("Cannot read properties of undefined (reading 'users')"):
        console.log(`[ERROR] ${error}`)
        return '*Пользователь не найден!*';
      case error instanceof Error && error.message.includes("invalid json response body at"):
        console.log(`[ERROR] ${error}`)
        return '*TikTok выдал временную блокировку. Попробуйте немного позже!*';
      default:
        console.log(error)
        console.log(`[ERROR] ${error}`)
        return '*Произошла ошибка. Попробуйте позже!*';
    }
  }
}