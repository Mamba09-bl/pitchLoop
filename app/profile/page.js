"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, OrbitControls, Stars } from "@react-three/drei";
import {
  ArrowRight,
  ExternalLink,
  Mail,
  MonitorPlay,
  MoveRight,
  Sparkles,
} from "lucide-react";

const projects = [
  {
    title: "Nova Commerce",
    description:
      "A cinematic commerce experience with motion-rich product storytelling and conversion-focused flows.",
    stack: ["Next.js", "Tailwind", "Framer Motion"],
    accent: "from-fuchsia-500/30 to-cyan-500/20",
  },
  {
    title: "Lumen Studio",
    description:
      "An editorial portfolio platform blending immersive visuals with a modular publishing experience.",
    stack: ["React", "Three.js", "GSAP"],
    accent: "from-violet-500/30 to-slate-500/20",
  },
  {
    title: "Pulse Analytics",
    description:
      "A real-time dashboard designed to turn complex metrics into a calm, actionable interface.",
    stack: ["Node.js", "MongoDB", "Socket.IO"],
    accent: "from-emerald-500/30 to-cyan-500/20",
  },
  {
    title: "Northstar AI",
    description:
      "A conversational product concept for intelligent team collaboration and rapid onboarding.",
    stack: ["TypeScript", "Next.js", "OpenAI"],
    accent: "from-amber-500/30 to-rose-500/20",
  },
  {
    title: "Helio Sync",
    description:
      "A polished creator workspace focused on seamless collaboration, instant feedback, and flow.",
    stack: ["React", "Tailwind", "Realtime"],
    accent: "from-sky-500/30 to-indigo-500/20",
  },
  {
    title: "Atlas Labs",
    description:
      "A modular product launch experience balancing storytelling, product detail, and delight.",
    stack: ["Next.js", "Framer Motion", "Prisma"],
    accent: "from-teal-500/30 to-purple-500/20",
  },
];

const skills = [
  "React",
  "Next.js",
  "TypeScript",
  "Tailwind CSS",
  "Node.js",
  "MongoDB",
  "Socket.IO",
  "Three.js",
  "React Three Fiber",
  "GSAP",
];

const experiences = [
  {
    role: "Lead Frontend Engineer",
    company: "Lumen Labs",
    period: "2023 — Present",
    description:
      "Crafting premium product experiences for fast-moving SaaS teams and immersive digital launches.",
  },
  {
    role: "Senior UI Engineer",
    company: "Nova Atelier",
    period: "2020 — 2023",
    description:
      "Shaped multi-brand design systems and delivered high-performance interfaces with striking motion.",
  },
  {
    role: "Product Designer",
    company: "Atlas Collective",
    period: "2017 — 2020",
    description:
      "Bridged strategy, product thinking, and visual design for consumer-first digital experiences.",
  },
];

function FloatingScene() {
  const groupRef = useRef();

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.22;
      groupRef.current.rotation.x =
        Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={2.2} rotationIntensity={0.3} floatIntensity={0.7}>
        <mesh position={[0.8, 0.7, 0]}>
          <torusKnotGeometry args={[0.45, 0.16, 120, 20]} />
          <meshPhysicalMaterial
            color="#8b5cf6"
            roughness={0.15}
            metalness={0.6}
            clearcoat={1}
          />
        </mesh>
      </Float>

      <Float speed={1.8} rotationIntensity={0.4} floatIntensity={0.9}>
        <mesh position={[-1.1, -0.4, 0.2]}>
          <boxGeometry args={[0.6, 0.6, 0.6]} />
          <meshStandardMaterial color="#38bdf8" emissive="#0f172a" />
        </mesh>
      </Float>

      <Float speed={2.6} rotationIntensity={0.25} floatIntensity={0.5}>
        <mesh position={[0.1, -1.1, -0.4]}>
          <icosahedronGeometry args={[0.45, 0]} />
          <meshStandardMaterial
            color="#f472b6"
            roughness={0.2}
            metalness={0.6}
          />
        </mesh>
      </Float>

      <mesh position={[0, 0, -0.6]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.3, 1.8, 64]} />
        <meshBasicMaterial color="#1e293b" transparent opacity={0.45} />
      </mesh>
    </group>
  );
}

function SectionHeading({ eyebrow, title, description }) {
  return (
    <div className="max-w-2xl">
      <p className="text-sm uppercase tracking-[0.35em] text-cyan-300/80">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
        {title}
      </h2>
      <p className="mt-4 text-base leading-8 text-slate-400">{description}</p>
    </div>
  );
}

