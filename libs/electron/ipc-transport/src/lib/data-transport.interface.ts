export interface RendererTransportType {
  hello(options: { num: number }): Promise<{ text: string }>;
  version(): Promise<{ version: string }>;
  takeScreenShot(): Promise<string>;
}

export interface MainTransportType {}
