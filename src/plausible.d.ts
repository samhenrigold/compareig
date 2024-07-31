interface Window {
    plausible: {
      (eventName: string, options?: object): void;
      q?: Array<[string, object?]>;
    };
  }
  