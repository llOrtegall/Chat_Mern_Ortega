import { SendIcon } from './icons/SendIcon'

interface FormSensMsgProps {
  newMessageText: string
  setNewMessageText: (text: string) => void
  sendMessage: (e: React.FormEvent) => void
}

export const FormSensMsg = ({ newMessageText, sendMessage, setNewMessageText }: FormSensMsgProps) => {
  return (
    <form className='flex gap-2' onSubmit={sendMessage}>
      <input type='text' placeholder='type your message here'
        value={newMessageText} onChange={e => setNewMessageText(e.target.value)}
        className='bg-white border flex-grow p-2 rounded-md' />
      <button className='bg-blue-600 p-2 text-white rounded-md'>
        <SendIcon />
      </button>
    </form>
  )
}