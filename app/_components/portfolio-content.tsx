'use client';

import React, { useCallback, useEffect, useRef, useState } from "react";
import type { Application } from "@splinetool/runtime";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Github, Linkedin, Mail, FileDown, Cpu, FlaskConical, Brain, Printer, Rocket, GraduationCap, BookOpen, Share2, Repeat2, Menu, X } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import type { LinkedInPost } from "@/lib/linkedin-posts";
import LiquidGlass from 'liquid-glass-react'

function App() {
  return (
    <LiquidGlass>
      <div className="p-6">
        <h2>Your content here</h2>
        <p>This will have the liquid glass effect</p>
      </div>
    </LiquidGlass>
  )
}
// ----
// Simple utility components
// ----
const Section = ({ id, title, subtitle, children }: { id: string; title: string; subtitle?: string; children: React.ReactNode }) => (
  <section id={id} className="relative mx-auto max-w-6xl px-6 sm:px-8 py-20">
    <motion.h2
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20%" }}
      transition={{ duration: 0.5 }}
      className="text-3xl md:text-4xl font-bold tracking-tight"
    >
      {title}
    </motion.h2>
    {subtitle && (
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-20%" }}
        transition={{ duration: 0.5, delay: 0.05 }}
        className="mt-2 text-muted-foreground max-w-2xl"
      >
        {subtitle}
      </motion.p>
    )}
    <div className="mt-8">{children}</div>
  </section>
);

const Badge = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
    {children}
  </span>
);

// Use a safe any-cast to read env var so TypeScript doesn't complain about Process typings
const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "");
const withBasePath = (path: string) => `${basePath}${path.startsWith("/") ? path : `/${path}`}`;
const cvDownloadHref = withBasePath("/stefan-ritchie-cv.pdf");

type SplineApplicationCtor = new (canvas: HTMLCanvasElement) => Application;

const loadSplineRuntime = (() => {
  let runtimePromise: Promise<SplineApplicationCtor> | null = null;
  return async () => {
    if (!runtimePromise) {
      runtimePromise = import("@splinetool/runtime").then(
        (mod) => mod.Application as SplineApplicationCtor,
      );
    }
    return runtimePromise;
  };
})();

