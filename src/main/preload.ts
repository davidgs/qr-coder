import { contextBridge, ipcRenderer } from 'electron';

export type Channels = 'utm-builder';
export type Events =
  | 'get-config'
  | 'get-params'
  | 'save-config'
  | 'check-passwd';

export type electronAPI = {
  saveConfig: (key: string) => Promise<string>;
};

contextBridge.exposeInMainWorld('electronAPI', {
  saveConfig: (key: string) => {
    return ipcRenderer.invoke('save-config', key);
  },
});

// Path: src/main/preload.ts

declare global {
  interface Window {
    electronAPI: {
      saveConfig: (key: string) => Promise<string>;
    };
  }
}
