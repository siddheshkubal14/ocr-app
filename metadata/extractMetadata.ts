import { defaultMetadata } from "../constants.js";

interface Customer {
    name: string;
    email?: string;
}

interface InvoiceMetadata {
    invoiceNumber: string;
    date: string;
    amount: number;
    customer: Customer;
}


export function extractMetadata(text: string): InvoiceMetadata {
    const invoiceNumber = text.match(/INV-\d+/)?.[0] || defaultMetadata.invoiceNumber;
    const customerName = text.match(/Customer:\s*(.*)/)?.[1] || defaultMetadata.customer.name;
    const amount = parseFloat(text.match(/Total:\s*(\d+(\.\d+)?)/)?.[1] || defaultMetadata.amount);
    const date = text.match(/Date:\s*(\d{4}-\d{2}-\d{2})/)?.[1] || defaultMetadata.date;

    return {
        invoiceNumber,
        customer: {
            name: customerName
        },
        amount,
        date,
    };
}
