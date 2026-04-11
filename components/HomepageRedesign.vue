<script setup lang="ts">
interface ToolItem {
  name: string
  description: string
  path: string
}

interface ToolCategory {
  id: string
  title: string
  description: string
  link: string
  tools: ToolItem[]
}

const props = defineProps<{
  toolCategories: ToolCategory[]
}>()

const { t } = useI18n()
const localePath = useLocalePath()

const homeCopy = computed(() => ({
  eyebrow: t('home.redesign.eyebrow'),
  headline: t('home.redesign.headline'),
  description: t('home.redesign.description'),
  primaryCta: t('home.redesign.primaryCta'),
  secondaryCta: t('home.redesign.secondaryCta'),
  quickLabel: t('home.redesign.quickLabel'),
  workflowTitle: t('home.redesign.workflowTitle'),
  workflowSubtitle: t('home.redesign.workflowSubtitle'),
  categoriesTitle: t('home.redesign.categoriesTitle'),
  categoriesSubtitle: t('home.redesign.categoriesSubtitle'),
  futureTitle: t('home.redesign.futureTitle'),
  futureSubtitle: t('home.redesign.futureSubtitle'),
  faqSubtitle: t('home.redesign.faqSubtitle')
}))

const iconMap: Record<string, string> = {
  '/image-compressor': 'heroicons:arrows-pointing-in',
  '/image-format-converter': 'heroicons:arrow-path',
  '/heic-converter': 'heroicons:device-phone-mobile',
  '/qr-code-generator': 'heroicons:qr-code',
  '/json-formatter': 'heroicons:code-bracket',
  '/base64-codec': 'heroicons:lock-closed',
  '/text-diff': 'heroicons:document-duplicate',
  '/markdown-preview': 'heroicons:document-text',
  '/color-converter': 'heroicons:swatch',
  '/url-codec': 'heroicons:link'
}

const categoryMeta = computed(() => ({
  'image-tools': {
    eyebrow: t('home.redesign.categoryMeta.imageTools.eyebrow'),
    summary: t('home.redesign.categoryMeta.imageTools.summary'),
    icon: 'heroicons:photo'
  },
  'dev-tools': {
    eyebrow: t('home.redesign.categoryMeta.devTools.eyebrow'),
    summary: t('home.redesign.categoryMeta.devTools.summary'),
    icon: 'heroicons:code-bracket-square'
  }
}))

const trustSignals = computed(() => [
  { title: t('home.values.secure'), description: t('home.values.secureDesc'), icon: 'heroicons:shield-check' },
  { title: t('home.values.fast'), description: t('home.values.fastDesc'), icon: 'heroicons:bolt' },
  { title: t('home.values.free'), description: t('home.values.freeDesc'), icon: 'heroicons:sparkles' }
])

const workflowSteps = computed(() => [
  { title: t('home.redesign.workflowSteps.step1.title'), description: t('home.redesign.workflowSteps.step1.description') },
  { title: t('home.redesign.workflowSteps.step2.title'), description: t('home.redesign.workflowSteps.step2.description') },
  { title: t('home.redesign.workflowSteps.step3.title'), description: t('home.redesign.workflowSteps.step3.description') },
  { title: t('home.redesign.workflowSteps.step4.title'), description: t('home.redesign.workflowSteps.step4.description') }
])

const futureTracks = computed(() => [
  {
    title: t('home.redesign.futureTracks.api.title'),
    description: t('home.redesign.futureTracks.api.description'),
    bullets: [
      t('home.redesign.futureTracks.api.bullets.0'),
      t('home.redesign.futureTracks.api.bullets.1'),
      t('home.redesign.futureTracks.api.bullets.2')
    ]
  },
  {
    title: t('home.redesign.futureTracks.ai.title'),
    description: t('home.redesign.futureTracks.ai.description'),
    bullets: [
      t('home.redesign.futureTracks.ai.bullets.0'),
      t('home.redesign.futureTracks.ai.bullets.1'),
      t('home.redesign.futureTracks.ai.bullets.2')
    ]
  }
])

