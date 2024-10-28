export default function Avatar({ username, userId }: { username: string, userId: string }) {
  const colors = [
    'bg-red-200', 'bg-blue-200', 
    'bg-green-200', 'bg-yellow-200', 
    'bg-purple-200', 'bg-pink-200'
  ]

  const userIdBase10 = parseInt(userId, 16)
  const colorIndex = userIdBase10 % colors.length

  const color = colors[colorIndex]
  

  return (
    <div className={`w-10 h-10 ${color ? color : 'bg-white' } text-xl rounded-full flex items-center`}>
      <span className='w-full text-center opacity-60'>{username[0].toUpperCase()}</span>
    </div>
  )
}