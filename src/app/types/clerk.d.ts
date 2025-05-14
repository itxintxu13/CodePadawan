declare module '@clerk/nextjs' {
  interface UserPublicMetadata {
    rol: string;
    points?: number;
    retosResueltos?: number;
  }
}