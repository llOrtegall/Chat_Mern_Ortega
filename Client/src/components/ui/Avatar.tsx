export const Avatar = ({ userId, username, online }: { userId: string, username: string, online: boolean }) => {
  const colors = ['bg-blue-300', 'bg-green-300', 'bg-yellow-300', 'bg-purple-300', 'bg-pink-300', 'bg-orange-300']

  const userIdBase10 = parseInt(userId, 13)
  const colorIndex = userIdBase10 % colors.length
  const color = colors[colorIndex]

  return (
    <div className={'w-8 h-8 relative rounded-full flex items-center ' + color}>
      <span className='w-full text-center font-semibold opacity-85'>{username[0].toUpperCase()}</span>
      {
        online === true
          ? <div className="absolute w-3 h-3 bg-green-500 border-2 border-gray-100 shadow-md shadow-gray-400 bottom-0 right-0 rounded-full "></div>
          : <div className="absolute w-3 h-3 bg-gray-400 border-2 border-gray-100 shadow-md shadow-gray-400 bottom-0 right-0 rounded-full "></div>
      }
    </div>
  )
}
