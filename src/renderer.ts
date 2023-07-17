import { getPluginConfig } from "./config";
import * as qqntim from "qqntim/renderer";

export default class Entry implements QQNTim.Entry.Renderer {
    constructor() {
        const config = getPluginConfig(qqntim.env.config.plugins.config);
        console.log("[Template] Hello world!", qqntim);
        console.log("[Template] 当前插件配置：", config);
    }
}
