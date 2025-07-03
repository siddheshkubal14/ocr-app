# Document OCR & Metadata Extraction Microservice

This microservice enables users to upload documents that are then processed asynchronously for OCR (Optical Character Recognition), metadata extraction, validation, and persistence.

It is built with modular, testable, and production-ready design principles, using Express, TypeScript, BullMQ, Redis, Zod, and Docker.

## IMP:

.env file shared separately (add it at root level, same level as server.ts)

---

## Table of Contents

- [Features](#features)  
- [Architecture](#architecture)  
- [Folder Structure](#folder-structure)  
- [Getting Started](#getting-started)  
- [API Usage](#api-usage)  
- [Testing](#testing)  
- [Deployment](#deployment)  
- [Future Improvements](#future-improvements)

---

## Features

- RESTful file upload API with validation
- Asynchronous processing via BullMQ + Redis
- OCR simulation (replaceable with real OCR)
- Metadata extraction using regex
- Schema validation with Zod
- API key authentication & CORS protection
- Structured error handling
- Centralized logging with Winston
- Fully Dockerized with automated deploy script
- TDD with Mocha, Chai

---

## Architecture

```

Client ──▶ /api/upload
│
\[middlewares] ─ validate, auth, CORS
│
uploadHandler
│
─ Save to disk
─ Save to Redis
─ Enqueue job
│
Background worker (BullMQ)
│
─ Simulate OCR
─ Extract metadata
─ Validate metadata
─ Update Redis
─ Cleanup temp files

```

---

## Folder Structure

```
root/
├── api/                # API routes
├── config/             # Environment config
├── handlers/           # Upload processing logic
├── metadata/           # Metadata extractor
├── middlewares/        # Auth, validation, error handling
├── ocr/                # OCR simulation
├── queues/             # BullMQ queue config
├── workers/            # Job processor
├── storage/            # Redis and persistence helpers
├── logger/             # Winston setup
├── validation/         # Zod schemas
├── uploads/            # Temporary file storage
├── tests/              # Mocha/Chai test suite
├── app.ts              # Express app config
├── server.ts           # Server startup
├── Dockerfile          # Container definition
├── docker-compose.yml  # App + Redis setup
├── deploy.sh           # Deployment automation
├── .env                # Environment variables
└── README.md
````

---

## Getting Started
Run locally or deploy and run via docker (shown below)

### 1. Clone and Install

```bash
git clone https://github.com/siddheshkubal14/ocr-app.git
cd ocr-app
npm install
```

### 2. Setup Environment

Create a `.env` file:

```env
(.env file shared separately)
```

### 3. Start Redis

```bash
docker run -d -p 6379:6379 redis
```

### 4. Run Locally

```bash
npm start
```

App runs on: `http://localhost:3000`

---

## Deployment

### Deploy Script

```bash
chmod +x deploy.sh
bash ./deploy.sh
```
Builds, tags, pushes images to Docker Hub, and starts containers.


---

## API Usage

### Upload Document

**Endpoint:** `POST /api/upload`
**Headers:** `x-api-key: api-secret-key` (shared via env file separately)
**Form Data:** `file` (PDF/Image/doc)

> Use Postman or a frontend form to test.

**Response Example:**

```json
{
  "message": "File uploaded and processing started",
  "docId": "INV-123"
}
```

---

## Testing

Run all unit tests:

```bash
npm test
```

* Uses Mocha + Chai for assertions
* Mocks Redis and file system
* TDD-compliant structure

---


## Future Improvements

| Feature                      | Reason                                            |
| ---------------------------- | ------------------------------------------------- |
| OCR threshold implementation | Move from mock OCR to production-grade OCR engine |
| Stronger Authentication      | Token-based session security                      |
| Magic Number File Validation | Prevent fake or corrupted file uploads            |
| Admin Dashboard              | Monitor status, retry DLQ jobs, view logs         |
| Object Storage (S3/GCS)      | Replace local storage with scalable cloud storage |
| Prometheus/Grafana           | Observability, health checks, alerting            |
| CI/CD Pipeline               | Lint + test automation + Docker build pipelines   |

---

