# Deploy do site Viragem Tour no Render

O frontend e o backend correm juntos num único Web Service. Não é necessário usar o Vercel.

## 1. Criar o serviço

1. Acede a https://render.com
2. Cria um Web Service e liga o repositório
3. Usa:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
4. Adiciona estas variáveis de ambiente:
   - `PORT=3001`
   - `GOOGLE_SERVICE_ACCOUNT_JSON={...}`
   - `GOOGLE_CALENDAR_ID=SEU_CALENDAR_ID`
   - `VITE_MANAGER_PASSWORD=sua_password_secreta`

O Render atribui automaticamente a variável `PORT`. O valor definido no ficheiro serve apenas para desenvolvimento local.

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
- Depois faz um novo deploy no Render