const primaryTools = computed(() => props.toolCategories[0]?.tools ?? [])
</script>

<template>
  <div class="home-shell min-h-screen transition-colors duration-300">
    <section class="px-6 pt-12 pb-8" aria-labelledby="hero-title">
      <div class="max-w-6xl mx-auto">
        <div class="hero-frame">
          <div class="grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)] lg:items-center">
            <div class="space-y-8">
              <div class="space-y-5">
                <p class="section-label">{{ homeCopy.eyebrow }}</p>
                <h1 id="hero-title" class="max-w-4xl text-5xl md:text-6xl font-semibold tracking-tight text-slate-950 dark:text-slate-50">
                  {{ homeCopy.headline }}
                </h1>
                <p class="max-w-3xl text-lg md:text-xl leading-8 text-slate-600 dark:text-slate-300">
                  {{ homeCopy.description }}
                </p>
              </div>

              <div class="flex flex-col gap-4 sm:flex-row">
                <NuxtLink :to="localePath('/image-tools')" class="primary-action" :aria-label="homeCopy.primaryCta">
                  <span>{{ homeCopy.primaryCta }}</span>
                  <Icon name="heroicons:arrow-right" class="h-5 w-5" aria-hidden="true" />
                </NuxtLink>
                <NuxtLink :to="localePath('/dev-tools')" class="secondary-action" :aria-label="homeCopy.secondaryCta">
                  <span>{{ homeCopy.secondaryCta }}</span>
                </NuxtLink>
              </div>

              <div class="space-y-4">
                <p class="section-label">{{ homeCopy.quickLabel }}</p>
                <div class="flex flex-wrap gap-3">
                  <NuxtLink
                    v-for="tool in primaryTools"
                    :key="tool.path"
                    :to="localePath(tool.path)"
                    class="quick-link"
                    :aria-label="`${tool.name} - ${tool.description}`"
                  >
                    <Icon :name="iconMap[tool.path] || 'heroicons:wrench-screwdriver'" class="h-4 w-4" aria-hidden="true" />
                    <span>{{ tool.name }}</span>
                  </NuxtLink>
                </div>
              </div>
            </div>

            <div class="workspace-panel" aria-hidden="true">
              <div class="workspace-chrome">
                <div class="workspace-dots">
                  <span />
                  <span />
                  <span />
                </div>
                <div class="workspace-pill">
                  <Icon name="heroicons:photo" class="h-4 w-4" />
                  <span>{{ t('home.redesign.workspace.pill') }}</span>
                </div>
              </div>

              <div class="workspace-body">
                <div class="workspace-card">
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="workspace-eyebrow">{{ t('home.redesign.workspace.pipelineEyebrow') }}</p>
                      <p class="workspace-title">
                        {{ t('home.redesign.workspace.pipelineTitle') }}
                      </p>
                    </div>
                    <div class="workspace-badge">
                      <Icon name="heroicons:shield-check" class="h-4 w-4" />
                      <span>{{ t('home.redesign.workspace.privateBadge') }}</span>
                    </div>
                  </div>

                  <div class="space-y-3">
                    <div v-for="(tool, index) in primaryTools" :key="tool.path" class="workspace-row">
                      <div class="workspace-row-index">{{ index + 1 }}</div>
                      <div class="min-w-0 flex-1">
                        <p class="font-medium text-slate-900 dark:text-slate-100">{{ tool.name }}</p>
                        <p class="text-sm text-slate-500 dark:text-slate-400">{{ tool.description }}</p>
                      </div>
                      <Icon name="heroicons:arrow-right" class="h-4 w-4 text-slate-400" />
                    </div>
                  </div>
                </div>

                <div class="grid gap-4 sm:grid-cols-2">
                  <div class="workspace-metric">
                    <p class="workspace-eyebrow">{{ t('home.redesign.workspace.futureLayerEyebrow') }}</p>
                    <p class="workspace-title">{{ t('home.redesign.workspace.futureLayerTitle') }}</p>
                    <p class="text-sm text-slate-500 dark:text-slate-400">
                      {{ t('home.redesign.workspace.futureLayerDescription') }}
                    </p>
                  </div>
                  <div class="workspace-metric">
                    <p class="workspace-eyebrow">{{ t('home.redesign.workspace.nextStepEyebrow') }}</p>
                    <p class="workspace-title">{{ t('home.redesign.workspace.nextStepTitle') }}</p>
                    <p class="text-sm text-slate-500 dark:text-slate-400">
                      {{ t('home.redesign.workspace.nextStepDescription') }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="px-6 py-8" :aria-label="t('home.redesign.trustAria')">
      <div class="max-w-6xl mx-auto">
        <div class="signal-grid">
          <article v-for="signal in trustSignals" :key="signal.title" class="signal-item">
            <div class="signal-icon">
              <Icon :name="signal.icon" class="h-5 w-5" aria-hidden="true" />
            </div>
            <div class="space-y-1">
              <h2 class="text-lg font-semibold text-slate-900 dark:text-slate-100">{{ signal.title }}</h2>
              <p class="text-sm leading-6 text-slate-600 dark:text-slate-400">{{ signal.description }}</p>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section class="px-6 py-12" aria-labelledby="workflow-title">
      <div class="max-w-6xl mx-auto section-stack">
        <div class="section-intro">
          <p class="section-label">{{ t('home.redesign.workflowLabel') }}</p>
          <h2 id="workflow-title" class="section-title">{{ homeCopy.workflowTitle }}</h2>
          <p class="section-description">{{ homeCopy.workflowSubtitle }}</p>
        </div>

        <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <article v-for="(step, index) in workflowSteps" :key="step.title" class="process-step">
            <p class="process-index">0{{ index + 1 }}</p>
            <h3 class="text-xl font-semibold text-slate-900 dark:text-slate-100">{{ step.title }}</h3>
            <p class="text-sm leading-6 text-slate-600 dark:text-slate-400">{{ step.description }}</p>
          </article>
        </div>
      </div>
    </section>

    <section class="px-6 py-12" aria-labelledby="categories-title">
      <div class="max-w-6xl mx-auto section-stack">
        <div class="section-intro">
          <p class="section-label">{{ t('home.redesign.categoriesLabel') }}</p>
          <h2 id="categories-title" class="section-title">{{ homeCopy.categoriesTitle }}</h2>
          <p class="section-description">{{ homeCopy.categoriesSubtitle }}</p>
        </div>

        <div class="space-y-6">
          <article
            v-for="category in toolCategories"
            :key="category.id"
            class="category-surface"
            :aria-labelledby="`category-${category.id}-title`"
          >
            <div class="category-summary">
              <div class="space-y-4">
                <p class="section-label">{{ categoryMeta[category.id]?.eyebrow || t('common.relatedLinks') }}</p>
                <div class="flex items-start gap-4">
                  <div class="category-icon">
                    <Icon :name="categoryMeta[category.id]?.icon || 'heroicons:wrench-screwdriver'" class="h-6 w-6" aria-hidden="true" />
                  </div>
                  <div class="space-y-3">
                    <h3 :id="`category-${category.id}-title`" class="text-3xl font-semibold text-slate-950 dark:text-slate-50">
                      {{ category.title }}
                    </h3>
                    <p class="text-base leading-7 text-slate-600 dark:text-slate-300">{{ category.description }}</p>
                    <p class="text-sm leading-6 text-slate-500 dark:text-slate-400">{{ categoryMeta[category.id]?.summary }}</p>
                  </div>
                </div>
              </div>

              <NuxtLink :to="localePath(category.link)" class="secondary-action w-fit" :aria-label="`${t('home.categories.viewAll')} ${category.title}`">
                <span>{{ t('home.categories.viewAll') }}</span>
              </NuxtLink>
            </div>

            <nav class="tool-grid" :aria-label="category.title" role="navigation">
              <NuxtLink
                v-for="tool in category.tools"
                :key="tool.path"
                :to="localePath(tool.path)"
                class="tool-row group"
                :aria-label="`${tool.name} - ${tool.description}`"
              >
                <div class="tool-row-icon">
                  <Icon :name="iconMap[tool.path] || 'heroicons:wrench-screwdriver'" class="h-5 w-5" aria-hidden="true" />
                </div>
                <div class="min-w-0 flex-1">
                  <h4 class="text-lg font-medium text-slate-900 dark:text-slate-100">{{ tool.name }}</h4>
                  <p class="text-sm leading-6 text-slate-600 dark:text-slate-400">{{ tool.description }}</p>
                </div>
                <Icon name="heroicons:arrow-right" class="h-5 w-5 text-slate-400 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
              </NuxtLink>
            </nav>
          </article>
        </div>
      </div>
    </section>

    <section class="px-6 py-12" aria-labelledby="future-title">
      <div class="max-w-6xl mx-auto section-stack">
        <div class="section-intro">
          <p class="section-label">{{ t('home.redesign.futureLabel') }}</p>
          <h2 id="future-title" class="section-title">{{ homeCopy.futureTitle }}</h2>
          <p class="section-description">{{ homeCopy.futureSubtitle }}</p>
        </div>

        <div class="grid gap-6 lg:grid-cols-2">
          <article v-for="track in futureTracks" :key="track.title" class="future-track">
            <div class="space-y-4">
              <h3 class="text-2xl font-semibold text-slate-950 dark:text-slate-50">{{ track.title }}</h3>
              <p class="text-base leading-7 text-slate-600 dark:text-slate-300">{{ track.description }}</p>
            </div>

            <ul class="space-y-3">
              <li v-for="bullet in track.bullets" :key="bullet" class="future-bullet">
                <span class="future-bullet-dot" />
                <span>{{ bullet }}</span>
              </li>
            </ul>
          </article>
        </div>
      </div>
    </section>

    <section class="px-6 py-12" aria-labelledby="faq-title">
      <div class="max-w-6xl mx-auto section-stack">
        <div class="section-intro">
          <p class="section-label">{{ t('home.redesign.faqLabel') }}</p>
          <h2 id="faq-title" class="section-title">{{ t('faq.title') }}</h2>
          <p class="section-description">{{ homeCopy.faqSubtitle }}</p>
        </div>
        <FAQ category="general" />
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-shell {
  --hero-surface: rgba(255, 255, 255, 0.88);
  --hero-border: rgba(148, 163, 184, 0.22);
  --soft-surface: rgba(255, 255, 255, 0.74);
  --soft-border: rgba(148, 163, 184, 0.18);
  background:
    radial-gradient(circle at top right, rgba(14, 165, 164, 0.08), transparent 28%),
    radial-gradient(circle at top left, rgba(59, 130, 246, 0.08), transparent 24%),
    linear-gradient(180deg, #f8fbfd 0%, #f8fafc 48%, #f3f6fb 100%);
}

.hero-frame,
.category-surface,
.future-track,
.process-step,
.signal-item {
  backdrop-filter: blur(14px);
}

.hero-frame {
  padding: 2rem;
  border: 1px solid var(--hero-border);
  border-radius: 2rem;
  background: var(--hero-surface);
  box-shadow: 0 28px 70px rgba(15, 23, 42, 0.08);
}

.section-stack {
  display: grid;
  gap: 2rem;
}

.section-intro {
  max-width: 48rem;
  display: grid;
  gap: 0.75rem;
}

.section-label {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #0f766e;
}

.section-title {
  font-size: clamp(2rem, 4vw, 3.25rem);
  line-height: 1.05;
  font-weight: 600;
  letter-spacing: -0.03em;
  color: #020617;
}

.section-description {
  font-size: 1rem;
  line-height: 1.75;
  color: #475569;
}

.primary-action,
.secondary-action,
.quick-link,
.tool-row {
  transition:
    border-color 180ms ease,
    background-color 180ms ease,
    color 180ms ease,
    transform 180ms ease,
    box-shadow 180ms ease;
}

.primary-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 0.95rem 1.4rem;
  border-radius: 999px;
  background: #0f172a;
  color: #f8fafc;
  font-weight: 600;
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.16);
}

