import { usePluginConfig } from "./utils/hooks";
import { defineSettingsPanels } from "qqntim-settings";
import { Dropdown, Input, SettingsBox, SettingsBoxItem, SettingsSection, Switch } from "qqntim-settings/components";
import { env } from "qqntim/renderer";
import { useMemo } from "react";
import { getPluginConfig } from "./config";

export default class Entry implements QQNTim.Entry.Renderer {
    constructor() {
        // 如果不需要设置界面，将下一行注释掉即可；如果需要在设置项目旁边加一个小图标，请将 `undefined` 改为一段 HTML 代码（可以是 `<svg>`, `<img>` 等等）。
        defineSettingsPanels(["防撤回插件", SettingsPanel, undefined]);
    }
}

function SettingsPanel({ config: _config, setConfig: _setConfig }: QQNTim.Settings.PanelProps) {
    const [pluginConfig, setPluginConfig] = usePluginConfig(_config, _setConfig);

    return (
        <>
            <SettingsSection title="插件设置">
                <SettingsBox>
                    <SettingsBoxItem title="暂存的最大消息数量" description={["指定允许暂存的最大消息数量。当数量到达设定值时，将会清除最早的消息。防撤回对已经被清除的消息无效。"]}>
                        <Dropdown
                            items={[
                                [100 as const, "100 条"],
                                [1000 as const, "1000 条"],
                                [5000 as const, "5000 条"],
                                [10000 as const, "10000 条"],
                                [20000 as const, "20000 条"],
                                [50000 as const, "50000 条"],
                                [100000 as const, "100000 条"],
                            ]}
                            selected={pluginConfig.maxMessagesCount}
                            onChange={(state) => setPluginConfig("maxMessagesCount", state)}
                            width="200px"
                        />
                    </SettingsBoxItem>
                    <SettingsBoxItem title="允许的最大被撤回消息数量" description={["指定允许存储的最大被撤回消息数量。当数量到达设定值时，将会清除最早的消息。"]}>
                        <Dropdown
                            items={[
                                [100 as const, "100 条"],
                                [1000 as const, "1000 条"],
                                [5000 as const, "5000 条"],
                                [10000 as const, "10000 条"],
                                [20000 as const, "20000 条"],
                                [50000 as const, "50000 条"],
                                [100000 as const, "100000 条"],
                            ]}
                            selected={pluginConfig.maxRevokedMessagesCount}
                            onChange={(state) => setPluginConfig("maxRevokedMessagesCount", state)}
                            width="200px"
                        />
                    </SettingsBoxItem>
                    <SettingsBoxItem title="自动保存时间间隔" description={["指定自动保存已撤回消息的时间间隔。"]}>
                        <Dropdown
                            items={[
                                [60 as const, "1 分钟"],
                                [120 as const, "2 分钟"],
                                [300 as const, "5 分钟"],
                            ]}
                            selected={pluginConfig.autoSaveDuration}
                            onChange={(state) => setPluginConfig("autoSaveDuration", state)}
                            width="200px"
                        />
                    </SettingsBoxItem>
                </SettingsBox>
            </SettingsSection>
        </>
    );
}
