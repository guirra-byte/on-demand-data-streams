import { parentPort, threadId } from "node:worker_threads";
import * as fs from 'node:fs'

parentPort.on('message', (args) => {
  const exists = fs.existsSync(args[0])
  if (!exists) { throw new Error() }
  else {
    const time = new Date().toISOString()
    const chunks = fs.createReadStream(args[0])
    const chunkToOverwrite = fs.createWriteStream(args[1])

    chunks.on('data', (chunk) => {
      const truncateBuffer = chunk.toString()
      chunkToOverwrite.write(truncateBuffer)

      const timeEnd = new Date().toISOString()
      parentPort
      .postMessage(`Benchmark-${time}-->${timeEnd}`)
    })

    parentPort.emit('close')
  }
})