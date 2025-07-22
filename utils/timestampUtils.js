export const getFormattedTimestamp = () => {
  const now = new Date();
  const pad = (n) => n.toString().padStart(2, "0");
  const padMs = (n) => n.toString().padStart(3, "0");

  const yyyy = now.getFullYear();
  const mm = pad(now.getMonth() + 1);
  const dd = pad(now.getDate());
  const hh = pad(now.getHours());
  const mi = pad(now.getMinutes());
  const ss = pad(now.getSeconds());
  const ms = padMs(now.getMilliseconds());

  return `${yyyy}_${mm}_${dd}-${hh}_${mi}_${ss}_${ms}`;
};
