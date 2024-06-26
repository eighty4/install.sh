#!/usr/bin/env sh
set -e

echo "VITE_GITHUB_CLIENT_ID=\"$GITHUB_CLIENT_ID\"" > .env.production
echo "VITE_SCRIPT_TEMPLATE_VERSION=\"$(node templateVersion.js)\"" >> .env.production

pnpm build:tsc
pnpm build:vite

mv dist/index.html dist/original.html

docker run -i --rm 84tech/minhtml \
  --minify-css --minify-js \
  --do-not-minify-doctype \
  --ensure-spec-compliant-unquoted-attribute-values \
  --keep-spaces-between-attributes \
  < dist/original.html \
  > dist/index.html

rm dist/original.html
