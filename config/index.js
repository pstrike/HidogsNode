var config = {
    local: {
        mode: 'local',
        host: 'localhost',
        port: 3000,
        mongo: {
            host: '127.0.0.1',
            port: 27017
        }
    },
    staging: {
        mode: 'staging',
        host: 'localhost',
        port: 4000,
        mongo: {
            host: '120.25.105.129',
            port: 27017
        }
    },
    production: {
        mode: 'production',
        host: 'localhost',
        port: 80,
        mongo: {
            host: '127.0.0.1',
            port: 27017
        }
    }
}
module.exports = function(mode) {
    return config[mode || process.argv[2] || 'local'] || config.local;
}