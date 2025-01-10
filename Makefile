prettier:
	npx prettier --write **/*.ts

build:
	rm -f *.js *.html *.css
	bun build --experimental-html --experimental-css ./web/index.html --outdir=.
