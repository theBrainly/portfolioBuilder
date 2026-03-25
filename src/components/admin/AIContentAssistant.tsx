"use client";

import { useEffect, useMemo, useState } from "react";
import { Bot, Sparkles, Wand2 } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import {
  AI_PROVIDERS,
  AI_PROVIDER_MODELS,
  AI_TARGET_FIELDS,
  type AIContentFieldId,
  type AIProvider,
} from "@/constants/aiWriting";
import type { SettingsFormData } from "@/lib/validations";
import toast from "react-hot-toast";

const STORAGE_KEY = "portfolio-admin-ai-writer";

type AssistantState = {
  provider: AIProvider;
  model: string;
  customModel: string;
  groqApiKey: string;
  openrouterApiKey: string;
  targetField: AIContentFieldId;
  prompt: string;
};

function getInitialState(): AssistantState {
  return {
    provider: "groq",
    model: AI_PROVIDER_MODELS.groq[0].id,
    customModel: "",
    groqApiKey: "",
    openrouterApiKey: "",
    targetField: "aboutDescription",
    prompt: "",
  };
}

function buildSiteContext(values: Partial<SettingsFormData>) {
  return {
    brandName: values.brandName,
    designPreset: values.designPreset,
    themePalette: values.themePalette,
    heroTitle: values.heroTitle,
    heroSubtitle: values.heroSubtitle,
    aboutTitle: values.aboutTitle,
    aboutDescription: values.aboutDescription,
    yearsOfExperience: values.yearsOfExperience,
    totalProjects: values.totalProjects,
    totalClients: values.totalClients,
    location: values.location,
    email: values.email,
    siteTitle: values.siteTitle,
    siteDescription: values.siteDescription,
  };
}

