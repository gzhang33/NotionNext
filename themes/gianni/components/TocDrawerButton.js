const TocDrawerButton = ({ onClick }) => {
  return (
    <button className='gianni-float-btn' onClick={onClick} aria-label='Table of Contents'>
      <i className='fas fa-list-ol text-xs' />
    </button>
  )
}

export default TocDrawerButton
