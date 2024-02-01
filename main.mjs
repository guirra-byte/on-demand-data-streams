// const input = process
//   .stdin
//   .on('data',
//     (input_data) => console.log(`input ${input_data}`))

// const output = process
//   .stdout
//   .on('data',
//     (output_data) => console.log(`output ${output_data}`))

//The data/events comming by left declarations has been ignored;
// input.pipe(output)

//Request and Response are Streams
import http from 'node:http'
import { Worker } from 'node:worker_threads'
import * as path from 'node:path'

const defaultPort = 3001

http.createServer((request, response) => {
  if (request.url.includes('/sse')) {
    if (request.method === 'GET') {
      response.writeHead(202, {
        "cache-control": 'no-cache',
        connection: 'keep-alive',
        'content-type': 'text/event-streams',
        location: `http://localhost:${defaultPort}/sse`
      }); console.log('SSE endpoint are listening!')

      response.on('finish', () => {
        console.log('sse fucionou...')
      })

      const readerWorker = new Worker('./workers/reader.worker.mjs')

      readerWorker.on('message', (msg) => {
        console.log(msg)
        // response.write(msg)
      }); readerWorker.once('close', () => {
        response.end()
        console.log('Terminou a execução...')
      })

      const [bigFilePath, outbigFilePath] = [
        path.resolve('./big.file'),
        path.resolve('./out-big.txt')
      ]

      readerWorker
        .postMessage([bigFilePath, outbigFilePath])
    }
  } 
}).listen(defaultPort,
  () => {
    console.log(`The server are running at: ${defaultPort}`);
    // http.get(`http://localhost:${defaultPort}/sse`)
  })