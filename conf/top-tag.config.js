/**
 * 全局置顶配置
 *
 * 使用方式：
 * - 在 Notion 的 Config 页填写 `TOP_TAG`（同名覆盖）
 * - 或在环境变量中设置 `NEXT_PUBLIC_TOP_TAG` / `TOP_TAG`
 *
 * 开启后：
 * - 在 SiteDataApi 构建 allPages 时，对「已发布 Post」整体重排：带 TOP_TAG 的排在前面；多条置顶时按最近更新时间倒序（见 lib/utils/pinnedPosts.js）
 * - 其它非置顶文章的相对顺序在「无标签 / 同段」内保持不变
 * - 各列表页无需单独处理，按 allPages 顺序 filter 即可
 */
module.exports = {
  TOP_TAG: process.env.NEXT_PUBLIC_TOP_TAG || process.env.TOP_TAG || ''
}

