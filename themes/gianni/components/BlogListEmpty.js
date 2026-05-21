import { useGlobal } from '@/lib/global'

const BlogListEmpty = ({ currentSearch }) => {
  const { locale } = useGlobal()

  return (
    <div className='min-h-[60vh] flex items-center justify-center'>
      <div className='flex flex-col items-center gap-3' style={{ color: 'var(--text-muted)' }}>
        <i className='fa-regular fa-folder-open text-2xl' />
        <span className='text-sm'>
          {currentSearch ? `${locale.COMMON.NO_MORE} "${currentSearch}"` : locale.COMMON.NO_MORE}
        </span>
      </div>
    </div>
  )
}

export default BlogListEmpty
