"use client";

import { useState, useEffect } from "react";
import type { GreetingProps, TimeSlot } from "../types";
import { getGreeting } from "../lib/greetings";

export function Greeting({ className = "" }: GreetingProps) {
  const [_timeSlot, setTimeSlot] = useState<TimeSlot>("morning");
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    // 获取当前时间段
    const hour = new Date().getHours();
    let slot: TimeSlot = "morning";

    if (hour >= 5 && hour < 11) {
      slot = "morning";
    } else if (hour >= 11 && hour < 13) {
      slot = "noon";
    } else if (hour >= 13 && hour < 18) {
      slot = "afternoon";
    } else if (hour >= 18 && hour < 22) {
      slot = "evening";
    } else {
      slot = "lateNight";
    }

    setTimeSlot(slot);
    setGreeting(getGreeting(slot));
  }, []);

  return <div className={`text-lg font-medium ${className}`}>{greeting}</div>;
}