// ----
// Data (feel free to edit these)
// ----
const projects = [
  {
    title: "MSc Dissertation • RNA‑seq Batch Correction",
    blurb:
      "Comparative analysis of empirical Bayes and surrogate variable approaches across multi‑cohort bulk RNA‑seq datasets with integration metrics (kBET, iLISI, silhouette).",
    tags: ["RNA‑seq", "Batch correction", "Empirical Bayes", "SVA"],
    cta: { label: "Download dissertation (PDF)", href: withBasePath("/dissertation-batch-correction.pdf") },
    icon: <GraduationCap className="w-5 h-5" />,
    details: {
      overview:
        "Capstone benchmarking of empirical (ComBat/limma variants) versus surrogate-variable methods (SVA, RUV family) on simulated and TARGET bulk RNA-seq cohorts.",
      bullets: [
        "Built a Nextflow + R/Python workflow: raw counts → library-size normalisation → CPM/log branches plus count-native paths for ComBat-Seq/RUV",
        "Benchmarked on Splatter-style simulations and TARGET/GEO neuroblastoma cohorts with known batch annotations",
        "Quantified harmonisation and biology retention via PERMANOVA R², kBET rejection, Batch/Bio Silhouette, iLISI/cLISI, PCR R², and gene-level R²",
        "Observed limma/ComBat drop PERMANOVA R² to ≈0.000–0.002 and kBET rejection to ≈1% while lifting Bio Silhouette above zero",
        "Published a decision matrix outlining empirical-label use (limma/ComBat) versus latent-confounder strategies (SVA/SVA-Seq, RUV variants)",
      ],
      links: [
        { label: "Read dissertation (PDF)", href: withBasePath("/dissertation-batch-correction.pdf") },
        { label: "Analysis repo", href: "https://github.com/stef1949/RNA-Seq-Batch-Correction" },
      ],
    },
  },
  {
    title: "BSc Dissertation • Sertraline/drSERTaa MD",
    blurb:
      "In silico molecular dynamics of Sertraline complexes with Danio rerio serotonin transporter (drSERTaa) using binding free energy and RMSD analysis to probe bioavailability risks.",
    tags: ["Molecular dynamics", "Sertraline", "Danio rerio", "Free energy"],
    cta: { label: "Download BSc dissertation (PDF)", href: withBasePath("/dissertation-bsc-sertraline.pdf") },
    icon: <BookOpen className="w-5 h-5" />,
    details: {
      overview:
        "Molecular dynamics dissertation quantifying Sertraline interactions with the zebrafish serotonin transporter to assess aquatic toxicology risk.",
      bullets: [
        "Ran 200 ns GROMACS trajectories with solvated complexes and progressive restraints",
        "Measured RMSD/RMSF, hydrogen bonding, and MM/PBSA energies to characterise binding",
        "Benchmark zebrafish transporter dynamics against human SERT references",
        "Discussed implications for wastewater pharmacology and environmental impact",
      ],
      pipeline: [
        "Generated homology model via SWISS-MODEL/AlphaFold inputs (70.83% identity, QMEANDisCo 0.74)",
        "Docked Sertraline to drSERTaa active site and parametrised ligands with CHARMM-GUI",
        "Executed energy minimisation → NVT/NPT equilibration → 200 ns production run in GROMACS",
        "Post-processed trajectories with GROMACS/MDAnalysis scripts for energy and conformational metrics",
      ],
      evaluation: [
        "Binding free energy: -11.56 kcal/mol (drSERTaa) vs -8.9 kcal/mol (human SERT)",
        "Ligand RMSD 1.5–2.4 Å showing less stable pose in drSERTaa vs human complex",
        "Tracked hydrogen bond persistence across 200 ns to contextualise affinity shifts",
      ],
      operations: [
        "Toolchain: SWISS-MODEL, AlphaFold references, CHARMM36 force field, CHARMM-GUI, GROMACS 2023",
        "Simulations executed on local GPU workstation with periodic checkpoints for restartability",
        "Results packaged with plots/notebooks documenting environmental toxicology implications",
      ],
      links: [
        { label: "Read dissertation (PDF)", href: withBasePath("/dissertation-bsc-sertraline.pdf") },
      ],
    },
  },
  {
    title: "LumiFur • ESP32‑S3 LED Visor",
    blurb:
      "BLE‑controlled protogen visor system (ESP‑IDF + Hub75 DMA) with iOS/watchOS companion app in SwiftUI.",
    tags: ["ESP32‑S3", "Hub75", "SwiftUI", "BLE", "ESP‑IDF"],
    cta: { label: "View repo / site", href: "https://github.com/stef1949" },
    icon: <Cpu className="w-5 h-5" />,
    details: {
      overview:
        "Wearable LED visor platform featuring an ESP32-S3 controller, Hub75 DMA renderer, and SwiftUI BLE companion apps for live animation control.",
      bullets: [
        "20+ built-in animation presets ready to push to the visor",
        "Powered by ESP32-S3 with Wi-Fi/Bluetooth radios and Qwiic/STEMMA expansion",
        "BLE 5.3 support for cable-free control",
        "SwiftUI companion app orchestrates colour, brightness, and playlists on iOS",
        "DIY bill of materials keeps builds affordable (£35–£90 depending on microcontroller/LED choice)",
      ],
      pipeline: [
        "ESP32-S3 firmware (ESP-IDF) drives addressable LEDs and exposes LumiFur BLE services",
        "iOS 14+ device discovers controller over BLE, pairs, and syncs animation sets",
        "Webflow documentation guides hardware assembly, wiring, and flashing the controller",
        "Spline demo and marketing site preview animation packs before deployment",
      ],
      operations: [
        "Supports ESP32-S3 by default with guidance for Teensy-class alternatives",
        "Hardware kit requires microcontroller, addressable LEDs, 5V supply, and wearable diffusion",
        "Companion app walkthrough covers first-time setup and BLE reconnect workflows",
      ],
    },
  },
  {
    title: "HarmonizeNN • Batch Correction",
    blurb:
      "Unsupervised neural network for bulk RNA‑seq batch correction with evaluation metrics (kBET, iLISI, silhouette).",
    tags: ["Python", "PyTorch", "RNA‑seq", "Batch effects", "Autoencoder"],
    cta: { label: "HarmonizeNN on GitHub", href: "https://github.com/stef1949/HarmonizeNN" },
    icon: <Brain className="w-5 h-5" />,
    details: {
      overview:
        "Adversarial autoencoder pipeline with gradient reversal to suppress batch signal while keeping phenotype labels intact.",
      bullets: [
        "CLI handles counts→CPM→log1p transforms with optional HVG selection",
        "Lambda schedules (linear, sigmoid, adaptive) balance reconstruction vs adversary",
        "Post-run PCA, boxplots, and silhouette metrics exported automatically",
        "Ships with W&B integration for reproducible tracking",
      ],
      links: [
        { label: "Repo", href: "https://github.com/stef1949/HarmonizeNN" },
        { label: "W&B Report", href: "https://api.wandb.ai/links/stef1949-sr-richies3d-ltd/xv6g7tlc" },
      ],
      pipeline: [
        "Counts ingestion with orientation autodetect ⇒ library size normalisation ⇒ CPM/log1p",
        "Optional HVG filtering + per-gene z-scoring for stable training then inverse transform",
        "Adversarial autoencoder with gradient reversal batch classifier and optional supervised head",
        "Exports corrected logCPM matrix, latent embeddings, PCA plots, and batch QC dashboards",
      ],
      evaluation: [
        "kBET pass-rate ↑ from 42% → 89% on GEO multi-cohort benchmarks",
        "iLISI scores stabilised > 1.8 while preserving condition silhouette > 0.75",
        "Latent UMAP shows batch mixing without collapsing biological subtypes",
      ],
      operations: [
        "Docker recipe + Make targets for containerised runs on HPC/Cloud",
        "Weights & Biases sweeps track hyperparameters, metrics, and artifact lineage",
        "CI smoke tests validate dataset orientation parsing and CLI entrypoints",
      ],
    },
  },
  {
    title: "Electron Orbital Simulator",
    blurb:
      "GPU‑accelerated orbital visualizer producing probability density maps and isosurfaces.",
    tags: ["CUDA/CuPy", "Numerical", "Visualization"],
    cta: { label: "View on GitHub", href: "https://github.com/stef1949/Electron-Orbital-Simulator" },
    icon: <FlaskConical className="w-5 h-5" />,
    details: {
      overview:
        "GPU-accelerated simulator that renders electron probability densities and isosurfaces for hydrogenic orbitals in real time.",
      bullets: [
        "Normalized hydrogenic Rnl(r) and real spherical harmonics (up to f) implemented for accurate |ψ|² sampling",
        "Four render paths (Instanced, Points, WebGL GPU, WebGPU compute) adapt to browser/GPU capabilities",
        "Interactive UI exposes presets, density controls, HDR toggle, depth culling, and export to PNG",
        "Continuous integration runs npm tests on push; repo ships MIT license and security policy",
      ],
      pipeline: [
        "Sampling tables precompute inverse CDFs for |R|² r² and |Y|² sinθ to drive instanced and GPU modes",
        "WebGL path renders to RGBA32F textures consumed by point shader; WebGPU compute path generates point buffers",
        "UI built with Web Components; orientation overlay provides smooth axes snaps",
        "Build tooling: Vite bundler, worker-based sampler, npm scripts for dev/test",
      ],
      evaluation: [
        "Requires WebGL2 with EXT_color_buffer_float; WebGPU path targets Chrome/Edge 113+",
        "Importance sampling yields dense electron clouds without rejection sampling artefacts",
        "Test suite exercises math utilities and sampling helpers via npm test",
      ],
      operations: [
        "Release tarball in dist/ for static hosting; run `python3 -m http.server` or `npx http-server`",
        "Contribution guidelines cover tuning point size/brightness and fallback behaviour",
      ],
      links: [
        { label: "Simulator repo", href: "https://github.com/stef1949/Electron-Orbital-Simulator" },
      ],
    },
  },
  {
    title: "Richies 3D Ltd • Models & Fursuits",
    blurb:
      "FDM & resin printing for anatomical models and fursuit components. Etsy storefront and custom commissions.",
    tags: ["FDM", "Resin", "Etsy", "CAD"],
    cta: { label: "Enquire", href: "mailto:admin@richies.uk" },
    icon: <Printer className="w-5 h-5" />,
    details: {
      overview:
        "Custom fabrication producing anatomical models and fursuit components with FDM and resin workflows.",
      bullets: [
        "Parametric CAD templates let clients tweak sizing, articulation, and magnet mounts",
        "Material menu spans PLA+, PETG, TPU, and photopolymer resins for impact, flexibility, or surface quality",
        "Finishing services cover sanding, priming, airbrushing, clear coats, and optional electronics",
        "Order flow supports Etsy storefronts plus bespoke brief-to-delivery commissions",
      ],
      pipeline: [
        "Consultation captures reference imagery/measurements and selects material + finish",
        "CAD + slicer setup produce tuned profiles (layer heights, infill, support strategy)",
        "FDM/resin print runs monitored with in-process checks; parts cured, washed, and inspected",
        "Finishing, hardware install, and packaging with care sheets and spare consumables",
      ],
      operations: [
        "Maintains calibrated printer fleet (FDM & resin) with maintenance logs and material profiling",
        "QA checklist verifies tolerances, surface quality, and articulation before dispatch",
        "Aftercare support covers repaint kits, replacement components, and maintenance advice",
      ],
      links: [
        { label: "Email enquiry", href: "mailto:admin@richies.uk" },
        { label: "Etsy store", href: "https://www.etsy.com/uk/shop/Richies3D" },
      ],
    },
  },
];

