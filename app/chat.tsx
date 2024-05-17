"use client"

import { type AI } from "@/actions"
import { useActions, useUIState } from "ai/rsc"


export default function Chat() {
  const [messages, setMessages] = useUIState<typeof AI>()
  const { submitUserMessage } = useActions()

  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const responseMessage = await submitUserMessage()
    setMessages(currentMessages => [
      ...currentMessages,
      responseMessage
    ])
  }

  return (
    <div className="flex flex-col gap-4 p-4 bg-gray-100 h-full w-full">
      <div className="max-w-2xl px-4">
        {messages.map((message) => {
          if (message.display === null) return null
          if (Array.isArray(message.display) && 
              !message.display.some(
                item => item !== null && item !== undefined)) {
            return null
          }

          return (
            <div key={message.id} className="flex flex-col gap-2 py-2">
              {message.display !== null && message.display}
            </div>
          )
        })}
      </div>
      <form onSubmit={handleOnSubmit} method="post">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" 
          type="submit">Send</button>
      </form>
    </div>
  )
}