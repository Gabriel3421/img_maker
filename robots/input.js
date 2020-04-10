const readline = require('readline-sync')
const state = require('./state')

function robot(){
  const content = {
    maximunSentences: 7
  }
  content.searchTerm = askAndReturnSearchTerm()
  content.prefix = askAndReturnPrefix()
  state.save(content)
  
  function askAndReturnSearchTerm(){
    return readline.question('digita ai tio: ')
  }
  
  function askAndReturnPrefix(){
    const prefixes = ['who is', 'what is']
    const selectedPrefixIndex = readline.keyInSelect(prefixes)
    const selectedPrefixText = prefixes[selectedPrefixIndex]
    return (selectedPrefixText)  
  }
}

module.exports = robot 

