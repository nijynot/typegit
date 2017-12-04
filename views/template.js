module.exports = ({ script, title }) => {
  return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/yui/3.18.1/cssreset/cssreset-min.css" />
      <link rel="stylesheet" href="/assets/css/style.css" />
      <title>${title}</title>
    </head>
    <body>
      <div id="root">
      </div>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/react/16.0.0-rc.3/umd/react.development.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/16.0.0-rc.3/umd/react-dom.development.js"></script>
      <script src="/assets/${script}"></script>
    </body>
  </html>
  `;
};

// <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/2.9.0/github-markdown.css" />
