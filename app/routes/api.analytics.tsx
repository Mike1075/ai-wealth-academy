import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { supabase } from "~/lib/supabase";

// GET /api/analytics - 获取统计分析数据
export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const type = url.searchParams.get("type") || "overview";
  const startDate = url.searchParams.get("start_date");
  const endDate = url.searchParams.get("end_date");

  try {
    // 验证API密钥
    const apiKey = request.headers.get("x-api-key");
    if (!apiKey || apiKey !== process.env.API_KEY) {
      return json({ error: "Unauthorized" }, { status: 401 });
    }

    switch (type) {
      case "overview": {
        // 获取总体统计数据
        const [
          { count: totalUsers },
          { count: totalCourses },
          { count: totalEnrollments },
          { data: enrollmentsWithCourses }
        ] = await Promise.all([
          supabase.from('users').select('*', { count: 'exact', head: true }),
          supabase.from('courses').select('*', { count: 'exact', head: true }),
          supabase.from('enrollments').select('*', { count: 'exact', head: true }),
          supabase
            .from('enrollments')
            .select('*, courses(price)')
            .eq('status', 'active')
        ]);

        const totalRevenue = enrollmentsWithCourses?.reduce((sum, enrollment) => {
          return sum + (enrollment.courses?.price || 0);
        }, 0) || 0;

        // 按状态统计报名
        const { data: enrollmentsByStatus } = await supabase
          .from('enrollments')
          .select('status')
          .then(({ data }) => {
            const statusCounts = {
              pending: 0,
              active: 0,
              completed: 0,
              cancelled: 0
            };
            data?.forEach(enrollment => {
              const status = enrollment.status || 'pending';
              if (status in statusCounts) {
                statusCounts[status as keyof typeof statusCounts]++;
              }
            });
            return { data: statusCounts };
          });

        // 按角色统计用户
        const { data: usersByRole } = await supabase
          .from('users')
          .select('role')
          .then(({ data }) => {
            const roleCounts = {
              student: 0,
              instructor: 0,
              admin: 0
            };
            data?.forEach(user => {
              const role = user.role || 'student';
              if (role in roleCounts) {
                roleCounts[role as keyof typeof roleCounts]++;
              }
            });
            return { data: roleCounts };
          });

        return json({
          overview: {
            totalUsers: totalUsers || 0,
            totalCourses: totalCourses || 0,
            totalEnrollments: totalEnrollments || 0,
            totalRevenue
          },
          enrollmentsByStatus: enrollmentsByStatus || {},
          usersByRole: usersByRole || {}
        });
      }

      case "revenue": {
        // 收入分析
        let query = supabase
          .from('enrollments')
          .select(`
            created_at,
            status,
            courses (price, title)
          `)
          .eq('status', 'active');

        // 日期过滤
        if (startDate) {
          query = query.gte('created_at', startDate);
        }
        if (endDate) {
          query = query.lte('created_at', endDate);
        }

        const { data: enrollments } = await query;

        // 按月统计收入
        const monthlyRevenue: Record<string, number> = {};
        const courseRevenue: Record<string, { title: string; revenue: number; count: number }> = {};

                 enrollments?.forEach(enrollment => {
           const date = new Date(enrollment.created_at || '');
           const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
           const courses = enrollment.courses as any;
           const price = courses?.price || 0;
           const courseTitle = courses?.title || 'Unknown';

          // 按月收入
          monthlyRevenue[monthKey] = (monthlyRevenue[monthKey] || 0) + price;

          // 按课程收入
          if (!courseRevenue[courseTitle]) {
            courseRevenue[courseTitle] = { title: courseTitle, revenue: 0, count: 0 };
          }
          courseRevenue[courseTitle].revenue += price;
          courseRevenue[courseTitle].count += 1;
        });

        return json({
          monthlyRevenue,
          courseRevenue: Object.values(courseRevenue).sort((a, b) => b.revenue - a.revenue)
        });
      }

      case "enrollments": {
        // 报名趋势分析
        let query = supabase
          .from('enrollments')
          .select(`
            created_at,
            status,
            courses (title, level)
          `);

        // 日期过滤
        if (startDate) {
          query = query.gte('created_at', startDate);
        }
        if (endDate) {
          query = query.lte('created_at', endDate);
        }

        const { data: enrollments } = await query;

        // 按日期统计报名
        const dailyEnrollments: Record<string, number> = {};
        const levelDistribution: Record<string, number> = {};

                 enrollments?.forEach(enrollment => {
           const date = new Date(enrollment.created_at || '');
           const dateKey = date.toISOString().split('T')[0];
           const courses = enrollment.courses as any;
           const level = courses?.level || 'Unknown';

          // 按日报名
          dailyEnrollments[dateKey] = (dailyEnrollments[dateKey] || 0) + 1;

          // 按难度分布
          levelDistribution[level] = (levelDistribution[level] || 0) + 1;
        });

        return json({
          dailyEnrollments,
          levelDistribution
        });
      }

      case "users": {
        // 用户增长分析
        let query = supabase
          .from('users')
          .select('created_at, role');

        // 日期过滤
        if (startDate) {
          query = query.gte('created_at', startDate);
        }
        if (endDate) {
          query = query.lte('created_at', endDate);
        }

        const { data: users } = await query;

        // 按日期统计新用户
        const dailyNewUsers: Record<string, number> = {};
        const cumulativeUsers: Record<string, number> = {};

        users?.sort((a, b) => new Date(a.created_at || '').getTime() - new Date(b.created_at || '').getTime());

        let totalCount = 0;
        users?.forEach(user => {
          const date = new Date(user.created_at || '');
          const dateKey = date.toISOString().split('T')[0];

          // 按日新用户
          dailyNewUsers[dateKey] = (dailyNewUsers[dateKey] || 0) + 1;

          // 累计用户
          totalCount += 1;
          cumulativeUsers[dateKey] = totalCount;
        });

        return json({
          dailyNewUsers,
          cumulativeUsers
        });
      }

      case "popular_courses": {
        // 热门课程分析
        const { data: popularCourses } = await supabase
          .from('courses')
          .select(`
            *,
            enrollments (count)
          `)
          .order('created_at', { ascending: false });

        const coursesWithStats = popularCourses?.map(course => ({
          ...course,
          enrollmentCount: course.enrollments?.[0]?.count || 0
        })).sort((a, b) => b.enrollmentCount - a.enrollmentCount);

        return json({
          popularCourses: coursesWithStats?.slice(0, 10) || []
        });
      }

      default:
        return json({ error: "Invalid analytics type" }, { status: 400 });
    }
  } catch (error) {
    console.error('分析API错误:', error);
    return json({ error: "Internal server error" }, { status: 500 });
  }
} 