.primary-action:hover {
  background: #1e293b;
  transform: translateY(-1px);
}

.secondary-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 0.95rem 1.4rem;
  border-radius: 999px;
  border: 1px solid rgba(148, 163, 184, 0.3);
  background: rgba(255, 255, 255, 0.64);
  color: #0f172a;
  font-weight: 600;
}

.secondary-action:hover,
.quick-link:hover,
.tool-row:hover {
  border-color: rgba(14, 165, 164, 0.28);
  background: rgba(240, 253, 250, 0.85);
  transform: translateY(-1px);
}

.quick-link {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0.75rem 1rem;
  border-radius: 999px;
  border: 1px solid rgba(148, 163, 184, 0.22);
  background: rgba(255, 255, 255, 0.7);
  color: #0f172a;
  font-size: 0.95rem;
  font-weight: 500;
}

.workspace-panel {
  padding: 1rem;
  border-radius: 1.75rem;
  border: 1px solid rgba(148, 163, 184, 0.22);
  background: linear-gradient(180deg, rgba(226, 232, 240, 0.46), rgba(255, 255, 255, 0.88));
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.8);
}

.workspace-chrome {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
}

.workspace-dots {
  display: flex;
  gap: 0.45rem;
}

.workspace-dots span {
  width: 0.7rem;
  height: 0.7rem;
  border-radius: 999px;
  background: rgba(148, 163, 184, 0.6);
}

