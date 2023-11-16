import { TTScraper } from "../tiktok/src/main";
import * as fs from 'fs/promises';
import * as path from 'path';

export default async function getTikTokInfo(firstDate: string, secondDate: string, nameOrUrl: string, attempt: number = 1) {
  try {
    const TikTokScraper = new TTScraper();

    const usernames = nameOrUrl.split(/\s+/).map(username => {
      const match = username.match(/@(.+?)(\?|\/|$)/);
      return match ? match[1] : username;
    });

    const tableRows = [];

    for (const username of usernames) {
      async function getUserVideos(this_attempt: number = 1) {
        try {
          const getAllVideosFromUser = await TikTokScraper.getAllVideosFromUser(username);
          const combinedArray = getAllVideosFromUser.map(obj => {
            return {
              createdAt: obj.createdAt || '',
              directVideoUrl: obj.directVideoUrl || '',
              playCount: obj.playCount || 0
            };
          });
          return combinedArray;
        } catch (error) {
          if (error instanceof TypeError && error.message.includes("Cannot read properties of undefined (reading 'users')")) {
            console.error(`[ERROR]`, error);
            tableRows.push(`Пользователь - ${username} не найден!`);
            return;
          }
          console.error(`[ERROR]`, error);
          await new Promise(resolve => setTimeout(resolve, 30 * 1000));
          console.log(`[ERROR] ${username} restarting function`)
          return getUserVideos(this_attempt + 1);
        }
      }

      const firstDateParts = firstDate.split(".");
      const secondDateParts = secondDate.split(".");
      const startDate = `${firstDateParts[1]}.${firstDateParts[0]}.${firstDateParts[2]}`;
      const endDate = `${secondDateParts[1]}.${secondDateParts[0]}.${secondDateParts[2]}`;
      
      const videos = await getUserVideos();
      if (videos != undefined) {
        const filteredArray = videos.filter(obj => {
          const createdAtDate = obj.createdAt;
          return new Date(createdAtDate) >= new Date(startDate) && new Date(createdAtDate) <= new Date(endDate);
        });
        const filterPlayCount = filteredArray.reduce((accumulator, obj) => accumulator + obj.playCount, 0);
        const formattedPlayCount = filterPlayCount.toLocaleString();

        const videoRows: any[] = [];
        if (filteredArray.length == 0) videoRows.push(`*[${firstDate} - ${secondDate}] - ${username}\nНет видео за период\n*`);

        // Собираем строки таблицы для каждого пользователя
        filteredArray.forEach(video => {
          const row = `${video.directVideoUrl || ''} | ${video.createdAt || ''} | ${video.playCount || ''}`;
          videoRows.push(row);
        });

        // Добавляем строки таблицы для текущего пользователя в общий массив
        const userTable = [
          `[${firstDate} - ${secondDate}] - ${username}`,
          ...videoRows,
          `Видео за период - [${filteredArray.length}]`,
          `Просмотров за период - [${formattedPlayCount}]`,
        ];
        tableRows.push(userTable.join('\n'));
      }
    }
    // Записываем таблицу в текстовый файл
    const tableText = tableRows.join('\n\n');
    const fileNameTable = `${new Date().toISOString().replace(/[:.]/g, '_')}.txt`;
    const filePathTable = path.join(__dirname, '../storage/txt', fileNameTable);
    await fs.writeFile(filePathTable, tableText, 'utf-8');

    return { tableFilePath: filePathTable };
  } catch (error) {
    console.error(`[ERROR]`, error);
  }
}