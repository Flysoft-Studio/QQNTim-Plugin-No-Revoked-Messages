import { getPluginConfig } from "./config";
import { s } from "./utils/sep";
import { randomUUID } from "crypto";
import { app } from "electron";
import { env, interrupt } from "qqntim/main";
import { modules } from "qqntim/main";
const { fs } = modules;

export default class Entry implements QQNTim.Entry.Main {
    private messages = new Map<string, any>();
    private revokedMessages = new Map<string, any>();
    private changesRequested = false;
    constructor() {
        const config = getPluginConfig(env.config.plugins.config);

        interrupt.ipc(
            (args) => {
                args?.[1]?.[0]?.payload?.msgList?.forEach((msg) => {
                    const id = msg.msgId;
                    this.messages.set(id, msg);
                    if (this.messages.size > config.maxMessagesCount)
                        for (const [id] of this.messages.entries()) {
                            this.messages.delete(id);
                            break;
                        }
                });
            },
            { eventName: "ns-ntApi", cmdName: "nodeIKernelMsgListener/onRecvMsg", direction: "out", type: "request" },
        );

        interrupt.ipc(
            (args) => {
                if (args?.[1]?.[0]?.payload?.msgList)
                    args[1][0].payload.msgList = args[1][0].payload.msgList.map((msg) => {
                        const id = msg.msgId;
                        if (msg.elements[0]?.grayTipElement?.revokeElement && !msg.elements[0].grayTipElement.revokeElement.isSelfOperate) {
                            const storedMsg = this.messages.get(id);
                            this.revokedMessages.set(id, storedMsg);
                            if (this.revokedMessages.size > config.maxRevokedMessagesCount)
                                for (const [id] of this.revokedMessages.entries()) {
                                    this.revokedMessages.delete(id);
                                    break;
                                }
                            this.changesRequested = true;
                            return storedMsg;
                        }
                        return msg;
                    });
            },
            { eventName: "ns-ntApi", cmdName: "nodeIKernelMsgListener/onMsgInfoListUpdate", direction: "out", type: "request" },
        );

        interrupt.ipc(
            (args) => {
                const processMsg = (msg) => {
                    const id = msg.msgId;
                    const storedMsg = this.revokedMessages.get(id);
                    if (storedMsg)
                        return {
                            ...storedMsg,
                            elements: [
                                ...storedMsg.elements,
                                {
                                    elementType: 1,
                                    elementId: randomUUID(),
                                    textElement: {
                                        content: "\n(已被撤回)",
                                        atType: 0,
                                        atUid: "0",
                                        atTinyId: "0",
                                        atNtUid: "",
                                        subElementType: 0,
                                        atChannelId: "0",
                                    },
                                },
                            ],
                        };
                    return msg;
                };
                if (args?.[1]?.[0]?.payload?.msgList) args[1][0].payload.msgList = args[1][0].payload.msgList.map(processMsg);
                else if (args?.[1]?.msgList) args[1].msgList = args[1].msgList.map(processMsg);
            },
            { eventName: "ns-ntApi", direction: "out" },
        );

        const dataFile = `${env.path.dataDir}${s}revoked-messages.json`;
        if (fs.existsSync(dataFile)) {
            this.revokedMessages = new Map(fs.readJSONSync(dataFile));
            console.log(`[NoRevokedMessages] 已成功从 ${dataFile} 加载 ${this.revokedMessages.size} 条被撤回的消息`);
        }

        const saveChanges = async () => {
            if (!this.changesRequested) return;
            this.changesRequested = false;
            console.log(`[NoRevokedMessages] 正在保存撤回已消息数据到 ${dataFile}`);
            await fs.writeJSON(dataFile, Array.from(this.revokedMessages));
        };
        const scheduleSaveChanges = () => {
            setTimeout(async () => {
                await saveChanges();
                scheduleSaveChanges();
            }, config.autoSaveDuration * 1000);
        };
        scheduleSaveChanges();
        app.on("before-quit", (event) => {
            if (this.changesRequested) {
                event.preventDefault();
                saveChanges().then(() => app.quit());
            }
        });
    }
}
