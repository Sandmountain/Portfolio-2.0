export const externalResource = (url: string) => {
  if (url) {
    const win = typeof window !== "undefined" && window?.open(url, "_blank");
    if (win) {
      win.focus();
    }
  }
};
