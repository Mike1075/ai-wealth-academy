import { useState, useEffect } from "react";
import { Link } from "@remix-run/react";
import { useAuth, ProtectedRoute } from "~/lib/auth-context";
import { supabase } from "~/lib/supabase";
import type { User } from "~/lib/supabase";

interface UserWithEnrollments extends User {
  enrollments: { count: number }[];
  admins?: { permissions: string[] }[];
}

export default function AdminUsers() {
  const { userProfile } = useAuth();
  const [users, setUsers] = useState<UserWithEnrollments[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [editingUser, setEditingUser] = useState<UserWithEnrollments | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select(`
          *,
          enrollments (count),
          admins (permissions)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('加载用户失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (user: UserWithEnrollments) => {
    setEditingUser(user);
    setShowEditModal(true);
  };

  const handleSaveUser = async (updatedUser: Partial<User>) => {
    if (!editingUser) return;

    try {
      const { error } = await supabase
        .from('users')
        .update(updatedUser)
        .eq('id', editingUser.id);

      if (error) throw error;

      // 如果角色改变为admin，需要处理admins表
      if (updatedUser.role === 'admin' && editingUser.role !== 'admin') {
        await supabase
          .from('admins')
          .insert({
            user_id: editingUser.id,
            permissions: ['user_management', 'course_management', 'enrollment_management']
          });
      } else if (updatedUser.role !== 'admin' && editingUser.role === 'admin') {
        await supabase
          .from('admins')
          .delete()
          .eq('user_id', editingUser.id);
      }

      setShowEditModal(false);
      setEditingUser(null);
      loadUsers(); // 重新加载用户列表
    } catch (error) {
      console.error('更新用户失败:', error);
      alert('更新用户失败');
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!confirm('确定要删除这个用户吗？此操作不可撤销。')) return;

    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

      if (error) throw error;
      loadUsers(); // 重新加载用户列表
    } catch (error) {
      console.error('删除用户失败:', error);
      alert('删除用户失败');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'instructor':
        return 'bg-blue-100 text-blue-800';
      case 'student':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case 'admin':
        return '管理员';
      case 'instructor':
        return '导师';
      case 'student':
        return '学员';
      default:
        return '未知';
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
                className="border-b-2 border-blue-500 text-blue-600 py-4 px-1 text-sm font-medium"
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
            <h1 className="text-3xl font-bold text-gray-900">用户管理</h1>
            <p className="mt-2 text-gray-600">管理系统中的所有用户</p>
          </div>

          {/* Filters */}
          <div className="bg-white shadow rounded-lg mb-6">
            <div className="px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    搜索用户
                  </label>
                  <input
                    type="text"
                    placeholder="搜索姓名或邮箱..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    用户角色
                  </label>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">所有角色</option>
                    <option value="student">学员</option>
                    <option value="instructor">导师</option>
                    <option value="admin">管理员</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={loadUsers}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    刷新列表
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  用户列表 ({filteredUsers.length})
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        用户信息
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        角色
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        报名课程
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        注册时间
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                            {user.phone && (
                              <div className="text-sm text-gray-500">{user.phone}</div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleBadge(user.role || 'student')}`}>
                            {getRoleText(user.role || 'student')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.enrollments?.[0]?.count || 0} 门课程
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(user.created_at || '').toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditUser(user)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              编辑
                            </button>
                            {user.id !== userProfile?.id && (
                              <button
                                onClick={() => handleDeleteUser(user.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                删除
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredUsers.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">没有找到匹配的用户</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Edit User Modal */}
        {showEditModal && editingUser && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">编辑用户</h3>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    handleSaveUser({
                      name: formData.get('name') as string,
                      email: formData.get('email') as string,
                      phone: formData.get('phone') as string,
                      role: formData.get('role') as any
                    });
                  }}
                >
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">姓名</label>
                      <input
                        type="text"
                        name="name"
                        defaultValue={editingUser.name}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">邮箱</label>
                      <input
                        type="email"
                        name="email"
                        defaultValue={editingUser.email}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">手机</label>
                      <input
                        type="tel"
                        name="phone"
                        defaultValue={editingUser.phone || ''}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">角色</label>
                      <select
                        name="role"
                        defaultValue={editingUser.role || 'student'}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="student">学员</option>
                        <option value="instructor">导师</option>
                        <option value="admin">管理员</option>
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