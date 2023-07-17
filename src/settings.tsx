import { usePluginConfig } from "./utils/hooks";
import { defineSettingsPanels } from "qqntim-settings";
import { Dropdown, Input, SettingsBox, SettingsBoxItem, SettingsSection, Switch } from "qqntim-settings/components";
import { env } from "qqntim/renderer";
import { useMemo } from "react";
import { getPluginConfig } from "./config";

export default class Entry implements QQNTim.Entry.Renderer {
    constructor() {
        // 如果不需要设置界面，将下一行注释掉即可；如果需要在设置项目旁边加一个小图标，请将 `undefined` 改为一段 HTML 代码（可以是 `<svg>`, `<img>` 等等）。
        defineSettingsPanels(["模板插件设置", SettingsPanel, undefined]);
    }
}

function SettingsPanel({ config: _config, setConfig: _setConfig }: QQNTim.Settings.PanelProps) {
    const [pluginConfig, setPluginConfig] = usePluginConfig(_config, _setConfig);
    const currentPluginConfigString = useMemo(() => JSON.stringify(getPluginConfig(env.config.plugins.config)), []);

    return (
        <>
            <SettingsSection title="插件设置">
                <SettingsBox>
                    <SettingsBoxItem title="当前生效的插件配置：" description={[currentPluginConfigString]} />
                    <SettingsBoxItem title="开关" description={["这是一个开关。", `当前状态为：${pluginConfig.switchConfigItem ? "开" : "关"}`]}>
                        <Switch checked={pluginConfig.switchConfigItem} onToggle={(state) => setPluginConfig("switchConfigItem", state)} />
                    </SettingsBoxItem>
                    {pluginConfig.switchConfigItem && (
                        <SettingsBoxItem title="另一个开关" description={["这是另一个开关。", `当前状态为：${pluginConfig.anotherSwitchConfigItem ? "开" : "关"}`]}>
                            <Switch checked={pluginConfig.anotherSwitchConfigItem} onToggle={(state) => setPluginConfig("anotherSwitchConfigItem", state)} />
                        </SettingsBoxItem>
                    )}
                    <SettingsBoxItem title="下拉菜单" description={["这是一个下拉菜单。", `当前状态为：${pluginConfig.dropdownConfigItem}`]}>
                        <Dropdown
                            items={[
                                ["A" as const, "我是 A 选项"],
                                ["B" as const, "我是 B 选项"],
                                ["C" as const, "我是 C 选项"],
                            ]}
                            selected={pluginConfig.dropdownConfigItem}
                            onChange={(state) => setPluginConfig("dropdownConfigItem", state)}
                            width="150px"
                        />
                    </SettingsBoxItem>
                    <SettingsBoxItem title="输入框" description={["这是一个输入框。", `当前状态为：${pluginConfig.inputConfigItem}`]} isLast={true}>
                        <Input value={pluginConfig.inputConfigItem} onChange={(state) => setPluginConfig("inputConfigItem", state)} />
                    </SettingsBoxItem>
                </SettingsBox>
            </SettingsSection>
        </>
    );
}
