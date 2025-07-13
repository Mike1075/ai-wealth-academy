import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";

export async function loader({ request }: LoaderFunctionArgs) {
  const apiDocumentation = {
    title: "AI创富实训营 API 文档",
    version: "1.0.0",
    description: "RESTful API for AI Wealth Academy platform",
    baseUrl: new URL(request.url).origin,
    authentication: {
      type: "API Key",
      header: "x-api-key",
      description: "请在请求头中包含 x-api-key"
    },
    endpoints: {
      users: {
        description: "用户管理API",
        endpoints: [
          {
            method: "GET",
            path: "/api/users",
            description: "获取用户列表",
            parameters: [
              { name: "page", type: "integer", description: "页码，默认1" },
              { name: "limit", type: "integer", description: "每页数量，默认10" },
              { name: "search", type: "string", description: "搜索姓名或邮箱" },
              { name: "role", type: "string", description: "用户角色过滤" }
            ],
            response: {
              data: "User[]",
              pagination: {
                page: "number",
                limit: "number", 
                total: "number",
                totalPages: "number"
              }
            }
          },
          {
            method: "POST",
            path: "/api/users",
            description: "创建新用户",
            body: {
              name: "string (required)",
              email: "string (required)",
              phone: "string (optional)",
              role: "string (optional, default: student)"
            },
            response: {
              data: "User"
            }
          },
          {
            method: "PUT", 
            path: "/api/users/:id",
            description: "更新用户信息",
            body: {
              name: "string",
              email: "string",
              phone: "string",
              role: "string"
            },
            response: {
              data: "User"
            }
          },
          {
            method: "DELETE",
            path: "/api/users/:id", 
            description: "删除用户",
            response: {
              message: "string"
            }
          }
        ]
      },
      courses: {
        description: "课程管理API",
        endpoints: [
          {
            method: "GET",
            path: "/api/courses",
            description: "获取课程列表",
            parameters: [
              { name: "page", type: "integer", description: "页码，默认1" },
              { name: "limit", type: "integer", description: "每页数量，默认10" },
              { name: "search", type: "string", description: "搜索课程标题或描述" },
              { name: "level", type: "string", description: "课程难度过滤" },
              { name: "include_enrollments", type: "boolean", description: "是否包含报名信息" }
            ],
            response: {
              data: "Course[]",
              pagination: "Pagination"
            }
          },
          {
            method: "POST",
            path: "/api/courses",
            description: "创建新课程",
            body: {
              title: "string (required)",
              description: "string (required)",
              level: "string (required, 初级|中级|高级)",
              duration: "string (required)",
              price: "number (required)",
              image_url: "string (optional)"
            },
            response: {
              data: "Course"
            }
          },
          {
            method: "PUT",
            path: "/api/courses/:id",
            description: "更新课程信息",
            body: {
              title: "string",
              description: "string", 
              level: "string",
              duration: "string",
              price: "number",
              image_url: "string"
            },
            response: {
              data: "Course"
            }
          },
          {
            method: "DELETE",
            path: "/api/courses/:id",
            description: "删除课程",
            response: {
              message: "string"
            }
          }
        ]
      },
      enrollments: {
        description: "报名管理API",
        endpoints: [
          {
            method: "GET",
            path: "/api/enrollments",
            description: "获取报名列表",
            parameters: [
              { name: "page", type: "integer", description: "页码，默认1" },
              { name: "limit", type: "integer", description: "每页数量，默认10" },
              { name: "search", type: "string", description: "搜索用户或课程" },
              { name: "status", type: "string", description: "报名状态过滤" },
              { name: "user_id", type: "integer", description: "用户ID过滤" },
              { name: "course_id", type: "integer", description: "课程ID过滤" }
            ],
            response: {
              data: "Enrollment[]",
              pagination: "Pagination"
            }
          },
          {
            method: "POST",
            path: "/api/enrollments",
            description: "创建新报名",
            body: {
              user_id: "integer (required)",
              course_id: "integer (required)",
              status: "string (optional, default: pending)"
            },
            response: {
              data: "Enrollment"
            }
          },
          {
            method: "PUT",
            path: "/api/enrollments/:id",
            description: "更新报名状态",
            body: {
              status: "string (pending|active|completed|cancelled)"
            },
            response: {
              data: "Enrollment"
            }
          },
          {
            method: "DELETE",
            path: "/api/enrollments/:id",
            description: "删除报名",
            response: {
              message: "string"
            }
          }
        ]
      },
      analytics: {
        description: "数据分析API",
        endpoints: [
          {
            method: "GET",
            path: "/api/analytics?type=overview",
            description: "获取总体统计数据",
            response: {
              overview: {
                totalUsers: "number",
                totalCourses: "number", 
                totalEnrollments: "number",
                totalRevenue: "number"
              },
              enrollmentsByStatus: "object",
              usersByRole: "object"
            }
          },
          {
            method: "GET",
            path: "/api/analytics?type=revenue",
            description: "获取收入分析",
            parameters: [
              { name: "start_date", type: "string", description: "开始日期 (YYYY-MM-DD)" },
              { name: "end_date", type: "string", description: "结束日期 (YYYY-MM-DD)" }
            ],
            response: {
              monthlyRevenue: "object",
              courseRevenue: "object[]"
            }
          },
          {
            method: "GET",
            path: "/api/analytics?type=enrollments",
            description: "获取报名趋势分析",
            parameters: [
              { name: "start_date", type: "string", description: "开始日期 (YYYY-MM-DD)" },
              { name: "end_date", type: "string", description: "结束日期 (YYYY-MM-DD)" }
            ],
            response: {
              dailyEnrollments: "object",
              levelDistribution: "object"
            }
          },
          {
            method: "GET",
            path: "/api/analytics?type=users",
            description: "获取用户增长分析",
            parameters: [
              { name: "start_date", type: "string", description: "开始日期 (YYYY-MM-DD)" },
              { name: "end_date", type: "string", description: "结束日期 (YYYY-MM-DD)" }
            ],
            response: {
              dailyNewUsers: "object",
              cumulativeUsers: "object"
            }
          },
          {
            method: "GET",
            path: "/api/analytics?type=popular_courses",
            description: "获取热门课程分析",
            response: {
              popularCourses: "Course[]"
            }
          }
        ]
      }
    },
    examples: {
      curl: {
        getUsers: `curl -X GET "${new URL(request.url).origin}/api/users?page=1&limit=10" \\
  -H "x-api-key: YOUR_API_KEY"`,
        createUser: `curl -X POST "${new URL(request.url).origin}/api/users" \\
  -H "x-api-key: YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "张三",
    "email": "zhangsan@example.com",
    "phone": "13800138000",
    "role": "student"
  }'`,
        createEnrollment: `curl -X POST "${new URL(request.url).origin}/api/enrollments" \\
  -H "x-api-key: YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "user_id": 1,
    "course_id": 2,
    "status": "active"
  }'`,
        getAnalytics: `curl -X GET "${new URL(request.url).origin}/api/analytics?type=overview" \\
  -H "x-api-key: YOUR_API_KEY"`
      }
    },
    errorCodes: {
      400: "Bad Request - 请求参数错误",
      401: "Unauthorized - API密钥无效或缺失",
      404: "Not Found - 资源不存在",
      409: "Conflict - 资源冲突（如邮箱已存在）",
      500: "Internal Server Error - 服务器内部错误"
    }
  };

  return json(apiDocumentation, {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, x-api-key"
    }
  });
} 