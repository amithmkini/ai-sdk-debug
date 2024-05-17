import "server-only"

import {
  CoreMessage,
} from "ai"
import {
  createAI,
  createStreamableUI,
  getAIState
} from "ai/rsc"
import { nanoid } from "nanoid"

export type AIState = Array<CoreMessage>

export type UIState = {
  id: string
  display: React.ReactNode
}[]


export const dynamic = "force-dynamic"


async function askLLM(iteration: number, response: any) {
  const result = createStreamableUI(<div>{"Starting from: " + iteration}</div>);
  response.append(result.value);
  
  // Simulate multiple calls to the API and responses
  // IIFE
  (async () => {
    // Wait for 2 seconds before responding
    await new Promise((resolve) => setTimeout(resolve, 2000))
    result.done(<div>{"Response from: " + iteration}</div>)
    // Ask AI 3 times before ending the conversation
    if (iteration < 2) {
      await askLLM(iteration + 1, response)
    } else {
      response.done()
    }
  })();
}

async function submitUserMessage() {
  "use server"

  const response = createStreamableUI(<div>Testing</div>)
  await askLLM(0, response)

  return {
    id: nanoid(),
    display: response.value
  }
}


export const AI = createAI<AIState, UIState>({
  actions: {
    submitUserMessage
  },
  initialUIState: [],
  initialAIState: [],
  onGetUIState: async () => {
    "use server"

    // Honestly, this is only needed because I have sample
    // data in the Chat component. In a real-world scenario,
    // you would be loading data from DB or some other source.
    const aiState = getAIState() as AIState
    const uiState = aiState.map((message) => {
      return {
        id: nanoid(),
        display: <div>TESTING</div>
      }
    })

    return uiState
  }
})

