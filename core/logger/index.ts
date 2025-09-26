import { ReactNativeLogger } from "./logger";

export function getLogger() {
  return new ReactNativeLogger({
    name: "avales-app",
  });
}

export const logger = getLogger();
