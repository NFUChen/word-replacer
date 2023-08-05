"use client";

import { SWRConfig } from "swr";

interface ISWRProvider {
  children: React.ReactNode;
}

export const SWRProvider: React.FC<ISWRProvider> = ({ children }) => {
  return <SWRConfig value={{ provider: () => new Map() }}>{children}</SWRConfig>;
};
