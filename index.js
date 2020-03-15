function start(){
  const content = {}
  content.serachTerm = askAndReturnSearchTerm()
  function askAndReturnSearchTerm(){
    return 'teste'
  }
  console.log(content)
}

start()