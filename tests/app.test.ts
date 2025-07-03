import { expect } from 'chai';
import { uploadHandler } from '../handlers/uploadHandler.js';
import { extractMetadata } from '../metadata/extractMetadata.js';
import { InvoiceSchema } from '../validation/invoiceSchema.js';
import { ERROR_MESSAGES } from '../constants.js';

describe('extractMetadata', () => {
    it('should extract invoice data correctly from OCR text', () => {
        const ocrText = `
      Invoice: INV-123
      Date: 2025-07-03
      Total: 100.50
      Customer: ACME Corp
      Address: 123 Street
    `;

        const result = extractMetadata(ocrText);

        expect(result).to.deep.equal({
            invoiceNumber: 'INV-123',
            date: '2025-07-03',
            amount: 100.50,
            customer: {
                name: 'ACME Corp'
            },
        });
    });

    it('should validate the metadata schema', () => {
        const metadata = {
            invoiceNumber: 'INV-001',
            date: '2025-07-01',
            amount: 200.0,
            customer: {
                name: 'John Doe',
                email: 'john@example.com',
            },
        };

        const result = InvoiceSchema.safeParse(metadata);
        expect(result.success).to.be.true;
    });

    it('should fail validation if required fields are missing', () => {
        const metadata = {
            invoiceNumber: '',
            date: '',
            amount: undefined,
            customer: {
                name: '',
                email: 'invalid-email',
            },
        };

        const result = InvoiceSchema.safeParse(metadata);
        expect(result.success).to.be.false;
    });
});

describe('uploadHandler', () => {
    it('should return 400 if no file is uploaded', async () => {
        const req: any = { file: undefined };

        const res: any = {
            statusCode: null,
            jsonData: null,
            status(code: number) {
                this.statusCode = code;
                return this;
            },
            json(data: any) {
                this.jsonData = data;
                return this;
            },
        };

        const next = () => { };

        await uploadHandler(req, res, next);

        expect(res.statusCode).to.equal(400);
        expect(res.jsonData).to.deep.equal({ error: ERROR_MESSAGES.FILE_REQUIRED });
    });
});
