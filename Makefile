prettier:
	npx prettier --write **/*.ts

build:
	rm -f *.js *.html *.css *.ttf
	bun build --experimental-html --experimental-css ./web/index.html --outdir=.

test:
	bun test
	bunx tsc
