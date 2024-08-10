export interface OnlineUser {
  userId: string;
  username: string;
}

export interface OfflineUser {
  _id: string;
  username: string;
}

export interface MessageData {
  online: OnlineUser[];
  text?: string[];
  isOur?: boolean;
  sender?: string;
}
