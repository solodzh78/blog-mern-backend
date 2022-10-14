export const MONGO_DB_URI = process.env.MONGO_DB_URI || (await import('./secret/constants.js')).LOCAL_MONGO_DB_URI;
export const PORT = process.env.PORT || 4444;