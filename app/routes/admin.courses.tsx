import { useState, useEffect } from "react";
import { Link } from "@remix-run/react";
import { useAuth, ProtectedRoute } from "~/lib/auth-context";
import { supabase } from "~/lib/supabase";
import type { Course } from "~/lib/supabase";

interface CourseWithEnrollments extends Course {
  enrollments: { count: number }[];
}

export default function AdminCourses() {
  const { userProfile } = useAuth();
  const [courses, setCourses] = useState<CourseWithEnrollments[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [editingCourse, setEditingCourse] = useState<CourseWithEnrollments | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          enrollments (count)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCourses(data || []);
    } catch (error) {
      console.error('加载课程失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditCourse = (course: CourseWithEnrollments) => {
    setEditingCourse(course);
    setShowEditModal(true);
  };

  const handleSaveCourse = async (courseData: Partial<Course>) => {
    try {
      if (editingCourse) {
        // 更新课程
        const { error } = await supabase
          .from('courses')
          .update(courseData)
          .eq('id', editingCourse.id);

        if (error) throw error;
        setShowEditModal(false);
        setEditingCourse(null);
      } else {
        // 添加新课程
        const { error } = await supabase
          .from('courses')
          .insert([courseData]);

        if (error) throw error;
        setShowAddModal(false);
      }

      loadCourses(); // 重新加载课程列表
    } catch (error) {
      console.error('保存课程失败:', error);
      alert('保存课程失败');
    }
  };

  const handleDeleteCourse = async (courseId: number) => {
    if (!confirm('确定要删除这个课程吗？此操作不可撤销。')) return;

    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', courseId);

      if (error) throw error;
      loadCourses(); // 重新加载课程列表
    } catch (error) {
      console.error('删除课程失败:', error);
      alert('删除课程失败');
    }
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel;
    return matchesSearch && matchesLevel;
  });

  const getLevelBadge = (level: string) => {
    switch (level) {
      case '初级':
        return 'bg-green-100 text-green-800';
      case '中级':
        return 'bg-yellow-100 text-yellow-800';
      case '高级':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
                className="border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 py-4 px-1 text-sm font-medium"
              >
                用户管理
              </Link>
              <Link
                to="/admin/courses"
                className="border-b-2 border-blue-500 text-blue-600 py-4 px-1 text-sm font-medium"
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
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">课程管理</h1>
                <p className="mt-2 text-gray-600">管理系统中的所有课程</p>
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <span className="mr-2">➕</span>
                添加新课程
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white shadow rounded-lg mb-6">
            <div className="px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    搜索课程
                  </label>
                  <input
                    type="text"
                    placeholder="搜索课程标题或描述..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    课程难度
                  </label>
                  <select
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">所有难度</option>
                    <option value="初级">初级</option>
                    <option value="中级">中级</option>
                    <option value="高级">高级</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={loadCourses}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    刷新列表
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Courses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <div key={course.id} className="bg-white shadow rounded-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                      {course.title}
                    </h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getLevelBadge(course.level)}`}>
                      {course.level}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {course.description}
                  </p>
                  
                  <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                    <span>时长: {course.duration}</span>
                    <span>报名: {course.enrollments?.[0]?.count || 0}人</span>
                  </div>
                  
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-bold text-blue-600">
                      ¥{course.price.toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(course.created_at || '').toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditCourse(course)}
                      className="flex-1 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100"
                    >
                      编辑
                    </button>
                    <button
                      onClick={() => handleDeleteCourse(course.id)}
                      className="flex-1 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100"
                    >
                      删除
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredCourses.length === 0 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center text-3xl text-gray-400">
                📚
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">没有找到课程</h3>
              <p className="text-gray-600 mb-6">尝试调整搜索条件或添加新课程</p>
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700"
              >
                添加新课程
              </button>
            </div>
          )}
        </div>

        {/* Course Form Modal (Add/Edit) */}
        {(showEditModal || showAddModal) && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {editingCourse ? '编辑课程' : '添加新课程'}
                </h3>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    handleSaveCourse({
                      title: formData.get('title') as string,
                      description: formData.get('description') as string,
                      level: formData.get('level') as string,
                      duration: formData.get('duration') as string,
                      price: parseInt(formData.get('price') as string),
                      image_url: formData.get('image_url') as string || null
                    });
                  }}
                >
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">课程标题</label>
                      <input
                        type="text"
                        name="title"
                        defaultValue={editingCourse?.title || ''}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">课程描述</label>
                      <textarea
                        name="description"
                        rows={3}
                        defaultValue={editingCourse?.description || ''}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">难度等级</label>
                      <select
                        name="level"
                        defaultValue={editingCourse?.level || '初级'}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="初级">初级</option>
                        <option value="中级">中级</option>
                        <option value="高级">高级</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">课程时长</label>
                      <input
                        type="text"
                        name="duration"
                        placeholder="例如：4周、8小时"
                        defaultValue={editingCourse?.duration || ''}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">课程价格（元）</label>
                      <input
                        type="number"
                        name="price"
                        min="0"
                        defaultValue={editingCourse?.price || ''}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">课程图片URL（可选）</label>
                      <input
                        type="url"
                        name="image_url"
                        defaultValue={editingCourse?.image_url || ''}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      type="button"
                      onClick={() => {
                        setShowEditModal(false);
                        setShowAddModal(false);
                        setEditingCourse(null);
                      }}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                    >
                      取消
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                    >
                      {editingCourse ? '更新' : '添加'}
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