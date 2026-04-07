// get-token.ts  —  запустить один раз: npx ts-node get-token.ts
import { google } from 'googleapis';
import * as readline from 'readline';

const oauth2Client = new google.auth.OAuth2(
    "495784182640-719c3pge6qaas4blds2v7jqtiga1dsue.apps.googleusercontent.com",
    "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",
    "http://localhost:3000",
);

const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline', // обязательно для получения refresh_token
  prompt: 'consent',      // обязательно чтобы refresh_token пришёл
  scope: ['https://www.googleapis.com/auth/drive.file'],
});

console.log('Перейдите по ссылке:', authUrl);

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
rl.question('Вставьте code из URL после редиректа: ', async (code) => {
  const { tokens } = await oauth2Client.getToken(code);
  console.log('Ваш Refresh Token:', tokens.refresh_token);
  rl.close();
});
