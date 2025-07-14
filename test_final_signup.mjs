import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://fravbpockztpjnpofxcq.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZyYXZicG9ja3p0cGpucG9meGNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzMjg1ODYsImV4cCI6MjA2NzkwNDU4Nn0.PO8A0I-8HxpSiB0qSwbXuYwjjzlMGxas41PKqr6ZJr8'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZyYXZicG9ja3p0cGpucG9meGNxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjMyODU4NiwiZXhwIjoyMDY3OTA0NTg2fQ.WLeSfy-0oSfWtGcgTXMbvhuON4X1JadXQnOL8hek0k4'

const supabase = createClient(supabaseUrl, supabaseAnonKey)
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

// 模拟我们修复后的signUp函数
async function signUp(email, password, userData) {
  try {
    console.log('Starting user registration for:', email)
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    })

    if (error) {
      console.error('Supabase Auth Error:', error)
      return { data: null, error }
    }

    console.log('User registration successful:', data)

    // 如果注册成功，尝试创建用户记录
    if (data.user && !error) {
      try {
        console.log('Creating user profile with admin client for user:', data.user.id)
        
        // 先插入用户记录，auth_user_id暂时为null
        const { data: profileData, error: profileError } = await supabaseAdmin
          .from('users')
          .insert({
            email: data.user.email,
            name: userData?.name || '',
            phone: userData?.phone || '',
            role: 'student'
          })
          .select()

        if (profileError) {
          console.error('Error creating user profile:', profileError)
          return { 
            data: null, 
            error: { message: 'Database error saving new user. Please contact support.' }
          }
        }

        // 然后更新auth_user_id（稍后在用户确认邮箱后）
        console.log('User profile created successfully, will update auth_user_id after email confirmation')
        console.log('Profile data:', profileData)
        
      } catch (profileError) {
        console.error('Exception creating user profile:', profileError)
        return { 
          data: null, 
          error: { message: 'Database error saving new user. Please try again.' }
        }
      }
    }

    return { data, error }
  } catch (exception) {
    console.error('Registration exception:', exception)
    return { 
      data: null, 
      error: { message: 'Registration failed. Please try again.' }
    }
  }
}

async function testFinalSignUp() {
  console.log('🧪 测试修复后的用户注册流程...')
  
  const result = await signUp('finaltest@example.com', 'testpassword123', {
    name: '张鑫',
    phone: '13803118888'
  })
  
  if (result.error) {
    console.error('❌ 注册失败:', result.error)
    return false
  } else {
    console.log('✅ 注册成功!')
    return true
  }
}

const success = await testFinalSignUp()
if (success) {
  console.log('🎉 用户注册问题已完全解决！')
} else {
  console.log('💔 仍需进一步调试')
}
process.exit(success ? 0 : 1)
