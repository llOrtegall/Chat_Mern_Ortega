export default function Avatar({ email, num }: { email: string, num: number }) {
  const colors = ['bg-cyan-500', 'bg-rose-500', 'bg-teal-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500']
  const colorIndex = num % colors.length
  const color = colors[colorIndex]

  return (
    <div className={`flex items-center justify-center w-10 h-10 ${color} rounded-full`}>
      <p className='text-white text-xl uppercase font-semibold'>{email[0]}</p>
    </div>
  )
}