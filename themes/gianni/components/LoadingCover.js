import { useGlobal } from '@/lib/global'

const LoadingCover = () => {
  const { locale } = useGlobal()
  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className='flex flex-col items-center gap-3'>
        <div className='gianni-loading-spinner' />
        <span className='text-sm' style={{ color: 'var(--text-muted)' }}>
          {locale.COMMON.LOADING}
        </span>
      </div>
    </div>
  )
}

export default LoadingCover
