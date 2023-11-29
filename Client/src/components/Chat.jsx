import { useContext, useEffect, useState } from 'react'
import { uniqBy } from 'lodash'
import { Avatar } from './Avatar'
import { Logo } from './Logo'
import { UserContext } from '../UserContext'

export function Chat () {
  const [ws, setWs] = useState(null)
  const [onlinePeople, setOnlinePeople] = useState({})
  const [selectedContact, setSelectedContact] = useState(null)
  const [newMessageText, setNewMessageText] = useState('')
  const [messages, setMessages] = useState([])
  const { user } = useContext(UserContext)

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:4040')
    setWs(ws)
    ws.addEventListener('message', handleMessage)
  }, [])

  function showOnLinePeople (peopleArray) {
    const people = {}
    peopleArray.forEach(({ userId, username }) => {
      people[userId] = username
    })
    setOnlinePeople(people)
  }

  function handleMessage (e) {
    const messageData = JSON.parse(e.data)
    console.log({ e, messageData })
    if ('online' in messageData) {
      showOnLinePeople(messageData.online)
    } else if ('text' in messageData) {
      setMessages(prev => ([...prev, { ...messageData }]))
    }
  }

  function sendMessage (ev) {
    ev.preventDefault()
    ws.send(JSON.stringify({
      recipient: selectedContact,
      text: newMessageText
    }))
    setNewMessageText('')
    setMessages(prev => ([...prev, {
      text: newMessageText,
      sender: user.userId,
      recipient: selectedContact
    }]))
  }

  const onlinePeopleExcluOurUser = { ...onlinePeople }
  delete onlinePeopleExcluOurUser[user.userId]

  const messagesWithOutDupes = uniqBy(messages, 'id')

  return (
    <section className="flex h-screen">
      <div className="bg-blue-100 w-1/3">
        <Logo />
        {Object.keys(onlinePeopleExcluOurUser).map(userId => (
          <div onClick={() => setSelectedContact(userId)} key={userId} className={`border-b border-gray-100 flex items-center gap-2 cursor-pointer ${userId === selectedContact ? 'bg-blue-200' : ''}`}>
            {userId === selectedContact && (
              <div className='w-1 bg-blue-500 h-12 rounded-r-md'></div>
            )}
            <div className='flex gap-2 py-2 pl-4 items-center'>
              <Avatar username={onlinePeople[userId]} userId={userId} />
              <span className='text-gray-800'>{onlinePeople[userId]}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col bg-blue-300 w-2/3 p-2">
        <div className="flex-grow">
          {!selectedContact && (
            <div className='flex h-full items-center justify-center'>
              <div className='text-gray-500'>&larr; Select a contact from the sidebar</div>
            </div>
          )}
          {!!selectedContact && (
            <div className='overflow-auto'>{messagesWithOutDupes.map(message => (
              <div key={message.sender} className={(message.sender === user.userId ? 'text-right' : 'text-left')}>
                <div className={' ' + (message.sender === user.userId ? 'bg-blue-500 text-white p-2 m-2 rounded-md inline-block text-left' : 'bg-white text-gray-500 p-2 m-2 rounded-md inline-block')}>
                  sender: {message.sender} <br />
                  my id: {user.userId} <br />
                  {message.text}
                </div>
              </div>

            ))}</div>
          )}
        </div>
        {!!selectedContact && (
          <form className="flex gap-2" onSubmit={sendMessage}>
            <input type="text" placeholder="Type Your Message"
              className="bg-white border p-2 flex-grow rounded-md" value={newMessageText}
              onChange={ev => setNewMessageText(ev.target.value)} />
            <button type='submit' className="bg-blue-500 p-2 text-white rounded-md">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
