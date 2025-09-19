import type { TimeSlot } from "../types";

/**
 * 根据时间段获取问候语
 * @param timeSlot 时间段
 * @returns 问候语
 */
export function getGreeting(timeSlot: TimeSlot): string {
  const greetings: Record<TimeSlot, string> = {
    morning: "早上好",
    noon: "中午好",
    afternoon: "下午好",
    evening: "晚上好",
    lateNight: "夜深了，注意休息",
  };

  return greetings[timeSlot] || "你好";
}