export default function AIContentAssistant({
  values,
  onApply,
}: {
  values: Partial<SettingsFormData>;
  onApply: (field: AIContentFieldId, value: string) => void;
}) {
  const [state, setState] = useState<AssistantState>(getInitialState);
  const [loaded, setLoaded] = useState(false);
  const [result, setResult] = useState("");
  const [resolvedModel, setResolvedModel] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const modelOptions = useMemo(
    () => AI_PROVIDER_MODELS[state.provider],
    [state.provider]
  );
  const activeField = useMemo(
    () => AI_TARGET_FIELDS.find((field) => field.id === state.targetField) || AI_TARGET_FIELDS[0],
    [state.targetField]
  );
  const currentFieldValue =
    typeof values[state.targetField as keyof SettingsFormData] === "string"
      ? String(values[state.targetField as keyof SettingsFormData] || "")
      : "";
  const currentApiKey =
    state.provider === "groq" ? state.groqApiKey : state.openrouterApiKey;

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        setLoaded(true);
        return;
      }

      const parsed = JSON.parse(raw) as Partial<AssistantState>;
      const initial = getInitialState();
      const nextProvider =
        parsed.provider === "openrouter" || parsed.provider === "groq"
          ? parsed.provider
          : initial.provider;
      const nextModels = AI_PROVIDER_MODELS[nextProvider];
      const nextModel =
        parsed.model && nextModels.some((model) => model.id === parsed.model)
          ? parsed.model
          : nextModels[0].id;

      setState({
        ...initial,
        ...parsed,
        provider: nextProvider,
        model: nextModel,
      });
    } catch {
      setState(getInitialState());
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!loaded) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [loaded, state]);

  useEffect(() => {
    if (modelOptions.some((model) => model.id === state.model)) return;
    setState((current) => ({ ...current, model: modelOptions[0].id }));
  }, [modelOptions, state.model]);

  const handleGenerate = async () => {
    if (!state.prompt.trim()) {
      toast.error("Add a prompt describing what you want written.");
      return;
    }

    setIsGenerating(true);
    setResolvedModel("");

    try {
      const response = await fetch("/api/admin/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: state.provider,
          model: state.model,
          customModel: state.customModel,
          apiKey: currentApiKey,
          prompt: state.prompt,
          targetField: state.targetField,
          currentValue: currentFieldValue,
          siteContext: buildSiteContext(values),
        }),
      });

      const payload = await response.json();
      if (!response.ok || !payload.success) {
        throw new Error(payload.error || "Failed to generate content");
      }

      setResult(payload.data.text);
      setResolvedModel(payload.data.model || state.customModel || state.model);
      toast.success("Draft generated");
    } catch (error: any) {
      toast.error(error.message || "Failed to generate content");
    } finally {
      setIsGenerating(false);
    }
  };

  const applyGeneratedText = () => {
    if (!result.trim()) {
      toast.error("Generate a draft first.");
      return;
    }

    onApply(state.targetField, result.trim());
    toast.success(`Applied to ${activeField.label}`);
  };

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 space-y-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-2 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-text-muted">
            <Bot className="h-3.5 w-3.5" />
            AI Writer
          </div>
          <h3 className="mt-4 text-lg font-semibold text-text-primary">
            Generate content for site fields
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-text-muted">
            Describe what you want, choose a provider and model, and apply the draft
            directly to the selected settings field. The assistant also uses the local
            portfolio writing guide from `doc/skills.md`.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-surface-2 px-4 py-3 text-xs text-text-muted">
          API keys are stored only in this browser.
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-4">
        <Select
          label="Provider"
          value={state.provider}
          onChange={(event) =>
            setState((current) => ({
              ...current,
              provider: event.target.value as AIProvider,
              model: AI_PROVIDER_MODELS[event.target.value as AIProvider][0].id,
            }))
          }
          options={AI_PROVIDERS.map((provider) => ({
            value: provider.id,
            label: provider.label,
          }))}
        />

        <Select
          label="Model"
          value={state.model}
          onChange={(event) =>
            setState((current) => ({ ...current, model: event.target.value }))
          }
          options={modelOptions.map((model) => ({
            value: model.id,
            label: model.label,
          }))}
        />

        <Input
          label={
            state.provider === "groq" ? "Groq API Key" : "OpenRouter API Key"
          }
          type="password"
          value={currentApiKey}
          onChange={(event) =>
            setState((current) =>
              state.provider === "groq"
                ? { ...current, groqApiKey: event.target.value }
                : { ...current, openrouterApiKey: event.target.value }
            )
          }
          helperText={
            state.provider === "openrouter"
              ? "Leave blank if OPENROUTER_API_KEY is configured. `openrouter/free` uses a free-model router."
              : "Leave blank if GROQ_API_KEY is configured."
          }
        />

        <Input
          label="Custom Model ID"
          value={state.customModel}
          onChange={(event) =>
            setState((current) => ({ ...current, customModel: event.target.value }))
          }
          placeholder={
            state.provider === "openrouter"
              ? "Optional, e.g. any-model-id:free"
              : "Optional model override"
          }
          helperText="Optional. If filled, this overrides the selected model."
        />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
        <div className="space-y-4">
          <Select
            label="Write For Field"
            value={state.targetField}
            onChange={(event) =>
              setState((current) => ({
                ...current,
                targetField: event.target.value as AIContentFieldId,
              }))
            }
            options={AI_TARGET_FIELDS.map((field) => ({
              value: field.id,
              label: field.label,
            }))}
          />

          <div className="rounded-2xl border border-border bg-surface-2 p-4">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-text-muted">
              Field guidance
            </p>
            <p className="mt-3 text-sm font-medium text-text-primary">
              {activeField.label}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-text-muted">
              {activeField.placeholder}
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-surface-2 p-4">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-text-muted">
              Current field value
            </p>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-text-secondary">
              {currentFieldValue || "This field is currently empty."}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <Textarea
            label="Prompt"
            rows={6}
            value={state.prompt}
            onChange={(event) =>
              setState((current) => ({ ...current, prompt: event.target.value }))
            }
            placeholder={`Example: I am a frontend developer with 4 years of experience building SaaS dashboards. I want this ${activeField.label.toLowerCase()} to sound calm, premium, and clear without hype.`}
          />

          <div className="flex flex-wrap gap-3">
            <Button
              type="button"
              onClick={handleGenerate}
              isLoading={isGenerating}
              leftIcon={<Sparkles className="h-4 w-4" />}
            >
              Generate Draft
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={applyGeneratedText}
              disabled={!result.trim()}
              leftIcon={<Wand2 className="h-4 w-4" />}
            >
              Apply To Field
            </Button>
          </div>

          <Textarea
            label="Generated Draft"
            rows={8}
            value={result}
            onChange={(event) => setResult(event.target.value)}
            placeholder="The generated draft will appear here. You can edit it before applying."
          />

          <div className="rounded-2xl border border-border bg-surface-2 p-4 text-sm text-text-muted">
            <p>
              Selected provider:{" "}
              <span className="font-medium text-text-primary">
                {AI_PROVIDERS.find((provider) => provider.id === state.provider)?.label}
              </span>
            </p>
            <p className="mt-1">
              Active model:{" "}
              <span className="font-medium text-text-primary">
                {resolvedModel || state.customModel || state.model}
              </span>
            </p>
            <p className="mt-1">
              Tip: OpenRouter accepts `openrouter/free` or a custom model ending in
              `:free` when you want a free model route.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
