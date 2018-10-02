#!/usr/bin/env node

const prog   = require('caporal')
const flastm = require('flastm')

prog
	.version('1.0.0')
	.description('A Polybar module to scrobble & love music in Lastfm')
	.argument('<apikey>', 'Lastfm api_key', prog.REPEATABLE)
	.argument('<apisecret>', 'Lastfm api_secret', prog.REPEATABLE)
	.argument('<username>', 'Lastfm username', prog.REPEATABLE)
	.argument('<password>', 'Lastfm password', prog.REPEATABLE)
	.argument('<action>', '"scrobble" or "love"', prog.REPEATABLE)
	.argument('<artist>', 'Artist name', prog.REPEATABLE)
	.argument('<name>', 'Music name', prog.REPEATABLE)
	.action(async function(args, options, logger) {
		try {
			const action = args['action']
			const artist = args['artist']
			const name = args['name']
			const config = {
				api_key: args['apikey'],
				secret: args['apisecret'],
				username: args['username'],
				password: args['password']
			}
			const lastfm = flastm(config)
			if (artist != '' && name != '') {
				lastfm.auth.getMobileSession()
				.then(session => {
					const sk = session.session.key
					if (action == 'love') {
						lastfm.track.love(
							artist,
							name,
							sk
						)
						logger.info(`${artist} - ${name} Scrobbling now and Loved`)
					} else {
						lastfm.track.scrobble(
							artist,
							name,
							new Date().getTime()/1000,
							sk
						)
						logger.info(`${artist} - ${name} Scrobbling now`)
					}
				})
				.catch(() => logger.info(`${artist} - ${name} (Lastfm Offline)`))
			} else {
				logger.info(`${artist} - ${name}`)
			}
		} catch (e) {
			const artist = args['artist']
			const name = args['name']
			logger.info(`${artist} - ${name}`)
		}
	});
prog.parse(process.argv)
