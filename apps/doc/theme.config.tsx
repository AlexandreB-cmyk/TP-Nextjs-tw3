import React from 'react'
import type { DocsThemeConfig } from 'nextra-theme-docs'

const config: DocsThemeConfig = {
  logo: <span style={{ fontWeight: 'bold' }}>📚 TP Next.js - Documentation</span>,
  project: {
    link: 'https://github.com/micmc422/TP-Nextjs-tw3',
  },
  docsRepositoryBase: 'https://github.com/micmc422/TP-Nextjs-tw3/tree/master/apps/doc',
  footer: {
    content: (
      <span>
        TP Next.js Avancé - {new Date().getFullYear()} © Documentation
      </span>
    ),
  },
  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta property="og:title" content="Documentation TP Next.js" />
      <meta property="og:description" content="Documentation complète du projet TP Next.js avec Turborepo" />
      <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>📚</text></svg>" />
    </>
  ),
  sidebar: {
    defaultMenuCollapseLevel: 1,
    toggleButton: true,
  },
  toc: {
    backToTop: true,
    title: 'Sur cette page',
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
  gitTimestamp: ({ timestamp }) => (
    <>
      Dernière mise à jour le{' '}
      {timestamp.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })}
    </>
  ),
  color: {
    hue: 210,
    saturation: 100,
  },
}

export default config
