# Alisya Chatbot

A friendly conversational chatbot named Alisya integrated with Large Language Model (llama3-8b-8192) for creating response and using SQLite to store conversation as memory. Using [whatsapp-web.js](https://wwebjs.dev) as interface so this bot can used for everyone using their personal WhatsApp number.

### Feature List
1. Add number to group chat.
2. Kick person from group chat.
3. Make sticker from sent image media.
4. Tagging all group participants.
5. Sending a message or media via bot to someone.
6. Talking with bot using LLM.

### Setup
1. Install node modules,
   ```bash
   npm install
   ```
2. Create `.env` file from `.env.example`,
   ```bash
   cp .env.example .env
   ```
3. Fill `.env` file,
   ```
   CHIPER_KEY=<your_custom_secret_key>
   GROQ_API_KEY=<your_groq_api_key>
   DB_NAME=BotDatabase.db
   ```
4. Perform database migration to store chat conversation,
   ```bash
   npm run migrate
   ```
5. Start node application,
   ```bash
   # Production server
   npm start

   # Development server
   npm run dev
6. Wait application to start and after QR Code appeared scan it on WhatsApp to login,
7. After client authenticated you're ready to go,
8. Enjoyy...

### Usage
You can send a `!help` command message to show the list action that bot can do.

### Additional Note
This bot using LLM from [Groq AI](https://groq.com) you can grab your API key from that site and fill it into env file.

### Libraries
- [whatsapp-web.js](https://groq.com)
- [LangChain.js](https://js.langchain.com)
- [LangChain Groq](https://www.npmjs.com/package/@langchain/groq)
- [Sequelize](https://sequelize.org)

### Credits
Developed by Zavier Ferodova Al Fitroh ✌️