const experience = [
  { role: "MSc Genetic Manipulation & Molecular Biosciences", org: "University of Sussex", time: "2024–2025" },
  { role: "BSc Biomedical Science", org: "University of Brighton", time: "2019–2023" },
  { role: "Bioinformatics & Computational Biology Projects", org: "Personal / Open‑source", time: "Ongoing" },
];

// ----
// Main Component
// ----
type PortfolioContentProps = {
  linkedinPosts: LinkedInPost[];
  linkedinMessage?: string | null;
};

export default function PortfolioContent({ linkedinPosts, linkedinMessage = null }: PortfolioContentProps) {
  const ROTATE_TARGET_NAME = 'Globe'; // Change to your object name from Spline
  const [mounted, setMounted] = useState(false);
  const [shouldRenderSpline, setShouldRenderSpline] = useState(false);
  const appRef = useRef<Application | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const navMouseContainerRef = useRef<HTMLDivElement | null>(null);
  const scrollRafRef = useRef<number | null>(null);
  const [sharedPost, setSharedPost] = useState<string | null>(null);
  const [expandedProject, setExpandedProject] = useState<string | null>(null);
  // Minimal types for Spline runtime interop
  type SplineRotation = { x: number; y: number; z: number };
  type SplineNodeLike = {
    id?: string | number;
    name?: string;
    title?: string;
    rotation?: SplineRotation;
    children?: SplineNodeLike[];
    nodes?: SplineNodeLike[];
    objects?: SplineNodeLike[];
    items?: SplineNodeLike[];
  };
  type SplineAppLike = {
    scene?: SplineNodeLike;
    findObjectByName?: (name: string) => SplineNodeLike | null | undefined;
    setRotation?: (id: string | number, x: number, y: number, z: number) => void;
    addEventListener?: (type: string, listener: (ev: unknown) => void) => void;
    removeEventListener?: (type: string, listener: (ev: unknown) => void) => void;
    setSize?: (width: number, height: number) => void;
    setGlobalEvents?: (enabled: boolean) => void;
    load?: (url: string) => Promise<void>;
    dispose?: () => void;
  };

  const splineScrollHandlerRef = useRef<((e: unknown) => void) | null>(null);
  const rotateTargetRef = useRef<SplineNodeLike | null>(null);
  const removeScrollHandlerRef = useRef<(() => void) | null>(null);
  const [splineError, setSplineError] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Best-effort traversal to list object names in the Spline scene
  const collectObjectNames = useCallback((app: unknown): string[] => {
    const names: string[] = [];
    const seen = new Set<unknown>();
    const pushName = (node: Partial<SplineNodeLike> | undefined | null) => {
      const n = node?.name ?? node?.title ?? node?.id;
      if (n && typeof n === 'string') names.push(n);
    };
    const walk = (node: unknown, depth = 0) => {
      if (!node || seen.has(node) || depth > 5) return;
      seen.add(node);
      const n = node as Partial<SplineNodeLike>;
      pushName(n);
      const kids = ([] as unknown[])
        .concat((n.children as unknown[]) || [])
        .concat((n.nodes as unknown[]) || [])
        .concat((n.objects as unknown[]) || [])
        .concat((n.items as unknown[]) || []);
      for (const k of kids) walk(k, depth + 1);
    };
    try {
      const a = app as SplineAppLike;
      if (a?.scene) walk(a.scene);
      // Some runtimes keep top-level objects under app.
      walk(app);
    } catch {}
    return Array.from(new Set(names)).filter(Boolean);
  }, []);

  const activeProject = expandedProject ? projects.find((p) => p.title === expandedProject) ?? null : null;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const detectWebGL = () => {
      try {
        const canvas = document.createElement('canvas');
        const context =
          canvas.getContext('webgl2') ??
          canvas.getContext('webgl') ??
          canvas.getContext('experimental-webgl');
        return Boolean(context && 'getParameter' in context);
      } catch {
        return false;
      }
    };

    const nextValue = detectWebGL();
    setShouldRenderSpline((prev) => (prev === nextValue ? prev : nextValue));
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const { body } = document;
    if (!body) return;
    const previous = body.style.overflow;
    if (expandedProject) {
      body.style.overflow = 'hidden';
    }
    return () => {
      body.style.overflow = previous;
    };
  }, [expandedProject]);

  useEffect(() => {
    if (!expandedProject) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setExpandedProject(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [expandedProject]);

  const handleSharePost = async (title: string, href: string) => {
    const shareUrl = href || 'https://www.linkedin.com/in/stefan-ritchie/';
    try {
      if (typeof navigator !== 'undefined' && 'share' in navigator && typeof navigator.share === 'function') {
        await navigator.share({ title, url: shareUrl });
        setSharedPost(title);
        return;
      }
    } catch (err) {
      // Ignore abort errors where the user cancels the share sheet
      const aborted = (err as { name?: string } | null)?.name === 'AbortError';
      if (!aborted) {
        console.warn('Web Share API failed, falling back to clipboard', err);
      } else {
        return;
      }
    }
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        await navigator.clipboard.writeText(shareUrl);
        setSharedPost(title);
        return;
      }
    } catch (err) {
      console.warn('Clipboard write failed, falling back to opening link', err);
    }
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  };

  const toggleProjectDetails = (title: string) => {
    setExpandedProject((prev) => (prev === title ? null : title));
  };

  // Clean up Spline runtime scroll listener on unmount
  useEffect(() => {
    return () => {
      const runtime = appRef.current as unknown as SplineAppLike | null;
      if (runtime?.removeEventListener && splineScrollHandlerRef.current) {
        runtime.removeEventListener('scroll', splineScrollHandlerRef.current);
      }
      if (removeScrollHandlerRef.current) {
        removeScrollHandlerRef.current();
      }
      if (scrollRafRef.current !== null) {
        cancelAnimationFrame(scrollRafRef.current);
        scrollRafRef.current = null;
      }
      rotateTargetRef.current = null;
      const disposable = appRef.current as unknown as { dispose?: () => void } | null;
      disposable?.dispose?.();
      appRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mounted || !shouldRenderSpline) return;

    let cancelled = false;

    const onResize = () => {
      const el = containerRef.current;
      const app = appRef.current as SplineAppLike | null;
      if (!el || !app?.setSize) return;
      const { clientWidth, clientHeight } = el;
      if (clientWidth > 0 && clientHeight > 0) {
        app.setSize(clientWidth, clientHeight);
      }
    };

    const setup = async () => {
      if (!canvasRef.current || !containerRef.current) return;
      try {
        const ApplicationCtor = await loadSplineRuntime();
        if (cancelled || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const app = new ApplicationCtor(canvas);
        const disposableApp = app as unknown as { dispose?: () => void };
        if (cancelled) {
          disposableApp.dispose?.();
          return;
        }
        appRef.current = app;
        const el = containerRef.current;
        const { clientWidth, clientHeight } = el;
        if (clientWidth > 0 && clientHeight > 0) {
          app.setSize(clientWidth, clientHeight);
        }

        try {
          await app.load('https://prod.spline.design/bXae1i6w76cK2003/scene.splinecode');
        } catch (err) {
          console.error('[Spline] Failed to load scene', err);
          setSplineError('Failed to load Spline scene');
          disposableApp.dispose?.();
          appRef.current = null;
          return;
        }

        if (cancelled) {
          disposableApp.dispose?.();
          appRef.current = null;
          return;
        }

        app.setGlobalEvents?.(true);

        const runtime = app as unknown as SplineAppLike;
        if (splineScrollHandlerRef.current && runtime.removeEventListener) {
          runtime.removeEventListener('scroll', splineScrollHandlerRef.current);
        }
        splineScrollHandlerRef.current = null;

        const tryFindRotateTarget = () => {
          const a = app as unknown as SplineAppLike;
          if (a?.findObjectByName && ROTATE_TARGET_NAME) {
            try {
              const obj = a.findObjectByName(ROTATE_TARGET_NAME);
              if (obj) return obj;
            } catch {}
          }
          if (a?.findObjectByName) {
            const candidates = ['Root', 'root', 'Scene', 'scene', 'Model', 'Group', 'Empty', 'Pivot'];
            for (const name of candidates) {
              try {
                const obj = a.findObjectByName(name);
                if (obj) return obj;
              } catch {}
            }
          }
          const children = a?.scene?.children;
          if (Array.isArray(children)) {
            const obj = children.find((o: SplineNodeLike) => o?.rotation);
            if (obj) return obj;
          }
          return a?.scene ?? null;
        };

        rotateTargetRef.current = tryFindRotateTarget();
        setSplineError(null);
        if (cancelled) {
          return;
        }
        if (!rotateTargetRef.current) {
          const names = collectObjectNames(app);
          console.warn('No rotatable target found in Spline scene. Available names:', names);
        }

        let ticking = false;
        const onScroll = () => {
          if (ticking) return;
          ticking = true;
          scrollRafRef.current = window.requestAnimationFrame(() => {
            ticking = false;
            const target = rotateTargetRef.current;
            if (!target) return;
            const doc = document.documentElement;
            const max = Math.max(1, doc.scrollHeight - doc.clientHeight);
            const t = Math.min(1, Math.max(0, window.scrollY / max));
            const angle = t * Math.PI * 2;
            const runtimeLike = app as unknown as SplineAppLike;
            if (target.rotation) {
              try {
                target.rotation.y = angle;
                return;
              } catch {}
            }
            if (runtimeLike?.setRotation && target?.id != null) {
              try {
                runtimeLike.setRotation(target.id, 0, angle, 0);
              } catch {}
            }
          });
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        removeScrollHandlerRef.current = () => {
          window.removeEventListener('scroll', onScroll);
          if (scrollRafRef.current !== null) {
            cancelAnimationFrame(scrollRafRef.current);
            scrollRafRef.current = null;
          }
        };
      } catch (err) {
        console.error('[Spline] Runtime failed to initialise', err);
        setSplineError('Spline is unavailable in this browser');
      }
    };

    setup();
    window.addEventListener('resize', onResize, { passive: true });

    return () => {
      cancelled = true;
      window.removeEventListener('resize', onResize);
      if (removeScrollHandlerRef.current) {
        removeScrollHandlerRef.current();
        removeScrollHandlerRef.current = null;
      }
      const runtime = appRef.current as unknown as SplineAppLike | null;
      if (runtime?.removeEventListener && splineScrollHandlerRef.current) {
        runtime.removeEventListener('scroll', splineScrollHandlerRef.current);
      }
      splineScrollHandlerRef.current = null;
      if (scrollRafRef.current !== null) {
        cancelAnimationFrame(scrollRafRef.current);
        scrollRafRef.current = null;
      }
      rotateTargetRef.current = null;
      const disposable = appRef.current as unknown as { dispose?: () => void } | null;
      disposable?.dispose?.();
      appRef.current = null;
    };
  }, [collectObjectNames, mounted, shouldRenderSpline]);

  return (
    <LayoutGroup>
      <div className="static min-h-screen bg-background text-foreground selection:bg-foreground ">
        {/* Background Spline scene (fixed right, behind content) */}
        <div className="fixed inset-0 z-0">
          <div className="absolute inset-0">
            <div
              ref={containerRef}
              className="absolute top-0 bottom-0 right-0 w-full md:w-1/2 z-0 touch-pan-y"
            >
              {!mounted ? (
                <div className="absolute inset-0 bg-muted/10 animate-pulse" />
              ) : shouldRenderSpline ? (
                <>
                  <canvas ref={canvasRef} className="h-full w-full pointer-events-auto" aria-hidden />
                  {splineError && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/90">
                      <p className="text-sm text-muted-foreground">{splineError}</p>
                    </div>
                  )}
                </>
              ) : (
                <div className="absolute inset-0 bg-linear-to-b from-muted/10 via-background to-background" aria-hidden />
              )}
            </div>
            <div className="absolute inset-0 z-0 pointer-events-none bg-linear-to-b from-background/50 md:from-background/0 via-background/80 md:via-background/0 to-background" />
          </div>
        </div>

        {/* Nav */}
        <header className="fixed top-6 left-0 right-0 z-30 px-4 sm:px-6 flex justify-center pointer-events-none">
          <div ref={navMouseContainerRef} className="pointer-events-auto relative">
            <LiquidGlass
              displacementScale={64}
              blurAmount={0.1}
              saturation={130}
              aberrationIntensity={2}
              elasticity={0.3}
              cornerRadius={100}
              padding="2px 2px"
              mode="shader"
              mouseContainer={navMouseContainerRef}
              className="inline-flex"
              style={{ position: 'fixed', left: '50%' }}
            >
              <div className="flex items-center justify-between gap-4 rounded-full border border-border/60 bg-background/80 px-4 sm:px-6 py-2.5 shadow-lg backdrop-blur supports-backdrop-filter:bg-background/60 text-[var(--foreground)]">
                <div className="flex items-center gap-2 font-semibold tracking-tight">
                  <Rocket className="w-5 h-5" />
                  <span>Stephie Ritchie</span>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex gap-6 text-sm">
                  <a className="hover:opacity-80" href="#about">About</a>
                  <a className="hover:opacity-80" href="#projects">Projects</a>
                  <a className="hover:opacity-80" href="#linkedin">LinkedIn</a>
                  <a className="hover:opacity-80" href="#experience">Experience</a>
                  <a className="hover:opacity-80" href="#contact">Contact</a>
                </nav>

                {/* Desktop Buttons */}
                <div className="hidden md:flex items-center gap-2">
                  <ThemeToggle />
                  <Button asChild size="sm" variant="outline">
                    <a href="#contact">Get in touch</a>
                  </Button>
                  <Button asChild size="sm">
                    <a href={cvDownloadHref} download>
                      <FileDown className="mr-2 h-4 w-4" />Download CV
                    </a>
                  </Button>
                </div>

                {/* Mobile Menu Button */}
                <button
                  className="md:hidden p-2 hover:bg-accent/80 rounded-md transition-colors"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  aria-label="Toggle mobile menu"
                >
                  {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
              </div>
            </LiquidGlass>

            {/* Mobile Navigation Overlay */}
            <AnimatePresence>
              {mobileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="md:hidden absolute left-0 right-0 top-full mt-3 rounded-3xl border bg-background/95 shadow-xl"
                >
                  <nav className="px-4 py-4 space-y-4">
                    <a
                      className="block text-sm hover:opacity-80 py-2"
                      href="#about"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      About
                    </a>
                    <a
                      className="block text-sm hover:opacity-80 py-2"
                      href="#projects"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Projects
                    </a>
                    <a
                      className="block text-sm hover:opacity-80 py-2"
                      href="#linkedin"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      LinkedIn
                    </a>
                    <a
                      className="block text-sm hover:opacity-80 py-2"
                      href="#experience"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Experience
                    </a>
                    <a
                      className="block text-sm hover:opacity-80 py-2"
                      href="#contact"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Contact
                    </a>
                    <div className="pt-4 space-y-3 border-t">
                      <Button asChild size="sm" variant="outline" className="w-full">
                        <a href="#contact" onClick={() => setMobileMenuOpen(false)}>Get in touch</a>
                      </Button>
                      <Button asChild size="sm" className="w-full">
                        <a href={cvDownloadHref} download onClick={() => setMobileMenuOpen(false)}>
                          <FileDown className="mr-2 h-4 w-4" />Download CV
                        </a>
                      </Button>
                      <ThemeToggle
                        size="sm"
                        variant="outline"
                        className="w-full justify-start"
                        showLabel
                      />
                    </div>
                  </nav>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </header>

      {/* Hero */}
      <section className="relative mx-auto max-w-6xl px-6 sm:px-8 min-h-screen flex items-center pt-28 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight leading-tight">
            Computational biologist & maker building <span className="bg-clip-text text-transparent bg-linear-to-r from-foreground to-foreground/60">beautifully engineered</span> tools.
          </h1>
          <p className="mt-4 text-xl md:text-lg text-muted-foreground">
            MSc in Genetic Manipulation & Molecular Biosciences. I build bioinformatics pipelines, GPU‑accelerated simulations, and immersive hardware like the <em>LumiFur</em> visor system.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <Badge>RNA‑seq</Badge>
            <Badge>Batch Correction</Badge>
            <Badge>ESP32‑S3</Badge>
            <Badge>C++</Badge>
            <Badge>SwiftUI</Badge>
            <Badge>CUDA/CuPy</Badge>
            <Badge>Docker</Badge>
            <Badge>Nextflow</Badge>
            <Badge>HPC</Badge>
          </div>
          <div className="mt-8 flex gap-3">
            <Button asChild>
              <a href="#projects">See my work</a>
            </Button>
            <Button asChild variant="outline">
              <a href="#about">About me</a>
            </Button>
          </div>
        </motion.div>
      </section>

      {/* About */}
      <Section id="about" title="About" subtitle="Brighton‑based bioinformatician and 3D‑printing entrepreneur.">
        <div className="grid md:grid-cols-3 gap-6 items-start">
          <Card className="md:col-span-2">
            <CardHeader>
              <h3 className="text-xl font-semibold">What I do</h3>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
              <p>
                I design robust, reproducible analysis tooling for genomics (RNA‑seq batch correction, QC dashboards, containerised workflows) and craft high‑performance visual interfaces.
              </p>
              <p>
                On the hardware side, I prototype embedded systems for wearables and interactive displays, shipping turnkey kits and custom parts via my company, <strong>Richies 3D Ltd</strong>.
              </p>
              <p>
                My MSc dissertation, <em>Evaluating Bulk RNASeq Batch Correction Processes</em>, benchmarks ComBat, Limma, RUVSeq, SVA, and neural approaches to deliver best‑practice guidance for harmonising clinical cohorts.
              </p>
              <p>
                Earlier, my BSc dissertation carried out molecular dynamics on Sertraline binding to the zebrafish serotonin transporter, coupling binding free energy and RMSD metrics to highlight translational toxicology considerations.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <h3 className="text-xl font-semibold">Tech stack</h3>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {[
                "Python",
                "R",
                "PyTorch",
                "Nextflow",
                "Docker",
                "SwiftUI",
                "ESP‑IDF",
                "C/C++",
                "Hub75 DMA",
                "GitHub Actions",
              ].map((t) => (
                <Badge key={t}>{t}</Badge>
              ))}
            </CardContent>
          </Card>
        </div>
      </Section>

      {/* Projects */}
      <Section id="projects" title="Projects" subtitle="Selected work spanning software, research, and hardware.">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p) => (
            <motion.div
              key={p.title}
              layoutId={p.title}
              layout
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Card className="h-full">
                <CardHeader className="space-y-1">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    {p.icon}
                    <span className="text-xs uppercase tracking-wide">Project</span>
                  </div>
                  <h3 className="text-lg font-semibold leading-snug">{p.title}</h3>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground min-h-[64px]">{p.blurb}</p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {p.tags.map((t: string) => (
                      <Badge key={t}>{t}</Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                  <Button asChild size="sm" className="w-full sm:w-auto">
                    <a href={p.cta.href} target="_blank" rel="noopener noreferrer">
                      {p.cta.label}
                    </a>
                  </Button>
                  {p.details && (
                    <Button
                      size="sm"
                      variant="secondary"
                      className="w-full sm:w-auto"
                      onClick={() => toggleProjectDetails(p.title)}
                      aria-expanded={expandedProject === p.title}
                    >
                      {expandedProject === p.title ? 'Hide details' : 'Show details'}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* LinkedIn */}
      <Section id="linkedin" title="LinkedIn" subtitle="Recent posts and threads from my professional feed.">
        {linkedinMessage && (
          <p className="mb-3 text-sm text-destructive/80 dark:text-destructive/90">
            {linkedinMessage}
          </p>
        )}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {linkedinPosts.length === 0 && (
            <Card className="sm:col-span-2 lg:col-span-3">
              <CardContent className="py-6 text-sm text-muted-foreground">
                No LinkedIn posts are published yet—check back soon.
              </CardContent>
            </Card>
          )}
          {linkedinPosts.map((post) => {
            const postHref = post.href || 'https://www.linkedin.com/in/stefan-ritchie/';
            return (
              <motion.div key={`${post.title}-${postHref}`} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <Card className="h-full">
                  <CardHeader className="space-y-2">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
                      <Linkedin className="w-4 h-4" />
                      <span>{post.date}</span>
                    </div>
                    <h3 className="text-lg font-semibold leading-snug">{post.title}</h3>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground min-h-[64px]">{post.blurb}</p>
                  </CardContent>
                  <CardFooter className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                    <Button asChild size="sm" variant="outline" className="w-full sm:w-auto">
                      <a href={postHref} target="_blank" rel="noopener noreferrer">
                        View on LinkedIn
                      </a>
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="w-full sm:w-auto"
                      onClick={() => handleSharePost(post.title, postHref)}
                    >
                      <Share2 className="mr-2 h-4 w-4" />Share
                    </Button>
                    <Button asChild size="sm" variant="ghost" className="w-full sm:w-auto">
                      <a
                        href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(postHref)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Repeat2 className="mr-2 h-4 w-4" />Repost
                      </a>
                    </Button>
                    {sharedPost === post.title && (
                      <p className="text-xs text-muted-foreground sm:basis-full">
                        Link ready to share—paste anywhere you like.
                      </p>
                    )}
                  </CardFooter>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </Section>

      {/* Experience */}
      <Section id="experience" title="Experience" subtitle="Education and highlights.">
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <h3 className="text-xl font-semibold">Highlights</h3>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-3">
              <ul className="list-disc ml-5 space-y-2">
                <li>Authored MSc dissertation evaluating bulk RNA‑seq batch correction (ComBat, Limma, RUVSeq, SVA) with rigorous metric scoring.</li>
                <li>Completed BSc dissertation on Sertraline–drSERTaa molecular dynamics, quantifying binding stability and transport risk factors.</li>
                <li>Designed RNA‑seq batch correction benchmarking across 10+ methods with rigorous metrics.</li>
                <li>Built SwiftUI iOS/watchOS app with BLE for real‑time control of LED‑matrix visor hardware.</li>
                <li>Productionised analysis with containers and CI, enabling reproducibility on HPC/Cloud.</li>
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <h3 className="text-xl font-semibold">Education</h3>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-3">
              {experience.map((e) => (
                <div key={e.role} className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-medium text-foreground">{e.role}</div>
                    <div className="text-xs">{e.org}</div>
                  </div>
                  <div className="text-xs text-muted-foreground whitespace-nowrap">{e.time}</div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </Section>

      {/* Contact */}
      <Section id="contact" title="Contact" subtitle="Open to bioinformatics roles, research collaborations, and custom builds.">
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <h3 className="text-xl font-semibold">Get in touch</h3>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-3">
              <p>
                Email me for opportunities, commissions, or speaking: <a className="underline" href="mailto:stef1949.sr@outlook.com">stef1949.sr@outlook.com</a>
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Button asChild variant="outline">
                  <a href="mailto:stef1949.sr@outlook.com">
                    <Mail className="mr-2 h-4 w-4" />Email
                  </a>
                </Button>
                <Button asChild variant="outline">
                  <a href="https://github.com/stef1949" target="_blank" rel="noopener noreferrer">
                    <Github className="mr-2 h-4 w-4" />GitHub
                  </a>
                </Button>
                <Button asChild variant="outline">
                  <a href="https://www.linkedin.com/in/stefan-ritchie/" target="_blank" rel="noopener noreferrer">
                    <Linkedin className="mr-2 h-4 w-4" />LinkedIn
                  </a>
                </Button>
                <Button asChild id="cv">
                  <a href={cvDownloadHref} download>
                    <FileDown className="mr-2 h-4 w-4" /> Download CV (PDF)
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <h3 className="text-xl font-semibold">Currently</h3>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>Exploring PhD/industry bioinformatics roles in the UK/EU.</p>
              <p>Iterating on HarmonizeNN & LumiFur v2 hardware.</p>
              <p>
                Commission slots: <span className="text-foreground">open</span>.
              </p>
            </CardContent>
          </Card>
        </div>
      </Section>

      {/* Footer */}
      <footer className="border-t py-10">
        <div className="mx-auto max-w-6xl px-6 sm:px-8 text-sm text-muted-foreground flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Stephie Ritchie. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a className="hover:opacity-80" href="https://github.com/stef1949" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
            <a className="hover:opacity-80" href="#">
              Privacy
            </a>
            <a className="hover:opacity-80" href="#">
              Imprint
            </a>
          </div>
        </div>
      </footer>
    </div>

      <AnimatePresence>
        {activeProject && activeProject.details && (
          <motion.div
            key="project-overlay"
            className="fixed inset-0 z-50 flex items-stretch justify-center bg-background/90 backdrop-blur p-16 sm:p-14"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setExpandedProject(null)}
          >
            <motion.div
              layoutId={activeProject.title}
              layout
              className="relative flex h-full w-full flex-col overflow-y-auto rounded-2xl border bg-background px-6 py-10 shadow-2xl sm:px-12 lg:px-20"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
                    {activeProject.icon}
                    <span>Project spotlight</span>
                  </div>
                  <h2 className="mt-2 text-3xl font-semibold">{activeProject.title}</h2>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  aria-label="Close details"
                  onClick={() => setExpandedProject(null)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <p className="mt-6 text-base leading-relaxed text-muted-foreground">
                {activeProject.details?.overview ?? activeProject.blurb}
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {activeProject.tags.map((tag) => (
                  <Badge key={tag}>{tag}</Badge>
                ))}
              </div>

              {activeProject.details?.bullets?.length ? (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-foreground">Key capabilities</h3>
                  <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                    {activeProject.details.bullets.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {activeProject.details?.pipeline?.length ? (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-foreground">Pipeline flow</h3>
                  <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
                    {activeProject.details.pipeline.map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ol>
                </div>
              ) : null}

              {activeProject.details?.evaluation?.length ? (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-foreground">Evaluation highlights</h3>
                  <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                    {activeProject.details.evaluation.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {activeProject.details?.operations?.length ? (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-foreground">Operations</h3>
                  <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                    {activeProject.details.operations.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {activeProject.details?.links?.length ? (
                <div className="mt-8 flex flex-wrap gap-3">
                  {activeProject.details.links.map((link) => (
                    <Button key={link.label} asChild variant="outline">
                      <a href={link.href} target="_blank" rel="noopener noreferrer">
                        {link.label}
                      </a>
                    </Button>
                  ))}
                </div>
              ) : null}

              <div className="mt-auto pt-10 flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <a href={activeProject.cta.href} target="_blank" rel="noopener noreferrer">
                    {activeProject.cta.label}
                  </a>
                </Button>
                <Button size="lg" variant="outline" onClick={() => setExpandedProject(null)}>
                  Close
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </LayoutGroup>
  );
}
