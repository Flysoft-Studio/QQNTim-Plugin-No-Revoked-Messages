export const id = "no-revoked-message" as const;

export const defaults: PluginConfig = {
    switchConfigItem: false,
    anotherSwitchConfigItem: false,
    inputConfigItem: "默认值",
    dropdownConfigItem: "A",
};
export function getPluginConfig(config: Config | undefined) {
    return Object.assign({}, defaults, config?.[id] || {});
}

export interface PluginConfig {
    switchConfigItem: boolean;
    anotherSwitchConfigItem: boolean;
    inputConfigItem: string;
    dropdownConfigItem: "A" | "B" | "C";
}
export type Config = {
    [X in typeof id]?: Partial<PluginConfig>;
};
