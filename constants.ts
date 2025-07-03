export const ERROR_MESSAGES = {
    INVALID_FILE_TYPE: 'Only PDF, Word, PNG, and JPEG files are allowed.',
    FILE_TOO_LARGE: 'File size exceeds the 2MB limit.',
    FILE_REQUIRED: 'A file is required.',
    TOO_MANY_REQUESTS: 'Too many requests from this IP, please try again later.'
};

export const allowedMimeTypes = [
    'image/png',
    'image/jpeg',
    'application/pdf',
    'application/msword', // .doc
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
];

export const whitelistedURL = ['http://localhost:3000'];

export const allowedExtensions = ['.png', '.jpg', '.jpeg', '.pdf', '.doc', '.docx'];

export const fileSizeLimit = 2 * 1024 * 1024; // 2MB

export enum DocumentStatus {
    Uploaded = 'uploaded',
    Processing = 'processing',
    Validated = 'validated',
    Failed = 'failed',
}

export const defaultMetadata = {
    invoiceNumber: "INV-123",
    date: "2025-07-03",
    amount: '100.50',
    customer: {
        name: "ACME Corp",
        address: "123 Street"
    }
};
