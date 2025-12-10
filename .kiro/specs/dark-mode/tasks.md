# Implementation Plan

- [x] 1. 安装和配置 color-mode 模块





  - [x] 1.1 安装 @nuxtjs/color-mode 依赖


    - 运行 `pnpm add @nuxtjs/color-mode`
    - _Requirements: 1.1, 2.1_
  - [x] 1.2 配置 nuxt.config.ts


    - 添加 color-mode 模块到 modules 数组
    - 配置 colorMode 选项（preference: 'system', classSuffix: ''）
    - _Requirements: 1.3, 2.3_
  - [x] 1.3 配置 Tailwind CSS 深色模式


    - 确保 tailwind.config 使用 darkMode: 'class'
    - _Requirements: 4.1_

- [x] 2. 创建 ThemeToggle 组件





  - [x] 2.1 创建 components/ThemeToggle.vue


    - 实现三态切换按钮（light/dark/system）
    - 显示对应图标（太阳/月亮/电脑）
    - 支持键盘操作（Enter/Space）
    - 添加无障碍标签
    - _Requirements: 3.1, 3.2, 3.3, 3.4_
  - [x] 2.2 编写 ThemeToggle 属性测试


    - **Property 1: Theme toggle cycles through modes**
    - **Property 6: Icon matches current mode**
    - **Property 7: Keyboard navigation works**
    - **Validates: Requirements 1.1, 3.2, 3.4**

- [x] 3. 集成 ThemeToggle 到导航栏





  - [x] 3.1 修改 app.vue 添加 ThemeToggle


    - 在桌面导航栏添加 ThemeToggle 组件
    - 在移动端菜单添加 ThemeToggle 组件
    - _Requirements: 3.1_
  - [x] 3.2 更新 app.vue 深色模式样式


    - 添加 header 深色样式
    - 添加 footer 深色样式
    - 添加主背景深色样式
    - _Requirements: 4.1_

- [x] 4. 更新全局 CSS 深色模式样式





  - [x] 4.1 更新 assets/css/main.css


    - 添加主题切换过渡动画
    - 更新 .card 组件深色样式
    - 更新 .btn-primary 和 .btn-secondary 深色样式
    - 更新 .upload-zone 深色样式
    - 更新 .tool-card 深色样式
    - 更新滚动条深色样式
    - _Requirements: 4.3, 4.5_

- [x] 5. Checkpoint - 确保基础功能正常





  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. 更新页面组件深色模式样式





  - [x] 6.1 更新 pages/index.vue 深色样式


    - Hero section 深色背景和文字
    - 工具分类卡片深色样式
    - 特色功能区域深色样式
    - 统计数据区域深色样式
    - _Requirements: 4.2_
  - [x] 6.2 更新 pages/about.vue 深色样式


    - 页面背景和文字颜色
    - 卡片组件深色样式
    - _Requirements: 4.2_

  - [x] 6.3 更新 pages/contact.vue 深色样式

    - 联系方式卡片深色样式
    - 联系类型卡片深色样式
    - _Requirements: 4.2_
  - [x] 6.4 更新 pages/privacy.vue 深色样式


    - 内容区域深色样式
    - _Requirements: 4.2_

- [x] 7. 更新工具页面深色模式样式






  - [x] 7.1 更新 pages/heic-converter.vue 深色样式

    - Hero section 深色样式
    - 特性介绍区域深色样式
    - 相关工具推荐深色样式
    - _Requirements: 4.2_
  - [x] 7.2 更新 pages/image-compressor.vue 深色样式


    - _Requirements: 4.2_
  - [x] 7.3 更新 pages/image-format-converter.vue 深色样式


    - _Requirements: 4.2_
  - [x] 7.4 更新 pages/image-tools/index.vue 深色样式


    - _Requirements: 4.2_

- [x] 8. 更新可复用组件深色模式样式





  - [x] 8.1 更新 components/FAQ.vue 深色样式


    - 问答卡片深色背景
    - 展开/收起按钮深色样式
    - _Requirements: 4.3_
  - [x] 8.2 更新 components/HeicConverter.vue 深色样式


    - 上传区域深色样式
    - 文件列表深色样式
    - 进度条深色样式
    - _Requirements: 4.3_
  - [x] 8.3 更新 components/ImageCompressor.vue 深色样式


    - _Requirements: 4.3_
  - [x] 8.4 更新 components/ImageFormatConverter.vue 深色样式


    - _Requirements: 4.3_
  - [x] 8.5 更新 components/LanguageSwitcher.vue 深色样式


    - _Requirements: 4.3_
  - [x] 8.6 更新 components/BlogCard.vue 深色样式


    - _Requirements: 4.3_

  - [x] 8.7 更新 components/RelatedLinks.vue 深色样式

    - _Requirements: 4.3_

- [x] 9. 更新博客相关页面深色样式





  - [x] 9.1 更新 pages/blog/index.vue 深色样式


    - _Requirements: 4.2_
  - [x] 9.2 更新博客文章页面深色样式


    - _Requirements: 4.2_
  - [x] 9.3 更新 assets/css/prose.css 深色样式


    - 代码块深色样式
    - 文章内容深色样式
    - _Requirements: 4.3_

- [x] 10. Checkpoint - 确保所有样式正常





  - Ensure all tests pass, ask the user if questions arise.

- [x] 11. 添加国际化支持





  - [x] 11.1 更新 i18n/locales/zh.json

    - 添加主题切换相关翻译文本
    - _Requirements: 3.2_

  - [x] 11.2 更新 i18n/locales/en.json
    - 添加主题切换相关翻译文本
    - _Requirements: 3.2_

- [x] 12. 编写属性测试





  - [x] 12.1 编写主题持久化属性测试


    - **Property 4: Preference persists to localStorage**
    - **Property 5: Preference restores from localStorage**
    - **Validates: Requirements 2.1, 2.2**
  - [x] 12.2 编写系统偏好属性测试

    - **Property 3: System mode follows OS preference**
    - **Validates: Requirements 1.3, 1.4**
  - [x] 12.3 编写主题类应用属性测试

    - **Property 2: Theme class matches preference**
    - **Validates: Requirements 1.2**

- [x] 13. Final Checkpoint - 确保所有测试通过








  - Ensure all tests pass, ask the user if questions arise.
