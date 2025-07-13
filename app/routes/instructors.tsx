import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "王牌导师 - 爱学AI创富实训营" },
    { name: "description", content: "认识我们的王牌导师团队，他们是AI创富领域的实战专家和成功创业者" },
  ];
};

export default function Instructors() {
  const instructors = [
    {
      id: 1,
      name: "张教授",
      title: "AI创富实训营创始人",
      expertise: "AI产品化、技术创业",
      experience: "10年AI领域研发经验，成功孵化3家AI独角兽企业",
      achievements: [
        "前谷歌AI实验室首席科学家",
        "《AI创富密码》作者",
        "已指导300+学员实现AI创富梦想"
      ],
      avatar: "👨‍🏫"
    },
    {
      id: 2,
      name: "李总监",
      title: "全球化营销专家",
      expertise: "海外市场开拓、品牌营销",
      experience: "15年全球化营销经验，服务过50+知名品牌",
      achievements: [
        "前字节跳动海外营销总监",
        "TikTok全球增长操盘手",
        "帮助100+企业实现海外突破"
      ],
      avatar: "👩‍💼"
    },
    {
      id: 3,
      name: "王技术",
      title: "全栈开发大师",
      expertise: "快速开发、技术架构",
      experience: "12年全栈开发经验，擅长快速MVP构建",
      achievements: [
        "前阿里巴巴技术专家",
        "开源项目贡献者",
        "月薪6位数自由职业者"
      ],
      avatar: "👨‍💻"
    },
    {
      id: 4,
      name: "赵设计",
      title: "用户体验设计师",
      expertise: "产品设计、用户体验",
      experience: "8年UX设计经验，设计过亿级用户产品",
      achievements: [
        "前腾讯设计总监",
        "苹果设计奖获得者",
        "设计作品用户超1亿"
      ],
      avatar: "👩‍🎨"
    },
    {
      id: 5,
      name: "刘创业",
      title: "连续创业者",
      expertise: "商业模式、融资策略",
      experience: "连续创业10年，成功退出2家公司",
      achievements: [
        "获得3轮融资共1亿元",
        "创建2家独角兽企业",
        "投资孵化20+创业项目"
      ],
      avatar: "👨‍🚀"
    },
    {
      id: 6,
      name: "陈运营",
      title: "增长黑客专家",
      expertise: "用户增长、运营策略",
      experience: "8年增长运营经验，操盘过多个千万级项目",
      achievements: [
        "前滴滴增长团队负责人",
        "0-1操盘用户增长1000万",
        "增长黑客实战专家"
      ],
      avatar: "👩‍🔬"
    }
  ];

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
                <Link to="/courses" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  课程赛道
                </Link>
                <Link to="/instructors" className="text-blue-600 px-3 py-2 rounded-md text-sm font-medium border-b-2 border-blue-600">
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
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-white">
            <div className="mb-6">
              <span className="inline-block bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                ⭐ 全明星导师阵容
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              王牌导师团队
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              他们不是普通的老师，而是AI创富领域的实战专家和成功创业者。
              从技术到商业，从产品到营销，每一个环节都有顶尖高手为你护航。
            </p>
            <div className="flex items-center justify-center space-x-8 text-blue-100">
              <div className="text-center">
                <div className="text-3xl font-bold">6位</div>
                <div className="text-sm">王牌导师</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">100+</div>
                <div className="text-sm">成功案例</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">1对1</div>
                <div className="text-sm">专属指导</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Instructors Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              认识你的导师团队
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              每位导师都有10年以上实战经验，不仅是技术专家，更是成功的创业者。
              他们将用最实用的方法，帮你避开创业路上的坑。
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {instructors.map((instructor) => (
              <div key={instructor.id} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-3xl text-white">
                    {instructor.avatar}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{instructor.name}</h3>
                  <p className="text-blue-600 font-semibold">{instructor.title}</p>
                </div>

                <div className="mb-6">
                  <div className="flex items-center mb-2">
                    <span className="text-sm text-gray-500 font-medium">专业领域：</span>
                  </div>
                  <p className="text-gray-700">{instructor.expertise}</p>
                </div>

                <div className="mb-6">
                  <div className="flex items-center mb-2">
                    <span className="text-sm text-gray-500 font-medium">经验背景：</span>
                  </div>
                  <p className="text-gray-700 text-sm">{instructor.experience}</p>
                </div>

                <div>
                  <div className="flex items-center mb-3">
                    <span className="text-sm text-gray-500 font-medium">核心成就：</span>
                  </div>
                  <ul className="space-y-2">
                    {instructor.achievements.map((achievement, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-blue-500 mr-2 text-sm">✓</span>
                        <span className="text-gray-700 text-sm">{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Teaching Philosophy */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              导师指导理念
            </h2>
            <p className="text-xl text-gray-600">
              我们的导师不是传统意义上的"老师"，而是你的创业伙伴
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-2xl text-white">
                🎯
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">实战导向</h3>
              <p className="text-gray-600 text-sm">
                不讲理论，只谈实战。所有指导都围绕你的项目展开。
              </p>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-2xl text-white">
                💡
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">启发式教学</h3>
              <p className="text-gray-600 text-sm">
                不直接给答案，而是启发你思考，培养创业思维。
              </p>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-2xl text-white">
                🤝
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">1对1指导</h3>
              <p className="text-gray-600 text-sm">
                针对你的项目特点，提供个性化的指导方案。
              </p>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center text-2xl text-white">
                🚀
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">全程陪伴</h3>
              <p className="text-gray-600 text-sm">
                从立项到上线，全程跟进，确保项目成功落地。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20 bg-gradient-to-r from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              学员成功故事
            </h2>
            <p className="text-xl text-gray-600">
              听听那些在导师指导下成功创富的学员们怎么说
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-2xl">👨‍💼</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">小李</h4>
                  <p className="text-sm text-gray-600">游戏开发营学员</p>
                </div>
              </div>
              <blockquote className="text-gray-700 italic mb-4">
                "张教授的指导让我在2周内做出了人生第一个AI游戏。现在月收入已经超过了我的工资！"
              </blockquote>
              <div className="text-sm text-green-600 font-semibold">
                📈 月收入增长300%
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-2xl">👩‍🚀</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">小张</h4>
                  <p className="text-sm text-gray-600">全球化创业营学员</p>
                </div>
              </div>
              <blockquote className="text-gray-700 italic mb-4">
                "李总监帮我打通了海外市场，产品在欧美市场大受欢迎，第一个月就回本了！"
              </blockquote>
              <div className="text-sm text-green-600 font-semibold">
                🌍 海外市场成功打开
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-2xl">👨‍💻</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">小王</h4>
                  <p className="text-sm text-gray-600">APP开发营学员</p>
                </div>
              </div>
              <blockquote className="text-gray-700 italic mb-4">
                "王技术的高效开发方法让我用最短时间做出了最有价值的产品。现在已经拿到天使轮融资！"
              </blockquote>
              <div className="text-sm text-green-600 font-semibold">
                💰 获得天使轮融资
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            准备好接受王牌导师的指导了吗？
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            这些导师的时间非常宝贵，席位有限，先到先得
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/register" 
              className="bg-white text-purple-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              🚀 立即报名获得导师指导
            </Link>
            <Link 
              to="/courses" 
              className="border-2 border-white text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white hover:text-purple-600 transition-all duration-200"
            >
              📚 查看课程赛道
            </Link>
          </div>
          <div className="mt-6 text-sm text-blue-100">
            💡 每位导师限带20名学员 · 1对1深度指导 · 全程跟踪辅导
          </div>
        </div>
      </section>

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