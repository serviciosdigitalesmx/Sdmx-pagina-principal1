declare module 'web-push' {
  type Subscription = {
    endpoint: string;
    keys: {
      p256dh: string;
      auth: string;
    };
  };

  type Payload = string | Buffer | ArrayBuffer;

  type WebPush = {
    setVapidDetails(subject: string, publicKey: string, privateKey: string): void;
    sendNotification(subscription: Subscription, payload: Payload): Promise<void>;
  };

  const webPush: WebPush;
  export default webPush;
}

