import { readFile } from "fs/promises";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import {
  AI_PROVIDERS,
  AI_TARGET_FIELD_IDS,
  AI_TARGET_FIELD_MAP,
  type AIProvider,
} from "@/constants/aiWriting";

const AI_PROVIDER_IDS = AI_PROVIDERS.map((provider) => provider.id) as [
  AIProvider,
  ...AIProvider[],
];

const aiGenerateSchema = z.object({
  provider: z.enum(AI_PROVIDER_IDS),
  model: z.string().min(1, "Model is required"),
  customModel: z.string().optional().default(""),
  apiKey: z.string().optional().default(""),
  prompt: z.string().min(10, "Prompt must be at least 10 characters").max(4000),
  targetField: z.enum(AI_TARGET_FIELD_IDS),
  currentValue: z.string().optional().default(""),
  siteContext: z.record(z.any()).optional().default({}),
});

function buildFieldInstruction(fieldKind: "short" | "medium" | "long") {
  switch (fieldKind) {
    case "short":
      return "Output a concise single line. Keep it compact, natural, and high-signal.";
    case "medium":
      return "Output 1 short paragraph or 1 to 3 short sentences.";
    case "long":
      return "Output 2 to 4 concise paragraphs with smooth flow and no fluff.";
    default:
      return "Output clean plain text only.";
  }
}

function formatContext(siteContext: Record<string, any>) {
  const entries = Object.entries(siteContext).filter(([, value]) => {
    if (value === null || value === undefined) return false;
    if (typeof value === "string") return value.trim().length > 0;
    return true;
  });

  if (!entries.length) return "No additional site context provided.";

  return entries
    .map(([key, value]) => {
      const label = key.replace(/([A-Z])/g, " $1").replace(/^./, (char) => char.toUpperCase());
      const formattedValue =
        typeof value === "string"
          ? value.trim()
          : Array.isArray(value)
            ? value.join(", ")
            : String(value);

      return `- ${label}: ${formattedValue}`;
    })
    .join("\n");
}

async function getSkillsContext() {
  try {
    const filePath = path.join(process.cwd(), "doc", "skills.md");
    return await readFile(filePath, "utf8");
  } catch {
    return "";
  }
}

function getProviderConfig(
  provider: AIProvider,
  apiKey: string,
  origin: string
): {
  url: string;
  headers: Record<string, string>;
} {
  if (provider === "groq") {
    return {
      url: "https://api.groq.com/openai/v1/chat/completions",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
    };
  }

  return {
    url: "https://openrouter.ai/api/v1/chat/completions",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "HTTP-Referer": origin,
      "X-Title": "Portfolio Admin AI Writer",
    },
  };
}

function extractMessageContent(payload: any) {
  const content = payload?.choices?.[0]?.message?.content;
  if (typeof content === "string") return content.trim();

  if (Array.isArray(content)) {
    return content
      .map((part) => {
        if (typeof part === "string") return part;
        if (typeof part?.text === "string") return part.text;
        return "";
      })
      .join("\n")
      .trim();
  }

  return "";
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validated = aiGenerateSchema.parse(body);
    const resolvedModel = validated.customModel.trim() || validated.model.trim();
    const apiKey =
      validated.apiKey.trim() ||
      (validated.provider === "groq"
        ? process.env.GROQ_API_KEY || ""
        : process.env.OPENROUTER_API_KEY || "");

    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error:
            validated.provider === "groq"
              ? "Add a Groq API key in the assistant or configure GROQ_API_KEY."
              : "Add an OpenRouter API key in the assistant or configure OPENROUTER_API_KEY.",
        },
        { status: 400 }
      );
    }

    const fieldMeta = AI_TARGET_FIELD_MAP[validated.targetField];
    const skillsContext = await getSkillsContext();
    const providerConfig = getProviderConfig(validated.provider, apiKey, req.nextUrl.origin);

    const response = await fetch(providerConfig.url, {
      method: "POST",
      headers: providerConfig.headers,
      body: JSON.stringify({
        model: resolvedModel,
        temperature: 0.7,
        max_tokens: fieldMeta.kind === "long" ? 700 : fieldMeta.kind === "medium" ? 260 : 80,
        messages: [
          {
            role: "system",
            content: [
              "You are an expert portfolio copywriter working inside an admin panel.",
              `The user wants content for the "${fieldMeta.label}" field.`,
              buildFieldInstruction(fieldMeta.kind),
              "Return only the final text for that field.",
              "Do not include markdown, labels, bullets, prefixes, or explanation.",
              "Do not invent facts that are not in the user's prompt or provided context.",
              skillsContext ? `Use this writing guide:\n${skillsContext}` : "",
            ]
              .filter(Boolean)
              .join("\n\n"),
          },
          {
            role: "user",
            content: [
              `Target field: ${fieldMeta.label}`,
              `Field purpose: ${fieldMeta.placeholder}`,
              validated.currentValue
                ? `Current field value:\n${validated.currentValue}`
                : "Current field value: empty",
              `User request:\n${validated.prompt}`,
              `Available portfolio context:\n${formatContext(validated.siteContext)}`,
            ].join("\n\n"),
          },
        ],
      }),
      cache: "no-store",
    });

    const payload = await response.json().catch(async () => ({
      error: { message: await response.text() },
    }));

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error:
            payload?.error?.message ||
            payload?.message ||
            "AI provider request failed.",
        },
        { status: response.status }
      );
    }

    const text = extractMessageContent(payload);
    if (!text) {
      return NextResponse.json(
        {
          success: false,
          error: "The model returned an empty response. Try a more specific prompt.",
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        text,
        provider: validated.provider,
        model: payload?.model || resolvedModel,
      },
    });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        { success: false, error: error.errors[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Failed to generate AI content" },
      { status: 500 }
    );
  }
}
