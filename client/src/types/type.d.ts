export interface OnlineUser {
  userId: string;
  email: string;
}

export interface OfflineUser {
  _id: string;
  email: string;
}

export interface Messages {
  text: string;
  sender: string;
  recipient: string;
  id: string;
}

export interface MessageData {
  online: OnlineUser[];
  messages: Messages;
}
