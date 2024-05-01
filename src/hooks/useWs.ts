import useWebSocket from 'react-use-websocket'
import {useEffect, useMemo, useRef} from 'react'
import {useWsStore} from "@/lib/store/wsStore.ts";
import {useAuth} from "@/context/auth.tsx";

const socketUrl = import.meta.env.VITE_WS_URL
export default function useWs() {
  const didUnmount = useRef(false)
  const {token} = useAuth()
  const {update} = useWsStore()
  const {sendMessage, lastMessage, readyState} = useWebSocket(socketUrl, {
    onOpen: () => {
      console.log('opened')
    },
    //Will attempt to reconnect on all close events, such as server shutting down
    shouldReconnect: (closeEvent) => {
      console.log(closeEvent)
      return !didUnmount.current
    },
    onError: (err) => {
      console.log(err)
    },
    reconnectAttempts: 10,
    reconnectInterval: 3000,
    queryParams: {
      token : token,
      type: 'admin'
    }
  })

  useEffect(() => {
    update(readyState)
  }, [readyState, update])

  // useEffect(() => {
  //   if (sendMessage && token)
  //     sendMessage(JSON.stringify({
  //       event: 'join_room',
  //       message: {
  //         userId: 'token',
  //         email: 'token',
  //       },
  //     }))
  // }, [sendMessage, token])

  return useMemo(() => {
    const data = (lastMessage && lastMessage.data) ? JSON.parse(lastMessage.data) : null
    return {
      sendMessage,
      readyState,
      msg: data,
    }
  }, [readyState, sendMessage, lastMessage])
}