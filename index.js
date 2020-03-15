const readline = require('readline-sync')
const robots = {
  text: require('./robots/text.js')
}

async function start(){
  const content = {}
  content.searchTerm = askAndReturnSearchTerm()
  content.prefix = askAndReturnPrefix()
  
  await robots.text(content)
  
  function askAndReturnSearchTerm(){
    return readline.question('digita ai tio: ')
  }

  function askAndReturnPrefix(){
    const prefixes = ['who is', 'what is']
    const selectedPrefixIndex = readline.keyInSelect(prefixes)
    const selectedPrefixText = prefixes[selectedPrefixIndex]
    return (selectedPrefixText)  
  }
  console.log(content)
}

start()