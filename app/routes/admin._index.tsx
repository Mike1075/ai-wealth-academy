import { useState, useEffect } from "react";
import { Link } from "@remix-run/react";
import { useAuth, ProtectedRoute } from "~/lib/auth-context";
import { supabase } from "~/lib/supabase";

interface AdminStats {
  totalUsers: number;
  totalCourses: number;
  totalEnrollments: number;
  totalRevenue: number;
  recentEnrollments: any[];
  recentUsers: any[];
}

export default function AdminDashboard() {
  const { userProfile } = useAuth();
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalCourses: 0,
    totalEnrollments: 0,
    totalRevenue: 0,
    recentEnrollments: [],
    recentUsers: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAdminStats();
  }, []);

  const loadAdminStats = async () => {
    try {
      // 获取用户总数
      const { count: userCount } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });

      // 获取课程总数
      const { count: courseCount } = await supabase
        .from('courses')
        .select('*', { count: 'exact', head: true });

      // 获取报名总数
      const { count: enrollmentCount } = await supabase
        .from('enrollments')
        .select('*', { count: 'exact', head: true });

      // 计算总收入（简化计算，实际应该基于付费状态）
      const { data: enrollmentsWithCourses } = await supabase
        .from('enrollments')
        .select(`
          *,
          courses (price)
        `)
        .eq('status', 'active');

      const totalRevenue = enrollmentsWithCourses?.reduce((sum, enrollment) => {
        return sum + (enrollment.courses?.price || 0);
      }, 0) || 0;

      // 获取最近的报名记录
      const { data: recentEnrollments } = await supabase
        .from('enrollments')
        .select(`
          *,
          users (name, email),
          courses (title)
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      // 获取最近注册的用户
      const { data: recentUsers } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      setStats({
        totalUsers: userCount || 0,
        totalCourses: courseCount || 0,
        totalEnrollments: enrollmentCount || 0,
        totalRevenue,
        recentEnrollments: recentEnrollments || [],
        recentUsers: recentUsers || []
      });
    } catch (error) {
      console.error('加载管理员统计数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <ProtectedRoute adminOnly>
      <div className="min-h-screen bg-gray-50">
        {/* Navigation */}
        <nav className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <Link to="/" className="text-2xl font-bold text-blue-600">
                  🤖 AI创富营 - 管理后台
                </Link>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">管理员：{userProfile?.name}</span>
                <Link
                  to="/dashboard"
                  className="text-blue-600 hover:text-blue-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  返回前台
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Admin Navigation */}
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-8">
              <Link
                to="/admin"
                className="border-b-2 border-blue-500 text-blue-600 py-4 px-1 text-sm font-medium"
              >
                总览
              </Link>
              <Link
                to="/admin/users"
                className="border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 py-4 px-1 text-sm font-medium"
              >
                用户管理
              </Link>
              <Link
                to="/admin/courses"
                className="border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 py-4 px-1 text-sm font-medium"
              >
                课程管理
              </Link>
              <Link
                to="/admin/enrollments"
                className="border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 py-4 px-1 text-sm font-medium"
              >
                报名管理
              </Link>
              <Link
                to="/admin/analytics"
                className="border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 py-4 px-1 text-sm font-medium"
              >
                数据分析
              </Link>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">管理员仪表板</h1>
            <p className="mt-2 text-gray-600">系统概览和关键指标</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                      <span className="text-white text-sm">👥</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">总用户数</dt>
                      <dd className="text-lg font-medium text-gray-900">{stats.totalUsers}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                      <span className="text-white text-sm">📚</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">总课程数</dt>
                      <dd className="text-lg font-medium text-gray-900">{stats.totalCourses}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                      <span className="text-white text-sm">📝</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">总报名数</dt>
                      <dd className="text-lg font-medium text-gray-900">{stats.totalEnrollments}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                      <span className="text-white text-sm">💰</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">总收入</dt>
                      <dd className="text-lg font-medium text-gray-900">¥{stats.totalRevenue.toLocaleString()}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Enrollments */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">最近报名</h3>
                <div className="flow-root">
                  <ul className="-my-5 divide-y divide-gray-200">
                    {stats.recentEnrollments.map((enrollment) => (
                      <li key={enrollment.id} className="py-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                              <span className="text-blue-600 text-sm">📚</span>
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {enrollment.users?.name}
                            </p>
                            <p className="text-sm text-gray-500 truncate">
                              报名了 {enrollment.courses?.title}
                            </p>
                          </div>
                          <div className="flex-shrink-0 text-sm text-gray-500">
                            {new Date(enrollment.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Recent Users */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">最近注册用户</h3>
                <div className="flow-root">
                  <ul className="-my-5 divide-y divide-gray-200">
                    {stats.recentUsers.map((user) => (
                      <li key={user.id} className="py-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                              <span className="text-green-600 text-sm">👤</span>
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {user.name}
                            </p>
                            <p className="text-sm text-gray-500 truncate">
                              {user.email}
                            </p>
                          </div>
                          <div className="flex-shrink-0 text-sm text-gray-500">
                            {new Date(user.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">快速操作</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link
                  to="/admin/courses/new"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <span className="mr-2">➕</span>
                  添加新课程
                </Link>
                <Link
                  to="/admin/users"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <span className="mr-2">👥</span>
                  管理用户
                </Link>
                <Link
                  to="/admin/analytics"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <span className="mr-2">📊</span>
                  查看分析
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
} 