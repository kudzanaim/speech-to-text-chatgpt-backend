import speech from '@google-cloud/speech'
import {config} from 'dotenv'
import fs from 'fs'
config()

export const speechToTextHandler = async () => {
  console.log(`Log - speechCredentialKey :: speechToTextHandler :: Entry :: ${console.log({
    key: process?.env?.SA_KEY,
    type: typeof process?.env?.SA_KEY
  })}`)
  try {
    const serviceKey = process.env.ENVIROMENT === 'dev' ? JSON.parse(process?.env?.SA_KEY) : process?.env?.SA_KEY
    const client = new speech.SpeechClient({credentials: serviceKey})
    const [response] = await client.recognize({
      config: {
        sampleRateHertz: 48000,
        languageCode: 'en-US',
        encoding: '7bit'
      },
      audio: {content: fs.readFileSync('uploads/voiceRecording.wav').toString('base64')}
    })
    console.log(`Log - speechCredentialKey :: 
      speechToTextHandler :: ${response?.results?.map(result => result?.alternatives[0]?.transcript)?.join('\n')}`)
    return response.results.map(result => result?.alternatives[0]?.transcript)?.join('\n')
  } catch(e){
    console.log(`Error :: speechToTextHandler :: ${e.message}`)
    return e.message
  }
}