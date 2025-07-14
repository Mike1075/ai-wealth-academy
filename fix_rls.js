const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://fravbpockztpjnpofxcq.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZyYXZicG9ja3p0cGpucG9meGNxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjMyODU4NiwiZXhwIjoyMDY3OTA0NTg2fQ.WLeSfy-0oSfWtGcgTXMbvhuON4X1JadXQnOL8hek0k4'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function fixRLS() {
  console.log('开始修复users表的RLS策略...')
  
  try {
    // 直接测试插入，看看是否还有递归错误
    console.log('测试插入用户...')
    const { data: insertData, error: insertError } = await supabase
      .from('users')
      .insert({
        auth_user_id: '550e8400-e29b-41d4-a716-446655440001',
        email: 'test@example.com',
        name: '测试用户',
        phone: '13800000000',
        role: 'student'
      })
    
    if (insertError) {
      console.error('❌ 插入测试失败:', insertError)
      return false
    } else {
      console.log('✅ 插入测试成功!')
      return true
    }
    
  } catch (error) {
    console.error('❌ 修复过程中出现错误:', error)
    return false
  }
}

fixRLS().then(success => {
  if (success) {
    console.log('🎉 RLS问题已解决！')
  } else {
    console.log('💔 RLS问题仍然存在')
  }
  process.exit(success ? 0 : 1)
})
