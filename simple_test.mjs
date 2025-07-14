import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://fravbpockztpjnpofxcq.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZyYXZicG9ja3p0cGpucG9meGNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzMjg1ODYsImV4cCI6MjA2NzkwNDU4Nn0.PO8A0I-8HxpSiB0qSwbXuYwjjzlMGxas41PKqr6ZJr8'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZyYXZicG9ja3p0cGpucG9meGNxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjMyODU4NiwiZXhwIjoyMDY3OTA0NTg2fQ.WLeSfy-0oSfWtGcgTXMbvhuON4X1JadXQnOL8hek0k4'

const supabase = createClient(supabaseUrl, supabaseAnonKey)
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

async function testSignUp() {
  console.log('测试用户注册流程...')
  
  try {
    // 1. 使用anon key注册用户（模拟真实注册）
    console.log('1. 使用Supabase Auth注册用户...')
    const { data, error } = await supabase.auth.signUp({
      email: 'newtest@example.com',
      password: 'testpassword123'
    })

    if (error) {
      console.error('❌ Auth注册失败:', error)
      return false
    }

    console.log('✅ Auth注册成功，用户ID:', data.user?.id)

    // 2. 如果注册成功，使用admin key插入users表
    if (data.user) {
      console.log('2. 使用admin key插入users表...')
      const { error: profileError } = await supabaseAdmin
        .from('users')
        .insert({
          auth_user_id: data.user.id,
          email: data.user.email,
          name: '新测试用户',
          phone: '13800000001',
          role: 'student'
        })

      if (profileError) {
        console.error('❌ 插入users表失败:', profileError)
        return false
      } else {
        console.log('✅ users表插入成功!')
        return true
      }
    }
    
  } catch (error) {
    console.error('❌ 测试过程中出现错误:', error)
    return false
  }
}

const success = await testSignUp()
if (success) {
  console.log('🎉 用户注册流程完全正常！问题已解决！')
} else {
  console.log('💔 用户注册流程仍有问题')
}
process.exit(success ? 0 : 1)
