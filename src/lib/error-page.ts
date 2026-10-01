export function renderErrorPage(pathname = "/"): string {
  const ar = pathname === "/ar" || pathname.startsWith("/ar/");
  const t = ar
    ? {
        title: "تعذّر تحميل هذه الصفحة",
        body: "حدث خطأ من جانبنا. يمكنك إعادة تحميل الصفحة أو العودة إلى الصفحة الرئيسية.",
        retry: "إعادة المحاولة",
        home: "الذهاب إلى الرئيسية",
        href: "/ar",
      }
    : {
        title: "This page didn't load",
        body: "Something went wrong on our end. You can try refreshing or head back home.",
        retry: "Try again",
        home: "Go home",
        href: "/",
      };
  return `<!doctype html>
<html lang="${ar ? "ar" : "en"}"${ar ? ' dir="rtl"' : ""}>
  <head>
    <meta charset="utf-8" />
    <title>${t.title}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      body { font: 15px/1.5 system-ui, -apple-system, sans-serif; background: #fafafa; color: #111; display: grid; place-items: center; min-height: 100vh; margin: 0; padding: 1.5rem; }
      .card { max-width: 28rem; width: 100%; text-align: center; padding: 2rem; }
      h1 { font-size: 1.25rem; margin: 0 0 0.5rem; }
      p { color: #4b5563; margin: 0 0 1.5rem; }
      .actions { display: flex; gap: 0.5rem; justify-content: center; flex-wrap: wrap; }
      a, button { padding: 0.5rem 1rem; border-radius: 0.375rem; font: inherit; cursor: pointer; text-decoration: none; border: 1px solid transparent; }
      .primary { background: #111; color: #fff; }
      .secondary { background: #fff; color: #111; border-color: #d1d5db; }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>${t.title}</h1>
      <p>${t.body}</p>
      <div class="actions">
        <button class="primary" onclick="location.reload()">${t.retry}</button>
        <a class="secondary" href="${t.href}">${t.home}</a>
      </div>
    </div>
  </body>
</html>`;
}
