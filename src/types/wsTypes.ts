export interface Message {
  senderId: string;
  messageId: string;
  message: string;
  date: string;
}

export type WSMessage =
  | WSInitMessages
  | WSNewMessage
  | WSDeleteMessage
  | WSRoomUsers
  | WSPrivateMessage;


export interface WSInitMessages {
  type: "INIT_MESSAGES";
  payload: Message[];
}

export interface WSNewMessage {
  type: "NEW_MESSAGE";
  payload: Message;
}

export interface WSDeleteMessage {
  type: "DELETE_MESSAGE";
  payload: string;
}

export interface WSRoomUsers {
  type: "ROOM_USERS";
  payload: {
    roomId: string;
    users: string[];
  };
}

export interface WSPrivateMessage {
  type: "PRIVATE_MESSAGE";
  payload: {
    from: string;
    text: string;
    date: string;
  };
}
