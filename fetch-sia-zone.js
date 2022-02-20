const split2 = require('split2')
const base32 = require('bs32')
const { Zone } = require('bns')
const { SkynetClient } = require('@skynetlabs/skynet-nodejs')

const client = new SkynetClient();

module.exports = function (skylink, portalUrl='https://siasky.net/') {
  skylink = base32.decode(skylink)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/\=/g, '')
  return new Promise(async (resolve, reject) => {
    const zone = new Zone()
    try {
      const response = await client.executeRequest({
        portalUrl,
        endpointPath: '/',
        method: 'get',
        extraPath: skylink,
        responseType: 'stream',
      })
      
      const stream = response.data.pipe(split2())
      stream.on('data', data => {
        console.log(skylink, data.toString())
        try {
          if (data.length) {
            data = data.toString()
            zone.fromString(data)
          }
        } catch (error) {
          stream.end() // force end of stream if sia data cannot be parsed as zone file
        }
      });
      stream.on('end', () => {
        resolve(zone)
      });
      stream.on('error', console.error);
    } catch (error) {
      reject(error)
    }
  })
  return zone
}