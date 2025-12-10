# Requirements Document

## Introduction

本文档定义了 TryUtils 网站完整深色模式功能的需求。该功能将允许用户在浅色和深色主题之间切换，同时支持跟随系统设置自动切换，并持久化用户的主题偏好。

## Glossary

- **Dark Mode（深色模式）**: 使用深色背景和浅色文字的界面主题
- **Light Mode（浅色模式）**: 使用浅色背景和深色文字的界面主题
- **System Preference（系统偏好）**: 操作系统级别的主题设置
- **Theme Toggle（主题切换器）**: 允许用户手动切换主题的 UI 组件
- **Color Mode**: 当前激活的主题模式（light/dark/system）
- **Tailwind CSS**: 项目使用的 CSS 框架，支持 dark: 前缀类

## Requirements

### Requirement 1: 主题切换功能

**User Story:** As a user, I want to switch between light and dark themes, so that I can use the website comfortably in different lighting conditions.

#### Acceptance Criteria

1. WHEN a user clicks the theme toggle button THEN the System SHALL switch between light, dark, and system modes
2. WHEN the theme changes THEN the System SHALL apply the new theme immediately without page reload
3. WHEN the user selects "system" mode THEN the System SHALL follow the operating system's theme preference
4. WHEN the system preference changes while in "system" mode THEN the System SHALL update the theme automatically

### Requirement 2: 主题持久化

**User Story:** As a user, I want my theme preference to be remembered, so that I don't have to set it every time I visit the website.

#### Acceptance Criteria

1. WHEN a user selects a theme THEN the System SHALL save the preference to localStorage
2. WHEN a user returns to the website THEN the System SHALL restore their previously selected theme
3. WHEN no preference is stored THEN the System SHALL default to following system preference

### Requirement 3: 主题切换器 UI

**User Story:** As a user, I want a visible and accessible theme toggle button, so that I can easily find and use the theme switching feature.

#### Acceptance Criteria

1. THE System SHALL display a theme toggle button in the navigation header
2. THE System SHALL display appropriate icons for each theme state (sun for light, moon for dark, computer for system)
3. WHEN the theme toggle is focused THEN the System SHALL provide visible focus indicators for accessibility
4. THE System SHALL support keyboard navigation for the theme toggle

### Requirement 4: 完整的深色模式样式

**User Story:** As a user, I want all pages and components to have proper dark mode styling, so that the entire website looks consistent in dark mode.

#### Acceptance Criteria

1. THE System SHALL apply dark mode styles to the main layout (app.vue) including header, footer, and navigation
2. THE System SHALL apply dark mode styles to all page components (index, about, contact, privacy, blog, tool pages)
3. THE System SHALL apply dark mode styles to all reusable components (FAQ, cards, buttons, forms)
4. THE System SHALL maintain readable contrast ratios in dark mode (WCAG AA compliance)
5. THE System SHALL apply smooth transitions when switching themes

### Requirement 5: 防止闪烁

**User Story:** As a user, I want the correct theme to load immediately, so that I don't see a flash of the wrong theme when the page loads.

#### Acceptance Criteria

1. WHEN the page loads THEN the System SHALL apply the correct theme before rendering content
2. THE System SHALL use a script in the document head to set the theme class before hydration
3. THE System SHALL prevent flash of unstyled content (FOUC) during theme initialization
