module.exports = ({ script, title }) => {
  if (process.env.NODE_ENV === 'production') {
    return `<!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
          <meta name="viewport" content="initial-scale=1, width=device-width">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/yui/3.18.1/cssreset/cssreset-min.css" />
        <link rel="stylesheet" href="/assets/css/style.css" />
        <link href="https://fonts.googleapis.com/css?family=Roboto:400,700" rel="stylesheet">
        <link href="https://fonts.googleapis.com/css?family=Overpass+Mono:400,700" rel="stylesheet">
        <link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,600,700" rel="stylesheet">
        <link href="https://fonts.googleapis.com/css?family=Open+Sans:400,600,700" rel="stylesheet">
        <link href="https://fonts.googleapis.com/css?family=EB+Garamond:400,400i,500,500i,600,600i,700,700i&amp;subset=latin-ext" rel="stylesheet">
        <link href="https://fonts.googleapis.com/css?family=Space+Mono:400,700" rel="stylesheet">
        <title>${title}</title>
      </head>
      <body>
        <div id="root">
        </div>
        <div id="root-modal">
        </div>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/react/16.2.0/umd/react.production.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/16.2.0/umd/react-dom.production.min.js"></script>
        <script src="/assets/${script}${(process.env.NODE_ENV === 'production') ? '.gz' : ''}"></script>
        <script src="https://js.stripe.com/v3/"></script>
        <!-- Global site tag (gtag.js) - Google Analytics -->
        <script async src="https://www.googletagmanager.com/gtag/js?id=UA-89395450-5"></script>
        <script>
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'UA-89395450-5');
        </script>
      </body>
    </html>`;
  }
  return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
        <meta name="viewport" content="initial-scale=1, width=device-width">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/yui/3.18.1/cssreset/cssreset-min.css" />
      <link rel="stylesheet" href="/assets/css/style.css" />
      <link href="https://fonts.googleapis.com/css?family=Roboto:400,700" rel="stylesheet">
      <link href="https://fonts.googleapis.com/css?family=Overpass+Mono:400,700" rel="stylesheet">
      <link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,600,700" rel="stylesheet">
      <link href="https://fonts.googleapis.com/css?family=Open+Sans:400,600,700" rel="stylesheet">
      <link href="https://fonts.googleapis.com/css?family=EB+Garamond:400,400i,500,500i,600,600i,700,700i&amp;subset=latin-ext" rel="stylesheet">
      <link href="https://fonts.googleapis.com/css?family=Space+Mono:400,700" rel="stylesheet">
      <title>${title}</title>
    </head>
    <body>
      <div id="root">
      </div>
      <div id="root-modal">
      </div>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/react/16.2.0/umd/react.development.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/16.2.0/umd/react-dom.development.js"></script>
      <script src="/assets/${script}"></script>
      <script src="https://js.stripe.com/v3/"></script>
    </body>
  </html>
  `;
};

// <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/2.9.0/github-markdown.css" />
