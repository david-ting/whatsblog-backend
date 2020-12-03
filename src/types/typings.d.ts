declare module Express {
  export interface Request {
    session: {
      key: number | undefined;
      destroy: (callback: (err: any) => void) => void;
    };
  }
}
