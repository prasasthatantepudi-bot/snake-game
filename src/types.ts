export interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url: string;
  cover: string;
}

export type GameStatus = "IDLE" | "PLAYING" | "PAUSED" | "GAME_OVER";

export interface Point {
  x: number;
  y: number;
}
