export const id = "no-revoked-message" as const;

export const defaults: PluginConfig = {
    maxMessagesCount: 10000,
    maxRevokedMessagesCount: 5000,
    autoSaveDuration: 120,
};
export function getPluginConfig(config: Config | undefined) {
    return Object.assign({}, defaults, config?.[id] || {});
}

export interface PluginConfig {
    maxMessagesCount: 100 | 1000 | 5000 | 10000 | 20000 | 50000 | 100000;
    maxRevokedMessagesCount: 100 | 1000 | 5000 | 10000 | 20000 | 50000 | 100000;
    autoSaveDuration: 60 | 120 | 300;
}
export type Config = {
    [X in typeof id]?: Partial<PluginConfig>;
};
