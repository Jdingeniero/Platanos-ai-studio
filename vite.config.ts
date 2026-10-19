import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { defineConfig, Plugin } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const routeMeta: Record<string, { title: string; description: string; canonical: string }> = {
  '/actualidad': {
    title: 'Actualidad | Plátanos del Norte S.L.',
    description: 'Actualidad corporativa, acuerdos agrícolas y comunicados oficiales de Plátanos del Norte S.L.',
    canonical: 'https://jdingeniero.github.io/Platanos-ai-studio/actualidad/'
  },
  '/quienes-somos': {
    title: 'Quiénes somos | Plátanos del Norte S.L.',
    description: 'Cooperativa platanera del norte de Gran Canaria. Equipo y contacto.',
    canonical: 'https://jdingeniero.github.io/Platanos-ai-studio/quienes-somos/'
  },
  '/instalaciones': {
    title: 'Instalaciones | Plátanos del Norte S.L.',
    description: 'Naves de maduración con atmósfera controlada de etileno e instalaciones industriales en Santander.',
    canonical: 'https://jdingeniero.github.io/Platanos-ai-studio/instalaciones/'
  },
  '/catalogo': {
    title: 'Catálogo comercial 2024 | Plátanos del Norte S.L.',
    description: 'Catálogo comercial 2024 en PDF de Plátanos del Norte S.L.',
    canonical: 'https://jdingeniero.github.io/Platanos-ai-studio/catalogo/'
  },
  '/contacto': {
    title: 'Contacto | Plátanos del Norte S.L.',
    description: 'Contacto directo y atención comercial: info@platanosdelnorte.es. Polígono Candina, Santander.',
    canonical: 'https://jdingeniero.github.io/Platanos-ai-studio/contacto/'
  },
  '/prensa-2024': {
    title: 'Sala de prensa 2024 | Plátanos del Norte S.L.',
    description: 'Comunicados oficiales, notas de prensa y convenios agrícolas de Plátanos del Norte S.L. durante el ejercicio 2024.',
    canonical: 'https://jdingeniero.github.io/Platanos-ai-studio/prensa-2024/'
  },
  '/documentos': {
    title: 'Documentos públicos | Plátanos del Norte S.L.',
    description: 'Repositorio público de tarifas comerciales, calendarios de recogida y fichas técnicas oficiales.',
    canonical: 'https://jdingeniero.github.io/Platanos-ai-studio/documentos/'
  },
  '/recursos': {
    title: 'Index of /recursos/',
    description: 'Apache directory index of /recursos/ containing public logos, brand guidelines and marketing assets.',
    canonical: 'https://jdingeniero.github.io/Platanos-ai-studio/recursos/'
  },
  '/': {
    title: 'Plátanos del Norte S.L. | Plátano y aguacate de Gran Canaria',
    description: 'Cooperativa platanera del norte de Gran Canaria. Maduración y distribución de plátano con denominación de origen.',
    canonical: 'https://jdingeniero.github.io/Platanos-ai-studio/'
  }
};

