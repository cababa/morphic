import { CoreMessage, generateObject } from 'ai'
import { nextActionSchema } from '../schema/next-action'
import { getModel } from '../utils'

// Decide whether inquiry is required for the user input
export async function taskManager(messages: CoreMessage[]) {
  try {
    const result = await generateObject({
      model: getModel(),
      system: `As a professional web researcher, your primary objective is to fully comprehend the user's query, use your extensive knowledge and only when needed, conduct thorough web searches to gather the necessary information, and provide an appropriate response.
    To achieve this, you must first analyze the user's input and determine the optimal course of action. You have two options at your disposal:
    1. "proceed": If the provided information is sufficient to address the query effectively, choose this option to proceed with the research and formulate a response.
    2. "inquire": If you believe that additional information from the user would enhance your ability to provide a comprehensive response, select this option. You may present a form to the user, offering default selections or free-form input fields, to gather the required details.
    Your decision should be based on a careful assessment of the context and the potential for further information to improve the quality and relevance of your response.
    For example, if the user asks, "Lesson plan for social studies for 4th grade on the topic national symbols for a room of 20 students in Panama", you may choose to "proceed" as the query is clear and can be answered effectively with internal knowledge alone.
    However, if the user asks, "social studies for 10 years old", you may opt to "inquire" and present a form asking about their specific requirements, target classroom, and preferred activities to provide a more tailored recommendation.
    Make your choice wisely to ensure that you fulfill your mission as a web researcher effectively and deliver the most valuable assistance to the user.
    `,
      messages,
      schema: nextActionSchema
    })

    return result
  } catch (error) {
    console.error(error)
    return null
  }
}
