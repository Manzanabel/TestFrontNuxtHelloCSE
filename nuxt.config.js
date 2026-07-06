// Je me hais d'écrire un projet aussi moisi en 2026, mais bon, c'est pour les
// tests techniques, alors on fait avec. Toi qui lis ça, sache que je suis désolé.
// Promis notre stack technique ressemble pas à ça en vrai. Je suis un Lead dev
// sérieux, je te jure.

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',

  ssr: false,
  
  vite: {
    optimizeDeps: {
      include: [
        '@vue/devtools-core',
        '@vue/devtools-kit',
        'lodash',
        'moment',
      ]
    }
  },

  build: {
    transpile: ['vuex', 'vue3-styled-components'],
  },
  

  app: {
    head: {
      title: 'Ma Super Todo App',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
      link: [
        {
          rel: 'stylesheet',
          href: 'https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css',
        },
      ],
      script: [
        {
          src: 'https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js',
        },
      ],
    },
  },

  plugins: [{ src: '~/plugins/vuex.client.js', mode: 'client' }],
});
