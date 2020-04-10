
const robots = {
  input: require('./robots/input'),
  text: require('./robots/text.js'),
  state: require('./robots/state'),
  img: require('./robots/img')
}

async function start(){
  
  //robots.input()
  //await robots.text()
  await robots.img()

  const content = robots.state.load()
  console.dir(content, { depth: null})
  
}

start()