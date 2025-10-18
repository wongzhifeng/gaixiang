'use client'

import { ArrowLeft } from 'lucide-react'

export default function ConversationDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* 顶部导航 */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <a href="/conversations" className="p-2 text-gray-500 hover:text-gray-700">
              <ArrowLeft className="w-6 h-6" />
            </a>
            <h1 className="text-lg font-semibold text-gray-900">对话详情</h1>
          </div>
        </div>
      </div>

      {/* 主内容区 */}
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-600 mb-2">对话功能开发中</h2>
          <p className="text-gray-500">我们正在开发对话功能，请稍后查看</p>
        </div>
      </main>
    </div>
  )
}