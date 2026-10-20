"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import type * as THREE from "three";
import { ArrowRight, Download, Move3d, RotateCcw, Upload } from "lucide-react";
import { swatches } from "@/lib/content";
import type { Capture } from "@/components/three/ConfiguratorScene";
import { SPEC_EVENT, type SpecDetail } from "@/lib/spec";
import { pop, ScrambleText } from "@/components/anim/Anim";
import { StageLoading } from "./HeroStage";

const ConfiguratorScene = dynamic(
  () => import("@/components/three/ConfiguratorScene"),
  { ssr: false, loading: () => <StageLoading /> },
);

const sizes = [
  { id: "S", label: "S", value: 0.24 },
  { id: "M", label: "M", value: 0.32 },
  { id: "L", label: "L", value: 0.42 },
] as const;

const quantities = ["Under 250", "250–1,000", "1,000–5,000", "5,000+"] as const;


function Segmented<T extends string>({
  legend,
  name,
  options,
  value,
  onChange,
}: {
  legend: string;
  name: string;
  options: readonly { id: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <fieldset>
      <legend className="eyebrow text-white/55">{legend}</legend>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((o) => (
          <label
            key={o.id}
            className="cursor-pointer rounded-md border border-white/20 px-3.5 py-2 font-mono text-xs uppercase transition-colors hover:border-white/50 has-[:checked]:border-accent has-[:checked]:bg-accent has-[:checked]:text-ink has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent"
          >
            <input
              type="radio"
              name={name}
              value={o.id}
              checked={value === o.id}
              onChange={(e) => {
                onChange(o.id);
                pop(e.currentTarget.parentElement, 0.9);
              }}
              className="sr-only"
            />
            {o.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function Configurator() {
  const uid = useId();
  const [colorName, setColorName] = useState("Navy");
  const [logo, setLogo] = useState<THREE.Texture | "placeholder">("placeholder");
  const [logoName, setLogoName] = useState<string | null>(null);
  const [logoError, setLogoError] = useState<string | null>(null);
  const [size, setSize] = useState<(typeof sizes)[number]["id"]>("M");
  const [qty, setQty] = useState<(typeof quantities)[number]>("250–1,000");
  const capture = useRef<Capture | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const swatch = swatches.find((s) => s.name === colorName)!;
  const sizeValue = sizes.find((s) => s.id === size)!.value;

  useEffect(
    () => () => {
      if (logo !== "placeholder") logo.dispose();
    },
    [logo],
  );

  const onCaptureReady = useCallback((fn: Capture) => {
    capture.current = fn;
  }, []);

  async function onFile(file: File | undefined) {
    if (!file) return;
    setLogoError(null);
    if (!file.type.startsWith("image/")) {
      setLogoError("Please choose a PNG, JPG, WEBP or SVG image.");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setLogoError("That file is over 8 MB — try a smaller export.");
      return;
    }
    try {
      const { textureFromFile } = await import("@/components/three/Bag");
      setLogo(await textureFromFile(file));
      setLogoName(file.name);
    } catch {
      setLogoError("We couldn't read that image. Try a PNG export.");
    }
  }

  function resetLogo() {
    setLogo("placeholder");
    setLogoName(null);
    setLogoError(null);
    if (fileInput.current) fileInput.current.value = "";
  }

  function saveImage() {
    const shot = capture.current?.();
    if (!shot) return;
    const img = new Image();
    img.onload = () => {
      const c = document.createElement("canvas");
      c.width = img.width;
      c.height = img.height;
      const ctx = c.getContext("2d")!;
      ctx.fillStyle = "#efeeea";
      ctx.fillRect(0, 0, c.width, c.height);
      ctx.drawImage(img, 0, 0);
      ctx.fillStyle = "#4a4f57";
      ctx.font = `${Math.round(c.width / 60)}px ui-monospace, monospace`;
      ctx.fillText(
        `BIZCRAFT · BZ-BP/01 · ${colorName.toUpperCase()} · PREVIEW`,
        c.width * 0.04,
        c.height * 0.95,
      );
      const a = document.createElement("a");
      a.href = c.toDataURL("image/png");
      a.download = `bizcraft-backpack-${colorName.toLowerCase()}.png`;
      a.click();
    };
    img.src = shot;
  }

  function sendSpec() {
    const detail: SpecDetail = {
      product: "Backpacks",
      quantity: qty,
      message: [
        "Spec from the website configurator:",
        "• Style: BZ-BP/01 rucksack",
        `• Fabric colour: ${colorName} (${swatch.hex})`,
        `• Logo: ${logoName ? `${logoName} — I'll attach the file` : "to be shared"}, front pocket, size ${size}`,
        `• Quantity: ${qty}`,
      ].join("\n"),
    };
    window.dispatchEvent(new CustomEvent<SpecDetail>(SPEC_EVENT, { detail }));
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
      {/* Photo-studio sweep: a lit white cyclorama inside the dark section. */}
      <div className="relative h-[360px] overflow-hidden rounded-2xl bg-[radial-gradient(ellipse_70%_62%_at_50%_42%,#ffffff_0%,#efeeea_48%,#d6d4ce_100%)] text-ink shadow-[0_10px_30px_-12px_rgb(0_0_0/0.6)] max-lg:sticky max-lg:top-[4.75rem] max-lg:z-10 sm:h-[480px] lg:col-span-8 lg:h-auto lg:min-h-[720px]">
        <ConfiguratorScene
          color={swatch.hex}
          logo={logo}
          logoSize={sizeValue}
          onCaptureReady={onCaptureReady}
        />
        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-6 md:p-8">
          <div>
            <p className="eyebrow text-ink-3">BZ-BP/01 — Rucksack</p>
            <p className="display mt-3 text-3xl font-semibold uppercase tracking-[-0.04em] md:text-4xl">
              <ScrambleText text={colorName} chars="a-z" />
            </p>
          </div>
          <p className="eyebrow hidden items-center gap-2 text-ink-3 sm:flex">
            <Move3d size={16} aria-hidden /> Drag to rotate
          </p>
        </div>
        <p className="eyebrow pointer-events-none absolute bottom-6 left-6 text-ink-3 md:bottom-8 md:left-8">
          Preview · Colours matched to fabric at sampling
        </p>
      </div>

      <div
        aria-label="Spec sheet"
        role="group"
        className="flex flex-col gap-7 rounded-2xl border border-white/10 bg-night-2 p-7 text-paper md:p-8 lg:col-span-4"
      >
        <div className="flex items-baseline justify-between border-b border-white/15 pb-5">
          <p className="display text-xl font-semibold uppercase tracking-[-0.03em]">Spec sheet</p>
          <p className="eyebrow text-white/50">No. BZ-BP/01</p>
        </div>

        <fieldset>
          <legend className="eyebrow text-white/55">
            01 · Fabric colour{" "}
            <span className="text-paper">
              — <ScrambleText text={colorName.toUpperCase()} />
            </span>
          </legend>
          <div className="mt-3 grid max-w-sm grid-cols-8 gap-2">
            {swatches.map((s) => (
              <label
                key={s.name}
                title={s.name}
                className="relative aspect-square cursor-pointer rounded-full border border-white/20 transition-transform hover:scale-105 has-[:checked]:ring-2 has-[:checked]:ring-accent has-[:checked]:ring-offset-[3px] has-[:checked]:ring-offset-night-2 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-white"
                style={{ background: s.hex }}
              >
                <input
                  type="radio"
                  name={`${uid}-colour`}
                  value={s.name}
                  checked={colorName === s.name}
                  onChange={(e) => {
                    setColorName(s.name);
                    pop(e.currentTarget.parentElement, 0.7);
                  }}
                  className="sr-only"
                />
                <span className="sr-only">{s.name}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          <p className="eyebrow text-white/55">02 · Your logo</p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <label className="btn btn-ghost h-11 cursor-pointer hover:border-accent hover:bg-accent has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-accent">
              <Upload size={16} aria-hidden />
              {logoName ? "Replace logo" : "Upload logo"}
              <input
                ref={fileInput}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/svg+xml"
                className="sr-only"
                onChange={(e) => onFile(e.target.files?.[0])}
              />
            </label>
            {logoName ? (
              <button
                type="button"
                onClick={resetLogo}
                className="inline-flex h-11 items-center gap-1.5 rounded-full px-3 text-sm text-white/70 hover:text-paper"
              >
                <RotateCcw size={14} aria-hidden /> Reset
              </button>
            ) : null}
          </div>
          <p className="mt-2 truncate text-sm text-white/50" aria-live="polite">
            {logoError ? (
              <span className="text-accent">{logoError}</span>
            ) : logoName ? (
              logoName
            ) : (
              "PNG with a transparent background works best."
            )}
          </p>
        </div>

        <Segmented
          legend="03 · Logo size"
          name={`${uid}-size`}
          options={sizes}
          value={size}
          onChange={setSize}
        />

        <Segmented
          legend="04 · Quantity"
          name={`${uid}-qty`}
          options={quantities.map((q) => ({ id: q, label: q }))}
          value={qty}
          onChange={setQty}
        />

        <div className="mt-auto flex flex-col gap-3 border-t border-white/15 pt-6">
          <button
            type="button"
            onClick={sendSpec}
            className="btn btn-accent w-full justify-center"
          >
            Send this spec <ArrowRight size={18} aria-hidden />
          </button>
          <button
            type="button"
            onClick={saveImage}
            className="btn btn-ghost w-full justify-center"
          >
            <Download size={16} aria-hidden /> Save preview image
          </button>
        </div>
      </div>
    </div>
  );
}
