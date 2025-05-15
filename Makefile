.PHONY: dev
dev:
	cd go-job-admin && npm run dev

.PHONY: prod
prod:
	cd go-job-admin && npm run prod

.PHONY: install
install:
	cd go-job-admin && npm install