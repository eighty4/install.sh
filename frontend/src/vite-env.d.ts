/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_GITHUB_CLIENT_ID: string
    readonly VITE_GITHUB_GRAPH_ADDRESS: string
    readonly VITE_GITHUB_OAUTH_ADDRESS: string
    readonly VITE_SCRIPT_TEMPLATE_VERSION: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
