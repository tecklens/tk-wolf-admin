import React, {createContext, useEffect, useMemo} from 'react'
import useWs from "@/hooks/useWs.ts";

const EventContext = createContext<any>(null);

const EventProvider = ({children}: { children: React.ReactNode }) => {
  const {msg, sendMessage} = useWs()

  useEffect(() => {
    console.log('msg' , msg)
    // sendMessage(JSON.stringify({
    //   "message": "hello",
    //   "event": "message"
    // }))
  }, [msg])

  const contextValue = useMemo(
    () => ({
      sendMessage,
    }),
    [sendMessage]
  );

  return (
    <EventContext.Provider value={contextValue}>{children}</EventContext.Provider>
  );
};

export default EventProvider;