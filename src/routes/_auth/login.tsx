import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { login } from '../../api/auth'
import { normalizeRedirectPath, setStoredAuth } from '../../lib/auth'

export const Route = createFileRoute('/_auth/login')({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      redirect: typeof search.redirect === 'string' ? search.redirect : undefined,
    }
  },
})

function RouteComponent() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const navigate = useNavigate()
  const search = Route.useSearch()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)
    setIsSubmitting(true)
    try {
      const token = await login({
        username: formData.username,
        password: formData.password,
      })

      setStoredAuth({
        ...token,
        username: formData.username,
        expires_at: Date.now() + token.expires_in * 1000,
      })

      const redirectTo = normalizeRedirectPath(search.redirect) ?? '/admin/reports'
      navigate({ to: redirectTo, replace: true })
    } catch (err: any) {
      setErrorMsg(err?.message || '登录失败，请稍后重试')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className=" flex items-center justify-center  from-gray-50 to-gray-100 px-4">
      <div className="max-w-1/2 w-full space-y-8">
        {/* 登录表单容器 */}
        <div className="bg-white rounded-xl shadow-2xl p-8 border border-gray-200">
          {/* 头部标题 */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">欢迎回来</h2>
            <p className="text-gray-600">请登录您的账户</p>
          </div>

          {/* 登录表单 */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {errorMsg ? (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {errorMsg}
              </div>
            ) : null}
            {/* 邮箱输入框 */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                用户名
              </label>
              <input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="请输入您的用户名"
              />
            </div>

            {/* 密码输入框 */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                密码
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="请输入您的密码"
              />
            </div>

            {/* 记住我和忘记密码 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  记住我
                </label>
              </div>
              <a href="#" className="text-sm text-blue-600 hover:text-blue-700 transition-colors">
                忘记密码？
              </a>
            </div>

            {/* 登录按钮 */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {isSubmitting ? '登录中...' : '登录'}
            </button>
          </form>

          <div className="mt-6 text-center">
            {/* <p className="text-gray-600">
              还没有账户？{' '}
              <a href="#" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
                立即注册
              </a>
            </p> */}
          </div>
        </div>
      </div>
    </div>
  )
}
