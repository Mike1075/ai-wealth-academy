import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://fravbpockztpjnpofxcq.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZyYXZicG9ja3p0cGpucG9meGNxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjMyODU4NiwiZXhwIjoyMDY3OTA0NTg2fQ.WLeSfy-0oSfWtGcgTXMbvhuON4X1JadXQnOL8hek0k4'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function testRealUser() {
  console.log('测试完整的用户注册流程...')
  
  try {
    // 1. 创建一个真实的Supabase Auth用户
    console.log('1. 创建Supabase Auth用户...')
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: 'realtest@example.com',
      password: 'testpassword123',
      email_confirm: true
    })
    
    if (authError) {
      console.error('❌ 创建Auth用户失败:', authError)
      return false
    }
    
    console.log('✅ Auth用户创建成功，ID:', authData.user.id)
    
    // 2. 在users表中插入对应记录
    console.log('2. 在users表中插入记录...')
    const { data: insertData, error: insertError } = await supabase
      .from('users')
      .insert({
        auth_user_id: authData.user.id,
        email: authData.user.email,
        name: '真实测试用户',
        phone: '13800000000',
        role: 'student'
      })
    
    if (insertError) {
      console.error('❌ 插入users表失败:', insertError)
      return false
    } else {
      console.log('✅ users表插入成功!')
      return true
    }
    
  } catch (error) {
    console.error('❌ 测试过程中出现错误:', error)
    return false
  }
}

const success = await testRealUser()
if (success) {
  console.log('🎉 完整流程测试成功！用户注册应该可以正常工作了！')
} else {
  console.log('💔 仍然有问题需要解决')
}
process.exit(success ? 0 : 1)
