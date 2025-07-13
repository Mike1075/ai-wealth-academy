import type { MetaFunction, LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { supabase } from "~/lib/supabase";
import type { Course } from "~/lib/supabase";

export const meta: MetaFunction = () => {
  return [
    { title: "课程赛道 - 爱学AI创富实训营" },
    { name: "description", content: "5大创富赛道任你选择：游戏开发者、全球化创业者、新消费产品经理、独立APP开发者、自动化一人公司。你的兴趣，就是你的下一个生意！" },
  ];
};

interface LoaderData {
  courses: Course[];
}

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const { data: courses, error } = await supabase
      .from('courses')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('获取课程失败:', error);
      return json<LoaderData>({ courses: [] });
    }

    return json<LoaderData>({ courses: courses || [] });
  } catch (error) {
    console.error('课程数据加载失败:', error);
    return json<LoaderData>({ courses: [] });
  }
}

export default function Courses() {
  const { courses } = useLoaderData<LoaderData>();
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
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link to="/courses" className="text-blue-600 px-3 py-2 rounded-md text-sm font-medium border-b-2 border-blue-600">
                  课程赛道
                </Link>
                <Link to="/instructors" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  王牌导师
                </Link>
                <Link to="/about" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  三级火箭
                </Link>
                <Link to="/pricing" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  投资方案
                </Link>
                <Link to="/register" className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-purple-700 hover:to-blue-700 transition-colors">
                  锁定席位
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-6">
            <span className="inline-block bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm font-semibold">
              🛒 AI创富项目超市
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            选择你的<span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">创富赛道</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            忘了那些枯燥的课程列表吧！这里的每一条赛道，都像一件你梦寐以求的限定装备，
            不仅酷，还能给你加上「财富自由」的超强Buff
          </p>
          <p className="text-lg text-gray-500">
            <strong>你的兴趣，就是你的下一个生意</strong>
          </p>
        </div>
      </section>

      {/* 5大赛道详情 */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            
            {/* 游戏开发者 */}
            <div className="flex flex-col lg:flex-row gap-12 items-center">
              <div className="flex-1 lg:max-w-2xl">
                <div className="mb-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-2xl">
                      🎮
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900">游戏开发者</h2>
                      <p className="text-lg text-gray-600">不止是玩家，更是元宇宙的造物主</p>
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">💡 你将做出什么</h3>
                  <p className="text-gray-700 leading-relaxed">
                    一款结合AIGC技术的沉浸式元宇宙游戏DEMO。游戏里的NPC不再是只会重复台词的笨蛋，
                    而是拥有独立思考和记忆的AI灵魂；世界的地图和任务由AI动态生成，每一次冒险都是绝版体验；
                    你甚至可以用一句话，为自己创造独一无二的武器和技能。
                  </p>
                </div>

                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">🎯 这适合什么样的你</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <span className="text-blue-500 text-lg">•</span>
                      <span className="text-gray-700">脑子里全是骚操作，觉得现在的游戏策划配不上你的创意</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-blue-500 text-lg">•</span>
                      <span className="text-gray-700">玩过无数游戏，心里总有个声音在说：要我做，肯定比他牛逼</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-blue-500 text-lg">•</span>
                      <span className="text-gray-700">对元宇宙、AIGC、虚拟世界这些词汇，心跳会不自觉加速</span>
                    </li>
                  </ul>
                </div>

                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-2 rounded-full">
                    <span className="text-sm font-medium text-gray-700">毕业作品：沉浸式元宇宙游戏DEMO</span>
                  </div>
                  <div className="bg-gray-100 px-4 py-2 rounded-full">
                    <span className="text-sm font-medium text-gray-700">2周孵化</span>
                  </div>
                </div>
              </div>

              <div className="flex-1 lg:max-w-lg">
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8 h-80 flex items-center justify-center relative overflow-hidden">
                  <div className="text-8xl opacity-20 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    🎮
                  </div>
                  <div className="text-center z-10">
                    <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-4xl text-white">
                      🎮
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">游戏开发者</h4>
                    <p className="text-gray-600">沉浸式元宇宙游戏DEMO</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 全球化创业者 */}
            <div className="flex flex-col lg:flex-row-reverse gap-12 items-center">
              <div className="flex-1 lg:max-w-2xl">
                <div className="mb-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center text-2xl">
                      🌏
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900">全球化创业者</h2>
                      <p className="text-lg text-gray-600">让世界，读懂你的野心</p>
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">💡 你将做出什么</h3>
                  <p className="text-gray-700 leading-relaxed">
                    一个全天候AI出海营销Bot。它能帮你洞察海外市场的最新爆款，用最地道的俚语自动生成TikTok、
                    Instagram的病毒式文案，还能模拟不同文化背景的用户和你产品互动。你的小生意，从此有了走向世界的底气。
                  </p>
                </div>

                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">🎯 这适合什么样的你</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <span className="text-green-500 text-lg">•</span>
                      <span className="text-gray-700">做着Tiktok/跨境电商/内容出海，却被文化差异和语言搞得头大</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-green-500 text-lg">•</span>
                      <span className="text-gray-700">坚信自己的产品或创意很牛，只缺一个撬动全球市场的支点</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-green-500 text-lg">•</span>
                      <span className="text-gray-700">格局打开，不想只赚一个区的钱</span>
                    </li>
                  </ul>
                </div>

                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 px-4 py-2 rounded-full">
                    <span className="text-sm font-medium text-gray-700">毕业作品：AI出海营销Bot</span>
                  </div>
                  <div className="bg-gray-100 px-4 py-2 rounded-full">
                    <span className="text-sm font-medium text-gray-700">2周孵化</span>
                  </div>
                </div>
              </div>

              <div className="flex-1 lg:max-w-lg">
                <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-3xl p-8 h-80 flex items-center justify-center relative overflow-hidden">
                  <div className="text-8xl opacity-20 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    🌏
                  </div>
                  <div className="text-center z-10">
                    <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-green-500 to-blue-500 rounded-2xl flex items-center justify-center text-4xl text-white">
                      🌏
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">全球化创业者</h4>
                    <p className="text-gray-600">AI出海营销Bot</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 所有课程展示 */}
            <div className="mt-16">
              {courses.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {courses.map((course) => (
                    <div key={course.id} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                      <div className="text-3xl mb-4">
                        {course.title.includes('游戏') ? '🎮' : 
                         course.title.includes('全球化') ? '🌏' : 
                         course.title.includes('新消费') ? '🧘' : 
                         course.title.includes('APP') ? '📱' : 
                         course.title.includes('自动化') ? '🤖' : '💡'}
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">{course.title}</h3>
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {course.description}
                      </p>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-2xl font-bold text-blue-600">¥{course.price}</span>
                        <span className="text-sm text-gray-500">{course.duration}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          course.level === '初级' ? 'bg-green-100 text-green-800' :
                          course.level === '中级' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {course.level}
                        </span>
                        <Link 
                          to={`/course/${course.id}`}
                          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                        >
                          立即报名
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">📚</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">暂无课程</h3>
                  <p className="text-gray-600">课程正在火热筹备中，敬请期待！</p>
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* PBL 教学法介绍 */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              🎓 PBL项目制学习法
            </h2>
            <p className="text-xl text-gray-600">
              彻底摒弃"老师讲，学生听"的过时模式
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100">
              <div className="text-4xl mb-4">🏗️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">在做中学</h3>
              <p className="text-gray-600">
                不是理论课程，而是真实项目实战。从第一天开始就在构建你的作品
              </p>
            </div>
            
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">导师制指导</h3>
              <p className="text-gray-600">
                导师不是老师，而是像最挑剔的投资人一样，倒逼你成长的"项目顾问"
              </p>
            </div>
            
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-pink-50 to-pink-100">
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">拿作品毕业</h3>
              <p className="text-gray-600">
                两周后，你展示的不是证书，而是能为你创造价值的第一个AI商业项目
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            选定了你的赛道？
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            立即锁定席位，开启你的AI创富之旅
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/register" 
              className="bg-white text-purple-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              🚀 锁定早鸟席位 ¥2999
            </Link>
            <Link 
              to="/pricing" 
              className="border-2 border-white text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white hover:text-purple-600 transition-all duration-200"
            >
              💰 查看投资方案
            </Link>
          </div>
          <div className="mt-6 text-sm text-blue-100">
            ⏰ 限额100席 · 完成打卡100%返还 · 3人团队立减¥1000
          </div>
        </div>
      </section>
    </div>
  );
} 