import { useState, useEffect } from "react";
import { Link } from "@remix-run/react";
import { useAuth, ProtectedRoute } from "~/lib/auth-context";
import { supabase } from "~/lib/supabase";
import type { Enrollment } from "~/lib/supabase";

interface EnrollmentWithDetails extends Enrollment {
  users: { name: string; email: string } | null;
  courses: { title: string; price: number } | null;
}

export default function AdminEnrollments() {
  const { userProfile } = useAuth();
  const [enrollments, setEnrollments] = useState<EnrollmentWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [editingEnrollment, setEditingEnrollment] = useState<EnrollmentWithDetails | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    loadEnrollments();
  }, []);

  const loadEnrollments = async () => {
    try {
      const { data, error } = await supabase
        .from('enrollments')
        .select(`
          *,
          users (name, email),
          courses (title, price)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEnrollments(data || []);
    } catch (error) {
      console.error('加载报名记录失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditEnrollment = (enrollment: EnrollmentWithDetails) => {
    setEditingEnrollment(enrollment);
    setShowEditModal(true);
  };

  const handleSaveEnrollment = async (updatedData: Partial<Enrollment>) => {
    if (!editingEnrollment) return;

    try {
      const { error } = await supabase
        .from('enrollments')
        .update(updatedData)
        .eq('id', editingEnrollment.id);

      if (error) throw error;

      setShowEditModal(false);
      setEditingEnrollment(null);
      loadEnrollments(); // 重新加载报名列表
    } catch (error) {
      console.error('更新报名记录失败:', error);
      alert('更新报名记录失败');
    }
  };

  const handleDeleteEnrollment = async (enrollmentId: number) => {
    if (!confirm('确定要删除这个报名记录吗？此操作不可撤销。')) return;

    try {
      const { error } = await supabase
        .from('enrollments')
        .delete()
        .eq('id', enrollmentId);

      if (error) throw error;
      loadEnrollments(); // 重新加载报名列表
    } catch (error) {
      console.error('删除报名记录失败:', error);
      alert('删除报名记录失败');
    }
  };

  const filteredEnrollments = enrollments.filter(enrollment => {
    const matchesSearch = 
      enrollment.users?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enrollment.users?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enrollment.courses?.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || enrollment.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
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

  const getStats = () => {
    const total = enrollments.length;
    const active = enrollments.filter(e => e.status === 'active').length;
    const pending = enrollments.filter(e => e.status === 'pending').length;
    const completed = enrollments.filter(e => e.status === 'completed').length;
    const cancelled = enrollments.filter(e => e.status === 'cancelled').length;
    const totalRevenue = enrollments
      .filter(e => e.status === 'active')
      .reduce((sum, e) => sum + (e.courses?.price || 0), 0);

    return { total, active, pending, completed, cancelled, totalRevenue };
  };

  const stats = getStats();

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
                <Link to="/admin" className="text-2xl font-bold text-blue-600">
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
                className="border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 py-4 px-1 text-sm font-medium"
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
                className="border-b-2 border-blue-500 text-blue-600 py-4 px-1 text-sm font-medium"
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
            <h1 className="text-3xl font-bold text-gray-900">报名管理</h1>
            <p className="mt-2 text-gray-600">管理所有课程报名记录</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-gray-500 rounded-md flex items-center justify-center">
                      <span className="text-white text-sm">📊</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">总报名</dt>
                      <dd className="text-lg font-medium text-gray-900">{stats.total}</dd>
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
                      <span className="text-white text-sm">✅</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">进行中</dt>
                      <dd className="text-lg font-medium text-gray-900">{stats.active}</dd>
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
                      <span className="text-white text-sm">⏳</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">待开始</dt>
                      <dd className="text-lg font-medium text-gray-900">{stats.pending}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                      <span className="text-white text-sm">🎓</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">已完成</dt>
                      <dd className="text-lg font-medium text-gray-900">{stats.completed}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-red-500 rounded-md flex items-center justify-center">
                      <span className="text-white text-sm">❌</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">已取消</dt>
                      <dd className="text-lg font-medium text-gray-900">{stats.cancelled}</dd>
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
                      <dt className="text-sm font-medium text-gray-500 truncate">收入</dt>
                      <dd className="text-lg font-medium text-gray-900">¥{stats.totalRevenue.toLocaleString()}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white shadow rounded-lg mb-6">
            <div className="px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    搜索报名
                  </label>
                  <input
                    type="text"
                    placeholder="搜索用户、邮箱或课程..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    报名状态
                  </label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">所有状态</option>
                    <option value="pending">待开始</option>
                    <option value="active">进行中</option>
                    <option value="completed">已完成</option>
                    <option value="cancelled">已取消</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={loadEnrollments}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    刷新列表
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Enrollments Table */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  报名列表 ({filteredEnrollments.length})
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        学员信息
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        课程信息
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        状态
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        报名时间
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredEnrollments.map((enrollment) => (
                      <tr key={enrollment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {enrollment.users?.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {enrollment.users?.email}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {enrollment.courses?.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              ¥{enrollment.courses?.price.toLocaleString()}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(enrollment.status || 'pending')}`}>
                            {getStatusText(enrollment.status || 'pending')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(enrollment.created_at || '').toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditEnrollment(enrollment)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              编辑
                            </button>
                            <button
                              onClick={() => handleDeleteEnrollment(enrollment.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              删除
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredEnrollments.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">没有找到匹配的报名记录</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Edit Enrollment Modal */}
        {showEditModal && editingEnrollment && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">编辑报名记录</h3>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    handleSaveEnrollment({
                      status: formData.get('status') as any
                    });
                  }}
                >
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">学员</label>
                      <input
                        type="text"
                        value={editingEnrollment.users?.name || ''}
                        disabled
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">课程</label>
                      <input
                        type="text"
                        value={editingEnrollment.courses?.title || ''}
                        disabled
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">状态</label>
                      <select
                        name="status"
                        defaultValue={editingEnrollment.status || 'pending'}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="pending">待开始</option>
                        <option value="active">进行中</option>
                        <option value="completed">已完成</option>
                        <option value="cancelled">已取消</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      type="button"
                      onClick={() => setShowEditModal(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                    >
                      取消
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                    >
                      保存
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
} 