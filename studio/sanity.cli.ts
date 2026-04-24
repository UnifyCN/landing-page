import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'j4gu2dbr',
    dataset: 'production'
  },
  deployment: {
    autoUpdates: true,
    appId: 'h8w0uo9ptig5eku9uxfeupbh',
  }
})