.workspace-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0.5rem 0.85rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.78);
  color: #334155;
  font-size: 0.875rem;
  font-weight: 600;
}

.workspace-body {
  display: grid;
  gap: 1rem;
}

.workspace-card,
.workspace-metric {
  padding: 1.2rem;
  border-radius: 1.4rem;
  border: 1px solid rgba(148, 163, 184, 0.18);
  background: rgba(255, 255, 255, 0.8);
}

.workspace-row {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 0.85rem 0;
  border-top: 1px solid rgba(226, 232, 240, 0.9);
}

.workspace-row:first-child {
  border-top: none;
}

.workspace-row-index {
  display: flex;
  width: 1.9rem;
  height: 1.9rem;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: rgba(15, 118, 110, 0.08);
  color: #0f766e;
  font-size: 0.82rem;
  font-weight: 700;
}

.workspace-eyebrow {
  margin-bottom: 0.3rem;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #0f766e;
}

.workspace-title {
  color: #0f172a;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.5;
}

.workspace-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.45rem 0.7rem;
  border-radius: 999px;
  background: rgba(15, 118, 110, 0.08);
  color: #115e59;
  font-size: 0.8rem;
  font-weight: 600;
}

.signal-grid {
  display: grid;
  gap: 1rem;
}

.signal-item {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 1rem;
  padding: 1.15rem 1.25rem;
  border-radius: 1.25rem;
  border: 1px solid var(--soft-border);
  background: var(--soft-surface);
}

