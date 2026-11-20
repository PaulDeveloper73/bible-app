const API_KEY = 'A70u9yULXJaSyfmgSDywk'
const BIBLE_ID = 'a6aee10bb058511c-02'

export const getBiblePassage = async passageId => {
  try {
    const url = `https://rest.api.bible/v1/bibles/${BIBLE_ID}/passages/${passageId}?content-type=text&fums-version=3`

    const response = await fetch(url, {
      headers: {
        'api-key': API_KEY,
        Accept: 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`)
    }

    const result = await response.json()

    console.log('\n' + result.data.reference)
    console.log(result.data.content)

    return result.data
  } catch (error) {
    console.error(error.message)
  }
}

// getBiblePassage('PSA.91.1-PSA.91.16')
