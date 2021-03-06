const algorithmia = require('algorithmia')
const algorithmiaApiKey = require('../credentials/algorithmia.json').apiKey
const sentenceBoundaryDetection = require('sbd')
const watsonApi = require('../credentials/watson-nlu.json')
const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
const { IamAuthenticator } = require('ibm-watson/auth');

const nlu = new NaturalLanguageUnderstandingV1({
  authenticator: new IamAuthenticator({ apikey: watsonApi.apikey }),
  version: '2018-04-05',
  url: watsonApi.url
});

const state = require('./state')

async function robot(){
  const content = state.load()
  await fetchContentFromWikipedia(content)
  sanitizeContent(content)
  breakContentIntoSentences(content)
  limitMaximumSentences(content)
  await fecthKeywordsOfAllSentences(content)

  state.save(content)

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

  function limitMaximumSentences(content){
    content.sentences = content.sentences.slice(0, content.maximunSentences)
  }

  async function fecthKeywordsOfAllSentences(content){
    for (const sentence of content.sentences){ 
      sentence.keywords = await fetchWatsonAndRturnKeywords(sentence.text)
    }
  } 

  async function fetchWatsonAndRturnKeywords(sentence){
    return new Promise ((resolve, reject) => {
     nlu.analyze(
       {
         html: sentence, // Buffer or String
         features: {
           keywords: {}
         }
       }, (error , response) =>{
          if(error){
            throw error
          }
          
          const keywords = response.result.keywords.map((keyword) => {
            return keyword.text
          })
          resolve(keywords)

          /*console.log(response)
          process.exit(0)*/
       })
    })
  }
  
}


module.exports = robot 