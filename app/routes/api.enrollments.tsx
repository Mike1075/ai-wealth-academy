import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { supabase } from "~/lib/supabase";

// GET /api/enrollments - 获取报名列表
export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1");
  const limit = parseInt(url.searchParams.get("limit") || "10");
  const search = url.searchParams.get("search") || "";
  const status = url.searchParams.get("status") || "";
  const userId = url.searchParams.get("user_id") || "";
  const courseId = url.searchParams.get("course_id") || "";

  try {
    // 验证API密钥
    const apiKey = request.headers.get("x-api-key");
    if (!apiKey || apiKey !== process.env.API_KEY) {
      return json({ error: "Unauthorized" }, { status: 401 });
    }

    let query = supabase
      .from('enrollments')
      .select(`
        *,
        users (id, name, email, phone),
        courses (id, title, description, level, duration, price)
      `, { count: 'exact' });

    // 用户过滤
    if (userId) {
      query = query.eq('user_id', userId);
    }

    // 课程过滤
    if (courseId) {
      query = query.eq('course_id', courseId);
    }

    // 状态过滤
    if (status) {
      query = query.eq('status', status);
    }

    // 搜索过滤（搜索用户名、邮箱或课程标题）
    if (search) {
      // 这里需要使用更复杂的查询，因为我们要在关联表中搜索
      // 简化处理：先获取所有数据，然后在应用层过滤
    }

    // 分页
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    // 排序
    query = query.order('created_at', { ascending: false });

    const { data, error, count } = await query;

    if (error) throw error;

    // 如果有搜索条件，在应用层过滤
    let filteredData = data || [];
    if (search) {
      filteredData = filteredData.filter(enrollment => 
        enrollment.users?.name.toLowerCase().includes(search.toLowerCase()) ||
        enrollment.users?.email.toLowerCase().includes(search.toLowerCase()) ||
        enrollment.courses?.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    return json({
      data: filteredData,
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

// POST /api/enrollments - 创建报名
// PUT /api/enrollments/:id - 更新报名
// DELETE /api/enrollments/:id - 删除报名
export async function action({ request }: ActionFunctionArgs) {
  try {
    // 验证API密钥
    const apiKey = request.headers.get("x-api-key");
    if (!apiKey || apiKey !== process.env.API_KEY) {
      return json({ error: "Unauthorized" }, { status: 401 });
    }

    const method = request.method;
    const url = new URL(request.url);
    const enrollmentId = url.pathname.split('/').pop();

    switch (method) {
      case "POST": {
        const body = await request.json();
        const { user_id, course_id, status = 'pending' } = body;

        // 验证必填字段
        if (!user_id || !course_id) {
          return json({ 
            error: "user_id and course_id are required" 
          }, { status: 400 });
        }

        // 验证状态
        if (!['pending', 'active', 'completed', 'cancelled'].includes(status)) {
          return json({ 
            error: "Status must be one of: pending, active, completed, cancelled" 
          }, { status: 400 });
        }

        // 检查用户是否存在
        const { data: user } = await supabase
          .from('users')
          .select('id')
          .eq('id', user_id)
          .single();

        if (!user) {
          return json({ error: "User not found" }, { status: 404 });
        }

        // 检查课程是否存在
        const { data: course } = await supabase
          .from('courses')
          .select('id')
          .eq('id', course_id)
          .single();

        if (!course) {
          return json({ error: "Course not found" }, { status: 404 });
        }

        // 检查是否已经报名
        const { data: existingEnrollment } = await supabase
          .from('enrollments')
          .select('id')
          .eq('user_id', user_id)
          .eq('course_id', course_id)
          .single();

        if (existingEnrollment) {
          return json({ 
            error: "User already enrolled in this course" 
          }, { status: 409 });
        }

        // 创建报名
        const { data, error } = await supabase
          .from('enrollments')
          .insert([{ user_id, course_id, status }])
          .select(`
            *,
            users (id, name, email, phone),
            courses (id, title, description, level, duration, price)
          `)
          .single();

        if (error) throw error;

        return json({ data }, { status: 201 });
      }

      case "PUT": {
        if (!enrollmentId || enrollmentId === 'enrollments') {
          return json({ error: "Enrollment ID is required" }, { status: 400 });
        }

        const body = await request.json();
        const { status } = body;

        // 验证状态
        if (status && !['pending', 'active', 'completed', 'cancelled'].includes(status)) {
          return json({ 
            error: "Status must be one of: pending, active, completed, cancelled" 
          }, { status: 400 });
        }

        // 更新报名
        const { data, error } = await supabase
          .from('enrollments')
          .update({ status })
          .eq('id', enrollmentId)
          .select(`
            *,
            users (id, name, email, phone),
            courses (id, title, description, level, duration, price)
          `)
          .single();

        if (error) throw error;

        if (!data) {
          return json({ error: "Enrollment not found" }, { status: 404 });
        }

        return json({ data });
      }

      case "DELETE": {
        if (!enrollmentId || enrollmentId === 'enrollments') {
          return json({ error: "Enrollment ID is required" }, { status: 400 });
        }

        const { error } = await supabase
          .from('enrollments')
          .delete()
          .eq('id', enrollmentId);

        if (error) throw error;

        return json({ message: "Enrollment deleted successfully" });
      }

      default:
        return json({ error: "Method not allowed" }, { status: 405 });
    }
  } catch (error) {
    console.error('API错误:', error);
    return json({ error: "Internal server error" }, { status: 500 });
  }
} 