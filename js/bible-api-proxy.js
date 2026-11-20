/*
 * SELAH — Secure API.Bible Proxy
 * Node.js 20+
 *
 * Install:
 * npm install express helmet express-rate-limit dotenv
 *
 * .env:
 * BIBLE_API_KEY=YOUR_REAL_API_KEY
 * PORT=3000
 * FRONTEND_ORIGIN=http://localhost:3000
 *
 * Run:
 * node bible-api-proxy.js
 */

'use strict'

require('dotenv').config()

const express = require('express')
const helmet = require('helmet')
const { rateLimit } = require('express-rate-limit')

const app = express()

const PORT = Number(process.env.PORT || 3000)
const API_KEY = process.env.BIBLE_API_KEY
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || ''

const UPSTREAM_BASE = 'https://rest.api.bible/v1/'
const UPSTREAM_TIMEOUT_MS = 15000

if (!API_KEY) {
  console.error('Missing BIBLE_API_KEY. Configure your .env file.')
  process.exit(1)
}

app.disable('x-powered-by')

app.use(
  helmet({
    contentSecurityPolicy: false
  })
)

const bibleRateLimit = rateLimit({
  windowMs: 60 * 1000,
  limit: 90,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: {
    error: 'Too many Bible requests. Please try again shortly.'
  }
})

function setCors (req, res) {
  const origin = req.get('origin')

  if (!origin) return true

  if (!FRONTEND_ORIGIN || origin !== FRONTEND_ORIGIN) {
    return false
  }

  res.setHeader('Access-Control-Allow-Origin', FRONTEND_ORIGIN)
  res.setHeader('Vary', 'Origin')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Accept, Content-Type')
  res.setHeader('Access-Control-Max-Age', '600')

  return true
}

app.use('/api/bible/v1', bibleRateLimit, async (req, res) => {
  if (!setCors(req, res)) {
    return res.status(403).json({
      error: 'Origin is not allowed.'
    })
  }

  if (req.method === 'OPTIONS') {
    return res.status(204).end()
  }

  if (req.method !== 'GET') {
    return res.status(405).json({
      error: 'Only GET requests are supported.'
    })
  }

  try {
    const relativeUrl = req.originalUrl.replace(/^\/api\/bible\/v1\/?/, '')

    const relativePath = relativeUrl.split('?')[0]

    // Restrict access to Bible resources required by Selah.
    const allowedPath =
      /^bibles(?:\/[A-Za-z0-9-]+(?:\/(?:books(?:\/[A-Za-z0-9.-]+\/chapters)?|chapters(?:\/[A-Za-z0-9.-]+)?|verses\/[A-Za-z0-9.-]+|passages\/[A-Za-z0-9.-]+|search))?)?$/

    if (!allowedPath.test(relativePath)) {
      return res.status(404).json({
        error: 'This API route is not enabled by the proxy.'
      })
    }

    const upstreamUrl = new URL(relativeUrl, UPSTREAM_BASE)

    const controller = new AbortController()

    const timeout = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS)

    let upstream

    try {
      upstream = await fetch(upstreamUrl, {
        method: 'GET',

        headers: {
          'api-key': API_KEY,
          Accept: 'application/json'
        },

        signal: controller.signal
      })
    } finally {
      clearTimeout(timeout)
    }

    const body = await upstream.text()

    res.status(upstream.status)

    res.setHeader(
      'Content-Type',
      upstream.headers.get('content-type') || 'application/json; charset=utf-8'
    )

    res.setHeader('Cache-Control', 'no-store')

    return res.send(body)
  } catch (error) {
    const timedOut = error?.name === 'AbortError'

    console.error(
      'API.Bible proxy error:',
      timedOut ? 'Upstream timeout' : error.message
    )

    return res.status(timedOut ? 504 : 502).json({
      error: timedOut
        ? 'The Bible service timed out. Please try again.'
        : 'The Bible service is temporarily unavailable.'
    })
  }
})

// Health check
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    application: 'Selah Bible API Proxy'
  })
})

app.listen(PORT, () => {
  console.log(`Selah API.Bible proxy running on port ${PORT}`)

  console.log(`Health check: http://localhost:${PORT}/health`)
})
