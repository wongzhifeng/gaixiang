'use client'

import { useState } from 'react'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'

export default function AuthPage() {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            街巷社区互助平台
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            邻里互助，温暖社区
          </p>
        </div>

        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* 认证模式切换 */}
          <div className="flex mb-6 border-b border-gray-200">
            <button
              onClick={() => setAuthMode('login')}
              className={`flex-1 py-2 px-4 text-center font-medium text-sm ${
                authMode === 'login'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              登录
            </button>
            <button
              onClick={() => setAuthMode('register')}
              className={`flex-1 py-2 px-4 text-center font-medium text-sm ${
                authMode === 'register'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              注册
            </button>
          </div>

          {/* 认证表单 */}
          {authMode === 'login' ? (
            <>
              <LoginForm />
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  还没有账号？{' '}
                  <button
                    onClick={() => setAuthMode('register')}
                    className="font-medium text-primary-600 hover:text-primary-500"
                  >
                    立即注册
                  </button>
                </p>
              </div>
            </>
          ) : (
            <>
              <RegisterForm />
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  已有账号？{' '}
                  <button
                    onClick={() => setAuthMode('login')}
                    className="font-medium text-primary-600 hover:text-primary-500"
                  >
                    立即登录
                  </button>
                </p>
              </div>
            </>
          )}
        </div>

        {/* 使用提示 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
          <h4 className="font-semibold mb-2">使用提示</h4>
          <ul className="space-y-1">
            <li>• 使用真实姓名和联系方式，方便邻居联系</li>
            <li>• 密码需要至少6位字符</li>
            <li>• 注册后即可发布需求和提供服务</li>
            <li>• 参与互助可以提升您的信任等级</li>
          </ul>
        </div>
      </div>
    </div>
  )
}