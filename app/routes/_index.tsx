import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "爱学AI创富实训营 - 从AI的用户到AI的合伙人" },
    { name: "description", content: "两周高强度孵化，从想法到产品，让AI成为你的财富加速器。游戏开发、全球化创业、新消费产品、APP开发、自动化一人公司，选择你的赛道！" },
  ];
};

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                🤖 爱学AI创富营
              </div>
            </div>
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
                <Link to="/pricing" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  投资方案
                </Link>
                <Link to="/login" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                  登录
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
      <section className="relative py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-6">
              <span className="inline-block bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                🔥 2025年7月7日-20日 · 限额100席
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              从AI的<span className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">"用户"</span>
              <br />
              到AI的<span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">"合伙人"</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-4xl mx-auto">
              一个残酷的真相：<strong>你不是在用AI，你只是在AI的用户列表里</strong>
              <br />
              两周高强度孵化，让你从想法到产品，成为AI智能体的驾驭者
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/register" 
                className="bg-gradient-to-r from-red-600 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-red-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                🚀 锁定创始人席位
              </Link>
              <Link 
                to="/courses" 
                className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-600 hover:text-white transition-all duration-200"
              >
                📚 查看5大赛道
              </Link>
            </div>
            <div className="mt-6 text-sm text-gray-500">
              早鸟价 ¥2999（原价 ¥3333）· 3人团队立减 ¥1000 · 完成打卡100%返还
            </div>
          </div>
        </div>
        
        {/* Floating elements */}
        <div className="absolute top-1/4 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-1/3 right-10 w-16 h-16 bg-purple-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/4 w-12 h-12 bg-pink-200 rounded-full opacity-20 animate-pulse delay-2000"></div>
      </section>

      {/* 三级火箭 Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              🚀 三级火箭孵化路径
            </h2>
            <p className="text-xl text-gray-600">
              从地面发射到全新的商业轨道
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 transition-all duration-300 transform hover:scale-105">
              <div className="text-4xl mb-4">🔥</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">第一级：点火升空</h3>
              <h4 className="text-lg font-medium text-blue-600 mb-3">武装个体</h4>
              <p className="text-gray-600 mb-4">
                用AI洞察商业机会，打造强大的"全能AI助手矩阵"，
                让你一个人活成一支高效军队
              </p>
              <div className="bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                产出：全能AI助手矩阵
              </div>
            </div>
            
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 transition-all duration-300 transform hover:scale-105">
              <div className="text-4xl mb-4">🏗️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">第二级：进入轨道</h3>
              <h4 className="text-lg font-medium text-purple-600 mb-3">建立工厂</h4>
              <p className="text-gray-600 mb-4">
                像搭积木一样设计商业蓝图，
                构建7x24小时为你工作的"自动化AI员工"
              </p>
              <div className="bg-purple-200 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                产出：自动化AI员工
              </div>
            </div>
            
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-pink-50 to-pink-100 hover:from-pink-100 hover:to-pink-200 transition-all duration-300 transform hover:scale-105">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">第三级：登陆新世界</h3>
              <h4 className="text-lg font-medium text-pink-600 mb-3">产品问世</h4>
              <p className="text-gray-600 mb-4">
                将蓝图变成真实产品原型，
                打造"可盈利的商业MVP"
              </p>
              <div className="bg-pink-200 text-pink-800 px-3 py-1 rounded-full text-sm font-medium">
                产出：可盈利商业MVP
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5大赛道 Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              🛒 选择你的赛道
            </h2>
            <p className="text-xl text-gray-600">
              你的兴趣，就是你的下一个生意
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="text-3xl mb-4">🎮</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">游戏开发者</h3>
              <p className="text-gray-600 mb-4">
                不止是玩家，更是元宇宙的造物主。
                打造拥有AI灵魂的NPC和动态生成的游戏世界
              </p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-blue-600 font-medium">沉浸式元宇宙游戏DEMO</span>
                <span className="text-sm text-gray-500">2周</span>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="text-3xl mb-4">🌏</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">全球化创业者</h3>
              <p className="text-gray-600 mb-4">
                让世界读懂你的野心。
                构建全天候AI出海营销Bot，撬动全球市场
              </p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-purple-600 font-medium">AI出海营销Bot</span>
                <span className="text-sm text-gray-500">2周</span>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="text-3xl mb-4">🧘</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">新消费产品经理</h3>
              <p className="text-gray-600 mb-4">
                用代码疗愈赛博世界的灵魂。
                打造AI情绪树洞、疗愈师、解梦师
              </p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-pink-600 font-medium">AI灵性疗愈产品MVP</span>
                <span className="text-sm text-gray-500">2周</span>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="text-3xl mb-4">📱</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">独立APP开发者</h3>
              <p className="text-gray-600 mb-4">
                你的下一个App，在这里诞生。
                无代码打造时间管理、第二大脑、穿搭顾问App
              </p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-green-600 font-medium">App核心功能原型</span>
                <span className="text-sm text-gray-500">2周</span>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 md:col-span-2 lg:col-span-1">
              <div className="text-3xl mb-4">🤖</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">自动化"一人公司"</h3>
              <p className="text-gray-600 mb-4">
                你只负责创意，AI搞定其他所有。
                构建7x24小时自动运转的AI智能商业体
              </p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-orange-600 font-medium">AI智能商业体</span>
                <span className="text-sm text-gray-500">2周</span>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link 
              to="/courses" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              查看完整赛道详情 →
            </Link>
          </div>
        </div>
      </section>

      {/* 王牌导师团队 */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              👑 王牌创富天团
            </h2>
            <p className="text-xl text-gray-600">
              身经百战的创业者、产品专家和技术大牛
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                M
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Mike</h3>
              <p className="text-blue-600 font-medium mb-2">领航舰长 & 赛道开创者</p>
              <p className="text-sm text-gray-600">
                "马斯克AI夏令营"开创者，2个月营收破百万的实战专家
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-pink-500 to-red-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                🐰
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">兔子</h3>
              <p className="text-purple-600 font-medium mb-2">首席孵化导师</p>
              <p className="text-sm text-gray-600">
                3年AI夏令营经验，独立开发多款小程序和App Store应用
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                ⬜
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">正方形</h3>
              <p className="text-green-600 font-medium mb-2">首席技术官</p>
              <p className="text-sm text-gray-600">
                B站知名博主，indiePlay 2024最佳叙事提名游戏制作人
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-orange-500 to-pink-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                T
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">陶子</h3>
              <p className="text-orange-600 font-medium mb-2">明星学员导师</p>
              <p className="text-sm text-gray-600">
                从学员到导师，开发"爱学生命数字"小程序的实战领路人
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-red-600 via-purple-600 to-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            准备好成为AI的"合伙人"了吗？
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            限额100席，报满即止。下一期恢复原价 ¥3333
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/register" 
              className="bg-white text-purple-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              🎓 锁定早鸟席位 ¥2999
            </Link>
            <Link 
              to="/pricing" 
              className="border-2 border-white text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white hover:text-purple-600 transition-all duration-200"
            >
              💰 查看投资方案
            </Link>
          </div>
          <div className="mt-6 text-sm text-blue-100">
            ⏰ 2025年7月7日开营 · 完成打卡100%返还 · 3人团队立减¥1000
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="text-2xl font-bold mb-4">🤖 爱学AI创富营</div>
              <p className="text-gray-400">
                两周高强度孵化，从想法到产品
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">课程赛道</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/courses" className="hover:text-white transition-colors">🎮 游戏开发者</Link></li>
                <li><Link to="/courses" className="hover:text-white transition-colors">🌏 全球化创业</Link></li>
                <li><Link to="/courses" className="hover:text-white transition-colors">🧘 新消费产品</Link></li>
                <li><Link to="/courses" className="hover:text-white transition-colors">📱 APP开发</Link></li>
                <li><Link to="/courses" className="hover:text-white transition-colors">🤖 一人公司</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">支持</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/faq" className="hover:text-white transition-colors">常见问题</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">联系我们</Link></li>
                <li><Link to="/about" className="hover:text-white transition-colors">关于我们</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">联系方式</h3>
              <ul className="space-y-2 text-gray-400">
                <li>📧 contact@aiwealth.academy</li>
                <li>📱 400-888-9999</li>
                <li>🗓️ 2025年7月7日-20日</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 爱学AI创富实训营. All rights reserved. | 从AI的用户到AI的合伙人</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