.signal-icon,
.category-icon,
.tool-row-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0f766e;
}

.signal-icon {
  width: 2.6rem;
  height: 2.6rem;
  border-radius: 999px;
  background: rgba(15, 118, 110, 0.08);
}

.process-step,
.future-track,
.category-surface {
  border: 1px solid var(--soft-border);
  background: var(--soft-surface);
}

.process-step {
  display: grid;
  gap: 1rem;
  padding: 1.5rem;
  border-radius: 1.5rem;
}

.process-index {
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  color: #0f766e;
}

.category-surface {
  display: grid;
  gap: 2rem;
  padding: 1.5rem;
  border-radius: 1.75rem;
}

.category-summary {
  display: grid;
  gap: 1.25rem;
  align-content: start;
}

.category-icon {
  width: 3.25rem;
  height: 3.25rem;
  flex-shrink: 0;
  border-radius: 1rem;
  background: rgba(15, 118, 110, 0.08);
}

.tool-grid {
  display: grid;
  gap: 0;
}

.tool-row {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 1rem;
  padding: 1rem 0;
  border-top: 1px solid rgba(226, 232, 240, 0.8);
}

.tool-row:first-child {
  border-top: none;
}

.tool-row-icon {
  width: 2.6rem;
  height: 2.6rem;
  border-radius: 0.9rem;
  background: rgba(15, 118, 110, 0.08);
}

