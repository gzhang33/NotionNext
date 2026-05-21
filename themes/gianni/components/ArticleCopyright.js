import { useGlobal } from '@/lib/global'
import { siteConfig } from '@/lib/config'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import CONFIG from '../config'

const ArticleCopyright = ({ post }) => {
  const { locale } = useGlobal()
  const router = useRouter()
  const [url, setUrl] = useState('')

  useEffect(() => {
    setUrl(window.location.href)
  }, [router.asPath])

  if (!siteConfig('GIANNI_ARTICLE_COPYRIGHT', null, CONFIG)) {
    return null
  }

  return (
    <div className='gianni-copyright mt-6'>
      <div>
        <strong>{locale.COMMON.AUTHOR}</strong>
        {siteConfig('AUTHOR')}
      </div>
      <div className='break-all'>
        <strong>{locale.COMMON.URL}</strong>
        <a href={url} target='_blank' rel='noreferrer'>
          {url}
        </a>
      </div>
      <div>
        <strong>{locale.COMMON.COPYRIGHT}</strong>
        {post?.copyright || locale.COMMON.COPYRIGHT_NOTICE}
      </div>
    </div>
  )
}

export default ArticleCopyright
