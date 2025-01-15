import { useUserContext } from '@/context/UserContext';
import { MessageCircleCodeIcon } from 'lucide-react';
import { OnlinePeople } from '@/types/interfaces';
import { Card, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { Button } from './ui/button';
import axios from 'axios';
import Avatar from './Avatar';

export function NavBar({ people, selected, funSelect }: { people: OnlinePeople[], selected: string | null, funSelect: React.Dispatch<React.SetStateAction<string | null>> }) {
  const { setUsername, setId } = useUserContext()

  const logOut = () => {
    axios.post('/logout')
      .then(() => {
        // setWs(null)
        setId(null)
        setUsername(null)
      })
  }

  return (
    <Card className='flex w-3/12 flex-col'>

      <header className='flex items-center justify-center gap-2 py-2'>
        <CardTitle className='py-1 text-2xl'>MernChat</CardTitle>
        <MessageCircleCodeIcon size={24} />
      </header>

      <Separator />

      <article className='flex flex-col flex-grow gap-2'>

        <div className='overflow-y-auto'>
          {
            people.map((person) => (
              <section
                key={person.userId}
                className={`flex w-full hover:bg-blue-200 text-gray-600 ${person.userId === selected ? 'bg-blue-300' : ''}`}>
                <div className={`w-1.5 rounded-r-md bg-blue-800 ${person.userId === selected ? 'visible' : 'hidden'}`}></div>
                <button onClick={() => funSelect(person.userId)}
                  className='w-full border-gray-100 py-2 flex items-center gap-3 mx-2'>
                  <Avatar online={true} userId={person.userId} username={person.username} />
                  <p>{person.username}</p>
                </button>
              </section>
            ))
          }

        </div>
      </article>

      <Separator />

      <footer className='flex justify-center py-2'>
        <Button onClick={logOut} >
          Log Out
        </Button>
      </footer>

    </Card >
  )
}