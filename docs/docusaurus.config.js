/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: 'Use Fixed',
  tagline: 'A (tiny) library to get permanent references to callbacks or state via react hooks.',
  url: 'https://paulKabira.github.io',
  baseUrl: '/use-fixed/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'paulKabira', // Usually your GitHub org/user name.
  projectName: 'use-fixed', // Usually your repo name.
  themeConfig: {
    navbar: {
      title: 'Use Fixed',
      logo: {
        alt: 'Use Fixed Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          to: 'docs/',
          activeBasePath: 'docs',
          label: 'Docs',
          position: 'left',
        },
        {
          href: 'https://github.com/paulKabira/use-fixed',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Getting Started',
              to: 'docs/',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Aakash More, Inc. Built with Docusaurus.`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl:
            'https://github.com/paulKabira/use-fixed/edit/master/docs/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl:
            'https://github.com/paulKabira/use-fixed/edit/master/docs',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
