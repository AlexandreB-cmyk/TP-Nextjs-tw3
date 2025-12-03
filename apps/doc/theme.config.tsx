import React from 'react'
import type { DocsThemeConfig } from 'nextra-theme-docs'

const config: DocsThemeConfig = {
  logo: <span style={{ fontWeight: 'bold' }}>📚 TP Next.js - Documentation</span>,
  project: {
    link: 'https://github.com/micmc422/TP-Nextjs-tw3',
  },
  docsRepositoryBase: 'https://github.com/micmc422/TP-Nextjs-tw3/tree/main/apps/doc',
  footer: {
    content: 'TP Next.js Avancé - Documentation',
  },
  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta property="og:title" content="Documentation TP Next.js" />
      <meta property="og:description" content="Documentation complète du projet TP Next.js avec Turborepo" />
    </>
  ),
  sidebar: {
    defaultMenuCollapseLevel: 1,
    toggleButton: true,
  },
  toc: {
    backToTop: true,
  },
  navigation: {
    prev: true,
    next: true,
  },
  editLink: {
    content: 'Modifier cette page sur GitHub →',
  },
  feedback: {
    content: 'Des questions ? Donnez-nous votre avis →',
    labels: 'feedback',
  },
  color: {
    hue: 210,
    saturation: 100,
  },
}

export default config
