import type { Message } from "../types/wsTypes";

export interface ChatInterfaceProps {
    messages: Message[];
    onSendMessage: (text: string) => void;
    onDeleteMessage: (id: string) => void;
    isConnected: boolean;
    currentUserId: string;
}
