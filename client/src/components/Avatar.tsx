export default function Avatar({ username, userId, online }: { username: string, userId: string, online: boolean }) {
  const colors = [
    'bg-red-200', 'bg-blue-200',
    'bg-green-200', 'bg-yellow-200',
    'bg-purple-200', 'bg-pink-200'
  ]

  const userIdBase10 = parseInt(userId, 17)
  const colorIndex = userIdBase10 % colors.length

  const color = colors[colorIndex]

  return (
    <div className={`w-10 h-10 ${color ? color : 'bg-white'} relative text-xl rounded-full flex items-center`}>
      <span className='w-full text-center opacity-60 text-black'>{username[0].toUpperCase()}</span>
      <div className={`absolute rounded-full w-3 h-3 ${online ? 'bg-green-500' : 'bg-gray-500'} bottom-0 right-0 border shadow-md`}></div>
    </div>
  )
}