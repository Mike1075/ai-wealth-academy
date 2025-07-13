import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { supabase } from "~/lib/supabase";

// GET /api/courses - 获取课程列表
export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1");
  const limit = parseInt(url.searchParams.get("limit") || "10");
  const search = url.searchParams.get("search") || "";
  const level = url.searchParams.get("level") || "";
  const includeEnrollments = url.searchParams.get("include_enrollments") === "true";

  try {
    // 验证API密钥
    const apiKey = request.headers.get("x-api-key");
    if (!apiKey || apiKey !== process.env.API_KEY) {
      return json({ error: "Unauthorized" }, { status: 401 });
    }

    let selectQuery = '*';
    if (includeEnrollments) {
      selectQuery = `
        *,
        enrollments (
          id,
          status,
          created_at,
          users (name, email)
        )
      `;
    }

    let query = supabase
      .from('courses')
      .select(selectQuery, { count: 'exact' });

    // 搜索过滤
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    // 难度过滤
    if (level) {
      query = query.eq('level', level);
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

// POST /api/courses - 创建课程
// PUT /api/courses/:id - 更新课程
// DELETE /api/courses/:id - 删除课程
export async function action({ request }: ActionFunctionArgs) {
  try {
    // 验证API密钥
    const apiKey = request.headers.get("x-api-key");
    if (!apiKey || apiKey !== process.env.API_KEY) {
      return json({ error: "Unauthorized" }, { status: 401 });
    }

    const method = request.method;
    const url = new URL(request.url);
    const courseId = url.pathname.split('/').pop();

    switch (method) {
      case "POST": {
        const body = await request.json();
        const { title, description, level, duration, price, image_url } = body;

        // 验证必填字段
        if (!title || !description || !level || !duration || price === undefined) {
          return json({ 
            error: "Title, description, level, duration, and price are required" 
          }, { status: 400 });
        }

        // 验证价格
        if (typeof price !== 'number' || price < 0) {
          return json({ error: "Price must be a non-negative number" }, { status: 400 });
        }

        // 验证难度等级
        if (!['初级', '中级', '高级'].includes(level)) {
          return json({ error: "Level must be one of: 初级, 中级, 高级" }, { status: 400 });
        }

        // 创建课程
        const { data, error } = await supabase
          .from('courses')
          .insert([{ title, description, level, duration, price, image_url }])
          .select()
          .single();

        if (error) throw error;

        return json({ data }, { status: 201 });
      }

      case "PUT": {
        if (!courseId || courseId === 'courses') {
          return json({ error: "Course ID is required" }, { status: 400 });
        }

        const body = await request.json();
        const { title, description, level, duration, price, image_url } = body;

        // 验证价格
        if (price !== undefined && (typeof price !== 'number' || price < 0)) {
          return json({ error: "Price must be a non-negative number" }, { status: 400 });
        }

        // 验证难度等级
        if (level && !['初级', '中级', '高级'].includes(level)) {
          return json({ error: "Level must be one of: 初级, 中级, 高级" }, { status: 400 });
        }

        // 更新课程
        const { data, error } = await supabase
          .from('courses')
          .update({ title, description, level, duration, price, image_url })
          .eq('id', courseId)
          .select()
          .single();

        if (error) throw error;

        if (!data) {
          return json({ error: "Course not found" }, { status: 404 });
        }

        return json({ data });
      }

      case "DELETE": {
        if (!courseId || courseId === 'courses') {
          return json({ error: "Course ID is required" }, { status: 400 });
        }

        // 检查是否有报名记录
        const { count } = await supabase
          .from('enrollments')
          .select('*', { count: 'exact', head: true })
          .eq('course_id', courseId);

        if (count && count > 0) {
          return json({ 
            error: "Cannot delete course with existing enrollments" 
          }, { status: 409 });
        }

        const { error } = await supabase
          .from('courses')
          .delete()
          .eq('id', courseId);

        if (error) throw error;

        return json({ message: "Course deleted successfully" });
      }

      default:
        return json({ error: "Method not allowed" }, { status: 405 });
    }
  } catch (error) {
    console.error('API错误:', error);
    return json({ error: "Internal server error" }, { status: 500 });
  }
} 