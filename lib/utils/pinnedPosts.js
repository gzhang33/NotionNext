/**
 * 全局置顶排序工具（纯函数，无依赖主题/配置，便于测试）
 *
 * 规则（与你确认的 A 一致）：
 * - 开启 topTag（topTag 非空）才生效
 * - 只重排“置顶文章”子集
 * - “非置顶文章”的索引位置不变（尽量保持原排序不动）
 * - 置顶文章按 lastEditedDate（兜底 publishDate）倒序；相同时间保持稳定（原相对顺序）
 */

function getPostLatestTime(post) {
  // lastEditedDate：getPageProperties 里基于 notion last_edited_time 生成
  if (post?.lastEditedDate) {
    return post.lastEditedDate
  }
  // publishDate：兜底保证不会出现 NaN
  if (post?.publishDate) {
    return post.publishDate
  }
  return 0
}

export function sortPinnedPostsByLatestUpdate(posts, topTag) {
  if (!Array.isArray(posts) || !topTag) {
    return posts
  }

  const pinnedSlots = []
  const pinned = []
  for (let i = 0; i < posts.length; i++) {
    const p = posts[i]
    const tags = Array.isArray(p?.tags) ? p.tags : []
    if (tags.includes(topTag)) {
      pinnedSlots.push(i)
      pinned.push({ post: p, idx: i })
    }
  }

  if (pinned.length <= 1) {
    // 0 或 1 个置顶：不改变顺序，避免无谓数组重排
    return posts
  }

  pinned.sort((a, b) => {
    const timeA = new Date(getPostLatestTime(a.post)).getTime()
    const timeB = new Date(getPostLatestTime(b.post)).getTime()
    if (timeB !== timeA) {
      return timeB - timeA
    }
    // 稳定：相同时间保持原相对顺序
    return a.idx - b.idx
  })

  // 关键：只重排置顶文章“自身在原列表中的索引位置”，不移动非置顶文章索引
  const result = [...posts]
  pinnedSlots.sort((a, b) => a - b) // 升序：保证最靠前的置顶槽位会拿到最新的置顶文章
  for (let i = 0; i < pinned.length; i++) {
    result[pinnedSlots[i]] = pinned[i].post
  }
  return result
}

/**
 * 将带置顶标签的文章移到数组最前；多条置顶时，置顶子集按 sortPinnedPostsByLatestUpdate 规则排序。
 *
 * @param {Array} posts
 * @param {string} topTag
 * @returns {Array}
 */
export function sortPostsByTopTag(posts, topTag) {
  if (!Array.isArray(posts) || !topTag) {
    return posts
  }
  const withTag = []
  const without = []
  for (let i = 0; i < posts.length; i++) {
    const p = posts[i]
    const tags = Array.isArray(p?.tags) ? p.tags : []
    if (tags.includes(topTag)) {
      withTag.push(p)
    } else {
      without.push(p)
    }
  }
  if (withTag.length === 0) {
    return posts
  }
  const orderedPinned =
    withTag.length > 1
      ? sortPinnedPostsByLatestUpdate(withTag, topTag)
      : withTag
  return [...orderedPinned, ...without]
}

/**
 * 在整站 allPages 上，仅对「已发布 Post」按出现顺序抽出、用 sortPostsByTopTag 重排后写回原下标。
 * 非 Post、非 Published 的项位置不变；各列表页只需 filter，无需再单独排序。
 *
 * @param {Array} allPages
 * @param {string} topTag
 * @returns {Array}
 */
export function reorderPublishedPostsInAllPagesByTopTag(allPages, topTag) {
  if (!Array.isArray(allPages) || !topTag) {
    return allPages
  }
  const indices = []
  for (let i = 0; i < allPages.length; i++) {
    const p = allPages[i]
    if (p?.type === 'Post' && p.status === 'Published') {
      indices.push(i)
    }
  }
  if (indices.length <= 1) {
    return allPages
  }
  const slice = indices.map(i => allPages[i])
  const sorted = sortPostsByTopTag(slice, topTag)
  const result = [...allPages]
  for (let j = 0; j < indices.length; j++) {
    result[indices[j]] = sorted[j]
  }
  return result
}
