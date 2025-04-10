export type FileCategory = 'image' | 'document' | 'video' | 'audio' | 'archive' | 'other';

interface CategoryConfig {
    maxSize: number;
    allowedMimeTypes: string[];
}

const CATEGORY_CONFIGS: Record<FileCategory, CategoryConfig> = {
    image: {
        maxSize: 5 * 1024 * 1024,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif'],
    },
    document: {
        maxSize: 10 * 1024 * 1024,
        allowedMimeTypes: [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument',
        ]
    },
    archive: {
        maxSize: 50 * 1024 * 1024,
        allowedMimeTypes: ['application/zip', 'application/x-rar-compressed', 'application/x-7z-compressed', 'application/gzip'],
    },
    video: {
        maxSize: 50 * 1024 * 1024,
        allowedMimeTypes: ['video/mp4', 'video/quicktime', 'video/x-msvideo'],
    },
    audio: {
        maxSize: 20 * 1024 * 1024,
        allowedMimeTypes: ['audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/ogg']

    },
    other: {
        maxSize: 5 * 1024 * 1024,
        allowedMimeTypes: ['*/*']
    }
}

export function validateAndCategorizeFile(file: File) {
    const category = categorizeFile(file.type);
    const config = CATEGORY_CONFIGS[category];

    if (file.size > config.maxSize) {
        throw new Error(`File size exceeds the maximum limit of ${config.maxSize / 1024 / 1024} MB for category ${category}`);
    }

    if (category !== 'other' && !config.allowedMimeTypes.includes(file.type)) {
        throw new Error(`File type ${file.type} not allowed for category ${category}`);
    }

    return {
        category,
        mimeType: file.type,
        size: file.size,
    }
}

export function categorizeFile(mimeType: string): FileCategory {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('audio/')) return 'audio';

    const documentTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument',
        'text/plain',
        'text/csv',
    ]

    const archiveTypes = [
        'application/zip',
        'application/x-rar-compressed',
        'application/x-7z-compressed',
        'application/gzip',
    ];

    if (documentTypes.some((type) => mimeType.includes(type))) return 'document';
    if (archiveTypes.some((type) => mimeType.includes(type))) return 'archive';

    return 'other'
}