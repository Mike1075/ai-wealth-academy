import type { LoaderFunctionArgs, ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { Form, Link, useLoaderData, useActionData, useNavigation } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import { useState } from "react";
import { supabase } from "~/lib/supabase";
import type { Course, UserInsert, EnrollmentInsert } from "~/lib/supabase";
import { 
  createCourseEnrollmentValidator, 
  convertValidationErrorsToActionErrors,
  sanitizeFormData,
  successMessages,
  errorMessages
} from "~/lib/validation";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: data?.course ? `${data.course.title} - 爱学AI创富实训营` : "课程详情" },
    { name: "description", content: data?.course?.description || "查看课程详情并立即报名" },
  ];
};

interface LoaderData {
  course: Course | null;
}

interface ActionErrors {
  name?: string;
  email?: string;
  phone?: string;
  general?: string;
}

interface ActionData {
  errors?: ActionErrors;
  success: boolean;
  message?: string;
}

export async function loader({ params }: LoaderFunctionArgs) {
  const courseId = params.id;
  
  if (!courseId) {
    throw new Response("Course ID is required", { status: 400 });
  }

  try {
    const { data: course, error } = await supabase
      .from('courses')
      .select('*')
      .eq('id', courseId)
      .single();

    if (error || !course) {
      throw new Response("Course not found", { status: 404 });
    }

    return json<LoaderData>({ course });
  } catch (error) {
    console.error('课程加载失败:', error);
    throw new Response("Failed to load course", { status: 500 });
  }
}

export async function action({ request, params }: ActionFunctionArgs) {
  const courseId = params.id;
  
  if (!courseId) {
    return json<ActionData>({ 
      errors: { general: errorMessages.courseNotFound }, 
      success: false 
    });
  }

  try {
    const formData = await request.formData();
    const rawData = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
    };

    // 清理表单数据
    const cleanData = sanitizeFormData(rawData);

    // 表单验证
    const validator = createCourseEnrollmentValidator();
    const validationResult = validator.validate(cleanData);
    
    if (!validationResult.isValid) {
      const errors = convertValidationErrorsToActionErrors(validationResult.errors);
      return json<ActionData>({ errors, success: false });
    }

    const { name, email, phone } = cleanData;

    // 检查用户是否已存在
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    let userId: number;

    if (existingUser) {
      userId = existingUser.id;
      
      // 检查是否已经报名过这个课程
      const { data: existingEnrollment } = await supabase
        .from('enrollments')
        .select('id')
        .eq('user_id', userId)
        .eq('course_id', parseInt(courseId))
        .single();

      if (existingEnrollment) {
        return json<ActionData>({ 
          errors: { general: errorMessages.alreadyEnrolled }, 
          success: false 
        });
      }
    } else {
      // 创建新用户
      const userData: UserInsert = {
        name,
        email,
        phone,
      };

      const { data: newUser, error: userError } = await supabase
        .from('users')
        .insert([userData])
        .select()
        .single();

      if (userError || !newUser) {
        throw userError;
      }

      userId = newUser.id;
    }

    // 创建报名记录
    const enrollmentData: EnrollmentInsert = {
      user_id: userId,
      course_id: parseInt(courseId),
      status: 'pending'
    };

    const { error: enrollmentError } = await supabase
      .from('enrollments')
      .insert([enrollmentData]);

    if (enrollmentError) {
      throw enrollmentError;
    }

    return json<ActionData>({ 
      success: true, 
      message: successMessages.courseEnrolled 
    });

  } catch (error) {
    console.error('报名失败:', error);
    return json<ActionData>({ 
      errors: { general: errorMessages.serverError }, 
      success: false 
    });
  }
}

