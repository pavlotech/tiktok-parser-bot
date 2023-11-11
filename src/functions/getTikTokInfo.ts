import { TTScraper } from "../tiktok/src/main";

export default async function getTikTokInfo(firstDate: string, secondDate: string, nameOrUrl: string, attempt: number = 1) {
  try {
    const TikTokScraper = new TTScraper();

    // Разделите строку на массив имен пользователей
    const usernames = nameOrUrl.split(/\s+/).map(username => {
      // Извлекаем имя пользователя из ссылки
      const match = username.match(/@(.+?)(\?|\/|$)/);
      return match ? match[1] : username;
    });

    // Создайте массив для хранения данных о пользователях
    const userDataArray = [];

    // Обработайте каждого пользователя
    for (const username of usernames) {
      const getAllVideosFromUser = await TikTokScraper.getAllVideosFromUser(username);
      const combinedArray = getAllVideosFromUser.map(obj => {
        return {
          createdAt: obj.createdAt || '',
          directVideoUrl: obj.directVideoUrl || '',
          playCount: obj.playCount || 0
        };
      });

      // Добавьте данные о пользователе в массив
      userDataArray.push({
        username: username,
        videos: combinedArray
      });
    }

    // Создайте массив для хранения результатов
    const resultsArray = [];

    // Обработайте каждого пользователя в массиве userDataArray
    for (const userData of userDataArray) {
      const combinedArray = userData.videos;
      const firstVideo = combinedArray[0];
      const lastVideo = combinedArray[combinedArray.length - 1];
      const filterPlayCount = combinedArray.reduce((accumulator, obj) => accumulator + obj.playCount, 0);

      // Формируйте строку для каждого пользователя
      const userResultText = `*[${firstDate} - ${secondDate}] - ${userData.username}\n${firstVideo.directVideoUrl || ''} | ${firstVideo.createdAt || ''} | ${firstVideo.playCount || ''}\n${lastVideo.directVideoUrl || ''} | ${lastVideo.createdAt || ''} | ${lastVideo.playCount || ''}\nВидео за период: ${combinedArray.length}\nПросмотров за период: ${filterPlayCount || ''}\n*`;

      // Добавьте строку в массив результатов
      resultsArray.push(userResultText);
    }

    // Объедините все строки результатов символами новой строки и верните результат
    return resultsArray.join('\n');
  } catch (error) {
    // Обработка ошибок остается неизменной
    switch (true) {
      case error instanceof TypeError && error.message.includes("Cannot read properties of undefined (reading 'users')"):
        console.error(`[ERROR]`, error)
        return '*Пользователь не найден!*';
      default:
        console.error(`[ERROR]`, error);
        await new Promise(resolve => setTimeout(resolve, 30 * 1000));
        // Повторный вызов функции
        return getTikTokInfo(firstDate, secondDate, nameOrUrl, attempt + 1);
    }
  }
}