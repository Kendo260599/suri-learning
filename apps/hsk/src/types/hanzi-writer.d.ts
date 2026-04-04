declare module 'hanzi-writer' {
  export interface HanziWriterOptions {
    width?: number;
    height?: number;
    padding?: number;
    strokeAnimationSpeed?: number;
    strokeFadeDuration?: number;
    strokeHighlightDuration?: number;
    strokeHighlightSpeed?: number;
    delayBetweenStrokes?: number;
    delayBetweenLoops?: number;
    strokeColor?: string;
    radicalColor?: string;
    highlightColor?: string;
    outlineColor?: string;
    drawingColor?: string;
    drawingWidth?: number;
    showOutline?: boolean;
    showCharacter?: boolean;
    renderer?: 'svg' | 'canvas';
  }

  export default class HanziWriter {
    static create(element: string | HTMLElement, character: string, options?: HanziWriterOptions): HanziWriter;
    showCharacter(): void;
    hideCharacter(): void;
    animateCharacter(): void;
    loopCharacterAnimation(): void;
    pauseAnimation(): void;
    resumeAnimation(): void;
    quiz(options?: {
      onMistake?: (strokeData: any) => void;
      onCorrectStroke?: (strokeData: any) => void;
      onComplete?: (summaryData: any) => void;
    }): void;
    cancelQuiz(): void;
    setCharacter(character: string): void;
  }
}