export default function CourseDetail() {
  const { course } = useLoaderData<LoaderData>();
  const actionData = useActionData<ActionData>();
  const navigation = useNavigation();
  const [showEnrollForm, setShowEnrollForm] = useState(false);
  const isSubmitting = navigation.state === "submitting";

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">课程不存在</h1>
          <Link to="/courses" className="text-blue-600 hover:text-blue-700">
            返回课程列表
          </Link>
        </div>
      </div>
    );
  }

  const getLevelColor = (level: string) => {
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

  return (
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
              <Link to="/courses" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                课程赛道
              </Link>
              <Link to="/pricing" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                投资方案
              </Link>
              <Link to="/login" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                登录
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Success Message */}
      {actionData?.success && (
        <div className="bg-green-50 border border-green-200 p-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <div className="text-green-500 mr-3">✅</div>
              <div>
                <p className="text-green-800 font-semibold">报名成功！</p>
                <p className="text-green-700 text-sm">{actionData.message}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Course Header */}
      <div className="py-12 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <div className="mb-6">
              <Link to="/courses" className="text-blue-100 hover:text-white text-sm">
                ← 返回课程列表
              </Link>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {course.title}
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              {course.description}
            </p>
            <div className="flex items-center justify-center space-x-6">
              <div className="flex items-center">
                <span className="text-3xl font-bold">¥{course.price}</span>
                <span className="text-blue-100 ml-2">早鸟价</span>
              </div>
              <div className="flex items-center">
                <span className="text-lg">{course.duration}</span>
                <span className="text-blue-100 ml-2">高强度孵化</span>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getLevelColor(course.level)}`}>
                {course.level}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Course Details */}
              <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">课程详情</h2>
                
                {/* Course Features */}
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4 mt-1">
                      <span className="text-blue-600 text-sm">🎯</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">学习目标</h3>
                      <p className="text-gray-600">
                        通过2周的高强度孵化，掌握AI工具的实际应用，并完成一个真实可用的项目作品。
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-4 mt-1">
                      <span className="text-green-600 text-sm">💡</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">课程特色</h3>
                      <p className="text-gray-600">
                        PBL项目制学习，王牌导师1对1指导，小班教学，实战项目，拿作品毕业。
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-4 mt-1">
                      <span className="text-purple-600 text-sm">🚀</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">毕业收获</h3>
                      <p className="text-gray-600">
                        一个完整的AI项目作品，AI工具使用经验，创业思维训练，同期学员人脉网络。
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Course Curriculum */}
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">课程大纲</h2>
                
                <div className="space-y-4">
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h3 className="font-semibold text-gray-900">第1周：基础搭建</h3>
                    <p className="text-gray-600 text-sm mt-1">
                      AI工具认知、项目立项、技术选型、基础功能开发
                    </p>
                  </div>
                  
                  <div className="border-l-4 border-green-500 pl-4">
                    <h3 className="font-semibold text-gray-900">第2周：项目完善</h3>
                    <p className="text-gray-600 text-sm mt-1">
                      功能优化、用户测试、项目打磨、作品展示
                    </p>
                  </div>
                  
                  <div className="border-l-4 border-purple-500 pl-4">
                    <h3 className="font-semibold text-gray-900">毕业典礼</h3>
                    <p className="text-gray-600 text-sm mt-1">
                      项目展示、同期交流、证书颁发、后续指导
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Enrollment Card */}
              <div className="bg-white rounded-2xl p-8 shadow-lg sticky top-24">
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    ¥{course.price}
                  </div>
                  <p className="text-gray-600">早鸟创始人席位</p>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">课程时长</span>
                    <span className="font-semibold">{course.duration}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">难度级别</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getLevelColor(course.level)}`}>
                      {course.level}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">学习模式</span>
                    <span className="font-semibold">在线+实战</span>
                  </div>
                </div>

                {!showEnrollForm ? (
                  <button
                    onClick={() => setShowEnrollForm(true)}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    🚀 立即报名
                  </button>
                ) : (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">快速报名</h3>
                    
                    {actionData?.errors?.general && (
                      <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-600 text-sm">{actionData.errors.general}</p>
                      </div>
                    )}

                    <Form method="post" className="space-y-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                          姓名 *
                        </label>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="请输入您的姓名"
                        />
                        {actionData?.errors?.name && (
                          <p className="mt-1 text-sm text-red-600">{actionData.errors.name}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          邮箱 *
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="请输入您的邮箱"
                        />
                        {actionData?.errors?.email && (
                          <p className="mt-1 text-sm text-red-600">{actionData.errors.email}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                          手机 *
                        </label>
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="请输入您的手机号"
                        />
                        {actionData?.errors?.phone && (
                          <p className="mt-1 text-sm text-red-600">{actionData.errors.phone}</p>
                        )}
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                      >
                        {isSubmitting ? "提交中..." : "提交报名"}
                      </button>
                    </Form>

                    <button
                      onClick={() => setShowEnrollForm(false)}
                      className="w-full mt-2 text-gray-600 hover:text-gray-700 text-sm"
                    >
                      取消
                    </button>
                  </div>
                )}

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="text-center text-sm text-gray-600">
                    <p>💡 报名后24小时内联系</p>
                    <p>🔒 信息安全保护</p>
                    <p>💰 完成学习100%返还</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
  );
} 