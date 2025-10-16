'use client'

import { useState } from 'react'
import { Heart, MessageCircle, Users, Settings, AlertCircle } from 'lucide-react'

export default function Home() {
  const [showHelp, setShowHelp] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white pb-20">
      {/* 顶部导航 */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-primary-600">街巷</h1>
            <button
              onClick={() => setShowHelp(!showHelp)}
              className="emergency-btn flex items-center gap-2"
              aria-label="一键求救"
            >
              <AlertCircle className="w-6 h-6" />
              一键求救
            </button>
          </div>
        </div>
      </header>

      {/* 主内容区 */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* 欢迎区域 */}
        <section className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            好汉三个帮
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            邻里互助，温暖社区
          </p>
        </section>

        {/* 快速操作区域 */}
        <section className="grid grid-cols-2 gap-6 mb-12">
          <button className="card hover:shadow-lg transition-shadow duration-200 text-center group">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-200 transition-colors">
              <Heart className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">我需要</h3>
            <p className="text-gray-600 text-sm">发布求助需求</p>
          </button>

          <button className="card hover:shadow-lg transition-shadow duration-200 text-center group">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
              <Users className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">我能提供</h3>
            <p className="text-gray-600 text-sm">分享技能服务</p>
          </button>
        </section>

        {/* 功能入口 */}
        <section className="space-y-4">
          <a href="/mutual-aid" className="block w-full card hover:shadow-lg transition-shadow duration-200 text-left flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">街巷互助广场</h3>
              <p className="text-gray-600 text-sm">浏览社区内的所有互助信息</p>
            </div>
          </a>

          <a href="/profile" className="block w-full card hover:shadow-lg transition-shadow duration-200 text-left flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Settings className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">我的街巷互助</h3>
              <p className="text-gray-600 text-sm">管理自己发布的需求和服务</p>
            </div>
          </a>
        </section>

        {/* 使用提示 */}
        {showHelp && (
          <div className="mt-8 card bg-blue-50 border-blue-200">
            <h4 className="text-lg font-semibold text-blue-900 mb-2">使用帮助</h4>
            <ul className="text-blue-800 space-y-2 text-sm">
              <li>• 点击"我需要"发布求助需求</li>
              <li>• 点击"我能提供"分享您的技能</li>
              <li>• 在互助广场浏览邻居们的需求</li>
              <li>• 一键求救按钮用于紧急情况</li>
            </ul>
          </div>
        )}
      </main>

      {/* 底部导航栏 */}
      <nav className="bottom-nav">
        <button className="nav-item active">
          <Heart className="w-6 h-6 mb-1" />
          <span>首页</span>
        </button>
        <button className="nav-item inactive">
          <MessageCircle className="w-6 h-6 mb-1" />
          <span>互助</span>
        </button>
        <button className="nav-item inactive">
          <Users className="w-6 h-6 mb-1" />
          <span>我的</span>
        </button>
      </nav>
    </div>
  )
}