# OCR & Metadata - Document Processing Pipeline

This microservice enables users to upload documents that are then processed asynchronously for OCR (Optical Character Recognition), metadata extraction, validation, and persistence.

It is built with modular, testable, and production-ready design principles, using Express, TypeScript, BullMQ, Redis, Zod, and Docker.

**Important:**
`.env` file is shared separately — place it at the root level (same level as `server.ts`).

---

## Table of Contents

* [Features](#features)
* [Architecture](#architecture)
* [Folder Structure](#folder-structure)
* [Getting Started](#getting-started)
* [API Usage](#api-usage)
* [Testing](#testing)
* [Deployment](#deployment)
* [Future Improvements](#future-improvements)

---

## Features

* RESTful file upload API with validation
* API key authentication and CORS protection
* Asynchronous processing via BullMQ and Redis
* OCR simulation with confidence scoring
* Metadata extraction using regex
* Schema validation with Zod
* Conditional processing based on OCR confidence (> 0.9)
* Structured error handling and Dead Letter Queue fallback
* Centralized logging with Winston
* Fully Dockerized with deploy script
* Test-driven development with Mocha and Chai

---

## Architecture

```
Client ──▶ /api/upload
│
[middlewares] ─ validate, auth, CORS
│
uploadHandler
│
─ Save file to disk
─ Save document metadata to Redis
─ Enqueue background job
│
Background Worker (BullMQ)
│
─ Simulate OCR
─ Check OCR confidence > 0.9?
    ├── Yes: Extract metadata → Validate with Zod → Save updated info
    └── No: Mark status as failed → Add reason for manual review
│
─ Update Redis
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
```

---

## Getting Started

Run locally or deploy using Docker (recommended for production setup).

### 1. Clone and Install

```bash
git clone https://github.com/siddheshkubal14/ocr-app.git
cd ocr-app
npm install
```

### 2. Setup Environment

Create a `.env` file at the root:

```env
# Example (exact keys shared separately)
PORT=3000
API_KEY=the-secret-key
REDIS_URL=redis://localhost:6379
```

### 3. Start Redis (if not using Docker Compose)

```bash
docker run -d -p 6379:6379 redis
```

### 4. Run Locally

```bash
npm start
```

Visit: `http://localhost:3000`

---

## Deployment

### Run with Deploy Script

```bash
chmod +x deploy.sh
./deploy.sh
```

This will:

* Build and tag Docker images
* Push to Docker Hub
* Launch containers with Docker Compose

---

## API Usage

### Upload Document

* **Method:** `POST /api/upload`
* **Headers:** `x-api-key: your-api-key`
* **Form Field:** `file` (PDF, PNG, JPG, DOC)

Use Postman or a frontend form to test file uploads.

#### Example Response

```json
{
  "documentId": "abc123",
  "status": "uploaded"
}
```

---

## Processing Logic

* Simulated OCR assigns a confidence score.
* If `confidence > 0.9`, document is parsed, validated, and marked as `validated`.
* If `confidence <= 0.9`, it is marked as `failed` with a reason for manual verification.
* Future enhancement: Replace mock OCR with actual cloud OCR (e.g., Google Vision, AWS Textract).

---

## Testing

Run all unit tests:

```bash
npm test
```

* Uses Mocha and Chai
* Redis and file system are mocked
* Tests handlers, queues, and processors

---

## Future Improvements

| Feature                  | Reason                                                   |
| ------------------------ | -------------------------------------------------------- |
| OCR confidence threshold | Already implemented (`> 0.9`)                            |
| Stronger authentication  | Use JWT or OAuth for user-level security                 |
| Magic number validation  | Prevent malicious or fake file uploads                   |
| Admin dashboard          | Monitor job status, logs, and Dead Letter Queue retry UI |
| Cloud object storage     | Migrate from local disk to S3 or GCS                     |
| Prometheus/Grafana       | Add observability and alerting                           |
| Retry/backoff mechanism  | Improve Dead Letter Queue retry logic                    |
| CI/CD pipeline           | Automate testing, linting, and Docker builds             |

---

Let me know if you want me to add badges or generate an OpenAPI spec!
Certainly! Here's the README update without any emojis:

---

# OCR & Metadata - Document Processing Pipeline

This microservice enables users to upload documents that are then processed asynchronously for OCR (Optical Character Recognition), metadata extraction, validation, and persistence.

It is built with modular, testable, and production-ready design principles, using Express, TypeScript, BullMQ, Redis, Zod, and Docker.

**Important:**
`.env` file is shared separately — place it at the root level (same level as `server.ts`).

---

## Table of Contents

* [Features](#features)
* [Architecture](#architecture)
* [Folder Structure](#folder-structure)
* [Getting Started](#getting-started)
* [API Usage](#api-usage)
* [Testing](#testing)
* [Deployment](#deployment)
* [Future Improvements](#future-improvements)

---

## Features

* RESTful file upload API with validation
* API key authentication and CORS protection
* Asynchronous processing via BullMQ and Redis
* OCR simulation with confidence scoring
* Metadata extraction using regex
* Schema validation with Zod
* Conditional processing based on OCR confidence (> 0.9)
* Structured error handling and Dead Letter Queue fallback
* Centralized logging with Winston
* Fully Dockerized with deploy script
* Test-driven development with Mocha and Chai

---

## Architecture

```
Client ──▶ /api/upload
│
[middlewares] ─ validate, auth, CORS
│
uploadHandler
│
─ Save file to disk
─ Save document metadata to Redis
─ Enqueue background job
│
Background Worker (BullMQ)
│
─ Simulate OCR
─ Check OCR confidence > 0.9?
    ├── Yes: Extract metadata → Validate with Zod → Save updated info
    └── No: Mark status as failed → Add reason for manual review
│
─ Update Redis
─ Cleanup temporary files (optional)
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
```

---

## Getting Started

Run locally or deploy using Docker (recommended for production setup).

### 1. Clone and Install

```bash
git clone https://github.com/siddheshkubal14/ocr-app.git
cd ocr-app
npm install
```

### 2. Setup Environment

Create a `.env` file at the root:

```env
# Example (exact keys shared separately)
PORT=3000
API_KEY=your-secret-key
REDIS_URL=redis://localhost:6379
```

### 3. Start Redis (if not using Docker Compose)

```bash
docker run -d -p 6379:6379 redis
```

### 4. Run Locally

```bash
npm start
```

Visit: `http://localhost:3000`

---

## Deployment

### Run with Deploy Script

```bash
chmod +x deploy.sh
./deploy.sh
```

This will:

* Build and tag Docker images
* Push to Docker Hub
* Launch containers with Docker Compose

---

## API Usage

### Upload Document

* **Method:** `POST /api/upload`
* **Headers:** `x-api-key: your-api-key`
* **Form Field:** `file` (PDF, PNG, JPG, DOC)

Use Postman or a frontend form to test file uploads. Current file size limit kept is 2MB.

#### Example Response

```json
{
  "documentId": "abc123",
  "status": "uploaded"
}
```

---

## Processing Logic

* Simulated OCR assigns a confidence score.
* If `confidence > 0.9`, document is parsed, validated, and marked as `validated`.
* If `confidence <= 0.9`, it is marked as `failed` with a reason for manual verification.
* Future enhancement: Replace mock OCR with actual cloud OCR (e.g., Google Vision, AWS Textract).

---

## Testing

Run all unit tests:

```bash
npm test
```

* Uses Mocha and Chai
* Redis and file system are mocked
* Tests handlers, queues, and processors

---

## Future Improvements

| Feature                        | Reason                                                              |
| ------------------------------ | ------------------------------------------------------------------- |
| Stronger authentication        | Use JWT or OAuth for user-level security                            |
| Magic number validation        | Prevent malicious or fake file uploads                              |
| Admin dashboard                | Monitor job status, logs, and Dead Letter Queue retry UI            |
| Cloud object storage           | Migrate from local disk to S3 or GCS                                |
| Prometheus/Grafana             | Add observability and alerting                                      |
| Retry/backoff mechanism        | Improve Dead Letter Queue retry logic                               |
| CI/CD pipeline                 | Automate testing, linting, and Docker builds                        |
| Removing files post-processing | Files removed post-processing via cron job after ‘x’ number of days |

---
