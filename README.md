# Matcher

A Node.js-based matching application that connects people based on their interests and preferences using AI-powered similarity matching. Features Telegram bot integration for seamless user interactions.

## Features

- **AI-Powered Matching**: Uses OpenAI embeddings and cosine similarity to find compatible matches
- **Telegram Bot Integration**: Complete bot experience for profile management and matching
- **RESTful API**: Full API with Swagger documentation
- **Background Processing**: Redis and BullMQ for efficient match processing
- **Database**: PostgreSQL with Supabase for data storage
- **Scheduled Tasks**: Automated match publishing via cron jobs

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL (via Supabase)
- **AI/ML**: OpenAI API for embeddings
- **Messaging**: Telegram Bot API
- **Queue System**: Redis, BullMQ
- **Scheduling**: node-cron
- **Documentation**: Swagger/OpenAPI

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- Redis server
- Supabase account
- OpenAI API key
- Telegram Bot Token

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd matcher
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your configuration


## Usage

### Development

Start the development server:
```bash
npm start
```

The server will start on `http://localhost:3000`

### API Documentation

Access Swagger documentation at: `http://localhost:3000/api-docs`

## Architecture

### Core Components

- **API Layer**: Express.js routes and controllers
- **Service Layer**: Business logic for users, matches, chats, and intros
- **Common Utilities**:
  - Telegram bot integration
  - OpenAI embeddings for similarity calculation
  - BullMQ for background matching
  - Cron scheduler for automated tasks
- **Database**: PostgreSQL with Supabase client

### Matching Algorithm

1. User profiles are converted to embeddings using OpenAI's text-embedding-ada-002
2. Cosine similarity is calculated between user interests
3. Top matches are stored and can be retrieved via API or Telegram bot

## Database Schema

The application uses four main tables:
- `users`: User profiles and preferences
- `matches`: Similarity-based match results
- `chats`: Conversation threads between matched users
- `messages`: Individual chat messages
- `intros`: Introduction requests between users