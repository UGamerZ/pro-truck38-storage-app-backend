export class CreateProductDto {
    oem: string;
    article: string;
    manufacturer: string;
    description: string;
    supplier: string;
    quantity: number;
    entryPrice: number;
    entryDate: Date;
    photos: string[];
}

export class RemoveDataDto {
    oem: string;
    article: string;
}
