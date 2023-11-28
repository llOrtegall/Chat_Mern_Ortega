export function Avatar ({ userId, username }) {
  return (
    <div className='w-8 h-8 bg-red-200 rounded-full flex items-center'>
      <div className="text-center w-full uppercase font-semibold">{username[0]}</div>
    </div>
  )
}
