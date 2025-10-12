import runtimeConfig from '../../config/config.json'

const DEFAULT_SPARQL_QUERY_ENDPOINT = 'http://localhost:3030/trestle/query'
const DEFAULT_SPARQL_UPDATE_ENDPOINT = 'http://localhost:3030/trestle/update'

const resolveBoolean = (value, fallback) =>
    typeof value === 'boolean' ? value : fallback

const resolvedSparql = {
    query: runtimeConfig?.sparql?.queryEndpoint ?? DEFAULT_SPARQL_QUERY_ENDPOINT,
    update:
        runtimeConfig?.sparql?.updateEndpoint ??
        runtimeConfig?.sparql?.queryEndpoint ??
        DEFAULT_SPARQL_UPDATE_ENDPOINT
}

const persistence = {
    useLocalStorage: resolveBoolean(runtimeConfig?.persistence?.localStorage, true),
    useSparql: resolveBoolean(runtimeConfig?.persistence?.sparql, true)
}

const credentials = {
    username: runtimeConfig?.sparql?.credentials?.username ?? null,
    password: runtimeConfig?.sparql?.credentials?.password ?? null
}

/**
 * Application configuration settings
 */
export const Config = {
    // SPARQL endpoint definitions
    SPARQL_ENDPOINTS: resolvedSparql,
    // Backwards-compatibility with legacy single endpoint usage
    SPARQL_ENDPOINT: resolvedSparql.query,
    SPARQL_CREDENTIALS: credentials,

    // Base URI for RDF data
    BASE_URI: 'http://hyperdata.it/trestle/',

    // RDF prefixes
    PREFIXES: {
        dc: 'http://purl.org/dc/terms/',
        ts: 'http://purl.org/stuff/trestle/',
        prj: 'http://purl.org/stuff/project/'
    },

    // Available RDF types for nodes
    RDF_TYPES: [
        {
            uri: 'http://purl.org/stuff/project/Project',
            label: 'Project',
            prefix: 'prj:Project',
            description: 'A project with goals and deliverables'
        },
        {
            uri: 'http://purl.org/stuff/project/Task',
            label: 'Task',
            prefix: 'prj:Task',
            description: 'A specific task or action item'
        },
        {
            uri: 'http://purl.org/stuff/trestle/Node',
            label: 'Generic Item',
            prefix: 'ts:Node',
            description: 'Default generic node type'
        }
    ],

    // Persistence configuration
    PERSISTENCE: persistence,

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

export default Config
