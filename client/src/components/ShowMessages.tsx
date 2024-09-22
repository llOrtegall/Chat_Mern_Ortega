import { Messages } from "../types/type"

interface ShowMessagesProps {
  messages: Messages[]
  id: string
  refScroll: React.RefObject<HTMLDivElement>
}

export const ShowMessages = ({ messages, id, refScroll}: ShowMessagesProps) => {
  return (
    <div className='relative h-full'>
      <div className='overflow-y-auto absolute top-0 left-0 right-0 bottom-4'>
        {
          messages.map(({ text, sender }, index) => (
            <div key={index} className={(sender === id ? 'text-right' : 'text-left')}>
              <div className={'text-left inline-block p-2 my-2 rounded-md text-sm ' +
                (sender === id ? 'bg-blue-500 text-white ' : 'bg-white text-gray-500')}>
                {text}
              </div>
            </div>
          ))
        }
        <div ref={refScroll}></div>
      </div>
    </div>
  )
}