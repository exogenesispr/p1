export interface S3UploadResult {
    fileUrl: string;
    key: string;
}

export interface S3FileParams {
    fileName: string;
    fileType: string;
    file: Buffer;
}

export interface S3ListResult {
    files: {
        key: string;
        url: string;
        lastModified?: Date;
        size?: number;
    }[];
}