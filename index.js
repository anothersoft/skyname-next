const fetchSiaZone = require("./util/fetch-sia-zone");
const {
	wire: { types },
} = require("bns");
let config = require("json5").parse(
	require("fs").readFileSync("./config.json5", "utf8")
);
const { RecursiveServer } = require("hipr");

const root = config.rootNameserver.split(":");

const server = new RecursiveServer({
	tcp: true,
	inet6: true,
	edns: false,
	dnssec: false,
});
server.on("log", console.log);
server.parseOptions({ dnssec: true });
server.resolver.setStub(
	root[0],
	parseInt(root[1]),
	require("./util/create-ds")()
);

// HIP-5-ish

const zones = new Map();
server.resolver.use(
	":data.:protocol(_skyname|skyname.xyz).",
	async ({ protocol, data }, name, type) => {
		data = data.split(".");
		const skylink = data[0];
		try {
			let zone = zones.get(skylink);

			if (!zone) {
				zone = await fetchSiaZone(skylink);
				zones.set(skylink, zone);
				console.log(zone);
			}
			const res = zone.resolve(name, types[type]);
			console.log(name, types[type], res);
			return res;
		} catch (e) {
			console.log("error", e);
			return null;
		}
	}
);
server.resolver.on("query", (req, res, rinfo) => {
	console.log(req, res, rinfo);
});
server.bind(config.port, "0.0.0.0");
