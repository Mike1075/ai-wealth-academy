import React, { useState, useRef, useCallback } from 'react';
import { useAuth } from '~/lib/auth-context';
import { 
  uploadFileToStorage, 
  UPLOAD_CONFIGS, 
  validateFile, 
  formatFileSize, 
  getFileIcon,
  type UploadResult 
} from '~/lib/file-upload';

interface FileUploadProps {
  uploadType: keyof typeof UPLOAD_CONFIGS;
  onUploadComplete?: (result: UploadResult) => void;
  onUploadError?: (error: string) => void;
  relatedId?: number;
  className?: string;
  multiple?: boolean;
  disabled?: boolean;
}

interface UploadProgress {
  file: File;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  result?: UploadResult;
  error?: string;
}

export default function FileUpload({
  uploadType,
  onUploadComplete,
  onUploadError,
  relatedId,
  className = '',
  multiple = false,
  disabled = false
}: FileUploadProps) {
  const { userProfile } = useAuth();
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploads, setUploads] = useState<UploadProgress[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const config = UPLOAD_CONFIGS[uploadType];

  const handleFiles = useCallback(async (files: FileList) => {
    if (!userProfile) {
      onUploadError?.('请先登录');
      return;
    }

    const fileArray = Array.from(files);
    const validFiles: File[] = [];

    // 验证所有文件
    for (const file of fileArray) {
      const validationError = validateFile(file, config);
      if (validationError) {
        onUploadError?.(validationError);
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    // 如果不支持多文件，只取第一个
    const filesToUpload = multiple ? validFiles : [validFiles[0]];

    // 初始化上传进度
    const newUploads: UploadProgress[] = filesToUpload.map(file => ({
      file,
      progress: 0,
      status: 'uploading'
    }));

    setUploads(prev => [...prev, ...newUploads]);

    // 上传文件
    for (let i = 0; i < filesToUpload.length; i++) {
      const file = filesToUpload[i];
      
      try {
        // 模拟进度更新
        const progressInterval = setInterval(() => {
          setUploads(prev => prev.map(upload => 
            upload.file === file && upload.status === 'uploading'
              ? { ...upload, progress: Math.min(upload.progress + 10, 90) }
              : upload
          ));
        }, 200);

        const result = await uploadFileToStorage(
          file,
          uploadType,
          userProfile.id,
          relatedId
        );

        clearInterval(progressInterval);

        setUploads(prev => prev.map(upload => 
          upload.file === file
            ? { 
                ...upload, 
                progress: 100, 
                status: result.success ? 'completed' : 'error',
                result: result.success ? result : undefined,
                error: result.success ? undefined : result.error
              }
            : upload
        ));

        if (result.success) {
          onUploadComplete?.(result);
        } else {
          onUploadError?.(result.error || '上传失败');
        }
      } catch (error) {
        setUploads(prev => prev.map(upload => 
          upload.file === file
            ? { 
                ...upload, 
                progress: 0, 
                status: 'error',
                error: '上传失败'
              }
            : upload
        ));
        onUploadError?.('上传失败');
      }
    }
  }, [userProfile, config, uploadType, relatedId, multiple, onUploadComplete, onUploadError]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (disabled) return;
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFiles(files);
    }
  }, [disabled, handleFiles]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
    // 清空input值，允许重复选择同一文件
    e.target.value = '';
  }, [handleFiles]);

  const handleClick = useCallback(() => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  }, [disabled]);

  const removeUpload = useCallback((file: File) => {
    setUploads(prev => prev.filter(upload => upload.file !== file));
  }, []);

  const maxSizeMB = Math.round(config.maxSize / (1024 * 1024));
  const allowedTypesText = config.allowedTypes
    .map(type => type.split('/')[1])
    .join(', ');

  return (
    <div className={`file-upload ${className}`}>
      {/* 上传区域 */}
      <div
        className={`
          border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${isDragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-blue-400 hover:bg-gray-50'}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileInput}
          multiple={multiple}
          accept={config.allowedTypes.join(',')}
          disabled={disabled}
        />
        
        <div className="space-y-2">
          <div className="text-4xl">📁</div>
          <div className="text-lg font-medium text-gray-900">
            {isDragOver ? '释放文件以上传' : '点击或拖拽文件到此处'}
          </div>
          <div className="text-sm text-gray-500">
            支持格式：{allowedTypesText}
          </div>
          <div className="text-sm text-gray-500">
            最大文件大小：{maxSizeMB}MB
          </div>
          {multiple && (
            <div className="text-sm text-gray-500">
              支持多文件上传
            </div>
          )}
        </div>
      </div>

      {/* 上传进度列表 */}
      {uploads.length > 0 && (
        <div className="mt-4 space-y-2">
          <h4 className="text-sm font-medium text-gray-900">上传进度</h4>
          {uploads.map((upload, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">
                    {getFileIcon(upload.file.type)}
                  </span>
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {upload.file.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatFileSize(upload.file.size)}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {upload.status === 'completed' && (
                    <span className="text-green-500 text-sm">✅ 完成</span>
                  )}
                  {upload.status === 'error' && (
                    <span className="text-red-500 text-sm">❌ 失败</span>
                  )}
                  <button
                    onClick={() => removeUpload(upload.file)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
              </div>
              
              {/* 进度条 */}
              {upload.status === 'uploading' && (
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${upload.progress}%` }}
                  />
                </div>
              )}
              
              {/* 错误信息 */}
              {upload.status === 'error' && upload.error && (
                <div className="text-xs text-red-600 mt-1">
                  {upload.error}
                </div>
              )}
              
              {/* 成功信息 */}
              {upload.status === 'completed' && upload.result?.data && (
                <div className="text-xs text-green-600 mt-1">
                  文件上传成功
                  {upload.result.data.public_url && (
                    <a 
                      href={upload.result.data.public_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 underline"
                    >
                      查看文件
                    </a>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 