const algorithmia = require('algorithmia')
const algorithmiaApiKey = require('../credentials/algorithmia.json').apiKey
const sentenceBoundaryDetection = require('sbd')

async function robot(content){
  await fetchContentFromWikipedia(content)
  sanitizeContent(content)
  breakContentIntoSentences(content)

  async function fetchContentFromWikipedia(content){
    const algorithmiaAuthenticated = algorithmia(algorithmiaApiKey)
    const wikiAlgorithm = algorithmiaAuthenticated.algo('web/WikipediaParser/0.1.2')
    const wikiResponse = await wikiAlgorithm.pipe(content.searchTerm)
    const wikiContent = wikiResponse.get()
    content.sourceContentOriginal = wikiContent.content
  }

  function sanitizeContent(content){
    const withoutBlankLinesAndMarkdown = removeBlankLinesAndMarkdown(content.sourceContentOriginal)
    const withoutDatesInParentheses = removeDatesInParentheses(withoutBlankLinesAndMarkdown) 
    content.sourceContentSanitize = withoutDatesInParentheses
    
    function removeBlankLinesAndMarkdown(text){
      const allLines = text.split('\n')
      const withoutBlankLinesAndMarkdown = allLines.filter((line) => {
        if(line.trim().length === 0 || line.trim().startsWith('=')){
          return false
        }
        return true
      })
      return withoutBlankLinesAndMarkdown.join(' ')
    }

    function removeDatesInParentheses(text){
      return text.replace(/\((?:\([^()]*\)|[^()])*\)/gm, '').replace(/  /g,' ')
    }
  }

  function breakContentIntoSentences(content){
    content.sentences = []
    const sentences = sentenceBoundaryDetection.sentences(content.sourceContentSanitize)
    sentences.forEach((sentence) => {
      content.sentences.push({
        text: sentence,
        keywords: [],
        image: []
      })
    })
  
  
  }
  
}

module.exports = robot 