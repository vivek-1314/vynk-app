export function getCountdownString(targetHour = 19, targetMinute = 0): string {
  const now = new Date();

  const target = new Date();
  target.setHours(targetHour, targetMinute, 0, 0);

  if (now > target) {
    target.setDate(target.getDate() + 1); // move to next day
  }

  const diff = target.getTime() - now.getTime();
  const totalSeconds = Math.floor(diff / 1000);

  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;

  return (
    h.toString().padStart(2, "0") +
    m.toString().padStart(2, "0") +
    s.toString().padStart(2, "0")
  );
}
