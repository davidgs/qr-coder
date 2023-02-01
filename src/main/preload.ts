import { contextBridge, ipcRenderer, dialog } from 'electron';

export type Channels = 'utm-builder';
export type Events =
  | 'get-config'
  | 'get-params'
  | 'save-config'
  | 'open-dialog'
  | 'read-file'
  | 'check-passwd';

export type electronAPI = {
  getConfig: () => Promise<string>;
  getParams: (key: string) => Promise<string>;
  saveConfig: (key: string) => Promise<string>;
  checkPass: () => Promise<string>;
  openDialog: (key: string) => Promise<typeof dialog>;
  readFile: (key: string) => Promise<string>;
};

contextBridge.exposeInMainWorld('electronAPI', {
  getConfig: () => {
    return ipcRenderer.invoke('get-config');
  },
  getParams: (key: string) => {
    return ipcRenderer.invoke('get-params', key);
  },
  saveConfig: (key: string) => {
    return ipcRenderer.invoke('save-config', key);
  },
  openDialog: (key: string) => {
    return ipcRenderer.invoke('open-dialog', key);
  },
  readFile: (key: string) => {
    return ipcRenderer.invoke('read-file', key);
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
