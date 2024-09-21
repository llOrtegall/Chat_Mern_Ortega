export interface OnlineUser {
  userId: string;
  email: string;
}

export interface OfflineUser {
  _id: string;
  email: string;
}

export interface MessageData {
  online: OnlineUser[];
  text?: string[];
  isOur?: boolean;
  sender?: string;
}
