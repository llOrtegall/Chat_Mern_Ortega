export const Avatar = ({ userId, username }: { userId: string, username: string}) => {
  const colors = ['bg-blue-300', 'bg-green-300', 'bg-yellow-300', 'bg-purple-300', 'bg-pink-300', 'bg-orange-300']

  const userIdBase10 = parseInt(userId, 13)
  const colorIndex = userIdBase10 % colors.length
  const color = colors[colorIndex]

  return (
    <div className={'w-8 h-8  rounded-full flex items-center ' + color}>
      <span className='w-full text-center font-semibold opacity-85'>{username[0].toUpperCase()}</span>
    </div>
  )
}
