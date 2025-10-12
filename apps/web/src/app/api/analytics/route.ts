import { NextResponse } from "next/server";
import { z } from "zod";

// 定义数据类型
interface ClientInfo {
  userAgent: string;
  language: string;
  platform: string;
  screenWidth: number;
  screenHeight: number;
}

interface PageViewData {
  url: string;
  referrer: string;
  title: string;
  sessionId: string;
}

interface EventData {
  name: string;
  category: string;
  label?: string;
  value?: number;
  sessionId: string;
}

interface ErrorData {
  message: string;
  stack: string;
  url: string;
  sessionId: string;
}

interface LongTaskData {
  duration: number;
  sessionId: string;
}

interface SlowResourceData {
  name: string;
  duration: number;
  size?: number;
  sessionId: string;
}

// 定义 Zod schemas
const PageViewDataSchema = z.object({
  url: z.string().url(),
  referrer: z.string(),
  title: z.string(),
  sessionId: z.string(),
});

const EventDataSchema = z.object({
  name: z.string(),
  category: z.string(),
  label: z.string().optional(),
  value: z.number().optional(),
  sessionId: z.string(),
});

const ErrorDataSchema = z.object({
  message: z.string(),
  stack: z.string(),
  url: z.string().url(),
  sessionId: z.string(),
});

const LongTaskDataSchema = z.object({
  duration: z.number(),
  sessionId: z.string(),
});

const SlowResourceDataSchema = z.object({
  name: z.string(),
  duration: z.number(),
  size: z.number().optional(),
  sessionId: z.string(),
});

// 定义事件类型映射
const eventSchemas: Record<string, z.ZodSchema> = {
  "page-view": PageViewDataSchema,
  event: EventDataSchema,
  error: ErrorDataSchema,
  "long-task": LongTaskDataSchema,
  "slow-resource": SlowResourceDataSchema,
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, data, clientInfo } = body;

    // 验证事件类型
    if (!(type && eventSchemas[type])) {
      return NextResponse.json({ error: "Invalid event type" }, { status: 400 });
    }

    // 验证数据
    const schema = eventSchemas[type];
    const result = schema.safeParse(data);
    if (!result.success) {
      return NextResponse.json({ error: "Invalid data", details: result.error }, { status: 400 });
    }

    const validatedData = result.data;
    const serverTimestamp = Date.now();

    // 处理不同类型的数据
    switch (type) {
      case "page-view":
        await handlePageView({ data: validatedData, clientInfo, serverTimestamp });
        break;
      case "event":
        await handleEvent({ data: validatedData, clientInfo, serverTimestamp });
        break;
      case "error":
        await handleError({ data: validatedData, clientInfo, serverTimestamp });
        break;
      case "long-task":
        await handleLongTask({ data: validatedData, clientInfo, serverTimestamp });
        break;
      case "slow-resource":
        await handleSlowResource({ data: validatedData, clientInfo, serverTimestamp });
        break;
      default:
        return NextResponse.json({ error: "Unsupported event type" }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Analytics API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * 处理页面浏览数据
 */
async function handlePageView(data: {
  data: PageViewData;
  clientInfo: ClientInfo;
  serverTimestamp: number;
}) {
  const pageViewData: PageViewData = data.data;

  // 在生产环境中，这里应该发送到实际的分析服务
  // 例如 Google Analytics, DataDog, New Relic 等

  if (process.env.NODE_ENV === "production") {
    await sendToExternalAnalytics("page-view", data);
  }

  console.log("Page view:", pageViewData);
}

/**
 * 处理事件数据
 */
async function handleEvent(data: {
  data: EventData;
  clientInfo: ClientInfo;
  serverTimestamp: number;
}) {
  const eventData: EventData = data.data;

  // 在生产环境中，这里应该发送到实际的分析服务

  if (process.env.NODE_ENV === "production") {
    await sendToExternalAnalytics("event", data);
  }

  console.log("Event:", eventData);
}

/**
 * 处理错误数据
 */
async function handleError(data: {
  data: ErrorData;
  clientInfo: ClientInfo;
  serverTimestamp: number;
}) {
  const errorData: ErrorData = data.data;

  // 错误应该被特别关注并发送告警
  console.error("Client error:", errorData);

  if (process.env.NODE_ENV === "production") {
    await sendToExternalAnalytics("error", data);

    // 发送告警
    await sendErrorAlert(errorData);
  }
}

/**
 * 处理长任务数据
 */
async function handleLongTask(data: {
  data: LongTaskData;
  clientInfo: ClientInfo;
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
  clientInfo: ClientInfo;
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
 * 发送到外部分析服务
 */
async function sendToExternalAnalytics(
  event: string,
  data: {
    data: PageViewData | EventData | ErrorData | LongTaskData | SlowResourceData;
    clientInfo: ClientInfo;
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
 * 发送错误告警
 */
async function sendErrorAlert(data: ErrorData) {
  try {
    // Slack 告警
    if (process.env.SLACK_WEBHOOK_URL) {
      await fetch(process.env.SLACK_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: "🚨 Client Error Alert",
          attachments: [
            {
              color: "danger",
              fields: [
                {
                  title: "Message",
                  value: data.message,
                  short: false,
                },
                {
                  title: "URL",
                  value: data.url,
                  short: true,
                },
                {
                  title: "Session ID",
                  value: data.sessionId,
                  short: true,
                },
              ],
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
          subject: "Client Error Alert",
          body: `Message: ${data.message}\nURL: ${data.url}\nStack: ${data.stack}`,
        }),
      });
    }
  } catch (error) {
    console.error("Failed to send error alert:", error);
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
