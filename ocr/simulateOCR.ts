import { defaultMetadata } from "../constants.js";

type OCRResult = {
    text: string;
    confidence: number;
    language: string;
};

export function simulateOCR(buffer: Buffer): Promise<OCRResult> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                text: JSON.stringify(defaultMetadata),
                confidence: 0.98,
                language: 'en',
            });
        }, 500);
    });
}
