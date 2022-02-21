const split2 = require("split2");
const { Zone } = require("bns");
let config = require("json5").parse(
	require("fs").readFileSync("./config.json5", "utf8")
);
const { SkynetClient } = require("@skynetlabs/skynet-nodejs");
const decode = require("./decodeSkylink");

const client = new SkynetClient();

module.exports = function (skylink, portalUrl = config.skynetPortal) {
	skylink = decode(skylink);
	return new Promise(async (resolve, reject) => {
		const zone = new Zone();
		try {
			const response = await client.executeRequest({
				portalUrl,
				endpointPath: "/",
				method: "get",
				extraPath: skylink,
				responseType: "stream",
			});

			const stream = response.data.pipe(split2());
			stream.on("data", (data) => {
				try {
					if (data.length) {
						data = data.toString();
						zone.fromString(data);
					}
				} catch (error) {
					stream.end(); // force end of stream if sia data cannot be parsed as zone file
				}
			});
			stream.on("end", () => {
				resolve(zone);
			});
			stream.on("error", console.error);
		} catch (error) {
			reject(error);
		}
	});
	return zone;
};
