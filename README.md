# sia hipr resolver

resolves `_skyname` hip5 protocol ns records (but recursively) using [hipr](https://github.com/lukeburns/hipr)

## usage

```
> git clone https://github.com/lukeburns/hipr-sia
> cd hipr-sia
> npm install
> node index.js # start recursive resolver on port 5333 using root server 149.248.21.56
```

in a new shell

```
> dig @127.0.0.1 -p 5333 example.chan0

; <<>> DiG 9.10.6 <<>> @127.0.0.1 -p 5333 example.chan0
; (1 server found)
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 37019
;; flags: qr rd ra; QUERY: 1, ANSWER: 1, AUTHORITY: 0, ADDITIONAL: 1

;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags:; udp: 4096
;; QUESTION SECTION:
;example.chan0.      IN  A

;; ANSWER SECTION:
example.chan0.    3600  IN  A  66.42.108.201

;; Query time: 824 msec
;; SERVER: 127.0.0.1#5333(127.0.0.1)
;; WHEN: Sun Feb 20 15:45:03 EST 2022
;; MSG SIZE  rcvd: 58
```

edit index.js to use a custom hsd root nameserver and listen on a different port

#### example

i have a hip5 ns record 

```
example.chan0. 3600 IN NS aaajfkj7tlmgktmjlq72hzyctb3ilrqnuvjqnruejspw6ta6aibrpry._skyname.
```

in my zone for the tld chan0, and the zone file 

```
example.chan0. 3600 IN A 66.42.108.201
```

pinned at `sky://AACSqT-a2GVNiVw_o-cCmHaFxg2lUwbGhEyfb0weAgMXxw`.

`aaajfkj7tlmgktmjlq72hzyctb3ilrqnuvjqnruejspw6ta6aibrpry` is the [base32](https://github.com/bcoin-org/bs32) encoding of the skylink `AACSqT-a2GVNiVw_o-cCmHaFxg2lUwbGhEyfb0weAgMXxw`. you can use `encode.js` and `decode.js` for base32 encoding and decoding of base64-encoded skylinks.

```
> node encode AACSqT-a2GVNiVw_o-cCmHaFxg2lUwbGhEyfb0weAgMXxw
aaajfkj7tlmgktmjlq72hzyctb3ilrqnuvjqnruejspw6ta6aibrpry

> node decode aaajfkj7tlmgktmjlq72hzyctb3ilrqnuvjqnruejspw6ta6aibrpry
AACSqT-a2GVNiVw_o-cCmHaFxg2lUwbGhEyfb0weAgMXxw
```