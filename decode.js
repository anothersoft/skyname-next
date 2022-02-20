#!/usr/bin/env node

const base32 = require('bs32')

const decode = skylink => 
    base32.decode(skylink)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/\=/g, '')

if (process.argv[2]) {
  process.stdout.write(decode(process.argv[2]))
}

module.exports = decode 

