export interface InstanceData {
  idInstance: number;
  wid: string;
  typeInstance: string;
}

export interface SenderData {
  chatId: string;
  chatName: string;
  sender: string;
  senderName: string;
}

export interface TextMessageData {
  textMessage: string;
}

export interface MessageData {
  typeMessage: string;
  textMessageData: TextMessageData;
}

export interface Body {
  typeWebhook: string;
  instanceData: InstanceData;
  timestamp: number;
  idMessage: string;
  senderData: SenderData;
  messageData: MessageData;
}

export interface Response {
  receiptId: number;
  body: Body;
}
