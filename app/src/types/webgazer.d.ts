declare module "webgazer" {
  export interface WebGazerPrediction {
    x: number;
    y: number;
  }

  export interface WebGazerInstance {
    begin(): Promise<void>;
    end(): Promise<void>;
    params?: {
      showVideoPreview?: boolean;
      showFaceOverlay?: boolean;
      showFaceFeedbackBox?: boolean;
      saveDataAcrossSessions?: boolean;
      [key: string]: unknown;
    };
    showVideoPreview(show: boolean): WebGazerInstance;
    showPredictionPoints(show: boolean): WebGazerInstance;
    setGazeListener(
      listener: (data: WebGazerPrediction | null, timestamp: number) => void,
    ): WebGazerInstance;
    removeMouseEventListeners(): void;
  }

  const webgazer: WebGazerInstance;
  export default webgazer;
}
