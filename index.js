const fetchSiaZone = require('./fetch-sia-zone');
const { wire: { types } } = require('bns');
const { RecursiveServer } = require('hipr');

const root = '149.248.21.56:53'.split(':')

const server = new RecursiveServer({
  tcp: true,
  inet6: true,
  edns: false,
  dnssec: false
})
server.on('log', console.log)
server.parseOptions({ dnssec: true })
server.resolver.setStub(root[0], parseInt(root[1]), require('./create-ds')())

// HIP-5-ish

const zones = new Map()
server.resolver.use(':data.:protocol(_skyname|skyname.xyz).', async ({ protocol, data }, name, type) => {
  data = data.split('.')
  const skylink = data[data.length - 1]
  try {
    let zone = zones.get(skylink) 

    if (!zone) {
      zone = await fetchSiaZone(skylink)
      zones.set(skylink, zone)
      console.log(zone)
    }
    const res = zone.resolve(name, types[type])
    console.log(name, types[type], res)
    return res
  } catch (e) {
    console.log('error', e)
    return null
  }
})

server.bind(5333, '127.0.0.1')
