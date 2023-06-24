import speech from '@google-cloud/speech'
import {config} from 'dotenv'
import fs from 'fs'
import gcpScrets from '@google-cloud/secret-manager'

config()

export const speechToTextHandler = async () => {
  const speechCredentialKey = process.env.ENVIROMENT === 'dev' ? JSON.parse(process?.env?.SA_KEY) :  await((async()=>{
    const [secret] = await (new gcpScrets.v1.SecretManagerServiceClient().getSecret({ name: 'speechCredentialKey'}))
    return secret
  }))()
  console.log(`Log - speechCredentialKey :: speechToTextHandler :: ${JSON.stringify(speechCredentialKey)}`)
  try {
    const client = new speech.SpeechClient({credentials: speechCredentialKey})
    const [response] = await client.recognize({
      config: {
        sampleRateHertz: 48000,
        languageCode: 'en-US',
        encoding: '7bit'
      },
      audio: {content: fs.readFileSync('uploads/voiceRecording.wav').toString('base64')}
    })
    return response.results.map(result => result?.alternatives[0]?.transcript)?.join('\n')
  } catch(e){
    console.log(`Error :: speechToTextHandler :: ${e.message}`)
    return e.message
  }
}