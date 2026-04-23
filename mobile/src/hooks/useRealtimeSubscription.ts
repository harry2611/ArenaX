import { Client, IMessage } from "@stomp/stompjs";
import { useEffect, useRef } from "react";
import { appConfig } from "@/constants/config";
import { useAuthStore } from "@/store/useAuthStore";

export function useRealtimeSubscription(
  destination: string | null,
  onMessage: (body: string) => void
) {
  const token = useAuthStore((state) => state.token);
  const handlerRef = useRef(onMessage);

  useEffect(() => {
    handlerRef.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    if (!destination || !token) {
      return;
    }

    let active = true;
    const client = new Client({
      brokerURL: appConfig.wsBaseUrl,
      reconnectDelay: 5_000,
      connectHeaders: {
        Authorization: `Bearer ${token}`
      },
      debug: () => undefined
    });

    client.onConnect = () => {
      if (!active) {
        return;
      }

      client.subscribe(destination, (message: IMessage) => {
        handlerRef.current(message.body);
      });
    };

    client.activate();

    return () => {
      active = false;
      void client.deactivate();
    };
  }, [destination, token]);
}

