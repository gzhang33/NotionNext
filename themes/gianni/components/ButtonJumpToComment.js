import { useEffect, useState } from 'react'

function easeInOutQuad(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
}

const ButtonJumpToComment = () => {
  const [hasComment, setHasComment] = useState(false)

  useEffect(() => {
    setHasComment(!!document.getElementById('comment'))
  }, [])

  if (!hasComment) return null

  const handleClick = () => {
    const el = document.getElementById('comment')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <button className='gianni-float-btn' onClick={handleClick} title='Jump to comment'>
      <i className='fa-regular fa-comment text-xs' />
    </button>
  )
}

export default ButtonJumpToComment
