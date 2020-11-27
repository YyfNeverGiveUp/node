import { format } from "path"

import * as http from 'http'

const server = http.createServer((req, res) => {
  console.log(req.url)
  console.log('有人来了')
})


server.listen(3030)
console.log('yyf');