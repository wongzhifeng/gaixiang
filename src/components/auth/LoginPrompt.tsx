'use client'

import { useState } from 'react'
import { LogIn, X } from 'lucide-react'

interface LoginPromptProps {
  message?: string
  action?: string
}

export default function LoginPrompt({
  message = "请先登录以继续操作",
  action = "登录"
}: LoginPromptProps) {
  const [showPrompt, setShowPrompt] = useState(true)

  if (!showPrompt) return null

  return (
    <div className="fixed top-4 left-4 right-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4 shadow-lg z-50">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <LogIn className="w-3 h-3 text-yellow-600" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-yellow-800 mb-1">
              {message}
            </h4>
            <div className="flex gap-2">
              <a
                href="/"
                className="inline-flex items-center gap-1 bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
              >
                <LogIn className="w-3 h-3" />
                {action}
              </a>
              <button
                onClick={() => setShowPrompt(false)}
                className="text-yellow-600 hover:text-yellow-700 text-xs font-medium"
              >
                稍后
              </button>
            </div>
          </div>
        </div>
        <button
          onClick={() => setShowPrompt(false)}
          className="text-yellow-400 hover:text-yellow-600 transition-colors flex-shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}