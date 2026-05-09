/**
 * 路由切换（尤其是文章详情页）时的全局骨架占位，减轻主题 Transition 收起后主区空白感。
 * 样式独立于具体主题，浅色/深色自适应。
 */
export default function ArticleRouteSkeleton({ visible }) {
  if (!visible) return null

  return (
    <div
      role='progressbar'
      aria-busy='true'
      aria-label='Loading article'
      className='fixed inset-0 z-[60] flex cursor-wait justify-center overflow-hidden bg-white/75 backdrop-blur-[2px] dark:bg-black/70'>
      <div className='mt-24 w-full max-w-3xl shrink-0 px-5 pb-24 md:mt-28 md:px-8'>
        <div className='mb-8 h-9 max-w-[72%] animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-700' />
        <div className='mb-4 flex gap-3'>
          <div className='h-4 w-24 animate-pulse rounded bg-neutral-200 dark:bg-neutral-700' />
          <div className='h-4 w-20 animate-pulse rounded bg-neutral-200 dark:bg-neutral-700' />
        </div>
        <div className='space-y-3'>
          <div className='h-4 animate-pulse rounded bg-neutral-200 dark:bg-neutral-700' />
          <div className='h-4 animate-pulse rounded bg-neutral-200 dark:bg-neutral-700' />
          <div className='h-4 w-[92%] animate-pulse rounded bg-neutral-200 dark:bg-neutral-700' />
          <div className='h-4 w-[88%] animate-pulse rounded bg-neutral-200 dark:bg-neutral-700' />
        </div>
        <div className='mt-10 space-y-3'>
          <div className='h-4 animate-pulse rounded bg-neutral-200/90 dark:bg-neutral-700/90' />
          <div className='h-4 w-[96%] animate-pulse rounded bg-neutral-200/90 dark:bg-neutral-700/90' />
          <div className='h-4 w-[84%] animate-pulse rounded bg-neutral-200/90 dark:bg-neutral-700/90' />
        </div>
      </div>
    </div>
  )
}