.future-track {
  display: grid;
  gap: 1.4rem;
  padding: 1.6rem;
  border-radius: 1.6rem;
}

.future-bullet {
  display: flex;
  gap: 0.8rem;
  align-items: flex-start;
  color: #334155;
  font-size: 0.95rem;
  line-height: 1.75;
}

.future-bullet-dot {
  width: 0.55rem;
  height: 0.55rem;
  margin-top: 0.55rem;
  flex-shrink: 0;
  border-radius: 999px;
  background: #0f766e;
}

:global(.dark) .home-shell {
  --hero-surface: rgba(15, 23, 42, 0.82);
  --hero-border: rgba(71, 85, 105, 0.55);
  --soft-surface: rgba(15, 23, 42, 0.72);
  --soft-border: rgba(71, 85, 105, 0.45);
  background:
    radial-gradient(circle at top right, rgba(45, 212, 191, 0.1), transparent 28%),
    radial-gradient(circle at top left, rgba(96, 165, 250, 0.1), transparent 24%),
    linear-gradient(180deg, #020617 0%, #020617 45%, #0f172a 100%);
}

:global(.dark) .hero-frame {
  box-shadow: 0 24px 60px rgba(2, 6, 23, 0.45);
}

:global(.dark) .section-title {
  color: #f8fafc;
}

:global(.dark) .section-description,
:global(.dark) .future-bullet {
  color: #cbd5e1;
}

:global(.dark) .secondary-action {
  border-color: rgba(71, 85, 105, 0.8);
  background: rgba(15, 23, 42, 0.76);
  color: #e2e8f0;
}

:global(.dark) .secondary-action:hover,
:global(.dark) .quick-link:hover,
:global(.dark) .tool-row:hover {
  border-color: rgba(45, 212, 191, 0.45);
  background: rgba(15, 118, 110, 0.14);
}

:global(.dark) .quick-link {
  border-color: rgba(71, 85, 105, 0.7);
  background: rgba(15, 23, 42, 0.7);
  color: #e2e8f0;
}

:global(.dark) .workspace-panel {
  border-color: rgba(71, 85, 105, 0.55);
  background: linear-gradient(180deg, rgba(15, 23, 42, 0.95), rgba(15, 23, 42, 0.82));
  box-shadow: inset 0 1px 0 rgba(148, 163, 184, 0.14);
}

:global(.dark) .workspace-pill,
:global(.dark) .workspace-card,
:global(.dark) .workspace-metric {
  background: rgba(15, 23, 42, 0.82);
}

:global(.dark) .workspace-row {
  border-top-color: rgba(51, 65, 85, 0.85);
}

:global(.dark) .workspace-title {
  color: #f8fafc;
}

:global(.dark) .workspace-badge,
:global(.dark) .workspace-row-index,
:global(.dark) .signal-icon,
:global(.dark) .category-icon,
:global(.dark) .tool-row-icon {
  background: rgba(45, 212, 191, 0.12);
  color: #5eead4;
}

@media (min-width: 768px) {
  .signal-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (min-width: 1024px) {
  .hero-frame {
    padding: 2.5rem;
  }

  .category-surface {
    grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
    align-items: start;
    padding: 2rem;
  }
}

@media (max-width: 767px) {
  .hero-frame {
    padding: 1.25rem;
    border-radius: 1.5rem;
  }

  .primary-action,
  .secondary-action {
    width: 100%;
  }

  .workspace-panel {
    padding: 0.85rem;
  }
}
</style>
