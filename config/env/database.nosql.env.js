module.exports = {
    db: {
        development: {
            promise: global.Promise,
            uri: process.env.MONGOHQ_URL || process.env.MONGODB_URI || `mongodb://${process.env.DB_1_PORT_27017_TCP_ADDR || `localhost`}/microservice`,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            maximumSortMemoryConfig : {
                setParameter: 1,
                internalQueryExecMaxBlockingSortBytes: 268435456
            }
        },
        production: {
            promise: global.Promise,
            uri: process.env.MONGOHQ_URL || process.env.MONGODB_URI || `mongodb://${process.env.DB_1_PORT_27017_TCP_ADDR || `localhost`}/microservice`,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            maximumSortMemoryConfig : {
                setParameter: 1,
                internalQueryExecMaxBlockingSortBytes: 268435456
            }
        }
    }
}