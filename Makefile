.PHONY: dev
dev:
	cd go-job-admin && npm run dev

.PHONY: prod
prod:
	cd go-job-admin && npm run prod

.PHONY: install
install:
	cd go-job-admin && npm install


BUILD_DIR := /cicd/projects/go-job-admin
VERSION ?= $(shell date +%Y%m%d%H%M%S)
IMAGE_NAME := go-job-admin
FULL_IMAGE := $(IMAGE_NAME):$(VERSION)
ENV_FILE := .env.production
ADDRESS := "http://www.example.com"
REGISTRY := REGISTRY.example.com/go-job-admin/
REMOTE_IMAGE := $(REGISTRY)/$(IMAGE_NAME):$(VERSION)

.PHONY: build-img
build-img:
	@echo ">>> 开始构建 go-job node 镜像: $(FULL_IMAGE)"
	@if [ -d "$(BUILD_DIR)" ]; then rm -rf $(BUILD_DIR); fi
	@git clone git@github.com:Ri0nGo/go-job-admin.git $(BUILD_DIR)
	@cd $(BUILD_DIR) && \
		echo "VITE_APP_BASE_API=$(ADDRESS)/api/go-job" > go-job-admin/$(ENV_FILE) && \
		docker build -t $(FULL_IMAGE) . -f Dockerfile
	@echo ">>> 构建完成: $(FULL_IMAGE)"

	@echo ">>> 开始推送镜像到镜像仓库: $(REMOTE_IMAGE)"
	@docker tag $(FULL_IMAGE) $(REMOTE_IMAGE)
	@docker push $(REMOTE_IMAGE)
	@echo ">>> 镜像推送完成: $(REMOTE_IMAGE)"

	#@echo ">>> 开始更新 go-job-admin tag: $(VERSION)"
	#@sed -i 's#\(.*rion/go-job-admin:\)[^"]*#\1$(VERSION)#g' $$GJC
	#@docker compose  -f $$GJC  up -d --force-recreate $(IMAGE_NAME)
	#@echo ">>> 更新镜像完, 服务名: $(IMAGE_NAME)"