-- Supabase Storage Buckets 设置脚本
-- 注意：这些命令需要在Supabase Dashboard的SQL编辑器中执行

-- 创建存储桶（通过Supabase Dashboard或CLI）
-- 1. avatars - 用户头像
-- 2. course-images - 课程图片  
-- 3. assignments - 作业文件
-- 4. documents - 文档文件

-- 设置存储桶策略

-- 1. avatars bucket 策略
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- 允许用户上传自己的头像
CREATE POLICY "Users can upload own avatar" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'avatars' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- 允许用户更新自己的头像
CREATE POLICY "Users can update own avatar" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'avatars' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- 允许用户删除自己的头像
CREATE POLICY "Users can delete own avatar" ON storage.objects
FOR DELETE USING (
  bucket_id = 'avatars' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- 允许所有人查看头像（公共访问）
CREATE POLICY "Avatars are publicly accessible" ON storage.objects
FOR SELECT USING (bucket_id = 'avatars');

-- 2. course-images bucket 策略
INSERT INTO storage.buckets (id, name, public) 
VALUES ('course-images', 'course-images', true)
ON CONFLICT (id) DO NOTHING;

-- 只有管理员可以上传课程图片
CREATE POLICY "Admins can manage course images" ON storage.objects
FOR ALL USING (
  bucket_id = 'course-images' AND
  EXISTS (
    SELECT 1 FROM users u 
    JOIN admins a ON u.id = a.user_id 
    WHERE u.auth_user_id = auth.uid()
  )
);

-- 所有人可以查看课程图片
CREATE POLICY "Course images are publicly accessible" ON storage.objects
FOR SELECT USING (bucket_id = 'course-images');

-- 3. assignments bucket 策略
INSERT INTO storage.buckets (id, name, public) 
VALUES ('assignments', 'assignments', false)
ON CONFLICT (id) DO NOTHING;

-- 用户可以上传作业文件
CREATE POLICY "Users can upload assignments" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'assignments' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- 用户可以查看自己的作业文件
CREATE POLICY "Users can view own assignments" ON storage.objects
FOR SELECT USING (
  bucket_id = 'assignments' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- 管理员可以查看所有作业文件
CREATE POLICY "Admins can view all assignments" ON storage.objects
FOR SELECT USING (
  bucket_id = 'assignments' AND
  EXISTS (
    SELECT 1 FROM users u 
    JOIN admins a ON u.id = a.user_id 
    WHERE u.auth_user_id = auth.uid()
  )
);

-- 4. documents bucket 策略
INSERT INTO storage.buckets (id, name, public) 
VALUES ('documents', 'documents', false)
ON CONFLICT (id) DO NOTHING;

-- 用户可以上传文档
CREATE POLICY "Users can upload documents" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'documents' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- 用户可以管理自己的文档
CREATE POLICY "Users can manage own documents" ON storage.objects
FOR ALL USING (
  bucket_id = 'documents' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- 管理员可以管理所有文档
CREATE POLICY "Admins can manage all documents" ON storage.objects
FOR ALL USING (
  bucket_id = 'documents' AND
  EXISTS (
    SELECT 1 FROM users u 
    JOIN admins a ON u.id = a.user_id 
    WHERE u.auth_user_id = auth.uid()
  )
);

-- 设置存储桶大小限制和文件类型限制
-- 注意：这些限制需要在应用层实现，数据库层面只是记录

COMMENT ON TABLE storage.buckets IS '存储桶配置：
avatars: 用户头像，公共访问，最大2MB，支持jpg/png/webp
course-images: 课程图片，公共访问，最大5MB，支持jpg/png/webp  
assignments: 作业文件，私有访问，最大10MB，支持pdf/doc/docx/txt/jpg/png
documents: 文档文件，私有访问，最大20MB，支持pdf/doc/docx/xls/xlsx/txt'; 