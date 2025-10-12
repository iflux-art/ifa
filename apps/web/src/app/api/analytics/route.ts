import { type NextRequest, NextResponse } from "next/server";

/**
 * 性能分析数据收集端点
 */

interface AnalyticsEvent {
  event: string;
  data: unknown;
  timestamp: number;
}

interface WebVitalData {
  name: string;
  value: number;
  sessionId: string;
  timestamp: number;
}

interface LongTaskData {
  duration: number;
  startTime: number;
  sessionId: string;
}

interface SlowResourceData {
  name: string;
  duration: number;
  size: number;
  type: string;
  sessionId: string;
}

/**
 * 处理性能分析数据
 */
export async function POST(request: NextRequest) {
  try {
    const body: AnalyticsEvent = await request.json();

    // 验证数据格式
    if (!(body.event && body.data && body.timestamp)) {
      return NextResponse.json({ error: "Invalid analytics data format" }, { status: 400 });
    }

    // 获取客户端信息
    const userAgent = request.headers.get("user-agent") || "unknown";
    const referer = request.headers.get("referer") || "unknown";
    const ip =
      request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";

    // 构建完整的分析数据
    const analyticsData = {
      ...body,
      clientInfo: {
        userAgent,
        referer,
        ip: ip.split(",")[0].trim(), // 取第一个 IP
      },
      serverTimestamp: Date.now(),
    };

    // 根据事件类型处理数据
    switch (body.event) {
      case "web-vital":
        await handleWebVital({
          ...analyticsData,
          data: analyticsData.data as WebVitalData,
        });
        break;
      case "long-task":
        await handleLongTask({
          ...analyticsData,
          data: analyticsData.data as LongTaskData,
        });
        break;
      case "slow-resource":
        await handleSlowResource({
          ...analyticsData,
          data: analyticsData.data as SlowResourceData,
        });
        break;
      default:
        console.log("Unknown analytics event:", body.event);
    }

    // 在开发环境下打印日志
    if (process.env.NODE_ENV === "development") {
      console.log("📊 Analytics Event:", {
        event: body.event,
        data: body.data,
        timestamp: new Date(body.timestamp).toISOString(),
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Analytics processing error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * 处理 Web Vitals 数据
 */
async function handleWebVital(data: {
  data: WebVitalData;
  clientInfo: unknown;
  serverTimestamp: number;
}) {
  const webVitalData: WebVitalData = data.data;

  // 在生产环境中，这里应该发送到实际的分析服务
  // 例如 Google Analytics, DataDog, New Relic 等

  if (process.env.NODE_ENV === "production") {
    // 发送到外部分析服务
    await sendToExternalAnalytics("web-vital", data);
  }

  // 检查性能阈值并发送告警
  await checkPerformanceThresholds(webVitalData);
}

/**
 * 处理长任务数据
 */
async function handleLongTask(data: {
  data: LongTaskData;
  clientInfo: unknown;
  serverTimestamp: number;
}) {
  const longTaskData: LongTaskData = data.data;

  // 长任务通常表示性能问题，需要特别关注
  if (longTaskData.duration > 50) {
    // 超过 50ms 的任务
    console.warn("Long task detected:", longTaskData);

    if (process.env.NODE_ENV === "production") {
      await sendToExternalAnalytics("long-task", data);

      // 发送告警
      if (longTaskData.duration > 100) {
        await sendPerformanceAlert("long-task", longTaskData);
      }
    }
  }
}

/**
 * 处理慢资源数据
 */
async function handleSlowResource(data: {
  data: SlowResourceData;
  clientInfo: unknown;
  serverTimestamp: number;
}) {
  const slowResourceData: SlowResourceData = data.data;

  console.warn("Slow resource detected:", slowResourceData);

  if (process.env.NODE_ENV === "production") {
    await sendToExternalAnalytics("slow-resource", data);

    // 如果资源加载时间超过 3 秒，发送告警
    if (slowResourceData.duration > 3000) {
      await sendPerformanceAlert("slow-resource", slowResourceData);
    }
  }
}

/**
 * 检查性能阈值
 */
async function checkPerformanceThresholds(data: WebVitalData) {
  const thresholds = {
    LCP: { good: 2500, poor: 4000 },
    FID: { good: 100, poor: 300 },
    CLS: { good: 0.1, poor: 0.25 },
    FCP: { good: 1800, poor: 3000 },
    TTFB: { good: 800, poor: 1800 },
  };

  const threshold = thresholds[data.name as keyof typeof thresholds];
  if (!threshold) return;

  if (data.value > threshold.poor) {
    await sendPerformanceAlert("poor-web-vital", {
      metric: data.name,
      value: data.value,
      threshold: threshold.poor,
      sessionId: data.sessionId,
    });
  }
}

/**
 * 发送到外部分析服务
 */
async function sendToExternalAnalytics(
  event: string,
  data: {
    data: WebVitalData | LongTaskData | SlowResourceData;
    clientInfo: unknown;
    serverTimestamp: number;
  }
) {
  try {
    // Google Analytics 4
    if (process.env.GA_MEASUREMENT_ID) {
      await fetch(
        `https://www.google-analytics.com/mp/collect?measurement_id=${process.env.GA_MEASUREMENT_ID}&api_secret=${process.env.GA_API_SECRET}`,
        {
          method: "POST",
          body: JSON.stringify({
            client_id: (data.data as { sessionId: string }).sessionId,
            events: [
              {
                name: event,
                params: data.data,
              },
            ],
          }),
        }
      );
    }

    // DataDog (示例)
    if (process.env.DATADOG_API_KEY) {
      await fetch("https://api.datadoghq.com/api/v1/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "DD-API-KEY": process.env.DATADOG_API_KEY,
        },
        body: JSON.stringify({
          title: `Performance Event: ${event}`,
          text: JSON.stringify(data.data),
          tags: [`event:${event}`, `session:${(data.data as { sessionId: string }).sessionId}`],
        }),
      });
    }

    // 自定义分析服务
    if (process.env.CUSTOM_ANALYTICS_ENDPOINT) {
      await fetch(process.env.CUSTOM_ANALYTICS_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.CUSTOM_ANALYTICS_TOKEN}`,
        },
        body: JSON.stringify(data),
      });
    }
  } catch (error) {
    console.error("Failed to send to external analytics:", error);
  }
}

/**
 * 发送性能告警
 */
async function sendPerformanceAlert(type: string, data: unknown) {
  try {
    // Slack 告警
    if (process.env.SLACK_WEBHOOK_URL) {
      await fetch(process.env.SLACK_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: `🚨 Performance Alert: ${type}`,
          attachments: [
            {
              color: "danger",
              fields: Object.entries(data as Record<string, unknown>).map(([key, value]) => ({
                title: key,
                value: String(value),
                short: true,
              })),
            },
          ],
        }),
      });
    }

    // 邮件告警
    if (process.env.EMAIL_ALERT_ENDPOINT) {
      await fetch(process.env.EMAIL_ALERT_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: process.env.ALERT_EMAIL,
          subject: `Performance Alert: ${type}`,
          body: JSON.stringify(data, null, 2),
        }),
      });
    }
  } catch (error) {
    console.error("Failed to send performance alert:", error);
  }
}

/**
 * 获取性能统计数据 (GET 请求)
 */
export function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get("timeRange") || "24h";
    const metric = searchParams.get("metric");

    // 这里应该从数据库或缓存中获取统计数据
    // 目前返回模拟数据
    const stats = {
      timeRange,
      metric,
      summary: {
        totalEvents: 1234,
        avgLCP: 2100,
        avgFID: 85,
        avgCLS: 0.08,
        slowResources: 12,
        longTasks: 5,
      },
      trends: [
        { timestamp: Date.now() - 3600000, value: 2000 },
        { timestamp: Date.now() - 1800000, value: 2200 },
        { timestamp: Date.now(), value: 2100 },
      ],
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Failed to get analytics stats:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
