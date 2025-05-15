export {};

declare global {
  interface UserPublicMetadata {
    rol: string;
    points?: number;
    retosResueltos?: number;
  }
}
