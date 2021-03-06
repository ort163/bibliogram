const {Pinski} = require("pinski")
const {subdirs} = require("node-dir")
const constants = require("../lib/constants")

const passthrough = require("./passthrough")

const pinski = new Pinski({
	port: 10407,
	relativeRoot: __dirname
})

subdirs("pug", async (err, dirs) => {
	if (err) throw err

	//pinski.addRoute("/", "pug/index.pug", "pug")
	pinski.addRoute("/static/css/main.css", "sass/main.sass", "sass")
	pinski.addPugDir("pug", dirs)
	pinski.addAPIDir("html/static/js/templates/api")
	pinski.addSassDir("sass")
	pinski.addAPIDir("api")
	pinski.muteLogsStartingWith("/imageproxy")
	pinski.muteLogsStartingWith("/videoproxy")
	pinski.muteLogsStartingWith("/static")

	if (constants.tor.enabled) {
		await require("../lib/utils/tor") // make sure tor state is known before going further
	}

	pinski.startServer()
	pinski.enableWS()

	require("pinski/plugins").setInstance(pinski)

	Object.assign(passthrough, pinski.getExports())

	console.log("Server started")
	require("./repl")
})
