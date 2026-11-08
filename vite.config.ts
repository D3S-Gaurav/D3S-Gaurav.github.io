import { defineConfig } from 'vite';
import { resumeHtml } from './src/ui/resumeHtml';

// The resume is written into index.html at build time, so it is real text for
// crawlers, screen readers and visitors without JavaScript.
export default defineConfig({
  base: '/',
  plugins: [
    {
      name: 'inline-resume',
      transformIndexHtml: (html) => html.replace('<!--RESUME-->', resumeHtml()),
    },
  ],
});
