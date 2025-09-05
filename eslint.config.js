import js from '@eslint/js'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{js,ts,tsx}'],
    rules: {
      // 忽略未使用变量的警告
      '@typescript-eslint/no-unused-vars': 'off',
      'no-unused-vars': 'off',

      // 忽略未使用导入的警告
      '@typescript-eslint/no-unused-imports': 'off',

      // 允许空函数
      '@typescript-eslint/no-empty-function': 'off',

      // 允许 any 类型
      '@typescript-eslint/no-explicit-any': 'warn',

      // 其他常见的开发时可以放松的规则
      '@typescript-eslint/ban-ts-comment': 'warn',
      '@typescript-eslint/prefer-const': 'warn'
    }
  },
  {
    // 忽略生成的文件
    ignores: [
      'node_modules/**',
      'dist/**',
      'build/**',
      'src/routeTree.gen.ts'
    ]
  }
)