export default function Page() {
  return (
    <main className="min-h-screen bg-[#030712] text-slate-100">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <motion.header
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.16),_transparent_30%),linear-gradient(135deg,_rgba(15,23,42,0.98),_rgba(2,6,23,0.96))] p-6 shadow-[0_0_80px_rgba(34,211,238,0.08)] sm:p-8 lg:p-12"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,_rgba(192,132,252,0.15),_transparent_24%)]" />
          <div className="relative grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-sm text-cyan-200">
                <Sparkles size={16} />
                Available for select collaborations
              </div>

              <h1 className="mt-6 max-w-3xl text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
                Hi, I’m{" "}
                <span className="bg-gradient-to-r from-cyan-300 via-sky-400 to-fuchsia-400 bg-clip-text text-transparent">
                  Aria Vale
                </span>
                .
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
                I build immersive digital experiences that feel premium,
                thoughtful, and quietly futuristic.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#projects"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-slate-950 transition hover:-translate-y-0.5 hover:bg-slate-200"
                >
                  View Projects
                  <ArrowRight size={16} />
                </a>
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-medium text-slate-200 transition hover:-translate-y-0.5 hover:bg-white/10"
                >
                  Contact
                  <MoveRight size={16} />
                </a>
              </div>

              <div className="mt-10 flex flex-wrap gap-4 text-sm text-slate-400">
                <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
                  8+ years crafting UI systems
                </div>
                <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
                  40+ launches shipped
                </div>
                <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
                  Remote-first worldwide
                </div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
              className="w-full"
            >
              <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/70 p-3 shadow-[0_0_80px_rgba(99,102,241,0.16)]">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[1.35rem] border border-white/10 bg-slate-950">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.15),_transparent_40%)]" />
                  <Canvas
                    camera={{ position: [0, 0, 5], fov: 45 }}
                    dpr={[1, 1.5]}
                  >
                    <color attach="background" args={["#030712"]} />
                    <fog attach="fog" args={["#030712", 4, 12]} />
                    <ambientLight intensity={0.8} />
                    <directionalLight position={[3, 3, 4]} intensity={2} />
                    <pointLight
                      position={[-2, 2, 2]}
                      intensity={1.4}
                      color="#7dd3fc"
                    />
                    <Stars
                      radius={60}
                      depth={50}
                      count={800}
                      factor={4}
                      saturation={0}
                    />
                    <FloatingScene />
                    <OrbitControls
                      enableZoom={false}
                      enablePan={false}
                      autoRotate
                      autoRotateSpeed={1.3}
                      minPolarAngle={Math.PI / 4}
                      maxPolarAngle={Math.PI / 2}
                    />
                  </Canvas>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.header>

        <section
          id="about"
          className="grid gap-8 rounded-[2rem] border border-white/10 bg-slate-900/70 p-6 backdrop-blur-xl sm:p-8 lg:grid-cols-[0.95fr_1.05fr] lg:p-10"
        >
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
          >
            <SectionHeading
              eyebrow="About"
              title="Designing calm interfaces with a cinematic edge."
              description="My work sits at the intersection of product strategy, visual storytelling, and engineering craft. I create interfaces that feel cohesive, elegant, and effortless to use."
            />
            <p className="mt-6 text-base leading-8 text-slate-400">
              I’m a product-minded frontend developer with a strong visual
              sensibility and a love for creating polished digital environments.
              My philosophy is simple: elegant systems, deliberate motion, and
              experiences that feel like they belong.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-2xl font-semibold text-white">8+</p>
                <p className="mt-1 text-sm text-slate-400">Years experience</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-2xl font-semibold text-white">40+</p>
                <p className="mt-1 text-sm text-slate-400">Projects shipped</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-2xl font-semibold text-white">24/7</p>
                <p className="mt-1 text-sm text-slate-400">Motion obsessive</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="rounded-[1.5rem] border border-white/10 bg-[linear-gradient(135deg,_rgba(15,23,42,0.95),_rgba(2,6,23,0.96))] p-6"
          >
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300/80">
              Core stack
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              {skills.map((skill, index) => (
                <motion.span
                  key={skill}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: index * 0.04 }}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300"
                >
                  {skill}
                </motion.span>
              ))}
            </div>
            <div className="mt-8 rounded-2xl border border-cyan-400/10 bg-cyan-400/10 p-5">
              <div className="flex items-center gap-2 text-cyan-200">
                <MonitorPlay size={16} />
                <span className="text-sm font-medium">
                  Focused on premium frontend craft
                </span>
              </div>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                Fast, elegant interfaces, detail-rich interactions, and systems
                that scale elegantly across products.
              </p>
            </div>
          </motion.div>
        </section>

        <section
          id="projects"
          className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-6 backdrop-blur-xl sm:p-8 lg:p-10"
        >
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
          >
            <SectionHeading
              eyebrow="Selected Work"
              title="Featured projects built for clarity and momentum."
              description="A curated mix of product design systems, immersive launches, and frontend experiences that balance beauty with reliability."
            />
          </motion.div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {projects.map((project, index) => (
              <motion.article
                key={project.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                whileHover={{ y: -6, scale: 1.01 }}
                className="group overflow-hidden rounded-[1.5rem] border border-white/10 bg-[linear-gradient(135deg,_rgba(15,23,42,0.95),_rgba(2,6,23,0.9))]"
              >
                <div className={`h-40 bg-gradient-to-br ${project.accent} p-5`}>
                  <div className="flex h-full items-end justify-between rounded-[1rem] border border-white/10 bg-slate-950/40 p-4 backdrop-blur-sm">
                    <div>
                      <p className="text-xs uppercase tracking-[0.34em] text-slate-300">
                        Case Study
                      </p>
                      <p className="mt-2 text-lg font-semibold text-white">
                        {project.title}
                      </p>
                    </div>
                    <div className="rounded-full border border-white/10 bg-white/10 p-2 text-slate-200">
                      <Sparkles size={16} />
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-sm leading-7 text-slate-400">
                    {project.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.stack.map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.24em] text-slate-300"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                  {/* <div className="mt-6 flex flex-wrap gap-3">
                    <a
                      href="#"
                      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200 transition hover:bg-white/10"
                    >
                      <Github size={15} />
                      GitHub
                    </a>
                    <a
                      href="#"
                      className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-2 text-sm text-cyan-200 transition hover:bg-cyan-400/20"
                    >
                      <ExternalLink size={15} />
                      Live Demo
                    </a>
                  </div> */}
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        <section className="grid gap-8 rounded-[2rem] border border-white/10 bg-slate-900/70 p-6 backdrop-blur-xl sm:p-8 lg:grid-cols-[0.95fr_1.05fr] lg:p-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
          >
            <SectionHeading
              eyebrow="Experience"
              title="A measured path from product design to high-end frontend engineering."
              description="Over the years, I’ve expanded from polished visual work into systems-level engineering and product execution."
            />
          </motion.div>

          <div className="space-y-5">
            {experiences.map((item, index) => (
              <motion.div
                key={item.role}
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="relative rounded-[1.25rem] border border-white/10 bg-[linear-gradient(135deg,_rgba(15,23,42,0.9),_rgba(2,6,23,0.95))] p-5"
              >
                <div className="absolute left-5 top-6 h-full w-px bg-white/10" />
                <div className="relative pl-7">
                  <span className="absolute left-0 top-1.5 h-3 w-3 rounded-full border border-cyan-300/50 bg-cyan-300/80" />
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-lg font-semibold text-white">
                      {item.role}
                    </h3>
                    <span className="text-sm text-slate-400">
                      {item.period}
                    </span>
                  </div>
                  <p className="mt-2 text-sm font-medium text-cyan-200">
                    {item.company}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-slate-400">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section
          id="contact"
          className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-6 backdrop-blur-xl sm:p-8 lg:p-10"
        >
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6 }}
            >
              <SectionHeading
                eyebrow="Contact"
                title="Let’s build something luminous."
                description="If you’re looking for a thoughtful frontend partner to shape a premium experience, I’d love to hear from you."
              />
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="mailto:aria@dummy.dev"
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10"
                >
                  <Mail size={15} />
                  aria@dummy.dev
                </a>
                {/* <a
                  href="#"
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10"
                >
                  <Github size={15} />
                  GitHub
                </a> */}
              </div>
            </motion.div>

            <motion.form
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              onSubmit={(event) => event.preventDefault()}
              className="rounded-[1.5rem] border border-white/10 bg-[linear-gradient(135deg,_rgba(15,23,42,0.95),_rgba(2,6,23,0.9))] p-6"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-sm text-slate-300">
                  <span className="mb-2 block">Name</span>
                  <input
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none ring-0 placeholder:text-slate-500"
                    placeholder="Avery Stone"
                  />
                </label>
                <label className="text-sm text-slate-300">
                  <span className="mb-2 block">Email</span>
                  <input
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none ring-0 placeholder:text-slate-500"
                    placeholder="hello@studio.com"
                  />
                </label>
              </div>
              <label className="mt-4 block text-sm text-slate-300">
                <span className="mb-2 block">Project brief</span>
                <textarea
                  className="min-h-32 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none ring-0 placeholder:text-slate-500"
                  placeholder="Tell me about your vision, goals, and timeline..."
                />
              </label>
              <button className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-slate-950 transition hover:-translate-y-0.5 hover:bg-slate-200">
                Send Inquiry
                <ArrowRight size={16} />
              </button>
            </motion.form>
          </div>
        </section>
      </div>
    </main>
  );
}
