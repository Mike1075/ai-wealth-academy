import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { useState } from "react";

export const meta: MetaFunction = () => {
  return [
    { title: "三级火箭 - 爱学AI创富实训营" },
    { name: "description", content: "了解我们独特的三级火箭培训体系，从想法到产品，从产品到商业，让AI成为你的财富加速器" },
  ];
};

export default function About() {
  const [activeTab, setActiveTab] = useState(0);

  const rockets = [
    {
      title: "第一级火箭：AI工具掌握",
      subtitle: "从小白到高手的蜕变",
      description: "让你快速掌握各种AI工具，从ChatGPT到Midjourney，从Cursor到Claude，每一个工具都是你的创富利器。",
      features: [
        "AI对话技巧训练",
        "图像生成工具应用",
        "代码生成与调试",
        "文案创作自动化",
        "数据分析与处理"
      ],
      icon: "🚀",
      color: "from-blue-500 to-purple-600"
    },
    {
      title: "第二级火箭：项目实战孵化",
      subtitle: "从想法到产品的实现",
      description: "在导师指导下，2周时间内完成一个完整的AI项目，从立项到上线，每个环节都有专业指导。",
      features: [
        "项目立项与规划",
        "技术架构设计",
        "MVP快速开发",
        "用户测试与反馈",
        "产品迭代优化"
      ],
      icon: "🛠️",
      color: "from-green-500 to-blue-500"
    },
    {
      title: "第三级火箭：商业化落地",
      subtitle: "从产品到财富的转化",
      description: "不只是做出产品，更要让产品变现。学会定价策略、营销推广、用户运营，真正实现财富自由。",
      features: [
        "商业模式设计",
        "定价策略制定",
        "营销渠道搭建",
        "用户增长运营",
        "收入变现优化"
      ],
      icon: "💰",
      color: "from-purple-500 to-pink-500"
    }
  ];

  const timeline = [
    {
      day: "Day 1-2",
      title: "破冰启动",
      content: "团队组建、项目立项、技术选型，为接下来的冲刺做好准备。",
      icon: "🏁"
    },
    {
      day: "Day 3-7",
      title: "疯狂开发",
      content: "在导师指导下，快速开发MVP，每天都有新的突破和进展。",
      icon: "⚡"
    },
    {
      day: "Day 8-10",
      title: "测试优化",
      content: "用户测试、bug修复、功能完善，让产品达到可发布的标准。",
      icon: "🔧"
    },
    {
      day: "Day 11-12",
      title: "商业包装",
      content: "商业模式设计、定价策略、营销素材准备，为上线做最后冲刺。",
      icon: "📦"
    },
    {
      day: "Day 13-14",
      title: "发布上线",
      content: "项目发布、用户反馈收集、后续优化规划，正式踏上创富之路。",
      icon: "🚀"
    }
  ];

  const faqs = [
    {
      question: "零基础可以参加吗？",
      answer: "当然可以！我们的课程就是为零基础学员设计的。通过我们的三级火箭体系，你将从AI工具的基础使用开始，逐步进阶到项目开发和商业化。我们的导师会根据你的基础情况提供个性化指导。"
    },
    {
      question: "两周时间真的能做出产品吗？",
      answer: "是的！我们采用PBL项目制学习和MVP快速开发方法论。重点不是做出完美的产品，而是做出可用的、能解决实际问题的产品。许多学员在两周内就获得了第一批用户和收入。"
    },
    {
      question: "学完之后还有后续支持吗？",
      answer: "有的！毕业后你将加入我们的校友网络，可以继续获得导师指导、项目合作机会，以及最新的AI工具和商业机会分享。我们还定期举办校友聚会和进阶课程。"
    },
    {
      question: "如果项目失败了怎么办？",
      answer: "失败是成功的一部分！我们的导师会帮你分析失败原因，调整策略，甚至帮你重新立项。而且我们有'零成本'承诺，完成打卡后可以100%返还学费。"
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
                <Link to="/instructors" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  王牌导师
                </Link>
                <Link to="/about" className="text-blue-600 px-3 py-2 rounded-md text-sm font-medium border-b-2 border-blue-600">
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
              <span className="inline-block bg-yellow-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                🚀 独家方法论
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              三级火箭体系
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              我们独创的三级火箭培训体系，让你从AI小白到创富高手，
              每一级都是你通往财富自由的加速器。
            </p>
            <div className="flex items-center justify-center space-x-8 text-blue-100">
              <div className="text-center">
                <div className="text-3xl font-bold">2周</div>
                <div className="text-sm">高强度孵化</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">3级</div>
                <div className="text-sm">进阶体系</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">1个</div>
                <div className="text-sm">商业作品</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Three Rockets Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              三级火箭推进系统
            </h2>
            <p className="text-xl text-gray-600">
              每一级火箭都有明确的目标和完整的体系
            </p>
          </div>

          {/* Rocket Tabs */}
          <div className="flex justify-center mb-12">
            <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
              {rockets.map((rocket, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTab(index)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === index
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-blue-600'
                  }`}
                >
                  {rocket.icon} 第{index + 1}级
                </button>
              ))}
            </div>
          </div>

          {/* Rocket Content */}
          <div className="max-w-4xl mx-auto">
            {rockets.map((rocket, index) => (
              <div
                key={index}
                className={`${activeTab === index ? 'block' : 'hidden'} transition-all duration-300`}
              >
                <div className="bg-white rounded-2xl p-8 shadow-lg">
                  <div className="text-center mb-8">
                    <div className={`w-20 h-20 mx-auto mb-4 bg-gradient-to-r ${rocket.color} rounded-full flex items-center justify-center text-3xl text-white`}>
                      {rocket.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{rocket.title}</h3>
                    <p className="text-lg text-gray-600 mb-4">{rocket.subtitle}</p>
                    <p className="text-gray-700 leading-relaxed">{rocket.description}</p>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {rocket.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center p-4 bg-gray-50 rounded-lg">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              14天冲刺时间线
            </h2>
            <p className="text-xl text-gray-600">
              每一天都有明确的目标和可衡量的成果
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>

            {timeline.map((item, index) => (
              <div key={index} className={`relative flex items-center mb-12 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                {/* Timeline dot */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-12 h-12 bg-white border-4 border-blue-500 rounded-full flex items-center justify-center text-xl z-10">
                  {item.icon}
                </div>

                {/* Content */}
                <div className={`w-5/12 ${index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'}`}>
                  <div className="bg-white p-6 rounded-lg shadow-lg">
                    <div className="text-sm font-semibold text-blue-600 mb-2">{item.day}</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                    <p className="text-gray-600">{item.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gradient-to-r from-gray-50 to-blue-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              常见问题
            </h2>
            <p className="text-xl text-gray-600">
              解答你心中的疑惑
            </p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <details key={index} className="group bg-white rounded-lg shadow-lg">
                <summary className="flex items-center justify-between p-6 cursor-pointer">
                  <h3 className="text-lg font-semibold text-gray-900">{faq.question}</h3>
                  <svg
                    className="w-6 h-6 text-gray-500 group-open:rotate-45 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </summary>
                <div className="px-6 pb-6">
                  <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            准备好启动你的创富火箭了吗？
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            三级火箭体系等你来体验，从AI小白到创富高手只需要14天
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/register" 
              className="bg-white text-purple-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              🚀 立即启动火箭
            </Link>
            <Link 
              to="/courses" 
              className="border-2 border-white text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white hover:text-purple-600 transition-all duration-200"
            >
              📚 选择赛道
            </Link>
          </div>
          <div className="mt-6 text-sm text-blue-100">
            🎯 14天冲刺 · 3级进阶 · 1个作品 · 无限可能
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