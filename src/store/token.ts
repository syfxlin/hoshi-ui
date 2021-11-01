export const TOKEN_NAME = "hoshi-note$token";

export const token = {
  get(): string | null {
    return localStorage.getItem(TOKEN_NAME);
  },
  set(t: string): void {
    localStorage.setItem(TOKEN_NAME, t);
  },
  exist(): boolean {
    return !!localStorage.getItem(TOKEN_NAME);
  },
  remove(): void {
    localStorage.removeItem(TOKEN_NAME);
  },
};
