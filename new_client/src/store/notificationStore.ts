import { create } from "zustand";

export type NotificationTone = "success" | "error" | "info";

export interface AppNotification {
  id: number;
  title: string;
  message?: string;
  tone: NotificationTone;
}

interface NotificationStore {
  notifications: AppNotification[];
  notify: (notification: Omit<AppNotification, "id">) => void;
  dismiss: (id: number) => void;
}

let notificationId = 0;

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],
  notify: (notification) => {
    const id = ++notificationId;
    set((state) => ({ notifications: [...state.notifications, { ...notification, id }].slice(-3) }));
    window.setTimeout(() => get().dismiss(id), 4500);
  },
  dismiss: (id) => set((state) => ({
    notifications: state.notifications.filter((notification) => notification.id !== id),
  })),
}));
