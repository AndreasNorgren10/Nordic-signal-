NORDIC SIGNAL – PUBLICERING MED CLOUDFLARE PAGES

Detta paket innehåller:
- index.html: webbplatsen
- functions/api/time_series.js: serverfunktion som använder Twelve Data-nyckeln som en krypterad Secret

VIKTIGT
Lägg aldrig API-nyckeln i index.html eller i GitHub. Lägg den bara som Secret i Cloudflare med namnet:
TWELVE_DATA_API_KEY

STEG 1 – GITHUB
1. Gå till https://github.com och skapa/logga in på ett konto.
2. Skapa ett nytt repository, t.ex. nordic-signal. Välj Private om du vill hålla källkoden privat.
3. Packa upp ZIP-filen på datorn.
4. I GitHub-repot väljer du Add file > Upload files.
5. Ladda upp index.html, README-SV.txt och mappen functions (med api/time_series.js inuti). Ladda upp innehållet, inte ZIP-filen.
6. Klicka Commit changes.

STEG 2 – CLOUDFLARE PAGES
1. Gå till https://dash.cloudflare.com och skapa/logga in på ett konto.
2. Öppna Workers & Pages.
3. Välj Create application > Pages > Connect to Git.
4. Anslut GitHub och välj repot nordic-signal.
5. Låt Framework preset vara None.
6. Lämna Build command tomt.
7. Sätt Build output directory till / (om kontrollen kräver ett värde, använd .).
8. Välj Save and Deploy.
9. När publiceringen är klar får du en adress som slutar på pages.dev.

STEG 3 – LÄGG IN API-NYCKELN SÄKERT
1. I Cloudflare: öppna Workers & Pages och välj ditt nordic-signal-projekt.
2. Öppna Settings > Variables and Secrets (i vissa vyer: Settings > Variables and Secrets).
3. Lägg till en Secret. Namn: TWELVE_DATA_API_KEY
4. Klistra in din Twelve Data API-nyckel som värde och välj Encrypt/Secret.
5. Spara.
6. Gå till Deployments och gör en ny deployment/redeploy så att funktionen får tillgång till hemligheten.

STEG 4 – TESTA
1. Öppna din pages.dev-adress på datorn.
2. Skriv AAPL och välj Analysera aktie. (Detta är ett första test med en vanlig amerikansk symbol.)
3. Om det fungerar kan du lägga till sidan på iPhone: öppna adressen i Safari > Dela > Lägg till på hemskärmen.

FELSÖKNING
- Om du får ett meddelande om att servern saknar TWELVE_DATA_API_KEY: kontrollera Secret-namnet exakt och gör en ny deployment.
- Om Twelve Data säger att symbolen är ogiltig: anslutningen fungerar, men symbolen behöver hittas i Twelve Datas eget symbolregister.
- Den här proxyfunktionen begränsar anropen till Twelve Datas time_series-endpoint och till 1 250 datapunkter per anrop. Webbplatsens URL är offentlig; en person som känner till adressen kan fortfarande använda anropsfunktionen och förbruka API-kvot. Lägg till Cloudflare rate limiting/access-skydd innan du delar adressen brett.
