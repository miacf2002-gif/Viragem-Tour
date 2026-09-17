# Deploy do site Viragem Tour

## 1. Frontend no Vercel

1. Acede a https://vercel.com
2. Importa este repositório
3. Framework Preset: Vite
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Adiciona estas variáveis de ambiente:
   - `VITE_API_URL=https://SEU-BACKEND-RENDER-URL`
   - `VITE_MANAGER_PASSWORD=sua_password_secreta`

## 2. Backend no Render

1. Acede a https://render.com
2. Cria um Web Service
3. Conecta o mesmo repositório
4. Usar o comando de build: `npm install`
5. Usar o comando de arranque: `npm start`
6. Adiciona estas variáveis de ambiente:
   - `PORT=3001`
   - `GOOGLE_SERVICE_ACCOUNT_JSON={...}`
   - `GOOGLE_CALENDAR_ID=SEU_CALENDAR_ID`
   - `VITE_MANAGER_PASSWORD=sua_password_secreta`

## 3. Google Calendar

1. Cria um Service Account no Google Cloud
2. Descarrega a chave JSON
3. Copia o `client_email`
4. No calendário do negócio, partilha com esse email como Editor
5. Usa o ID do calendário na variável `GOOGLE_CALENDAR_ID`

## 4. Testes finais

- Faz uma reserva na página
- Verifica se aparece no Google Calendar
- Verifica se o gestor consegue aceitar ou rejeitar
- Testa a área de gestão com a password escolhida

## 5. Atualizar depois

- Altera texto, imagens e experiências aqui no workspace
- Depois faz um novo deploy no Vercel e no Render
