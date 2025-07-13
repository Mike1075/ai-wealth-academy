import { Link } from "@remix-run/react";
import { useState, useEffect } from "react";
import { useAuth, ProtectedRoute } from "~/lib/auth-context";
import { supabase } from "~/lib/supabase";
import type { Course, Enrollment } from "~/lib/supabase";

interface EnrollmentWithCourse extends Enrollment {
  courses: Course | null;
}

export default function Dashboard() {
  const { user, userProfile, signOut, loading } = useAuth();
  const [enrollments, setEnrollments] = useState<EnrollmentWithCourse[]>([]);
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (userProfile) {
      loadUserData();
    }
  }, [userProfile]);

  const loadUserData = async () => {
    if (!userProfile) return;

    try {
      // 获取用户的报名信息
      const { data: enrollmentData } = await supabase
        .from('enrollments')
        .select(`
          *,
          courses (*)
        `)
        .eq('user_id', userProfile.id);

      // 获取所有课程
      const { data: coursesData } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });

      setEnrollments(enrollmentData || []);
      setAllCourses(coursesData || []);
    } catch (error) {
      console.error('加载数据失败:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return '进行中';
      case 'pending':
        return '待开始';
      case 'completed':
        return '已完成';
      case 'cancelled':
        return '已取消';
      default:
        return '未知';
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Navigation */}
        <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link to="/" className="flex items-center">
                <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  🤖 爱学AI创富营
                </div>
              </Link>
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">欢迎，{userProfile?.name}</span>
                <button
                  onClick={handleSignOut}
                  className="text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  退出登录
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Welcome Section */}
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    🎉 欢迎来到你的学习仪表板
                  </h1>
                  <p className="text-gray-600">
                    在这里管理你的课程、跟踪学习进度，开启AI创富之旅！
                  </p>
                </div>
                <div className="hidden md:block">
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-3xl text-white">
                    🚀
                  </div>
                </div>
              </div>
            </div>

            {/* User Profile Card */}
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">个人信息</h2>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">姓名</label>
                    <p className="text-gray-900">{userProfile?.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">邮箱</label>
                    <p className="text-gray-900">{userProfile?.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">手机</label>
                    <p className="text-gray-900">{userProfile?.phone || '未填写'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">角色</label>
                    <p className="text-gray-900">
                      {userProfile?.role === 'admin' ? '管理员' : 
                       userProfile?.role === 'instructor' ? '导师' : '学员'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">学习统计</h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">已报名课程</span>
                    <span className="text-2xl font-bold text-blue-600">{enrollments.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">进行中</span>
                    <span className="text-2xl font-bold text-green-600">
                      {enrollments.filter(e => e.status === 'active').length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">已完成</span>
                    <span className="text-2xl font-bold text-purple-600">
                      {enrollments.filter(e => e.status === 'completed').length}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">快速操作</h2>
                <div className="space-y-3">
                  <Link
                    to="/courses"
                    className="block w-full bg-blue-600 text-white text-center py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    浏览课程
                  </Link>
                  <Link
                    to="/instructors"
                    className="block w-full bg-purple-600 text-white text-center py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    查看导师
                  </Link>
                  <Link
                    to="/about"
                    className="block w-full bg-gray-600 text-white text-center py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    了解更多
                  </Link>
                </div>
              </div>
            </div>

            {/* My Enrollments */}
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">我的课程</h2>
              
              {loadingData ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : enrollments.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {enrollments.map((enrollment) => (
                    <div key={enrollment.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                      {enrollment.courses && (
                        <>
                          <div className="flex justify-between items-start mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                              {enrollment.courses.title}
                            </h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(enrollment.status || 'pending')}`}>
                              {getStatusText(enrollment.status || 'pending')}
                            </span>
                          </div>
                          
                          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                            {enrollment.courses.description}
                          </p>
                          
                          <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                            <span>难度: {enrollment.courses.level}</span>
                            <span>时长: {enrollment.courses.duration}</span>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <span className="text-lg font-bold text-blue-600">
                              ¥{enrollment.courses.price.toLocaleString()}
                            </span>
                            <Link
                              to={`/course/${enrollment.courses.id}`}
                              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
                            >
                              查看详情
                            </Link>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center text-3xl text-gray-400">
                    📚
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">还没有报名任何课程</h3>
                  <p className="text-gray-600 mb-6">浏览我们的课程，开始你的AI创富之旅吧！</p>
                  <Link
                    to="/courses"
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                  >
                    浏览课程
                  </Link>
                </div>
              )}
            </div>

            {/* Recommended Courses */}
            {allCourses.length > 0 && (
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">推荐课程</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {allCourses
                    .filter(course => !enrollments.some(e => e.course_id === course.id))
                    .slice(0, 3)
                    .map((course) => (
                      <div key={course.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {course.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                          {course.description}
                        </p>
                        <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                          <span>难度: {course.level}</span>
                          <span>时长: {course.duration}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-bold text-blue-600">
                            ¥{course.price.toLocaleString()}
                          </span>
                          <Link
                            to={`/course/${course.id}`}
                            className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-700 transition-colors"
                          >
                            了解详情
                          </Link>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="text-2xl font-bold mb-4">
              🤖 爱学AI创富营
            </div>
            <p className="text-gray-400">
              © 2025 爱学AI创富实训营. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </ProtectedRoute>
  );
} 