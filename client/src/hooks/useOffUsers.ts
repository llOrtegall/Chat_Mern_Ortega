import { OfflineUser, OnlineUser } from '../types/type'
import { useEffect, useState } from 'react'
import axios from 'axios'

async function getOnlinePeople(): Promise<OfflineUser[]> {
  const response = await axios.get('/people')
  return response.data as OfflineUser[]
}

export const useOffUsers = ({ id, onlinePeople }: { id: string, onlinePeople: OnlineUser[] }) => {
  const [offlinePeople, setOfflinePeople] = useState<OfflineUser[]>([])

  useEffect(() => {
    getOnlinePeople()
      .then(onlineP => {
        const offlinePeople = onlineP.filter(p => p._id !== id).filter(p => !onlinePeople.find(op => op.userId === p._id))
        setOfflinePeople(offlinePeople)
      })
      .catch(error => {
        console.log(error)
      })

  }, [onlinePeople])

  return { offlinePeople }

}