/*
 * SELAH — Bible, Prayer & Devotion
 * Browser application controller for bible-app-ui.html
 *
 * API key stays on the server.
 * Default API proxy: /api/bible/v1
 * Browser data: localStorage (device-local only).
 */

;(() => {
  'use strict'

  const CONFIG = Object.freeze({
    bibleId: 'a6aee10bb058511c-02',
    apiBaseUrl: '/api/bible/v1',
    requestTimeoutMs: 18000,
    searchLimit: 12,
    cacheTtlMs: 5 * 60 * 1000,
    storageKey: 'selah.app.v1',
    fumsScriptUrl: 'https://pkg.api.bible/fumsV3.min.js',

    // Development only. Never enable with a production API key.
    directApiForLocalTesting: false,
    directApiKey: '',
    directApiBaseUrl: 'https://rest.api.bible/v1'
  })

  const BOOK_LABELS = {
    GEN: 'Genesis',
    EXO: 'Exodus',
    LEV: 'Leviticus',
    NUM: 'Numbers',
    DEU: 'Deuteronomy',
    JOS: 'Joshua',
    JDG: 'Judges',
    RUT: 'Ruth',
    '1SA': '1 Samuel',
    '2SA': '2 Samuel',
    '1KI': '1 Kings',
    '2KI': '2 Kings',
    '1CH': '1 Chronicles',
    '2CH': '2 Chronicles',
    EZR: 'Ezra',
    NEH: 'Nehemiah',
    EST: 'Esther',
    JOB: 'Job',
    PSA: 'Psalms',
    PRO: 'Proverbs',
    ECC: 'Ecclesiastes',
    SNG: 'Song of Solomon',
    ISA: 'Isaiah',
    JER: 'Jeremiah',
    LAM: 'Lamentations',
    EZK: 'Ezekiel',
    DAN: 'Daniel',
    HOS: 'Hosea',
    JOL: 'Joel',
    AMO: 'Amos',
    OBA: 'Obadiah',
    JON: 'Jonah',
    MIC: 'Micah',
    NAM: 'Nahum',
    HAB: 'Habakkuk',
    ZEP: 'Zephaniah',
    HAG: 'Haggai',
    ZEC: 'Zechariah',
    MAL: 'Malachi',
    MAT: 'Matthew',
    MRK: 'Mark',
    LUK: 'Luke',
    JHN: 'John',
    ACT: 'Acts',
    ROM: 'Romans',
    '1CO': '1 Corinthians',
    '2CO': '2 Corinthians',
    GAL: 'Galatians',
    EPH: 'Ephesians',
    PHP: 'Philippians',
    COL: 'Colossians',
    '1TH': '1 Thessalonians',
    '2TH': '2 Thessalonians',
    '1TI': '1 Timothy',
    '2TI': '2 Timothy',
    TIT: 'Titus',
    PHM: 'Philemon',
    HEB: 'Hebrews',
    JAS: 'James',
    '1PE': '1 Peter',
    '2PE': '2 Peter',
    '1JN': '1 John',
    '2JN': '2 John',
    '3JN': '3 John',
    JUD: 'Jude',
    REV: 'Revelation'
  }

  const DAILY_VERSES = [
    'PSA.91.1',
    'PSA.23.1',
    'JHN.3.16',
    'PRO.3.5',
    'ROM.8.28',
    'ISA.41.10',
    'PSA.27.1',
    'PHP.4.6',
    'PSA.121.1',
    'MAT.11.28',
    'PSA.34.8',
    'JOS.1.9',
    '2CO.5.7',
    'PSA.46.1',
    'ROM.12.2',
    'HEB.11.1',
    'JHN.14.27',
    'PSA.37.5',
    'ISA.40.31',
    '1PE.5.7',
    'PSA.118.24',
    'GAL.5.22',
    'EPH.6.10',
    'COL.3.15',
    'PSA.16.8',
    'MIC.6.8',
    'DEU.31.8',
    'PSA.100.5',
    'PSA.139.14',
    'JER.29.11'
  ]

  const DAILY_DEVOTIONS = [
    {
      title: 'Stay close to the Source',
      body: 'A strong spiritual life is formed through daily connection, not occasional effort. Return to Scripture, make space to listen, and carry one truth into the choices you make today.',
      quote: 'Abide in me, and I in you.',
      reference: 'JOHN 15:4'
    },
    {
      title: 'Trust God with the next step',
      body: 'You do not need to see the whole road before taking the next faithful step. Bring your plans before God, listen to His Word, and move forward with humility and confidence.',
      quote: 'Trust in the LORD with all thine heart.',
      reference: 'PROVERBS 3:5'
    },
    {
      title: 'Rest under His care',
      body: 'Make room to remember that you are not carrying every concern alone. Prayer turns your attention toward the One who sees you, sustains you, and invites you to rest in His care.',
      quote: 'Cast thy burden upon the LORD.',
      reference: 'PSALM 55:22'
    },
    {
      title: 'Choose peace today',
      body: 'Peace grows as your thoughts return to what is true, gracious, and worthy of attention. Pause, pray, and let the wisdom of Scripture shape your response to today’s pressures.',
      quote: 'And the peace of God... shall keep your hearts and minds.',
      reference: 'PHILIPPIANS 4:7'
    },
    {
      title: 'Grow through the waiting',
      body: 'Waiting is not wasted when it is lived with God. Keep doing what is right, remain rooted in His promises, and allow patience to deepen your character.',
      quote: 'Let patience have her perfect work.',
      reference: 'JAMES 1:4'
    },
    {
      title: 'Walk in wisdom',
      body: 'Before decisions become actions, make space for Scripture, prayer, wise counsel, and honest reflection. God’s wisdom helps you choose what is good and build what lasts.',
      quote: 'If any of you lack wisdom, let him ask of God.',
      reference: 'JAMES 1:5'
    },
    {
      title: 'Let gratitude shape your day',
      body: 'Gratitude does not deny difficulty; it remembers God’s goodness in the middle of real life. Notice the gifts already present and respond with a thankful heart.',
      quote: 'In every thing give thanks.',
      reference: '1 THESSALONIANS 5:18'
    }
  ]

  const PLAN_READINGS = {
    'protection-7': [
      'PSA.91',
      'PSA.121',
      'PSA.27',
      'PSA.34',
      'PSA.23',
      'ISA.41',
      'ROM.8'
    ],
    'wisdom-14': [
      'PRO.1',
      'PRO.2',
      'PRO.3',
      'JAS.1',
      'PRO.4',
      'PRO.8',
      'PRO.9',
      'PRO.10',
      'ECC.3',
      'PSA.111',
      'COL.1',
      'EPH.5',
      'ROM.12',
      'JAS.3'
    ]
  }

  const $ = (selector, root = document) => root.querySelector(selector)

  const $$ = (selector, root = document) =>
    Array.from(root.querySelectorAll(selector))

  function defaultStorage () {
    return {
      savedVerses: [],
      prayers: [],
      journal: [],
      completedDays: [],
      plans: {},
      settings: {
        readerFontSize: 17,
        reminderTime: '',
        reminderEnabled: false
      },
      reminderLastShown: ''
    }
  }

  function loadStorage () {
    try {
      const raw = localStorage.getItem(CONFIG.storageKey)

      if (!raw) return defaultStorage()

      const parsed = JSON.parse(raw)
      const defaults = defaultStorage()

      return {
        ...defaults,
        ...parsed,
        settings: {
          ...defaults.settings,
          ...(parsed.settings || {})
        },
        savedVerses: Array.isArray(parsed.savedVerses)
          ? parsed.savedVerses
          : [],
        prayers: Array.isArray(parsed.prayers) ? parsed.prayers : [],
        journal: Array.isArray(parsed.journal) ? parsed.journal : [],
        completedDays: Array.isArray(parsed.completedDays)
          ? parsed.completedDays
          : [],
        plans:
          parsed.plans && typeof parsed.plans === 'object' ? parsed.plans : {}
      }
    } catch (error) {
      console.warn('Selah: local storage could not be read.', error)
      return defaultStorage()
    }
  }

  const state = {
    bibleId: CONFIG.bibleId,
    books: [],
    chapters: [],
    currentChapter: null,
    currentDailyVerse: null,
    currentSearch: '',
    cache: new Map(),
    reminderCheckTimer: null,
    modal: null,
    storage: loadStorage(),
    lastFocus: null
  }

  function persist () {
    try {
      localStorage.setItem(CONFIG.storageKey, JSON.stringify(state.storage))

      return true
    } catch (error) {
      console.warn('Selah: local storage could not be saved.', error)

      showToast(
        'This browser could not save data. Check storage settings or available space.',
        'error'
      )

      return false
    }
  }

  function dateKey (date = new Date()) {
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const d = String(date.getDate()).padStart(2, '0')

    return `${y}-${m}-${d}`
  }

  function dateLabel (
    date = new Date(),
    options = {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }
  ) {
    return new Intl.DateTimeFormat(undefined, options).format(date)
  }

  function escapeHtml (value) {
    return String(value ?? '').replace(
      /[&<>"']/g,
      char =>
        ({
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#39;'
        }[char])
    )
  }

  function showToast (message, type = 'success') {
    let region = $('#selah-toast-region')

    if (!region) {
      region = document.createElement('div')
      region.id = 'selah-toast-region'

      region.className =
        'fixed bottom-24 left-1/2 z-[100] flex w-[min(92vw,420px)] -translate-x-1/2 flex-col gap-2 lg:bottom-6'

      region.setAttribute('aria-live', 'polite')
      region.setAttribute('aria-atomic', 'false')

      document.body.append(region)
    }

    const toast = document.createElement('div')

    toast.className =
      'rounded-xl border px-4 py-3 text-sm font-semibold shadow-xl'

    toast.style.background = type === 'error' ? '#fff0ed' : '#fff9ef'

    toast.style.color = type === 'error' ? '#8c2f20' : '#4c3123'

    toast.style.borderColor = type === 'error' ? '#e9b8ae' : '#e1d1be'

    toast.textContent = message

    region.append(toast)

    window.setTimeout(() => toast.remove(), 4200)
  }

  function ensureFums () {
    window.fumsData = window.fumsData || []

    window.fums =
      window.fums ||
      function () {
        window.fumsData.push(arguments)
      }

    if (!document.querySelector(`script[src="${CONFIG.fumsScriptUrl}"]`)) {
      const script = document.createElement('script')

      script.src = CONFIG.fumsScriptUrl
      script.async = true

      script.onerror = () => {
        console.warn('Selah: API.Bible FUMS tracker could not be loaded.')
      }

      document.head.append(script)
    }
  }

  function trackFums (payload) {
    const token = payload?.meta?.fumsToken || payload?.meta?.fums

    if (!token) return

    try {
      window.fums('trackView', token)
    } catch (error) {
      console.warn('Selah: FUMS tracking could not be queued.', error)
    }
  }

  function apiUrl (path) {
    const direct = CONFIG.directApiForLocalTesting

    const base = direct ? CONFIG.directApiBaseUrl : CONFIG.apiBaseUrl

    if (!direct && !/^https?:\/\//i.test(base) && !base.startsWith('/')) {
      throw new Error(
        'API base URL must be an absolute URL or a same-origin path.'
      )
    }

    return `${base.replace(/\/$/, '')}/${String(path).replace(/^\//, '')}`
  }

  async function apiRequest (path, options = {}) {
    if (CONFIG.directApiForLocalTesting && !CONFIG.directApiKey) {
      throw new Error(
        'Add your API key to CONFIG.directApiKey for local testing only, or configure the secure backend proxy.'
      )
    }

    const controller = new AbortController()

    const timeout = window.setTimeout(
      () => controller.abort(),
      CONFIG.requestTimeoutMs
    )

    const headers = new Headers(options.headers || {})

    headers.set('Accept', 'application/json')

    if (CONFIG.directApiForLocalTesting) {
      headers.set('api-key', CONFIG.directApiKey)
    }

    try {
      const response = await fetch(apiUrl(path), {
        method: options.method || 'GET',
        headers,
        signal: options.signal || controller.signal,

        credentials: CONFIG.directApiForLocalTesting ? 'omit' : 'same-origin',

        cache: 'no-store'
      })

      const text = await response.text()

      let json

      try {
        json = text ? JSON.parse(text) : {}
      } catch {
        throw new Error(
          'The Bible service returned an unreadable response. Check your API proxy.'
        )
      }

      if (!response.ok) {
        const message =
          json?.message || json?.error?.message || json?.errors?.[0]?.message

        if (response.status === 401) {
          throw new Error(
            'Bible API authentication failed. Check the API key stored on your server.'
          )
        }

        if (response.status === 403) {
          throw new Error(
            'This Bible resource is not enabled for your API.Bible account or license.'
          )
        }

        if (response.status === 404) {
          throw new Error(
            'The requested Bible, book, chapter, or verse was not found.'
          )
        }

        if (response.status === 429) {
          throw new Error(
            'Bible API rate limit reached. Please try again shortly.'
          )
        }

        throw new Error(
          message || `Bible API request failed (${response.status}).`
        )
      }

      return json
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error(
          'The Bible request timed out. Check your connection and try again.'
        )
      }

      if (error instanceof TypeError) {
        throw new Error(
          'Could not reach the Bible service. Check your internet connection and backend proxy/CORS configuration.'
        )
      }

      throw error
    } finally {
      window.clearTimeout(timeout)
    }
  }

  function cacheGet (key) {
    const item = state.cache.get(key)

    if (!item || Date.now() - item.time > CONFIG.cacheTtlMs) {
      return null
    }

    return item.value
  }

  function cacheSet (key, value) {
    state.cache.set(key, {
      value,
      time: Date.now()
    })
  }

  function safeHtml (html) {
    const parser = new DOMParser()

    const doc = parser.parseFromString(
      `<body>${String(html || '')}</body>`,
      'text/html'
    )

    const allowed = new Set([
      'P',
      'DIV',
      'SPAN',
      'BR',
      'STRONG',
      'B',
      'EM',
      'I',
      'SUP',
      'SUB',
      'H1',
      'H2',
      'H3',
      'H4',
      'UL',
      'OL',
      'LI',
      'BLOCKQUOTE'
    ])

    const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_ELEMENT)

    const nodes = []

    while (walker.nextNode()) {
      nodes.push(walker.currentNode)
    }

    for (const node of nodes.reverse()) {
      if (!allowed.has(node.tagName)) {
        if (
          ['SCRIPT', 'STYLE', 'IFRAME', 'OBJECT', 'EMBED', 'SVG'].includes(
            node.tagName
          )
        ) {
          node.remove()
        } else {
          node.replaceWith(...Array.from(node.childNodes))
        }

        continue
      }

      for (const attr of Array.from(node.attributes)) {
        if (attr.name === 'class') continue
        node.removeAttribute(attr.name)
      }
    }

    return doc.body.innerHTML
  }

  function htmlToText (html) {
    const doc = new DOMParser().parseFromString(String(html || ''), 'text/html')

    return (doc.body.textContent || '').replace(/\s+/g, ' ').trim()
  }

  function getCurrentBibleName () {
    const selected = $('#bible-translation')?.selectedOptions?.[0]

    return selected?.textContent?.trim() || 'Selected Bible'
  }

  function markReadingActivity () {
    const today = dateKey()

    if (!state.storage.completedDays.includes(today)) {
      state.storage.completedDays.push(today)

      state.storage.completedDays = state.storage.completedDays.slice(-400)

      persist()
      renderReadingRhythm()
    }
  }

  function updateDateLabels () {
    const label = dateLabel()

    const mobileGreeting = $('#today > .mb-5 p')

    if (mobileGreeting) {
      mobileGreeting.textContent = label
    }

    const heroTag =
      $('#hero-title')?.parentElement?.querySelector('.text-white\\/65')

    if (heroTag) {
      heroTag.textContent = `• ${label}`
    }

    const mobileDay = document.querySelector('.lg\\:hidden .text-\\[11px\\]')

    if (mobileDay) {
      mobileDay.textContent = `${dateLabel(new Date(), {
        day: 'numeric'
      }).toUpperCase()} • KEEP GROWING`
    }
  }

  function updateProfileLabels () {
    const profileName = state.storage.settings.displayName || 'My space'

    $$('[data-action="open-profile"]').forEach(button => {
      const label = button.querySelector('span:last-child')

      if (label && button.textContent.includes('My space')) {
        label.textContent = profileName
      }
    })
  }

  function getBookLabel (bookId) {
    const book = state.books.find(item => item.id === bookId)

    return book?.name || book?.nameLocal || BOOK_LABELS[bookId] || bookId
  }

  function setSelectOptions (
    select,
    items,
    { valueKey = 'id', labelKey = 'name', placeholder } = {}
  ) {
    if (!select) return

    const previous = select.value
    const fragment = document.createDocumentFragment()

    if (placeholder) {
      const option = document.createElement('option')

      option.value = ''
      option.textContent = placeholder

      fragment.append(option)
    }

    items.forEach(item => {
      const option = document.createElement('option')

      option.value = item[valueKey]

      option.textContent = item[labelKey] || item.nameLocal || item[valueKey]

      fragment.append(option)
    })

    select.replaceChildren(fragment)

    if (items.some(item => item[valueKey] === previous)) {
      select.value = previous
    } else if (items.length) {
      select.value = items[0][valueKey]
    }
  }

  async function loadAccessibleBibles () {
    const select = $('#bible-translation')

    try {
      const cached = cacheGet('bibles')

      const payload = cached || (await apiRequest('/bibles'))

      cacheSet('bibles', payload)

      const bibles = Array.isArray(payload.data) ? payload.data : []

      if (!bibles.length) {
        throw new Error('No Bible translations are available to this API key.')
      }

      const selected =
        bibles.find(item => item.id === state.bibleId) || bibles[0]

      state.bibleId = selected.id

      setSelectOptions(
        select,
        bibles.map(item => ({
          id: item.id,
          name:
            `${item.nameLocal || item.name}` +
            `${item.abbreviationLocal ? ` (${item.abbreviationLocal})` : ''}`
        }))
      )

      if (select) select.value = state.bibleId

      const tag = $('#daily-verse .tag')

      if (tag) {
        tag.textContent =
          selected.abbreviationLocal ||
          selected.abbreviation ||
          selected.nameLocal ||
          selected.name
      }

      return bibles
    } catch (error) {
      console.error(error)

      if (select && !select.options.length) {
        const option = new Option('Selected Bible • API.Bible', CONFIG.bibleId)

        select.add(option)
      }

      showToast(error.message, 'error')

      return []
    }
  }

  async function loadBooks (bibleId, preferredBookId = 'PSA') {
    const select = $('#bible-book')
    const chapterSelect = $('#bible-chapter')

    if (select) select.disabled = true
    if (chapterSelect) chapterSelect.disabled = true

    try {
      const key = `books:${bibleId}`

      const payload =
        cacheGet(key) ||
        (await apiRequest(`/bibles/${encodeURIComponent(bibleId)}/books`))

      cacheSet(key, payload)

      state.books = Array.isArray(payload.data) ? payload.data : []

      if (!state.books.length) {
        throw new Error('No books were returned for this Bible.')
      }

      const options = state.books.map(book => ({
        id: book.id,
        name: book.nameLocal || book.name || BOOK_LABELS[book.id] || book.id
      }))

      setSelectOptions(select, options)

      if (state.books.some(book => book.id === preferredBookId)) {
        select.value = preferredBookId
      }

      state.bookId = select.value

      await loadChapters(bibleId, state.bookId, '91')
    } catch (error) {
      console.error(error)
      showToast(error.message, 'error')
    } finally {
      if (select) select.disabled = false
      if (chapterSelect) chapterSelect.disabled = false
    }
  }

  async function loadChapters (bibleId, bookId, preferredNumber = '1') {
    const select = $('#bible-chapter')

    if (select) select.disabled = true

    try {
      const key = `chapters:${bibleId}:${bookId}`

      const payload =
        cacheGet(key) ||
        (await apiRequest(
          `/bibles/${encodeURIComponent(bibleId)}/books/${encodeURIComponent(
            bookId
          )}/chapters`
        ))

      cacheSet(key, payload)

      state.chapters = Array.isArray(payload.data) ? payload.data : []

      if (!state.chapters.length) {
        throw new Error(`No chapters were found for ${getBookLabel(bookId)}.`)
      }

      const options = state.chapters.map(chapter => ({
        id: chapter.id,
        name: `Chapter ${chapter.number}`
      }))

      setSelectOptions(select, options)

      const preferred =
        state.chapters.find(
          chapter => String(chapter.number) === String(preferredNumber)
        ) || state.chapters[0]

      if (select) select.value = preferred.id

      state.chapterId = preferred.id

      await loadChapter(preferred.id, {
        scroll: false
      })
    } catch (error) {
      console.error(error)
      showToast(error.message, 'error')
    } finally {
      if (select) select.disabled = false
    }
  }

  function chapterVerseControls (chapterId, number) {
    const id = `${chapterId}.${number}`

    const wrapper = document.createElement('div')

    wrapper.className = 'mt-2 flex flex-wrap items-center gap-3 pl-9'

    const actions = [
      ['save', 'Save'],
      ['pray', 'Pray this verse'],
      ['share', 'Share']
    ]

    actions.forEach(([action, label]) => {
      const button = document.createElement('button')

      button.type = 'button'

      button.className =
        'text-[10px] font-bold text-[#9a5a2f] hover:text-bible-deep'

      button.dataset.verseAction = action
      button.dataset.verse = id

      button.textContent = label

      wrapper.append(button)
    })

    return wrapper
  }

  function renderChapterContent (container, chapter) {
    if (!container) return

    const raw = chapter.content || ''
    const clean = safeHtml(raw)

    const parsed = new DOMParser().parseFromString(
      `<body>${clean}</body>`,
      'text/html'
    )

    const paragraphs = Array.from(parsed.body.querySelectorAll('p'))

    const rendered = document.createDocumentFragment()

    let verseCount = 0

    paragraphs.forEach(paragraph => {
      const markers = Array.from(
        paragraph.querySelectorAll(
          '.v, [data-verse-number], .verse-number, sup.versenum'
        )
      )

      if (!markers.length) {
        const text = paragraph.textContent.trim()

        if (text) {
          const p = document.createElement('p')

          p.className = 'mb-3 font-serif text-[16px] leading-8 text-[#463329]'

          p.textContent = text

          rendered.append(p)
        }

        return
      }

      markers.forEach((marker, index) => {
        const number = Number((marker.textContent || '').match(/\d+/)?.[0])

        if (!Number.isInteger(number) || number < 1) return

        const range = document.createRange()

        try {
          range.setStartAfter(marker)

          if (markers[index + 1]) {
            range.setEndBefore(markers[index + 1])
          } else {
            range.setEnd(paragraph, paragraph.childNodes.length)
          }
        } catch {
          return
        }

        const verseText = range
          .cloneContents()
          .textContent.replace(/\s+/g, ' ')
          .trim()

        if (!verseText) return

        const article = document.createElement('article')

        article.className = 'verse-row'

        article.dataset.verseId = `${chapter.id}.${number}`

        const p = document.createElement('p')

        p.className = 'font-serif text-[17px] leading-[1.8] text-[#463329]'

        const badge = document.createElement('span')

        badge.className = 'verse-number'
        badge.textContent = String(number)

        p.append(badge, document.createTextNode(verseText))

        article.append(p, chapterVerseControls(chapter.id, number))

        rendered.append(article)

        verseCount += 1
      })
    })

    if (!verseCount) {
      const fallback = document.createElement('div')

      fallback.className =
        'prose max-w-none font-serif text-[17px] leading-8 text-[#463329]'

      fallback.innerHTML =
        clean ||
        '<p>Scripture content was not included in the API response.</p>'

      rendered.append(fallback)
    }

    container.replaceChildren(rendered)

    const copyright = document.createElement('p')

    copyright.className =
      'mt-5 border-t border-[#f0e6dc] pt-3 text-[10px] leading-5 text-bible-muted'

    copyright.textContent =
      chapter.copyright ||
      'Scripture text is provided by API.Bible. Translation copyright and usage terms apply.'

    container.append(copyright)
  }

  async function loadChapter (chapterId, options = {}) {
    const container = $('#bible-reading-content')
    const title = $('#reader-passage-title')
    const selectedChapter = $('#bible-chapter')
    const selectedBook = $('#bible-book')

    if (!chapterId) return

    if (container) {
      container.setAttribute('aria-busy', 'true')

      container.innerHTML =
        '<p class="rounded-xl bg-[#fff9f1] px-4 py-5 text-sm text-bible-muted">Loading Scripture…</p>'
    }

    try {
      const key = `chapter:${state.bibleId}:${chapterId}`

      const payload =
        cacheGet(key) ||
        (await apiRequest(
          `/bibles/${encodeURIComponent(
            state.bibleId
          )}/chapters/${encodeURIComponent(
            chapterId
          )}?content-type=html&include-verse-numbers=true&include-titles=true`
        ))

      cacheSet(key, payload)

      const chapter = payload.data

      if (!chapter) {
        throw new Error('The Bible API did not return chapter data.')
      }

      state.currentChapter = chapter

      state.chapterId = chapter.id || chapterId
      state.bookId = chapter.bookId || state.bookId

      trackFums(payload)

      if (title) {
        title.textContent =
          chapter.reference ||
          `${getBookLabel(state.bookId)} ${chapter.number || ''}`
      }

      if (selectedBook && selectedBook.value !== state.bookId) {
        selectedBook.value = state.bookId
      }

      if (
        selectedChapter &&
        Array.from(selectedChapter.options).some(
          option => option.value === state.chapterId
        )
      ) {
        selectedChapter.value = state.chapterId
      }

      renderChapterContent(container, chapter)

      const subline = $('#reader-passage-title')?.parentElement?.querySelector(
        'p'
      )

      if (subline) {
        subline.textContent = `${getCurrentBibleName()} • Bible ID: ${
          state.bibleId
        }`
      }

      markReadingActivity()

      if (options.scroll !== false) {
        $('#read-bible')?.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        })
      }

      if (options.highlightVerse) {
        highlightVerse(options.highlightVerse)
      }
    } catch (error) {
      console.error(error)

      if (container) {
        container.innerHTML = `<p class="rounded-xl border border-red-200 bg-red-50 px-4 py-5 text-sm text-red-800">${escapeHtml(
          error.message
        )}</p>`
      }

      showToast(error.message, 'error')
    } finally {
      if (container) {
        container.removeAttribute('aria-busy')
      }
    }
  }

  function highlightVerse (verseId) {
    window.setTimeout(() => {
      const target = $(`[data-verse-id="${CSS.escape(verseId)}"]`)

      if (target) {
        target.classList.add('is-highlighted')

        target.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        })
      }
    }, 100)
  }

  async function fetchVerse (verseId) {
    const payload = await apiRequest(
      `/bibles/${encodeURIComponent(state.bibleId)}/verses/${encodeURIComponent(
        verseId
      )}?content-type=text`
    )

    trackFums(payload)

    const data = payload.data || {}

    return {
      id: data.id || verseId,
      reference: data.reference || verseId,
      text: htmlToText(data.content || data.text || ''),
      copyright: data.copyright || ''
    }
  }

  function verseIdParts (verseId) {
    const match = String(verseId || '').match(/^(.+\.\d+)\.(\d+)$/)

    return match
      ? {
          chapterId: match[1],
          number: Number(match[2])
        }
      : null
  }

  function renderDailyDevotion () {
    const title = $('#devotional-title')
    const wrapper = $('#devotional-reading')

    if (!title || !wrapper) return

    const start = new Date(new Date().getFullYear(), 0, 0)

    const dayOfYear = Math.floor((new Date() - start) / 86400000)

    const item = DAILY_DEVOTIONS[dayOfYear % DAILY_DEVOTIONS.length]

    title.textContent = item.title

    wrapper.replaceChildren()

    const label = document.createElement('p')

    label.className =
      'text-[10px] font-extrabold uppercase tracking-[.13em] text-[#a17c60]'

    label.textContent = 'Today’s reflection'

    const body = document.createElement('p')

    body.className = 'mt-2 text-xs leading-6 text-bible-muted'

    body.textContent = item.body

    const quote = document.createElement('p')

    quote.className =
      'mt-3 border-l-2 border-[#d5a56e] pl-3 font-serif text-lg italic leading-6 text-bible-brown'

    quote.textContent = `“${item.quote}”`

    const reference = document.createElement('p')

    reference.className = 'mt-1 pl-3 text-[10px] font-extrabold text-[#9c6943]'

    reference.textContent = item.reference

    wrapper.append(label, body, quote, reference)
  }

  async function loadDailyVerse () {
    const index =
      Math.floor(
        (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) /
          86400000
      ) % DAILY_VERSES.length

    const verseId = DAILY_VERSES[index]

    try {
      const verse = await fetchVerse(verseId)

      state.currentDailyVerse = verse

      const section = $('#daily-verse')

      const quote =
        section?.querySelector('.bg-\\[\\#fff9f1\\] .font-serif') ||
        section?.querySelector('.relative.z-10 .font-serif')

      const reference = section?.querySelector('.relative.z-10 .mt-4.text-xs')

      if (quote && verse.text) {
        quote.textContent = verse.text
      }

      if (reference) {
        reference.textContent = `${verse.reference} • ${getCurrentBibleName()}`
      }
    } catch (error) {
      console.warn('Daily Scripture could not be refreshed:', error.message)
    }
  }

  function savedVerseExists (id) {
    return state.storage.savedVerses.some(
      item => item.id === id && item.bibleId === state.bibleId
    )
  }

  function saveVerse (verse) {
    if (!verse?.id) return

    if (savedVerseExists(verse.id)) {
      showToast('This verse is already in your saved list.')
      return
    }

    state.storage.savedVerses.unshift({
      ...verse,
      bibleId: state.bibleId,
      savedAt: new Date().toISOString()
    })

    state.storage.savedVerses = state.storage.savedVerses.slice(0, 300)

    persist()
    renderSavedVerses()

    showToast('Verse saved on this device.')
  }

  function renderSavedVerses () {
    const section = $('#saved')

    if (!section) return

    let list = $('#selah-saved-list', section)

    if (!list) {
      list = document.createElement('div')

      list.id = 'selah-saved-list'
      list.className = 'mt-4 space-y-2'

      const heading = section.querySelector(
        'div.flex.items-center.justify-between'
      )

      heading?.after(list)

      $$('.mt-4.rounded-xl, .mt-2.rounded-xl', section).forEach(node =>
        node.remove()
      )
    }

    list.replaceChildren()

    if (!state.storage.savedVerses.length) {
      const empty = document.createElement('p')

      empty.className =
        'rounded-xl bg-[#fff9f1] p-4 text-xs leading-5 text-bible-muted'

      empty.textContent =
        'Your saved verses will appear here. Save a verse while reading to keep it close.'

      list.append(empty)

      return
    }

    state.storage.savedVerses.forEach(item => {
      const card = document.createElement('article')

      card.className = 'rounded-xl bg-[#fff9f1] p-3.5'

      const verse = document.createElement('p')

      verse.className = 'font-serif text-[16px] leading-6 text-bible-brown'

      verse.textContent = `“${item.text}”`

      const row = document.createElement('div')

      row.className = 'mt-2 flex flex-wrap items-center justify-between gap-2'

      const ref = document.createElement('span')

      ref.className =
        'text-[9px] font-extrabold uppercase tracking-wider text-[#9c6943]'

      ref.textContent = item.reference

      const controls = document.createElement('div')

      controls.className = 'flex items-center gap-3'

      const open = document.createElement('button')

      open.type = 'button'
      open.className = 'text-[10px] font-bold text-[#9a5a2f]'

      open.dataset.action = 'open-saved-verse'
      open.dataset.verse = item.id
      open.textContent = 'Open'

      const remove = document.createElement('button')

      remove.type = 'button'
      remove.className = 'text-[10px] font-bold text-red-700'

      remove.dataset.action = 'remove-saved-verse'
      remove.dataset.verse = item.id
      remove.textContent = 'Remove'

      controls.append(open, remove)
      row.append(ref, controls)
      card.append(verse, row)
      list.append(card)
    })
  }

  async function handleVerseAction (action, verseId) {
    if (!verseId) return

    let verse

    try {
      const saved = state.storage.savedVerses.find(
        item => item.id === verseId && item.bibleId === state.bibleId
      )

      if (action === 'save' && saved) {
        return showToast('This verse is already saved.')
      }

      if (state.currentDailyVerse?.id === verseId) {
        verse = state.currentDailyVerse
      }

      if (!verse) {
        const row = $(`[data-verse-id="${CSS.escape(verseId)}"]`)

        const text = row
          ?.querySelector('p')
          ?.textContent?.replace(/^\s*\d+/, '')
          .trim()

        verse = {
          id: verseId,
          reference: verseId,
          text: text || ''
        }
      }

      if (!verse.text || action === 'share') {
        try {
          verse = await fetchVerse(verseId)
        } catch (error) {
          if (!verse.text) throw error
        }
      }

      if (action === 'save') {
        saveVerse(verse)
      } else if (action === 'pray') {
        const reference = $('#prayer-reference')
        const text = $('#prayer-text')

        if (reference) {
          reference.value = verse.reference || verseId
        }

        if (text) {
          text.value = `${text.value ? `${text.value}\n\n` : ''}${verse.text}`
        }

        $('#prayer-room')?.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        })

        text?.focus({
          preventScroll: true
        })

        showToast('Verse added to your prayer reflection.')
      } else if (action === 'share') {
        await shareText(`${verse.reference}\n${verse.text}`)
      }
    } catch (error) {
      showToast(error.message, 'error')
    }
  }

  async function shareText (text) {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Scripture',
          text
        })
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text)

        showToast('Scripture copied to clipboard.')
      } else {
        const area = document.createElement('textarea')

        area.value = text
        area.style.position = 'fixed'
        area.style.opacity = '0'

        document.body.append(area)

        area.select()

        const copied = document.execCommand('copy')

        area.remove()

        if (!copied) {
          throw new Error('Copy is not supported in this browser.')
        }

        showToast('Scripture copied to clipboard.')
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        showToast('Could not share this Scripture.', 'error')
      }
    }
  }

  function renderSearchResults (payload) {
    const container = $('#search-results')

    if (!container) return

    container.classList.remove('hidden')
    container.replaceChildren()

    const data = payload.data || {}

    const verses = Array.isArray(data.verses) ? data.verses : []

    const passages = Array.isArray(data.passages) ? data.passages : []

    const heading = document.createElement('div')

    heading.className =
      'mb-3 flex items-center justify-between gap-3 border-t border-[#eadccd] pt-4'

    const title = document.createElement('p')

    title.className = 'text-xs font-extrabold text-bible-deep'

    title.textContent = `${
      Number(data.total ?? verses.length + passages.length) ||
      verses.length + passages.length
    } search result(s)`

    const query = document.createElement('span')

    query.className = 'text-[10px] text-bible-muted'
    query.textContent = `For “${state.currentSearch}”`

    heading.append(title, query)
    container.append(heading)

    if (!verses.length && !passages.length) {
      const empty = document.createElement('p')

      empty.className = 'rounded-xl bg-[#fff9f1] p-4 text-xs text-bible-muted'

      empty.textContent =
        'No matching Scripture was found. Try a shorter keyword or a reference such as John 3:16.'

      container.append(empty)
      return
    }

    verses.forEach(item => {
      const card = document.createElement('article')

      card.className = 'mb-2 rounded-xl border border-[#eadccd] bg-white p-3.5'

      const ref = document.createElement('p')

      ref.className =
        'text-[10px] font-extrabold uppercase tracking-wider text-[#9c6943]'

      ref.textContent = item.reference || item.id

      const text = document.createElement('p')

      text.className = 'mt-2 font-serif text-[16px] leading-7 text-bible-brown'

      text.textContent = item.text || ''

      const row = document.createElement('div')

      row.className = 'mt-2 flex flex-wrap gap-3'

      const open = document.createElement('button')

      open.type = 'button'
      open.className = 'text-[10px] font-bold text-[#9a5a2f]'
      open.textContent = 'Open in reader'

      open.dataset.action = 'open-saved-verse'
      open.dataset.verse = item.id

      const save = document.createElement('button')

      save.type = 'button'
      save.className = 'text-[10px] font-bold text-[#9a5a2f]'
      save.textContent = 'Save'

      save.dataset.verseAction = 'save'
      save.dataset.verse = item.id

      const pray = document.createElement('button')

      pray.type = 'button'
      pray.className = 'text-[10px] font-bold text-[#9a5a2f]'
      pray.textContent = 'Pray this verse'

      pray.dataset.verseAction = 'pray'
      pray.dataset.verse = item.id

      row.append(open, save, pray)
      card.append(ref, text, row)

      container.append(card)
    })

    passages.forEach(item => {
      const card = document.createElement('article')

      card.className =
        'mb-2 rounded-xl border border-[#eadccd] bg-[#fff9f1] p-3.5'

      const ref = document.createElement('p')

      ref.className =
        'text-[10px] font-extrabold uppercase tracking-wider text-[#9c6943]'

      ref.textContent = item.reference || item.id

      const text = document.createElement('p')

      text.className = 'mt-2 text-xs leading-6 text-bible-brown'

      text.textContent = htmlToText(item.content || '')

      card.append(ref, text)
      container.append(card)
    })
  }

  async function searchScriptures (query) {
    const clean = String(query || '').trim()

    if (!clean) {
      return showToast('Enter a Bible reference or search term.', 'error')
    }

    const container = $('#search-results')

    state.currentSearch = clean

    if (container) {
      container.classList.remove('hidden')

      container.innerHTML =
        '<p class="rounded-xl bg-[#fff9f1] p-4 text-xs text-bible-muted">Searching Scripture…</p>'
    }

    $('#discover')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })

    try {
      const params = new URLSearchParams({
        query: clean,
        limit: String(CONFIG.searchLimit),
        sort: 'relevance'
      })

      const payload = await apiRequest(
        `/bibles/${encodeURIComponent(
          state.bibleId
        )}/search?${params.toString()}`
      )

      trackFums(payload)

      renderSearchResults(payload)
    } catch (error) {
      console.error(error)

      if (container) {
        container.innerHTML = `<p class="rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-800">${escapeHtml(
          error.message
        )}</p>`
      }
    }
  }

  function saveFormEntry (formType, values) {
    const now = new Date().toISOString()

    if (formType === 'prayer') {
      state.storage.prayers.unshift({
        id: cryptoRandomId(),
        ...values,
        createdAt: now
      })

      state.storage.prayers = state.storage.prayers.slice(0, 250)

      persist()
      renderPrayerEntries()

      showToast('Prayer saved on this device.')
    } else {
      state.storage.journal.unshift({
        id: cryptoRandomId(),
        ...values,
        createdAt: now
      })

      state.storage.journal = state.storage.journal.slice(0, 300)

      persist()
      renderJournalEntries()

      showToast('Journal entry saved on this device.')
    }
  }

  function cryptoRandomId () {
    if (window.crypto?.randomUUID) {
      return window.crypto.randomUUID()
    }

    return `entry-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
  }

  function createEntryCard ({ title, body, meta, removeAction, id }) {
    const card = document.createElement('article')

    card.className = 'rounded-xl border border-[#eadccd] bg-[#fff9f1] p-3.5'

    const top = document.createElement('div')

    top.className = 'flex items-start justify-between gap-3'

    const heading = document.createElement('p')

    heading.className = 'text-xs font-extrabold text-bible-deep'

    heading.textContent = title

    const remove = document.createElement('button')

    remove.type = 'button'

    remove.className = 'text-[10px] font-bold text-red-700'

    remove.textContent = 'Delete'

    remove.dataset.action = removeAction
    remove.dataset.entryId = id

    top.append(heading, remove)

    const content = document.createElement('p')

    content.className =
      'mt-2 whitespace-pre-wrap text-xs leading-6 text-bible-muted'

    content.textContent = body

    const foot = document.createElement('p')

    foot.className =
      'mt-2 text-[9px] font-bold uppercase tracking-wider text-[#9c6943]'

    foot.textContent = meta

    card.append(top, content, foot)

    return card
  }

  function ensureEntryList (id, formId) {
    let list = $(`#${id}`)

    if (!list) {
      list = document.createElement('div')

      list.id = id
      list.className = 'mt-4 space-y-2'

      $(`#${formId}`)?.after(list)
    }

    return list
  }

  function renderPrayerEntries () {
    const list = ensureEntryList('selah-prayer-entries', 'prayer-form')

    list.replaceChildren()

    const heading = document.createElement('p')

    heading.className =
      'text-[10px] font-extrabold uppercase tracking-wider text-[#a17c60]'

    heading.textContent = 'Saved prayer reflections'

    list.append(heading)

    if (!state.storage.prayers.length) {
      const p = document.createElement('p')

      p.className = 'text-xs text-bible-muted'
      p.textContent = 'Your saved prayers will appear here.'

      list.append(p)

      return
    }

    state.storage.prayers.slice(0, 12).forEach(entry => {
      list.append(
        createEntryCard({
          id: entry.id,
          removeAction: 'delete-prayer',

          title:
            `${entry.focus || 'Prayer'}` +
            `${entry.reference ? ` • ${entry.reference}` : ''}`,

          body: entry.text,

          meta: dateLabel(new Date(entry.createdAt), {
            dateStyle: 'medium',
            timeStyle: 'short'
          })
        })
      )
    })
  }

  function renderJournalEntries () {
    const list = ensureEntryList('selah-journal-entries', 'journal-form')

    list.replaceChildren()

    const heading = document.createElement('p')

    heading.className =
      'text-[10px] font-extrabold uppercase tracking-wider text-[#a17c60]'

    heading.textContent = 'Previous reflections'

    list.append(heading)

    if (!state.storage.journal.length) {
      const p = document.createElement('p')

      p.className = 'text-xs text-bible-muted'
      p.textContent = 'Your journal entries will appear here.'

      list.append(p)

      return
    }

    state.storage.journal.slice(0, 15).forEach(entry => {
      list.append(
        createEntryCard({
          id: entry.id,
          removeAction: 'delete-journal',

          title: entry.title || 'Untitled reflection',

          body: entry.entry,

          meta: `${dateLabel(new Date(entry.createdAt), {
            dateStyle: 'medium',
            timeStyle: 'short'
          })}${entry.isPrivate ? ' • Private on this device' : ''}`
        })
      )
    })
  }

  function renderReadingRhythm () {
    const now = new Date()

    const monday = new Date(now)

    monday.setHours(0, 0, 0, 0)

    const day = (monday.getDay() + 6) % 7

    monday.setDate(monday.getDate() - day)

    const week = Array.from({ length: 7 }, (_, index) => {
      const d = new Date(monday)

      d.setDate(monday.getDate() + index)

      return dateKey(d)
    })

    const completed = week.filter(key =>
      state.storage.completedDays.includes(key)
    ).length

    const rhythm = $('#rhythm-title')?.closest('section')

    if (!rhythm) return

    const status = rhythm.querySelector('.border-t p.text-xs')

    if (status) {
      status.textContent = `${completed} of 7 days`
    }

    const sub = rhythm.querySelector('.border-t p.mt-0\\.5')

    if (sub) {
      sub.textContent =
        completed >= 5
          ? 'You are building a steady reading habit.'
          : 'Every return to Scripture is a meaningful step.'
    }

    const progressText = rhythm.querySelector(
      '.border-t .text-xs.font-extrabold'
    )

    if (progressText) {
      progressText.textContent = `${completed} of 7 days`
    }

    const progressFill = document.querySelector('aside .progress-fill')

    if (progressFill) {
      progressFill.style.width = `${(completed / 7) * 100}%`
    }

    const sidebarCopy = document.querySelector('aside .progress-fill')
      ?.parentElement?.nextElementSibling

    if (sidebarCopy) {
      sidebarCopy.textContent = `${completed} of 7 weekly reading days completed`
    }
  }

  function renderPlanProgress () {
    $$('[data-plan-id]').forEach(button => {
      const planId = button.dataset.planId

      const count = Number(state.storage.plans[planId] || 0)

      const card = button.closest('article')

      const status = card?.querySelector('.mt-3 .text-\\[10px\\].font-semibold')

      if (status && PLAN_READINGS[planId]) {
        status.textContent = `${Math.min(
          count,
          PLAN_READINGS[planId].length
        )} days completed`
      }
    })
  }

  async function continuePlan (planId) {
    const readings = PLAN_READINGS[planId]

    if (!readings) {
      return showToast('This reading plan is not configured yet.', 'error')
    }

    const current = Number(state.storage.plans[planId] || 0)

    const reading = readings[Math.min(current, readings.length - 1)]

    const [bookId, chapterNo] = reading.split('.')

    state.storage.plans[planId] = Math.min(current + 1, readings.length)

    persist()
    renderPlanProgress()

    const bookSelect = $('#bible-book')

    if (
      bookSelect &&
      Array.from(bookSelect.options).some(option => option.value === bookId)
    ) {
      bookSelect.value = bookId

      await loadChapters(state.bibleId, bookId, chapterNo)

      showToast(`Reading plan opened: ${reading.replace('.', ' ')}`)
    } else {
      showToast(
        `Your plan's next reading is ${reading.replace(
          '.',
          ' '
        )}. The selected translation does not currently expose that book.`,
        'error'
      )
    }
  }

  function openModal (title, description, buildContent, actions = []) {
    closeModal()

    state.lastFocus = document.activeElement

    const overlay = document.createElement('div')

    overlay.className =
      'fixed inset-0 z-[110] flex items-center justify-center bg-[#140a05]/55 p-4'

    overlay.dataset.selahModal = 'true'

    const dialog = document.createElement('section')

    dialog.className =
      'w-full max-w-lg rounded-2xl border border-[#eadccd] bg-[#fffaf5] p-5 shadow-2xl'

    dialog.setAttribute('role', 'dialog')
    dialog.setAttribute('aria-modal', 'true')

    dialog.setAttribute('aria-labelledby', 'selah-modal-title')

    const header = document.createElement('div')

    header.className = 'flex items-start justify-between gap-4'

    const headingWrap = document.createElement('div')

    const h = document.createElement('h2')

    h.id = 'selah-modal-title'

    h.className = 'font-serif text-2xl font-semibold text-bible-deep'

    h.textContent = title

    const desc = document.createElement('p')

    desc.className = 'mt-1 text-xs leading-5 text-bible-muted'

    desc.textContent = description

    headingWrap.append(h, desc)

    const close = document.createElement('button')

    close.type = 'button'
    close.className = 'icon-btn shrink-0'

    close.setAttribute('aria-label', 'Close dialog')
    close.textContent = '×'

    close.addEventListener('click', closeModal)

    header.append(headingWrap, close)

    const content = document.createElement('div')

    content.className = 'mt-5 space-y-3'

    if (typeof buildContent === 'function') {
      buildContent(content)
    }

    const footer = document.createElement('div')

    footer.className = 'mt-6 flex flex-wrap justify-end gap-2'

    actions.forEach(action => {
      const button = document.createElement('button')

      button.type = 'button'

      button.className = action.primary ? 'primary-btn' : 'quiet-btn'

      button.textContent = action.label

      button.addEventListener('click', () => {
        action.onClick?.({
          overlay,
          dialog,
          content
        })
      })

      footer.append(button)
    })

    dialog.append(header, content, footer)
    overlay.append(dialog)

    document.body.append(overlay)

    overlay.addEventListener('click', event => {
      if (event.target === overlay) {
        closeModal()
      }
    })

    overlay.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        closeModal()
      }
    })

    state.modal = overlay

    close.focus()

    return {
      overlay,
      dialog,
      content,
      footer
    }
  }

  function closeModal () {
    state.modal?.remove()

    state.modal = null

    if (state.lastFocus?.isConnected) {
      state.lastFocus.focus()
    }
  }

  function showProfileModal () {
    openModal(
      'Your Selah space',

      'This version stores reflections in this browser only. It does not yet create user accounts or sync data across devices.',

      content => {
        const label = document.createElement('label')

        label.className = 'block text-xs font-bold text-bible-brown'

        label.textContent = 'Display name'

        const input = document.createElement('input')

        input.className = 'input-field mt-2'
        input.type = 'text'
        input.maxLength = 60

        input.value = state.storage.settings.displayName || ''

        input.placeholder = 'Enter a display name'

        label.append(input)

        content.append(label)

        const note = document.createElement('p')

        note.className =
          'rounded-xl bg-[#fff1df] p-3 text-xs leading-5 text-[#725c4b]'

        note.textContent =
          'For real accounts, private cloud storage, password recovery and cross-device sync, connect an authenticated backend and database.'

        content.append(note)
      },

      [
        {
          label: 'Close',
          onClick: closeModal
        },
        {
          label: 'Save name',
          primary: true,

          onClick: () => {
            const input = state.modal?.querySelector('input')

            state.storage.settings.displayName = input?.value.trim() || ''

            persist()

            updateProfileLabels()

            closeModal()

            showToast('Display name saved on this device.')
          }
        }
      ]
    )
  }

  function showNotificationsModal () {
    const supported = 'Notification' in window

    const permission = supported ? Notification.permission : 'not supported'

    openModal(
      'Notifications',

      'Manage reminders for your daily Scripture time.',

      content => {
        const status = document.createElement('div')

        status.className =
          'rounded-xl bg-[#fff1df] p-3 text-xs leading-5 text-[#725c4b]'

        status.textContent = supported
          ? `Browser notification permission: ${permission}. Notifications can be shown while this app is open; reliable reminders while it is closed require a service worker and server-side push setup.`
          : 'This browser does not support notifications.'

        content.append(status)

        const time = document.createElement('p')

        time.className = 'text-xs text-bible-muted'

        time.textContent = state.storage.settings.reminderEnabled
          ? `Your local reminder is set for ${state.storage.settings.reminderTime}.`
          : 'No daily reminder is currently enabled.'

        content.append(time)
      },

      [
        {
          label: 'Close',
          primary: true,
          onClick: closeModal
        }
      ]
    )
  }

  function showSettingsModal () {
    openModal(
      'Preferences & privacy',

      'Adjust this browser’s reading experience.',

      content => {
        const sizeLabel = document.createElement('label')

        sizeLabel.className = 'block text-xs font-bold text-bible-brown'

        sizeLabel.textContent = `Reader text size: ${state.storage.settings.readerFontSize}px`

        const range = document.createElement('input')

        range.type = 'range'
        range.min = '15'
        range.max = '24'
        range.step = '1'

        range.value = String(state.storage.settings.readerFontSize)

        range.className = 'mt-3 w-full accent-[#4c3123]'

        range.addEventListener('input', () => {
          sizeLabel.firstChild.textContent = `Reader text size: ${range.value}px`

          applyReaderSettings(Number(range.value))
        })

        sizeLabel.append(range)

        content.append(sizeLabel)

        const info = document.createElement('p')

        info.className =
          'rounded-xl bg-[#fff1df] p-3 text-xs leading-5 text-[#725c4b]'

        info.textContent =
          'Saved verses, prayer notes and journal entries are stored in localStorage on this device. They are not encrypted, backed up or synchronized. Avoid using this browser-only journal for highly sensitive information.'

        content.append(info)
      },

      [
        {
          label: 'Close',
          onClick: closeModal
        },
        {
          label: 'Save preferences',
          primary: true,

          onClick: () => {
            state.storage.settings.readerFontSize = Number(
              state.modal?.querySelector('input[type="range"]')?.value || 17
            )

            persist()

            applyReaderSettings(state.storage.settings.readerFontSize)

            closeModal()

            showToast('Reading preference saved.')
          }
        }
      ]
    )
  }

  function applyReaderSettings (size) {
    const content = $('#bible-reading-content')

    if (!content) return

    $$('.verse-row p', content).forEach(p => {
      p.style.fontSize = `${size}px`
    })
  }

  function showReaderOptions () {
    showSettingsModal()
  }

  function setPrayerCategory (category) {
    const select = $('#prayer-focus')

    const map = {
      Thanksgiving: 'gratitude',
      Family: 'family',
      Wisdom: 'wisdom',
      Protection: 'protection'
    }

    if (select && map[category]) {
      select.value = map[category]
    }

    const buttons = $$('[data-prayer-category]')

    buttons.forEach(button => {
      const active = button.dataset.prayerCategory === category

      button.classList.toggle('border-[#e4cdb5]', active)

      button.classList.toggle('bg-[#fff4e6]', active)

      button.classList.toggle('border-[#eadccd]', !active)

      button.classList.toggle('bg-white', !active)

      button.setAttribute('aria-pressed', String(active))
    })
  }

  async function configureReminder () {
    openModal(
      'Set a daily reminder',

      'Choose a time for a gentle reminder while Selah is open in this browser.',

      content => {
        const label = document.createElement('label')

        label.className = 'block text-xs font-bold text-bible-brown'

        label.textContent = 'Reminder time'

        const time = document.createElement('input')

        time.type = 'time'
        time.required = true

        time.className = 'input-field mt-2'

        time.value = state.storage.settings.reminderTime || '06:00'

        label.append(time)

        content.append(label)

        const note = document.createElement('p')

        note.className = 'text-xs leading-5 text-bible-muted'

        note.textContent =
          'A browser tab must be open for this basic local reminder to fire. For reminders when the app is closed, add web push notifications with a service worker and server.'

        content.append(note)
      },

      [
        {
          label: 'Cancel',
          onClick: closeModal
        },
        {
          label: 'Enable reminder',
          primary: true,

          onClick: async () => {
            const time = state.modal?.querySelector('input[type="time"]')?.value

            if (!time) {
              return showToast('Choose a reminder time.', 'error')
            }

            if (
              'Notification' in window &&
              Notification.permission === 'default'
            ) {
              try {
                await Notification.requestPermission()
              } catch {
                // Permission may be denied by the browser.
              }
            }

            state.storage.settings.reminderTime = time
            state.storage.settings.reminderEnabled = true

            persist()

            closeModal()

            startReminderChecker()

            showToast('Daily reminder saved for this browser.')
          }
        }
      ]
    )
  }

  function startReminderChecker () {
    if (state.reminderCheckTimer) {
      window.clearInterval(state.reminderCheckTimer)
    }

    if (
      !state.storage.settings.reminderEnabled ||
      !state.storage.settings.reminderTime
    ) {
      return
    }

    const check = () => {
      if (
        document.hidden ||
        !('Notification' in window) ||
        Notification.permission !== 'granted'
      ) {
        return
      }

      const now = new Date()

      const current = `${String(now.getHours()).padStart(2, '0')}:${String(
        now.getMinutes()
      ).padStart(2, '0')}`

      const today = dateKey()

      if (
        current === state.storage.settings.reminderTime &&
        state.storage.reminderLastShown !== today
      ) {
        try {
          new Notification('Your Selah moment', {
            body: 'Take a few minutes to read Scripture and reflect.',
            tag: 'selah-daily-reminder'
          })

          state.storage.reminderLastShown = today

          persist()
        } catch (error) {
          console.warn('Notification could not be displayed.', error)
        }
      }
    }

    check()

    state.reminderCheckTimer = window.setInterval(check, 30000)
  }

  async function openVerseInReader (verseId) {
    const parts = verseIdParts(verseId)

    if (!parts) {
      return showToast(
        'This reference could not be opened automatically.',
        'error'
      )
    }

    const bookId = parts.chapterId.split('.')[0]

    const bookSelect = $('#bible-book')

    if (
      bookSelect &&
      Array.from(bookSelect.options).some(option => option.value === bookId)
    ) {
      bookSelect.value = bookId

      await loadChapters(
        state.bibleId,
        bookId,
        parts.chapterId.split('.').at(-1)
      )
    } else {
      await loadChapter(parts.chapterId, { scroll: false })
    }

    highlightVerse(verseId)
  }

  function setActiveNavigation () {
    const sections = [
      'today',
      'read-bible',
      'discover',
      'reading-plans',
      'prayer-room',
      'journal',
      'saved'
    ]
      .map(id => document.getElementById(id))
      .filter(Boolean)

    if (!('IntersectionObserver' in window)) return

    const observer = new IntersectionObserver(
      entries => {
        const visible = entries
          .filter(entry => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]

        if (!visible) return

        const id = visible.target.id

        $$('a[href^="#"]').forEach(link => {
          const active = link.getAttribute('href') === `#${id}`

          if (
            link.classList.contains('nav-link') ||
            link.classList.contains('mobile-nav-item')
          ) {
            link.classList.toggle('active', active)

            if (active) {
              link.setAttribute('aria-current', 'page')
            } else {
              link.removeAttribute('aria-current')
            }
          }
        })
      },
      {
        rootMargin: '-20% 0px -65% 0px',
        threshold: [0, 0.2, 0.5]
      }
    )

    sections.forEach(section => {
      observer.observe(section)
    })
  }

  function handleAction (action, element) {
    switch (action) {
      case 'load-chapter':
      case 'load-full-chapter': {
        const chapterId = $('#bible-chapter')?.value || state.chapterId

        loadChapter(chapterId)

        break
      }

      case 'previous-chapter':
        if (state.currentChapter?.previous?.id) {
          loadChapter(state.currentChapter.previous.id)
        } else {
          moveChapter(-1)
        }

        break

      case 'next-chapter':
        if (state.currentChapter?.next?.id) {
          loadChapter(state.currentChapter.next.id)
        } else {
          moveChapter(1)
        }

        break

      case 'read-daily-verse': {
        const parts = verseIdParts(
          state.currentDailyVerse?.id || DAILY_VERSES[0]
        )

        if (parts) {
          openVerseInReader(state.currentDailyVerse.id)
        } else {
          $('#read-bible')?.scrollIntoView({
            behavior: 'smooth'
          })
        }

        break
      }

      case 'save-daily-verse':
        if (state.currentDailyVerse) {
          saveVerse(state.currentDailyVerse)
        } else {
          showToast(
            'The daily verse is still loading. Please try again.',
            'error'
          )
        }

        break

      case 'share-daily-verse':
        if (state.currentDailyVerse) {
          shareText(
            `${state.currentDailyVerse.reference}\n${state.currentDailyVerse.text}`
          )
        }

        break

      case 'clear-prayer':
        $('#prayer-form')?.reset()

        setPrayerCategory('Thanksgiving')

        showToast('Prayer form cleared.')

        break

      case 'save-prayer':
        $('#prayer-form')?.requestSubmit()

        break

      case 'save-journal':
        $('#journal-form')?.requestSubmit()

        break

      case 'open-notifications':
        showNotificationsModal()

        break

      case 'open-profile':
        showProfileModal()

        break

      case 'open-reader-settings':
        showReaderOptions()

        break

      case 'set-reading-reminder':
        configureReminder()

        break

      case 'continue-plan':
        continuePlan(element.dataset.planId)

        break

      case 'open-saved-verse':
        openVerseInReader(element.dataset.verse)

        break

      case 'remove-saved-verse':
        state.storage.savedVerses = state.storage.savedVerses.filter(
          item => item.id !== element.dataset.verse
        )

        persist()
        renderSavedVerses()

        showToast('Saved verse removed.')

        break

      case 'delete-prayer':
        state.storage.prayers = state.storage.prayers.filter(
          item => item.id !== element.dataset.entryId
        )

        persist()
        renderPrayerEntries()

        showToast('Prayer entry deleted.')

        break

      case 'delete-journal':
        state.storage.journal = state.storage.journal.filter(
          item => item.id !== element.dataset.entryId
        )

        persist()
        renderJournalEntries()

        showToast('Journal entry deleted.')

        break

      default:
        break
    }
  }

  function moveChapter (direction) {
    const index = state.chapters.findIndex(item => item.id === state.chapterId)

    const next = state.chapters[index + direction]

    if (next) {
      loadChapter(next.id)
    } else {
      showToast(
        direction > 0
          ? 'You are at the last chapter in this book.'
          : 'You are at the first chapter in this book.'
      )
    }
  }

  function bindEvents () {
    document.addEventListener('click', event => {
      const actionElement = event.target.closest('[data-action]')

      if (actionElement) {
        event.preventDefault()

        handleAction(actionElement.dataset.action, actionElement)

        return
      }

      const verseButton = event.target.closest('[data-verse-action]')

      if (verseButton) {
        event.preventDefault()

        handleVerseAction(
          verseButton.dataset.verseAction,
          verseButton.dataset.verse
        )

        return
      }

      const term = event.target.closest('[data-search-term]')

      if (term) {
        const input = $('#scripture-search-input')

        if (input) {
          input.value = term.dataset.searchTerm
        }

        searchScriptures(term.dataset.searchTerm)

        return
      }

      const topic = event.target.closest('[data-topic]')

      if (topic) {
        const query = topic.dataset.topic

        const input = $('#scripture-search-input')

        if (input) input.value = query

        searchScriptures(query)

        return
      }

      const category = event.target.closest('[data-prayer-category]')

      if (category) {
        setPrayerCategory(category.dataset.prayerCategory)
      }
    })

    document.addEventListener('click', event => {
      const anchor = event.target.closest(
        'a[href="#settings"], a[href="#profile"]'
      )

      if (!anchor) return

      event.preventDefault()

      if (anchor.getAttribute('href') === '#settings') {
        showSettingsModal()
      } else {
        showProfileModal()
      }
    })

    $('#scripture-search-form')?.addEventListener('submit', event => {
      event.preventDefault()

      searchScriptures($('#scripture-search-input')?.value)
    })

    $('#global-search')?.addEventListener('keydown', event => {
      if (event.key !== 'Enter') return

      event.preventDefault()

      const query = event.currentTarget.value

      const main = $('#scripture-search-input')

      if (main) main.value = query

      searchScriptures(query)
    })

    $('#global-search')?.addEventListener('change', event => {
      const query = event.currentTarget.value.trim()

      if (query) {
        const main = $('#scripture-search-input')

        if (main) main.value = query

        searchScriptures(query)
      }
    })

    $('#bible-translation')?.addEventListener('change', async event => {
      state.bibleId = event.target.value

      state.cache.clear()

      await loadBooks(state.bibleId, $('#bible-book')?.value || 'PSA')

      await loadDailyVerse()
    })

    $('#bible-book')?.addEventListener('change', event => {
      loadChapters(state.bibleId, event.target.value, '1')
    })

    $('#bible-chapter')?.addEventListener('change', event => {
      if (event.target.value) {
        loadChapter(event.target.value)
      }
    })

    $('#prayer-form')?.addEventListener('submit', event => {
      event.preventDefault()

      const text = $('#prayer-text')?.value.trim() || ''

      if (!text) {
        return showToast(
          'Write your prayer or reflection before saving.',
          'error'
        )
      }

      saveFormEntry('prayer', {
        focus:
          $('#prayer-focus')?.selectedOptions?.[0]?.textContent || 'Prayer',

        reference: $('#prayer-reference')?.value.trim() || '',

        text
      })

      event.currentTarget.reset()

      setPrayerCategory('Thanksgiving')
    })

    $('#journal-form')?.addEventListener('submit', event => {
      event.preventDefault()

      const title = $('#journal-title-input')?.value.trim() || ''

      const entry = $('#journal-entry')?.value.trim() || ''

      if (!entry) {
        return showToast('Write a reflection before saving.', 'error')
      }

      saveFormEntry('journal', {
        title,
        entry,
        isPrivate: Boolean($('#journal-private')?.checked)
      })

      event.currentTarget.reset()

      const checkbox = $('#journal-private')

      if (checkbox) checkbox.checked = true
    })

    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        startReminderChecker()
      }
    })
  }

  async function init () {
    ensureFums()

    updateDateLabels()

    renderDailyDevotion()

    bindEvents()

    renderSavedVerses()
    renderPrayerEntries()
    renderJournalEntries()

    renderReadingRhythm()
    renderPlanProgress()

    updateProfileLabels()

    applyReaderSettings(state.storage.settings.readerFontSize)

    setActiveNavigation()

    startReminderChecker()

    if (CONFIG.directApiForLocalTesting) {
      console.warn(
        'Selah is running in direct API testing mode. The API key is exposed to browser visitors. Do not deploy this configuration.'
      )
    }

    await loadAccessibleBibles()

    await loadBooks(state.bibleId, 'PSA')

    await loadDailyVerse()
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true })
  } else {
    init()
  }
})()
