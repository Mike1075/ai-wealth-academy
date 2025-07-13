import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "投资方案 - 爱学AI创富实训营" },
    { name: "description", content: "早鸟创始人席位¥2999，3人团队立减¥1000，完成打卡100%返还。一份稳赚不赔的未来投资！" },
  ];
};

export default function Pricing() {
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
                <Link to="/instructors" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  王牌导师
                </Link>
                <Link to="/about" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  三级火箭
                </Link>
                <Link to="/pricing" className="text-blue-600 px-3 py-2 rounded-md text-sm font-medium border-b-2 border-blue-600">
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
            <span className="inline-block bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold">
              💰 一份稳赚不赔的未来投资
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            投资你的<span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">未来</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            我们提供的不是一门课程，而是一次<strong>共同投资</strong>。
            你投资你的时间与承诺，我们投资顶级的资源与方法论，共同孵化你的未来。
          </p>
          <p className="text-lg text-gray-500">
            因此，我们设计了一套独特的"对赌式"投资方案
          </p>
        </div>
      </section>

      {/* 投资方案 */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* 标准投资额 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-200 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gray-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                  标准价格
                </span>
              </div>
              <div className="text-center pt-4">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">标准投资额</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-400 line-through">¥3,333</span>
                  <p className="text-gray-500 mt-2">原价</p>
                </div>
                <ul className="text-left space-y-3 mb-8">
                  <li className="flex items-center gap-3">
                    <span className="text-green-500">✓</span>
                    <span className="text-gray-700">两周高强度孵化</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-green-500">✓</span>
                    <span className="text-gray-700">5大赛道任选</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-green-500">✓</span>
                    <span className="text-gray-700">王牌导师指导</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-green-500">✓</span>
                    <span className="text-gray-700">PBL项目制学习</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-green-500">✓</span>
                    <span className="text-gray-700">拿作品毕业</span>
                  </li>
                </ul>
                <button className="w-full bg-gray-400 text-white px-6 py-3 rounded-xl text-lg font-semibold cursor-not-allowed">
                  下期恢复原价
                </button>
              </div>
            </div>

            {/* 早鸟创始人席位 */}
            <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-blue-500 relative transform scale-105">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                  🔥 最受欢迎
                </span>
              </div>
              <div className="text-center pt-4">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">早鸟创始人席位</h3>
                <div className="mb-6">
                  <span className="text-5xl font-bold text-blue-600">¥2,999</span>
                  <p className="text-blue-600 mt-2 font-semibold">九折优惠</p>
                  <p className="text-sm text-gray-500">前100名专享</p>
                </div>
                <ul className="text-left space-y-3 mb-8">
                  <li className="flex items-center gap-3">
                    <span className="text-blue-500">✓</span>
                    <span className="text-gray-700">所有标准功能</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-blue-500">✓</span>
                    <span className="text-gray-700">早鸟专属优惠</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-blue-500">✓</span>
                    <span className="text-gray-700">创始人身份认证</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-blue-500">✓</span>
                    <span className="text-gray-700">优先技术支持</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-blue-500">✓</span>
                    <span className="text-gray-700">专属社群权限</span>
                  </li>
                </ul>
                <Link 
                  to="/register"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 inline-block text-center"
                >
                  🚀 立即锁定席位
                </Link>
              </div>
            </div>

            {/* 团队创始人通道 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-purple-500 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-purple-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                  👥 团队优惠
                </span>
              </div>
              <div className="text-center pt-4">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">团队创始人通道</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-purple-600">¥2,666</span>
                  <p className="text-purple-600 mt-1 font-semibold">每人价格</p>
                  <p className="text-sm text-gray-500">3人及以上团队</p>
                  <p className="text-xs text-green-600 font-medium mt-1">团队总计立减¥1000</p>
                </div>
                <ul className="text-left space-y-3 mb-8">
                  <li className="flex items-center gap-3">
                    <span className="text-purple-500">✓</span>
                    <span className="text-gray-700">所有早鸟功能</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-purple-500">✓</span>
                    <span className="text-gray-700">团队协作项目</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-purple-500">✓</span>
                    <span className="text-gray-700">集体智慧加成</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-purple-500">✓</span>
                    <span className="text-gray-700">团队专属导师</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-purple-500">✓</span>
                    <span className="text-gray-700">推荐奖金分享</span>
                  </li>
                </ul>
                <Link 
                  to="/register"
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl text-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 inline-block text-center"
                >
                  👥 组队报名
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 零成本创富承诺 */}
      <section className="py-20 bg-gradient-to-r from-green-500 to-blue-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-3xl p-12 shadow-2xl">
            <div className="mb-8">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-3xl text-white">
                💎
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                "零成本"创富承诺
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                这是一场我们与你的"对赌协议"
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center text-2xl">
                  💰
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">学习保证金</h3>
                <p className="text-gray-600">
                  投资额¥2999作为你的学习保证金
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center text-2xl">
                  📅
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">3个月打卡</h3>
                <p className="text-gray-600">
                  完成为期3个月的"AI创富者打卡"
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center text-2xl">
                  🎁
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">100%返还</h3>
                <p className="text-gray-600">
                  保证金将100%全额返还
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 mb-8">
              <h4 className="text-xl font-bold text-gray-900 mb-3">我们赌什么？</h4>
              <ul className="text-left space-y-2 max-w-2xl mx-auto">
                <li className="flex items-center gap-3">
                  <span className="text-green-500">•</span>
                  <span className="text-gray-700">我们赌你能坚持学习和实践</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-green-500">•</span>
                  <span className="text-gray-700">我们赌你能学有所成，掌握AI创富技能</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-green-500">•</span>
                  <span className="text-gray-700">我们愿意为此承担全部成本风险</span>
                </li>
              </ul>
            </div>

            <div className="text-center">
              <p className="text-lg text-gray-700 mb-6">
                <strong>你唯一可能"损失"的，就是彻底掌握用AI赚钱的能力。</strong>
              </p>
              <p className="text-xl font-bold text-green-600">
                对你而言，这本质上是一次零风险、高回报的自我投资。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 课程信息 */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              📅 课程信息
            </h2>
            <p className="text-xl text-gray-600">
              两周高强度孵化，OMO模式教学
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100">
              <div className="text-4xl mb-4">📅</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">项目周期</h3>
              <p className="text-gray-600">
                2025年07月07日 - 07月20日
                <br />
                两周高强度孵化
              </p>
            </div>
            
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">班级规模</h3>
              <p className="text-gray-600">
                小班制教学
                <br />
                每期席位严格限定100席
              </p>
            </div>
            
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-green-50 to-green-100">
              <div className="text-4xl mb-4">🌐</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">孵化模式</h3>
              <p className="text-gray-600">
                OMO模式 (Online-Merge-Offline)
                <br />
                线上+线下深度实操
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            准备好投资你的未来了吗？
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            前100名早鸟席位，报满即止。下一期恢复原价¥3333
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/register" 
              className="bg-white text-purple-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              🚀 锁定早鸟席位 ¥2999
            </Link>
            <Link 
              to="/faq" 
              className="border-2 border-white text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white hover:text-purple-600 transition-all duration-200"
            >
              ❓ 常见问题
            </Link>
          </div>
          <div className="mt-6 text-sm text-blue-100">
            ⏰ 2025年7月7日开营 · 完成打卡100%返还 · 3人团队立减¥1000
          </div>
        </div>
      </section>
    </div>
  );
} 