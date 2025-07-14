import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://fravbpockztpjnpofxcq.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZyYXZicG9ja3p0cGpucG9meGNxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjMyODU4NiwiZXhwIjoyMDY3OTA0NTg2fQ.WLeSfy-0oSfWtGcgTXMbvhuON4X1JadXQnOL8hek0k4'

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

async function testInsert() {
  console.log('测试直接插入users表...')
  
  try {
    // 测试1：不指定auth_user_id（允许为null）
    console.log('测试1：插入不含auth_user_id的用户...')
    const { data: data1, error: error1 } = await supabaseAdmin
      .from('users')
      .insert({
        name: '测试用户1',
        email: 'test1@example.com',
        phone: '13800000001',
        role: 'student'
      })
      .select()
    
    if (error1) {
      console.error('❌ 测试1失败:', error1)
    } else {
      console.log('✅ 测试1成功:', data1)
    }
    
    // 测试2：使用一个假的UUID
    console.log('测试2：插入含假UUID的用户...')
    const { data: data2, error: error2 } = await supabaseAdmin
      .from('users')
      .insert({
        name: '测试用户2',
        email: 'test2@example.com',
        phone: '13800000002',
        role: 'student',
        auth_user_id: '550e8400-e29b-41d4-a716-446655440000'
      })
      .select()
    
    if (error2) {
      console.error('❌ 测试2失败:', error2)
    } else {
      console.log('✅ 测试2成功:', data2)
    }
    
  } catch (error) {
    console.error('❌ 测试过程中出现错误:', error)
  }
}

await testInsert()
