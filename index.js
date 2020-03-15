const readline = require('readline-sync')
function start(){
  const content = {}
  content.serachTerm = askAndReturnSearchTerm()
  content.prefix = askAndReturnPrefix()
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