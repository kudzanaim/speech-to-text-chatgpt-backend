import { speechToTextHandler } from './speachToTextHandler.js'
import {Configuration, OpenAIApi} from 'openai'
import {config} from 'dotenv'
config()

const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY })
const openai = new OpenAIApi(configuration)

export const processAudio = async (req, res) => {
  const response = { poem: null, success: false, transcript: null}
  try {
    const transcript = await speechToTextHandler()
    if(transcript && !transcript?.includes('Error:')) {
      response.transcript = transcript
      const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{role: "user", content: transcript}],
      })
      response.poem = completion?.data?.choices[0]?.message?.content
      response.success = true
    } else {
      response.message = transcript
    }
  } catch (e) {
    console.log(`Error :: processAudio :: ${e.message}`)
    response.message = e.message
  }
  return res.send(response)
}