/**
 * Application configuration settings
 */
export const Config = {
    // SPARQL endpoint for data persistence
    // SPARQL_ENDPOINT: 'http://localhost:3030/trestle',
    SPARQL_ENDPOINT: 'https://fuseki.hyperdata.it/farelo',
    // Base URI for RDF data
    BASE_URI: 'http://hyperdata.it/trestle/',


    // RDF prefixes
    PREFIXES: {
        dc: 'http://purl.org/dc/terms/',
        ts: 'http://purl.org/stuff/trestle/'
    },

    // Application settings
    AUTO_SAVE: false,
    AUTO_SAVE_INTERVAL: 60000, // 1 minute

    // Key codes for keyboard navigation
    KEY_CODES: {
        TAB: 9,
        ENTER: 13,
        ESCAPE: 27,
        UP: 38,
        DOWN: 40
    }
}

export default Config;
