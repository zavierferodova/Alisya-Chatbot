# Alisya Chatbot

A friendly conversational chatbot named Alisya integrated with Large Language Model (gemini-2.0-flash) for creating response and using Chromadb to store conversation as memory. Using [whatsapp-web.js](https://wwebjs.dev) as interface so this bot can used for everyone using their personal WhatsApp number.

### Feature List

1. Add number to group chat.
2. Kick person from group chat.
3. Make sticker from sent image media.
4. Tagging all group participants.
5. Sending a message or media via bot to someone.
6. Talking with bot using LLM with image attachment.
7. Take over, automatic message response assistant.

### Setup

## Development Setup

For local development without Docker:

1. Install node modules,
   ```bash
   pnpm install
   ```
2. Create `.env` file from `.env.example`,
   ```bash
   cp .env.example .env
   ```
3. Fill `.env` file,
   ```
   CHIPER_KEY=<your_custom_secret_key>
   LLM_API_KEY=<your_llm_api_key>
   DB_NAME=BotDatabase.db
   ```
4. Perform database migration to store bot configuration and seeding for initialize data,
   ```bash
   pnpm run migrate
   pnpm run seed
   ```
5. Create chromadb container,
   ```bash
   cd chromadb
   docker-compose up -d
   ```
6. Start development server,
   ```bash
   pnpm run dev
   ```
7. Wait application to start and after QR Code appeared scan it on WhatsApp to login,
8. After client authenticated you're ready to go,
9. Enjoyy...

## Production Setup

For production deployment using Docker:

1. Create `.env` file from `.env.example`,
   ```bash
   cp .env.example .env
   ```
2. Fill `.env` file,
   ```
   CHIPER_KEY=<your_custom_secret_key>
   LLM_API_KEY=<your_llm_api_key>
   DB_NAME=BotDatabase.db
   ```
3. Start all services using Docker Compose,
   ```bash
   docker-compose up -d
   ```
4. Wait for application to start and QR Code to appear in logs,
5. Scan the QR Code on WhatsApp to login,
6. After client authenticated you're ready to go,
7. Enjoyy...

#### Environment Variables

Make sure to set these in your `.env` file:

- `CHIPER_KEY`: Your custom secret key for encryption
- `LLM_API_KEY`: Your Google Generative AI API key for LLM functionality
- `DB_NAME`: Database name (default: BotDatabase.db)

For Mac and Windows User:

- `CHROMIUM_PATH`: (You can keep this configuration empty, and puppeteer will open browser from the package)

### Usage

You can send a `!help` command message to show the list action that bot can do. For bot configuration command you can send `!help` command message to your self WhatsApp phone number.

### Additional Note

This bot using LLM from [Google Generative AI](https://generativelanguage.google.com) you can grab your API key from [Google AI Studio](https://makersuite.google.com/app/maker) and fill it into env file.

### Libraries

- [whatsapp-web.js](https://wwebjs.dev/)
- [LangChain.js](https://js.langchain.com)
- [Google Generative AI](https://aistudio.google.com/)
- [Sequelize](https://sequelize.org)

### Credits

Developed by Zavier Ferodova Al Fitroh ✌️
