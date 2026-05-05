# fanX

## 🚀 Overview

This project is a scalable backend system that mimics Twitter’s core feed functionality.

## 🧱 Tech Stack

- Node.js + Express
- PostgreSQL (Prisma ORM)
- Redis (Caching)
- JWT Authentication
- Docker

## ⚙️ Features

- User authentication
- Create tweets
- Fetch user feed
- Redis caching for fast reads

## 🏗️ Architecture

- REST API based
- Cache-first strategy
- Modular folder structure

## 📦 Setup

```bash
git clone github.com/ozaycank/fanX
cd funX
npm install
docker-compose up -d
npx prisma migrate dev
npm run dev
```

## 🔥 Key Concepts

- Feed generation strategies
- Cache optimization
- Database design
- Scalable architecture

## 📈 Future Improvements

- Fan-out on write
- Message queue integration
- Ranking algorithm
- Microservices split
