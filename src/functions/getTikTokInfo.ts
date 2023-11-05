import { TTScraper } from "../tiktok/src/main";
import reverseDateFormat from "./reverseDateFormat";

export default async function getTikTokInfo(firstDate: string, secondDate: string, nameOrUrl: string) {
  try {
    const TikTokScraper = new TTScraper();

    const match = nameOrUrl.match(/@(.+?)(\?|\/|$)/);
    let username = match ? match[1] : nameOrUrl;

    const getAllVideosFromUser = await TikTokScraper.getAllVideosFromUser(String(username));
    //console.log(getAllVideosFromUser);
    const combinedArray = getAllVideosFromUser.map(obj => {
      return {
        createdAt: obj.createdAt || '',
        directVideoUrl: obj.directVideoUrl || '',
        playCount: obj.playCount || 0
      };
    });
    //console.table(combinedArray);
    const startDate = new Date(firstDate);
    const endDate = new Date(secondDate);

    const filteredArray = combinedArray.filter(obj => {
      const createdAtDate = obj.createdAt; // Предполагается, что createdAt содержит дату в строковом формате "дд.мм.гггг"
      const reversedCreatedAtDate = reverseDateFormat(createdAtDate); // Преобразуем формат
      return new Date(reversedCreatedAtDate) >= new Date(startDate) && new Date(reversedCreatedAtDate) <= new Date(endDate);
    });
    console.table(filteredArray)
    if (filteredArray.length == 0) { return '*За указаный период ничего не найдено*' }
    const filterPlayCount = filteredArray.reduce((accumulator, obj) => accumulator + obj.playCount, 0);

    return `*${filteredArray[0].directVideoUrl || ''} | ${filteredArray[0].createdAt || ''} | ${filteredArray[0].playCount || ''}\n${filteredArray[filteredArray.length - 1].directVideoUrl || ''} | ${filteredArray[filteredArray.length -1].createdAt || ''} | ${filteredArray[filteredArray.length -1].playCount || ''}\nВидео за этот период: ${filteredArray.length || ''}\nПросмотров за этот период: ${filterPlayCount || ''}*`
  } catch (error) {
    if (error instanceof TypeError && error.message.includes("Cannot read properties of undefined (reading 'users')")) {
      console.log(error)
      return '*Пользователь не найден!*';
    } else if (error instanceof Error && error.message.includes("invalid json response body at")) {
      console.log(error);
      return '*TikTok выдал временную блокировку попробуйте немного позже!*';
    } else {
      console.log(error)
      return '*Произошла ошибка. Попробуйте позже!*';
    }
  }
}
