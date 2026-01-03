import { supabase } from './supabaseClient';

const STORAGE_BUCKET = 'wedding-media';

export type MediaType = 'images' | 'audio' | 'video' | 'qr';

/**
 * Upload a file to Supabase Storage.
 * @param file - The file to upload
 * @param weddingSlug - The wedding slug for organizing files
 * @param mediaType - Type of media (images, audio, video, qr)
 * @param filename - Optional custom filename (without extension)
 * @returns Public URL of the uploaded file
 */
export async function uploadMedia(
    file: File,
    weddingSlug: string,
    mediaType: MediaType,
    filename?: string
): Promise<string> {
    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const uniqueName = filename || `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const filePath = `${weddingSlug}/${mediaType}/${uniqueName}.${fileExt}`;

    console.log(`📤 [Storage] Uploading to: ${filePath}`);

    const { data, error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(filePath, file, {
            cacheControl: '31536000', // 1 year cache for optimal repeat performance
            upsert: true, // Overwrite if exists
        });

    if (error) {
        console.error('❌ [Storage] Upload failed:', error);
        throw error;
    }

    console.log('✅ [Storage] Upload successful:', data);

    // Get public URL
    const { data: urlData } = supabase.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(filePath);

    console.log('🔗 [Storage] Public URL:', urlData.publicUrl);

    return urlData.publicUrl;
}

/**
 * Delete a file from Supabase Storage.
 * @param fileUrl - The public URL of the file to delete
 */
export async function deleteMedia(fileUrl: string): Promise<void> {
    try {
        const url = new URL(fileUrl);
        // Extract path after bucket name
        const pathMatch = url.pathname.match(/\/storage\/v1\/object\/public\/wedding-media\/(.+)/);
        if (!pathMatch || pathMatch.length < 2) {
            console.warn('⚠️ [Storage] Could not extract file path from URL:', fileUrl);
            return;
        }

        const filePath = decodeURIComponent(pathMatch[1]);
        console.log(`🗑️ [Storage] Deleting: ${filePath}`);

        const { error } = await supabase.storage.from(STORAGE_BUCKET).remove([filePath]);

        if (error) {
            console.error('❌ [Storage] Delete failed:', error);
            throw error;
        }

        console.log('✅ [Storage] Delete successful');
    } catch (err) {
        console.error('❌ [Storage] Delete error:', err);
    }
}

/**
 * Check if a URL is a Supabase Storage URL.
 */
export function isStorageUrl(url: string): boolean {
    return url?.includes('supabase.co/storage/v1/object/public/wedding-media');
}

/**
 * Convert a File to base64 Data URL (for preview before upload).
 */
export function fileToDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}
