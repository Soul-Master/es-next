export interface WorkerRequestMap {
    sendMessage: SendMessageData;
    registerChannel: RegisterChannelData;
    message: MessageData;
}

export interface SendMessageData {
    channel: KnownChannel;
    message: any;
}

export interface RegisterChannelData {
    target: KnownChannel;
    port: MessagePort;
}

export interface MessageData {
    channel: KnownChannel;
    message: any;
}

export type WorkerRequestMessage<T> = T extends keyof WorkerRequestMap ? {
    messageId: number;
    method: T;
    data: WorkerRequestMap[T];
} : never;
export type WorkerRequestTypes = WorkerRequestMessage<keyof WorkerRequestMap>;

export const enum KnownChannel {
    Main = 'main',
    Worker = 'worker'
}

const moduleUrl = new URL(import.meta.url);
const moduleName = moduleUrl.searchParams.get('name');

const channels: Record<KnownChannel, MessagePort | typeof globalThis | null> = {
    [KnownChannel.Main]: self,
    [KnownChannel.Worker]: null
};

function onMessage(e: MessageEvent<WorkerRequestTypes>) {
    switch (e.data?.method) {
        case 'sendMessage':
            sendMessage(e.data.messageId, e.data.data);
            break;
        case 'registerChannel':
            registerChannel(e.data.messageId, e.data.data);
            break;
        case 'message':
            receiveMessage(e.data.messageId, e.data.data);
            break;
    }
}

function sendMessage(messageId: number, data: SendMessageData) {
    const channel = channels[data.channel];
    if (!channel) return;

    log('Send message to ' + data.channel);
    channel.postMessage(data.message);
    
    self.postMessage(messageId);
}

function registerChannel(messageId: number, data: RegisterChannelData) {
    log(`Register ${data.target} channel`);
    channels[data.target] = data.port;

    data.port.onmessage = (e) => {
        log('Receive message from ' + data.target, e.data);
    };

    self.postMessage(messageId);
}

function receiveMessage(messageId: number, data: SendMessageData) {
    const channel = channels[data.channel];
    if (!channel) return;

    log('Receive message from ' + data.channel);    
    self.postMessage(messageId);
}

function log(message: string, ...optionalParams: any[]) {
    console.log(`%c${moduleName}`, 'background: blue; color: white; padding: 0 4px;', message, ...optionalParams);
}

function isWorker(obj: any): obj is WorkerGlobalScope {
    return obj === self;
}

self.addEventListener('message', onMessage);