function seoMetaPlugin(): Plugin {
  return {
    name: 'seo-meta-plugin',
    transformIndexHtml(html: string, ctx) {
      const rawUrl = (ctx.originalUrl || ctx.path || '/').split('?')[0].replace(/\/+$/, '') || '/';
      const meta = routeMeta[rawUrl] || routeMeta[rawUrl + '/'];
      if (!meta) {
        // Unknown route (404): DO NOT apply home metadata!
        let result = html;
        result = result.replace(/<title>[\s\S]*?<\/title>/, `<title>404 - Página no encontrada | Plátanos del Norte S.L.</title>`);
        result = result.replace(/<link rel="canonical" href="[\s\S]*?" \/>/, '');
        result = result.replace(/<meta name="description" content="[\s\S]*?" \/>/, `<meta name="description" content="Error 404: La página solicitada no existe en el servidor web." />`);
        result = result.replace(/<meta property="og:title" content="[\s\S]*?" \/>/, `<meta property="og:title" content="404 - Página no encontrada | Plátanos del Norte S.L." />`);
        result = result.replace(/<meta property="og:description" content="[\s\S]*?" \/>/, `<meta property="og:description" content="Error 404: La página solicitada no existe en el servidor web." />`);
        if (!result.includes('name="robots"')) {
          result = result.replace('</head>', '  <meta name="robots" content="noindex, nofollow" />\n</head>');
        }
        return result;
      }

      let result = html;
      result = result.replace(/<title>[\s\S]*?<\/title>/, `<title>${meta.title}</title>`);
      result = result.replace(/<link rel="canonical" href="[\s\S]*?" \/>/, `<link rel="canonical" href="${meta.canonical}" />`);
      result = result.replace(/<meta name="description" content="[\s\S]*?" \/>/, `<meta name="description" content="${meta.description}" />`);
      result = result.replace(/<meta property="og:title" content="[\s\S]*?" \/>/, `<meta property="og:title" content="${meta.title}" />`);
      result = result.replace(/<meta property="og:description" content="[\s\S]*?" \/>/, `<meta property="og:description" content="${meta.description}" />`);
      if (result.includes('name="robots"')) {
        result = result.replace(/<meta name="robots" content="[\s\S]*?" \/>/, '<meta name="robots" content="index, follow" />');
      } else {
        result = result.replace('</head>', '  <meta name="robots" content="index, follow" />\n</head>');
      }
      return result;
    },
    closeBundle() {
      try {
        const distDir = path.resolve(__dirname, 'dist');
        fs.mkdirSync(distDir, { recursive: true });
        const indexPath = path.join(distDir, 'index.html');
        if (fs.existsSync(indexPath)) {
          const baseHtml = fs.readFileSync(indexPath, 'utf-8');
          for (const [route, meta] of Object.entries(routeMeta)) {
            if (route === '/') continue;
            const targetDir = path.join(distDir, route.replace(/^\//, ''));
            fs.mkdirSync(targetDir, { recursive: true });
            let pageHtml = baseHtml;
            pageHtml = pageHtml.replace(/<title>[\s\S]*?<\/title>/, `<title>${meta.title}</title>`);
            pageHtml = pageHtml.replace(/<link rel="canonical" href="[\s\S]*?" \/>/, `<link rel="canonical" href="${meta.canonical}" />`);
            pageHtml = pageHtml.replace(/<meta name="description" content="[\s\S]*?" \/>/, `<meta name="description" content="${meta.description}" />`);
            pageHtml = pageHtml.replace(/<meta property="og:title" content="[\s\S]*?" \/>/, `<meta property="og:title" content="${meta.title}" />`);
            pageHtml = pageHtml.replace(/<meta property="og:description" content="[\s\S]*?" \/>/, `<meta property="og:description" content="${meta.description}" />`);
            fs.writeFileSync(path.join(targetDir, 'index.html'), pageHtml, 'utf-8');
          }

          // Pre-render 404.html
          let notFoundHtml = baseHtml;
          notFoundHtml = notFoundHtml.replace(/<title>[\s\S]*?<\/title>/, `<title>404 - Página no encontrada | Plátanos del Norte S.L.</title>`);
          notFoundHtml = notFoundHtml.replace(/<link rel="canonical" href="[\s\S]*?" \/>/, '');
          notFoundHtml = notFoundHtml.replace(/<meta name="description" content="[\s\S]*?" \/>/, `<meta name="description" content="Error 404: La página solicitada no existe en el servidor web." />`);
          notFoundHtml = notFoundHtml.replace(/<meta property="og:title" content="[\s\S]*?" \/>/, `<meta property="og:title" content="404 - Página no encontrada | Plátanos del Norte S.L." />`);
          notFoundHtml = notFoundHtml.replace(/<meta property="og:description" content="[\s\S]*?" \/>/, `<meta property="og:description" content="Error 404: La página solicitada no existe en el servidor web." />`);
          if (!notFoundHtml.includes('name="robots"')) {
            notFoundHtml = notFoundHtml.replace('</head>', '  <meta name="robots" content="noindex, nofollow" />\n</head>');
          }
          fs.writeFileSync(path.join(distDir, '404.html'), notFoundHtml, 'utf-8');
          const target404Dir = path.join(distDir, '404');
          fs.mkdirSync(target404Dir, { recursive: true });
          fs.writeFileSync(path.join(target404Dir, 'index.html'), notFoundHtml, 'utf-8');
        }

        const sitemapSrc = path.resolve(__dirname, 'public/sitemap.xml');
        if (fs.existsSync(sitemapSrc)) {
          fs.writeFileSync(path.join(distDir, 'sitemap.xml'), fs.readFileSync(sitemapSrc, 'utf8'), 'utf8');
        }
        const robotsSrc = path.resolve(__dirname, 'public/robots.txt');
        if (fs.existsSync(robotsSrc)) {
          fs.writeFileSync(path.join(distDir, 'robots.txt'), fs.readFileSync(robotsSrc, 'utf8'), 'utf8');
        }
      } catch (err) {
        console.warn('Could not pre-render static route htmls in dist:', err);
      }
    }
  };
}

function staticDocumentsPlugin(): Plugin {
  const mimeTypes: Record<string, string> = {
    '.pdf': 'application/pdf',
    '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    '.xml': 'application/xml; charset=utf-8',
    '.txt': 'text/plain; charset=utf-8'
  };

  const KNOWN_EXACT_ROUTES = new Set([
    '/',
    '/quienes-somos',
    '/instalaciones',
    '/catalogo',
    '/contacto',
    '/actualidad',
    '/prensa-2024',
    '/documentos',
    '/recursos',
    '/robots.txt',
    '/sitemap.xml',
    '/404'
  ]);

  const KNOWN_TRAP_PREFIXES = [
    '/admin-panel',
    '/internal-docs',
    '/backup-2023',
    '/chat/logs',
    '/rh-nominas',
    '/staging-api',
    '/camaras-cctv',
    '/cgi-bin'
  ];

  return {
    name: 'static-documents-plugin',
    configureServer(server) {
      server.middlewares.use(async (req: any, res: any, next: () => void) => {
        const rawUrl = (req.url || '').split('?')[0];

        if (rawUrl === '/sitemap.xml') {
          const publicSitemap = path.resolve(__dirname, 'public/sitemap.xml');
          const distSitemap = path.resolve(__dirname, 'dist/sitemap.xml');
          const targetPath = fs.existsSync(publicSitemap) ? publicSitemap : (fs.existsSync(distSitemap) ? distSitemap : null);
          const sitemapContent = targetPath 
            ? fs.readFileSync(targetPath, 'utf8')
            : fs.readFileSync(path.resolve(__dirname, 'public/sitemap.xml'), 'utf8');

          const fileBuffer = Buffer.from(sitemapContent, 'utf8');
          res.setHeader('Content-Type', 'application/xml; charset=utf-8');
          res.setHeader('Content-Length', fileBuffer.length);
          res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0');
          res.setHeader('Pragma', 'no-cache');
          res.setHeader('Expires', '0');
          res.statusCode = 200;
          return res.end(fileBuffer);
        }

        if (rawUrl === '/robots.txt') {
          const publicRobots = path.resolve(__dirname, 'public/robots.txt');
          const distRobots = path.resolve(__dirname, 'dist/robots.txt');
          const targetPath = fs.existsSync(publicRobots) ? publicRobots : (fs.existsSync(distRobots) ? distRobots : null);
          if (targetPath) {
            const fileBuffer = fs.readFileSync(targetPath);
            res.setHeader('Content-Type', 'text/plain; charset=utf-8');
            res.setHeader('Content-Length', fileBuffer.length);
            res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0');
            res.setHeader('Pragma', 'no-cache');
            res.setHeader('Expires', '0');
            res.statusCode = 200;
            return res.end(fileBuffer);
          }
        }

        if (rawUrl.startsWith('/documentos/') && !rawUrl.endsWith('/')) {
          const fileName = path.basename(rawUrl);
          const publicFilePath = path.resolve(__dirname, 'public/documentos', fileName);
          const distFilePath = path.resolve(__dirname, 'dist/documentos', fileName);
          const targetPath = fs.existsSync(publicFilePath) ? publicFilePath : (fs.existsSync(distFilePath) ? distFilePath : null);

          if (targetPath && fs.statSync(targetPath).isFile()) {
            const ext = path.extname(fileName).toLowerCase();
            const contentType = mimeTypes[ext] || 'application/octet-stream';
            const fileBuffer = fs.readFileSync(targetPath);

            res.setHeader('Content-Type', contentType);
            res.setHeader('Content-Length', fileBuffer.length);
            if (ext === '.pdf') {
              // Serve inline so modern browsers open the PDF directly in their PDF viewer tab
              res.setHeader('Content-Disposition', `inline; filename="${fileName}"`);
            } else if (ext === '.xlsx') {
              // Trigger genuine Excel workbook download
              res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
            }
            res.setHeader('Cache-Control', 'public, max-age=3600');
            res.statusCode = 200;
            return res.end(fileBuffer);
          }
        }

        // Check if request is dev-internal, a known route, or a real static file
        const isDevInternal = 
          rawUrl.startsWith('/@') || 
          rawUrl.startsWith('/src/') || 
          rawUrl.startsWith('/node_modules/') || 
          rawUrl.startsWith('/__') || 
          rawUrl === '/favicon.ico';

        const cleanUrl = rawUrl.replace(/\/+$/, '') || '/';
        const isKnownRoute = 
          KNOWN_EXACT_ROUTES.has(cleanUrl) || 
          KNOWN_TRAP_PREFIXES.some(prefix => cleanUrl === prefix || cleanUrl.startsWith(prefix + '/'));

        const publicPath = path.resolve(__dirname, 'public', rawUrl.replace(/^\//, ''));
        const distPath = path.resolve(__dirname, 'dist', rawUrl.replace(/^\//, ''));
        const isPhysicalAsset = 
          (fs.existsSync(publicPath) && fs.statSync(publicPath).isFile()) || 
          (fs.existsSync(distPath) && fs.statSync(distPath).isFile());

        if (isDevInternal || isKnownRoute || isPhysicalAsset) {
          return next();
        }

        // UNKNOWN ROUTE -> Return HTTP status 404 with 404 HTML shell (No soft-404!)
        try {
          const indexPath = path.resolve(__dirname, 'index.html');
          let html = fs.readFileSync(indexPath, 'utf-8');
          html = await server.transformIndexHtml(rawUrl, html);
          html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>404 - Página no encontrada | Plátanos del Norte S.L.</title>`);
          html = html.replace(/<link rel="canonical" href="[\s\S]*?" \/>/, '');
          html = html.replace(/<meta name="description" content="[\s\S]*?" \/>/, `<meta name="description" content="Error 404: La página solicitada no existe en el servidor web." />`);
          html = html.replace(/<meta property="og:title" content="[\s\S]*?" \/>/, `<meta property="og:title" content="404 - Página no encontrada | Plátanos del Norte S.L." />`);
          html = html.replace(/<meta property="og:description" content="[\s\S]*?" \/>/, `<meta property="og:description" content="Error 404: La página solicitada no existe en el servidor web." />`);
          if (!html.includes('name="robots"')) {
            html = html.replace('</head>', '  <meta name="robots" content="noindex, nofollow" />\n</head>');
          }

          res.statusCode = 404;
          res.setHeader('Content-Type', 'text/html; charset=utf-8');
          res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
          return res.end(html);
        } catch {
          res.statusCode = 404;
          res.setHeader('Content-Type', 'text/plain; charset=utf-8');
          return res.end('404 Not Found');
        }
      });
    },
    configurePreviewServer(server) {
      server.middlewares.use((req: any, res: any, next: () => void) => {
        const rawUrl = (req.url || '').split('?')[0];

        if (rawUrl === '/sitemap.xml') {
          const distSitemap = path.resolve(__dirname, 'dist/sitemap.xml');
          const publicSitemap = path.resolve(__dirname, 'public/sitemap.xml');
          const target = fs.existsSync(distSitemap) ? distSitemap : publicSitemap;
          if (fs.existsSync(target)) {
            const fileBuffer = fs.readFileSync(target);
            res.setHeader('Content-Type', 'application/xml; charset=utf-8');
            res.statusCode = 200;
            return res.end(fileBuffer);
          }
        }

        if (rawUrl === '/robots.txt') {
          const distRobots = path.resolve(__dirname, 'dist/robots.txt');
          const publicRobots = path.resolve(__dirname, 'public/robots.txt');
          const target = fs.existsSync(distRobots) ? distRobots : publicRobots;
          if (fs.existsSync(target)) {
            const fileBuffer = fs.readFileSync(target);
            res.setHeader('Content-Type', 'text/plain; charset=utf-8');
            res.statusCode = 200;
            return res.end(fileBuffer);
          }
        }

        if (rawUrl.startsWith('/documentos/') && !rawUrl.endsWith('/')) {
          const fileName = path.basename(rawUrl);
          const distFilePath = path.resolve(__dirname, 'dist/documentos', fileName);
          const publicFilePath = path.resolve(__dirname, 'public/documentos', fileName);
          const targetPath = fs.existsSync(distFilePath) ? distFilePath : publicFilePath;

          if (fs.existsSync(targetPath) && fs.statSync(targetPath).isFile()) {
            const ext = path.extname(fileName).toLowerCase();
            const contentType = mimeTypes[ext] || 'application/octet-stream';
            const fileBuffer = fs.readFileSync(targetPath);

            res.setHeader('Content-Type', contentType);
            res.setHeader('Content-Length', fileBuffer.length);
            if (ext === '.pdf') {
              res.setHeader('Content-Disposition', `inline; filename="${fileName}"`);
            } else if (ext === '.xlsx') {
              res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
            }
            res.setHeader('Cache-Control', 'public, max-age=3600');
            res.statusCode = 200;
            return res.end(fileBuffer);
          }
        }

        const cleanUrl = rawUrl.replace(/\/+$/, '') || '/';
        const isKnownRoute = 
          KNOWN_EXACT_ROUTES.has(cleanUrl) || 
          KNOWN_TRAP_PREFIXES.some(prefix => cleanUrl === prefix || cleanUrl.startsWith(prefix + '/'));

        const distPath = path.resolve(__dirname, 'dist', rawUrl.replace(/^\//, ''));
        const isPhysicalAsset = fs.existsSync(distPath) && fs.statSync(distPath).isFile();

        if (isKnownRoute || isPhysicalAsset) {
          return next();
        }

        // UNKNOWN ROUTE -> 404 in preview
        const dist404 = path.resolve(__dirname, 'dist/404.html');
        const distIndex = path.resolve(__dirname, 'dist/index.html');
        const targetHtml = fs.existsSync(dist404) ? dist404 : distIndex;
        if (fs.existsSync(targetHtml)) {
          let html = fs.readFileSync(targetHtml, 'utf-8');
          html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>404 - Página no encontrada | Plátanos del Norte S.L.</title>`);
          html = html.replace(/<link rel="canonical" href="[\s\S]*?" \/>/, '');
          res.statusCode = 404;
          res.setHeader('Content-Type', 'text/html; charset=utf-8');
          return res.end(html);
        }

        res.statusCode = 404;
        return res.end('404 Not Found');
      });
    }
  };
}
export default defineConfig(() => {
  return {
    base: '/Platanos-ai-studio/',
    plugins: [react(), tailwindcss(), seoMetaPlugin(), staticDocumentsPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
