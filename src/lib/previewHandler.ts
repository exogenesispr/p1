import { FileCategory } from "./fileValidation";

export interface PreviewConfig {
    canPreview: boolean;
    previewType: 'image' | 'iframe' | 'download' | 'audio' | 'none';
    icon: string;
    thumbnailUrl?: string;
}

const CATEGORY_ICONS: Record<FileCategory, string> = {
    image: 'https://cdn.jsdelivr.net/npm/heroicons@2.0.18/24/outline/photo.svg',
    document: 'https://cdn.jsdelivr.net/npm/heroicons@2.0.18/24/outline/document.svg',
    archive: 'https://cdn.jsdelivr.net/npm/heroicons@2.0.18/24/outline/archive-box.svg',
    video: 'https://cdn.jsdelivr.net/npm/heroicons@2.0.18/24/outline/video-camera.svg',
    audio: 'https://cdn.jsdelivr.net/npm/heroicons@2.0.18/24/outline/musical-note.svg',
    other: 'https://cdn.jsdelivr.net/npm/heroicons@2.0.18/24/outline/document.svg'
};

export function generatePreviewConfig(category: FileCategory, fileUrl: string, mimeType: string): PreviewConfig {
    // Get the icon for this category
    const icon = CATEGORY_ICONS[category];

    switch (category) {
        case 'image':
            return {
                canPreview: true,
                previewType: 'image',
                icon,
                thumbnailUrl: fileUrl, // For images, use the actual file as thumbnail
            }
        case 'document':
            return {
                canPreview: mimeType === 'application/pdf',
                previewType: mimeType === 'application/pdf' ? 'iframe' : 'download',
                icon,
                thumbnailUrl: mimeType === 'application/pdf' ? fileUrl : icon, // For PDFs, use the file as thumbnail if available
            }
        case 'archive':
            return {
                canPreview: false,
                previewType: 'download',
                icon,
                thumbnailUrl: icon, // Use the icon as thumbnail
            };
        case 'video':
            return {
                canPreview: true,
                previewType: 'iframe',
                icon,
                thumbnailUrl: icon, // Use the icon as thumbnail
            }
        case 'audio':
            return {
                canPreview: true,
                previewType: 'audio',
                icon,
                thumbnailUrl: icon, // Use the icon as thumbnail
            }
        default:
            return {
                canPreview: false,
                previewType: 'download',
                icon,
                thumbnailUrl: icon, // Use the icon as thumbnail
            }
    }
}
