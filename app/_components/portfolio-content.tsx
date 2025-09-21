'use client';

import React, { useEffect, useRef, useState } from "react";
import type { Application } from "@splinetool/runtime";
import dynamic from "next/dynamic";
const Spline = dynamic(() => import("@splinetool/react-spline"), { ssr: false });
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Github, Linkedin, Mail, FileDown, Cpu, FlaskConical, Brain, Printer, Rocket } from "lucide-react";

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
  <span className="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground">
    {children}
  </span>
);

// ----
// Data (feel free to edit these)
// ----
const projects = [
  {
    title: "LumiFur • ESP32‑S3 LED Visor",
    blurb:
      "BLE‑controlled protogen visor system (ESP‑IDF + Hub75 DMA) with iOS/watchOS companion app in SwiftUI.",
    tags: ["ESP32‑S3", "Hub75", "SwiftUI", "BLE", "ESP‑IDF"],
    cta: { label: "View repo / site", href: "https://github.com/stef1949" },
    icon: <Cpu className="w-5 h-5" />,
  },
  {
    title: "HarmonizeNN • Batch Correction",
    blurb:
      "Unsupervised neural network for bulk RNA‑seq batch correction with evaluation metrics (kBET, iLISI, silhouette).",
    tags: ["Python", "PyTorch", "RNA‑seq", "Batch effects", "Autoencoder"],
    cta: { label: "HarmonizeNN on GitHub", href: "https://github.com/stef1949/HarmonizeNN" },
    icon: <Brain className="w-5 h-5" />,
  },
  {
    title: "Electron Orbital Simulator",
    blurb:
      "GPU‑accelerated orbital visualizer producing probability density maps and isosurfaces.",
    tags: ["CUDA/CuPy", "Numerical", "Visualization"],
    cta: { label: "View on GitHub", href: "https://github.com/stef1949/Electron-Orbital-Simulator" },
    icon: <FlaskConical className="w-5 h-5" />,
  },
  {
    title: "Richies 3D Ltd • Models & Fursuits",
    blurb:
      "FDM & resin printing for anatomical models and fursuit components. Etsy storefront and custom commissions.",
    tags: ["FDM", "Resin", "Etsy", "CAD"],
    cta: { label: "Enquire", href: "mailto:admin@richies.uk" },
    icon: <Printer className="w-5 h-5" />,
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
export default function PortfolioContent() {
  const ROTATE_TARGET_NAME = 'Globe'; // Change to your object name from Spline
  const [mounted, setMounted] = useState(false);
  const appRef = useRef<Application | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
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
  };

  const splineScrollHandlerRef = useRef<((e: unknown) => void) | null>(null);
  const rotateTargetRef = useRef<SplineNodeLike | null>(null);
  const removeScrollHandlerRef = useRef<(() => void) | null>(null);

  // Best-effort traversal to list object names in the Spline scene
  const collectObjectNames = (app: unknown): string[] => {
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
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  // Clean up Spline runtime scroll listener on unmount
  useEffect(() => {
    return () => {
      if (appRef.current && splineScrollHandlerRef.current) {
        // @ts-ignore removeEventListener exists on runtime app
        appRef.current.removeEventListener('scroll', splineScrollHandlerRef.current);
      }
      if (removeScrollHandlerRef.current) {
        removeScrollHandlerRef.current();
      }
    };
  }, []);

  useEffect(() => {
    const onResize = () => {
      const el = containerRef.current;
      const app = appRef.current;
      if (!el || !app) return;
      const { clientWidth, clientHeight } = el;
      if (clientWidth > 0 && clientHeight > 0) {
        app.setSize(clientWidth, clientHeight);
      }
    };
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div className="static min-h-screen bg-background text-foreground selection:bg-foreground/100 ">
    {/* Background Spline scene (fixed right, behind content) */}
  <div className="fixed inset-0 z-0">
        <div className="absolute inset-0">
          <div
            ref={containerRef}
            className="absolute top-0 bottom-0 right-0 w-1/2 z-20"
            style={{ touchAction: 'pan-y' }}
          >
            {mounted ? (
              <Spline
                aria-hidden
                scene="https://prod.spline.design/bXae1i6w76cK2003/scene.splinecode"
                className="h-full w-full pointer-events-auto"
                onLoad={(app) => {
                  appRef.current = app;
                  const el = containerRef.current;
                  if (el) {
                    const { clientWidth, clientHeight } = el;
                    if (clientWidth > 0 && clientHeight > 0) {
                      app.setSize(clientWidth, clientHeight);
                    }
                  }
                  // Ensure scroll events are attached to the window/document
                  app.setGlobalEvents(true);
                  // Use Spline runtime's own scroll event
                  const runtime = app as unknown as SplineAppLike;
                  if (splineScrollHandlerRef.current && runtime.removeEventListener) {
                    runtime.removeEventListener('scroll', splineScrollHandlerRef.current);
                  }
                  splineScrollHandlerRef.current = (ev: unknown) => {
                    console.debug('Spline runtime scroll', ev);
                  };
                  runtime.addEventListener?.('scroll', splineScrollHandlerRef.current);

                  // Global page scroll -> rotate Spline object
                  // Try to find a reasonable default target to rotate
                  const tryFindRotateTarget = () => {
                    const a = app as unknown as SplineAppLike;
                    // 1) Try by explicit name first
                    if (a?.findObjectByName && ROTATE_TARGET_NAME) {
                      try {
                        const obj = a.findObjectByName(ROTATE_TARGET_NAME);
                        if (obj) return obj;
                      } catch {}
                    }
                    // 2) Try common names
                    if (a?.findObjectByName) {
                      const candidates = ['Root', 'root', 'Scene', 'scene', 'Model', 'Group', 'Empty', 'Pivot'];
                      for (const name of candidates) {
                        try {
                          const obj = a.findObjectByName(name);
                          if (obj) return obj;
                        } catch {}
                      }
                    }
                    // 3) First child with rotation
                    const children = a?.scene?.children;
                    if (Array.isArray(children)) {
                      const obj = children.find((o: SplineNodeLike) => o?.rotation);
                      if (obj) return obj;
                    }
                    // 4) Fallback to scene
                    return a?.scene ?? null;
                  };
                  rotateTargetRef.current = tryFindRotateTarget();
                  if (rotateTargetRef.current) {
                    console.debug('Spline rotate target:', rotateTargetRef.current?.name || rotateTargetRef.current?.id || 'unknown');
                  } else {
                    const names = collectObjectNames(app);
                    console.warn('No rotatable target found in Spline scene. Available names:', names);
                  }

                  // Attach window scroll listener (global page scroll)
                  const onScroll = () => {
                    const target = rotateTargetRef.current;
                    if (!target) return;
                    const doc = document.documentElement;
                    const max = Math.max(1, doc.scrollHeight - doc.clientHeight);
                    const t = Math.min(1, Math.max(0, window.scrollY / max));
                    const angle = t * Math.PI * 2; // one full rotation over page
                    const runtime2 = app as unknown as SplineAppLike;
                    // Try direct property
                    if (target.rotation) {
                      try {
                        target.rotation.y = angle;
                        return;
                      } catch {}
                    }
                    // Try API method if available
                    if (runtime2?.setRotation && target?.id != null) {
                      try {
                        runtime2.setRotation(target.id, 0, angle, 0);
                        return;
                      } catch {}
                    }
                  };
                  window.addEventListener('scroll', onScroll, { passive: true });
                  removeScrollHandlerRef.current = () => window.removeEventListener('scroll', onScroll);
                }}
                renderOnDemand={false}
              />
            ) : (
              <div className="absolute inset-0 bg-muted/10 animate-pulse" />
            )}
          </div>
          <div className="absolute inset-0 z-0 pointer-events-none bg-gradient-to-b from-background/40 via-background/70 to-background" />
        </div>
      </div>

      {/* Nav */}
      <header className="sticky top-0 z-20 backdrop-blur supports-[backdrop-filter]:bg-background/70 border-b">
        <div className="mx-auto max-w-6xl flex items-center justify-between px-6 sm:px-8 h-14">
          <div className="flex items-center gap-2 font-semibold tracking-tight">
            <Rocket className="w-5 h-5" />
            <span>Stephie Ritchie</span>
          </div>
          <nav className="hidden md:flex gap-6 text-sm">
            <a className="hover:opacity-80" href="#about">About</a>
            <a className="hover:opacity-80" href="#projects">Projects</a>
            <a className="hover:opacity-80" href="#experience">Experience</a>
            <a className="hover:opacity-80" href="#contact">Contact</a>
          </nav>
          <div className="flex items-center gap-2">
            <Button asChild size="sm" variant="outline">
              <a href="#contact">Get in touch</a>
            </Button>
            <Button asChild size="sm">
              <a href="#cv"><FileDown className="mr-2 h-4 w-4" />Download CV</a>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative mx-auto max-w-6xl px-6 sm:px-8 min-h-screen flex items-center pt-16 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
            Computational biologist & maker building <span className="bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/60">beautifully engineered</span> tools.
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
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
            <motion.div key={p.title} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
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
                <CardFooter>
                  <Button asChild size="sm" className="w-full">
                    <a href={p.cta.href} target="_blank" rel="noopener noreferrer">
                      {p.cta.label}
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
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
                Email me for opportunities, commissions, or speaking: <a className="underline" href="mailto:steph@portfolio.example">steph@portfolio.example</a>
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Button asChild variant="outline">
                  <a href="mailto:steph@portfolio.example">
                    <Mail className="mr-2 h-4 w-4" />Email
                  </a>
                </Button>
                <Button asChild variant="outline">
                  <a href="https://github.com/stef1949" target="_blank" rel="noopener noreferrer">
                    <Github className="mr-2 h-4 w-4" />GitHub
                  </a>
                </Button>
                <Button asChild variant="outline">
                  <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer">
                    <Linkedin className="mr-2 h-4 w-4" />LinkedIn
                  </a>
                </Button>
                <Button asChild id="cv">
                  <a href="#">
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
  );
}
