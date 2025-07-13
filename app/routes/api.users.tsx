import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { supabase, userService } from "~/lib/supabase";

// GET /api/users - 获取用户列表
export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1");
  const limit = parseInt(url.searchParams.get("limit") || "10");
  const search = url.searchParams.get("search") || "";
  const role = url.searchParams.get("role") || "";

  try {
    // 验证API密钥（简单实现）
    const apiKey = request.headers.get("x-api-key");
    if (!apiKey || apiKey !== process.env.API_KEY) {
      return json({ error: "Unauthorized" }, { status: 401 });
    }

    let query = supabase
      .from('users')
      .select(`
        *,
        enrollments (count),
        admins (permissions)
      `, { count: 'exact' });

    // 搜索过滤
    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
    }

    // 角色过滤
    if (role) {
      query = query.eq('role', role);
    }

    // 分页
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    // 排序
    query = query.order('created_at', { ascending: false });

    const { data, error, count } = await query;

    if (error) throw error;

    return json({
      data,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    });
  } catch (error) {
    console.error('API错误:', error);
    return json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/users - 创建用户
// PUT /api/users/:id - 更新用户
// DELETE /api/users/:id - 删除用户
export async function action({ request }: ActionFunctionArgs) {
  try {
    // 验证API密钥
    const apiKey = request.headers.get("x-api-key");
    if (!apiKey || apiKey !== process.env.API_KEY) {
      return json({ error: "Unauthorized" }, { status: 401 });
    }

    const method = request.method;
    const url = new URL(request.url);
    const userId = url.pathname.split('/').pop();

    switch (method) {
      case "POST": {
        const body = await request.json();
        const { name, email, phone, role = 'student' } = body;

        // 验证必填字段
        if (!name || !email) {
          return json({ error: "Name and email are required" }, { status: 400 });
        }

        // 检查邮箱是否已存在
        const { data: existingUser } = await supabase
          .from('users')
          .select('id')
          .eq('email', email)
          .single();

        if (existingUser) {
          return json({ error: "Email already exists" }, { status: 409 });
        }

        // 创建用户
        const { data, error } = await supabase
          .from('users')
          .insert([{ name, email, phone, role }])
          .select()
          .single();

        if (error) throw error;

        // 如果是管理员，添加到admins表
        if (role === 'admin') {
          await supabase
            .from('admins')
            .insert([{
              user_id: data.id,
              permissions: ['user_management', 'course_management', 'enrollment_management']
            }]);
        }

        return json({ data }, { status: 201 });
      }

      case "PUT": {
        if (!userId || userId === 'users') {
          return json({ error: "User ID is required" }, { status: 400 });
        }

        const body = await request.json();
        const { name, email, phone, role } = body;

        // 更新用户
        const { data, error } = await supabase
          .from('users')
          .update({ name, email, phone, role })
          .eq('id', userId)
          .select()
          .single();

        if (error) throw error;

        if (!data) {
          return json({ error: "User not found" }, { status: 404 });
        }

        // 处理管理员权限
        if (role === 'admin') {
          await supabase
            .from('admins')
            .upsert([{
              user_id: data.id,
              permissions: ['user_management', 'course_management', 'enrollment_management']
            }]);
        } else {
          await supabase
            .from('admins')
            .delete()
            .eq('user_id', data.id);
        }

        return json({ data });
      }

      case "DELETE": {
        if (!userId || userId === 'users') {
          return json({ error: "User ID is required" }, { status: 400 });
        }

        const { error } = await supabase
          .from('users')
          .delete()
          .eq('id', userId);

        if (error) throw error;

        return json({ message: "User deleted successfully" });
      }

      default:
        return json({ error: "Method not allowed" }, { status: 405 });
    }
  } catch (error) {
    console.error('API错误:', error);
    return json({ error: "Internal server error" }, { status: 500 });
  }
} 