export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (minutes < 1) return "刚刚";
  if (minutes < 60) return `${minutes}分钟前`;
  if (hours < 24) return `${hours}小时前`;
  if (days < 7) return `${days}天前`;
  return date.toLocaleDateString("zh-CN");
}

export function masteryColor(prob: number): string {
  if (prob >= 0.8) return "text-green-600";
  if (prob >= 0.6) return "text-yellow-600";
  if (prob >= 0.4) return "text-orange-500";
  return "text-red-500";
}

export function masteryBgColor(prob: number): string {
  if (prob >= 0.8) return "bg-green-500";
  if (prob >= 0.6) return "bg-yellow-500";
  if (prob >= 0.4) return "bg-orange-500";
  return "bg-red-500";
}

export function masteryLabel(prob: number): string {
  if (prob >= 0.8) return "熟练";
  if (prob >= 0.6) return "掌握";
  if (prob >= 0.4) return "一般";
  return "薄弱";
}

export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

