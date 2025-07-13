import { supabase } from './supabase';

export interface FileUploadOptions {
  bucket: string;
  folder?: string;
  maxSize?: number; // bytes
  allowedTypes?: string[];
  isPublic?: boolean;
}

export interface UploadResult {
  success: boolean;
  data?: {
    id: number;
    file_name: string;
    file_path: string;
    file_size: number;
    file_type: string;
    public_url?: string;
  };
  error?: string;
}

// 默认配置
export const UPLOAD_CONFIGS = {
  avatar: {
    bucket: 'avatars',
    folder: 'user-avatars',
    maxSize: 2 * 1024 * 1024, // 2MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    isPublic: true
  },
  course_image: {
    bucket: 'course-images',
    folder: 'course-covers',
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    isPublic: true
  },
  assignment: {
    bucket: 'assignments',
    folder: 'submissions',
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'image/jpeg',
      'image/png'
    ],
    isPublic: false
  },
  document: {
    bucket: 'documents',
    folder: 'general',
    maxSize: 20 * 1024 * 1024, // 20MB
    allowedTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain'
    ],
    isPublic: false
  }
};

// 验证文件
export function validateFile(file: File, config: FileUploadOptions): string | null {
  // 检查文件大小
  if (config.maxSize && file.size > config.maxSize) {
    const maxSizeMB = Math.round(config.maxSize / (1024 * 1024));
    return `文件大小不能超过 ${maxSizeMB}MB`;
  }

  // 检查文件类型
  if (config.allowedTypes && !config.allowedTypes.includes(file.type)) {
    return `不支持的文件类型。支持的类型：${config.allowedTypes.join(', ')}`;
  }

  return null;
}

// 生成唯一文件名
export function generateFileName(originalName: string, userId: number): string {
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 8);
  const extension = originalName.split('.').pop();
  return `${userId}_${timestamp}_${randomStr}.${extension}`;
}

// 上传文件到Supabase Storage
export async function uploadFileToStorage(
  file: File,
  uploadType: keyof typeof UPLOAD_CONFIGS,
  userId: number,
  relatedId?: number
): Promise<UploadResult> {
  try {
    const config = UPLOAD_CONFIGS[uploadType];
    
    // 验证文件
    const validationError = validateFile(file, config);
    if (validationError) {
      return { success: false, error: validationError };
    }

    // 生成文件名和路径
    const fileName = generateFileName(file.name, userId);
    const filePath = config.folder ? `${config.folder}/${fileName}` : fileName;

    // 上传到Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(config.bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      return { success: false, error: '文件上传失败' };
    }

    // 获取公共URL（如果是公共文件）
    let publicUrl: string | undefined;
    if (config.isPublic) {
      const { data: urlData } = supabase.storage
        .from(config.bucket)
        .getPublicUrl(filePath);
      publicUrl = urlData.publicUrl;
    }

    // 保存文件记录到数据库
    const { data: fileRecord, error: dbError } = await supabase
      .from('file_uploads')
      .insert([{
        user_id: userId,
        file_name: file.name,
        file_path: filePath,
        file_size: file.size,
        file_type: file.type,
        bucket_name: config.bucket,
        upload_type: uploadType,
        related_id: relatedId,
        is_public: config.isPublic
      }])
      .select()
      .single();

    if (dbError) {
      console.error('Database insert error:', dbError);
      // 清理已上传的文件
      await supabase.storage.from(config.bucket).remove([filePath]);
      return { success: false, error: '保存文件记录失败' };
    }

    return {
      success: true,
      data: {
        id: fileRecord.id,
        file_name: fileRecord.file_name,
        file_path: fileRecord.file_path,
        file_size: fileRecord.file_size,
        file_type: fileRecord.file_type,
        public_url: publicUrl
      }
    };
  } catch (error) {
    console.error('Upload error:', error);
    return { success: false, error: '文件上传失败' };
  }
}

// 删除文件
export async function deleteFile(fileId: number, userId: number): Promise<{ success: boolean; error?: string }> {
  try {
    // 获取文件记录
    const { data: fileRecord, error: fetchError } = await supabase
      .from('file_uploads')
      .select('*')
      .eq('id', fileId)
      .eq('user_id', userId)
      .single();

    if (fetchError || !fileRecord) {
      return { success: false, error: '文件不存在或无权限删除' };
    }

    // 从Storage删除文件
    const { error: storageError } = await supabase.storage
      .from(fileRecord.bucket_name)
      .remove([fileRecord.file_path]);

    if (storageError) {
      console.error('Storage delete error:', storageError);
    }

    // 从数据库删除记录
    const { error: dbError } = await supabase
      .from('file_uploads')
      .delete()
      .eq('id', fileId);

    if (dbError) {
      console.error('Database delete error:', dbError);
      return { success: false, error: '删除文件记录失败' };
    }

    return { success: true };
  } catch (error) {
    console.error('Delete error:', error);
    return { success: false, error: '删除文件失败' };
  }
}

// 获取文件URL
export async function getFileUrl(filePath: string, bucket: string, isPublic: boolean = false): Promise<string | null> {
  try {
    if (isPublic) {
      const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);
      return data.publicUrl;
    } else {
      const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(filePath, 3600); // 1小时有效期
      
      if (error) {
        console.error('Create signed URL error:', error);
        return null;
      }
      
      return data.signedUrl;
    }
  } catch (error) {
    console.error('Get file URL error:', error);
    return null;
  }
}

// 获取用户文件列表
export async function getUserFiles(
  userId: number, 
  uploadType?: string, 
  limit: number = 20
): Promise<any[]> {
  try {
    let query = supabase
      .from('file_uploads')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (uploadType) {
      query = query.eq('upload_type', uploadType);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Get user files error:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Get user files error:', error);
    return [];
  }
}

// 文件类型图标映射
export function getFileIcon(fileType: string): string {
  const iconMap: Record<string, string> = {
    'application/pdf': '📄',
    'application/msword': '📝',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '📝',
    'application/vnd.ms-excel': '📊',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '📊',
    'text/plain': '📃',
    'image/jpeg': '🖼️',
    'image/png': '🖼️',
    'image/webp': '🖼️',
    'image/gif': '🖼️'
  };

  return iconMap[fileType] || '📁';
}

// 格式化文件大小
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
} 