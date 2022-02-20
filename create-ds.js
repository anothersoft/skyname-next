const { wire: { Record }, dnssec } = require('bns');

module.exports = function createDS () {
  const ksk = Record.fromJSON({
    name: '.',
    ttl: 10800,
    class: 'IN',
    type: 'DNSKEY',
    data: {
      flags: 257,
      protocol: 3,
      algorithm: 13,
      publicKey: '' +
        'T9cURJ2M/Mz9q6UsZNY+Ospyvj+Uv+tgrrWkLtPQwgU/Xu5Yk0l02Sn5ua2x' +
        'AQfEYIzRO6v5iA+BejMeEwNP4Q=='
    }
  });
  return dnssec.createDS(ksk, dnssec.hashes.SHA256);
};
