import { default as test } from 'tape'
import postReviews from './index.js'
import testServer from '@twilson63/test-server'
import express from 'express'
import fetch from 'node-fetch'
import fetchMock from 'fetch-mock'

globalThis.fetch = fetchMock
  .post('https://play.hyper63.com/data/movie-reviews', {
    status: 201,
    body: { ok: true }
  })
  .sandbox()

const app = express()

test('ok', async t => {
  app.post('/api/movie-reviews', express.json(), postReviews)
  const server = testServer(app)
  const result = await fetch(server.url + '/api/movie-reviews', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json'},
    body: JSON.stringify({ title: 'My First Review', body: '...', rating: 3})
  }).then(res => res.json())

  t.ok(result.ok)

  server.close()
  
})
