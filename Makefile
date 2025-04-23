BUILD_DIR := /cicd/projects/go-job-admin
VERSION ?= $(shell date +%Y%m%d%H%M%S)
IMAGE_NAME := go-job-admin
FULL_IMAGE := $(IMAGE_NAME):$(VERSION)
REGISTRY := crpi-80ibqv4safscbvw3.cn-shanghai.personal.cr.aliyuncs.com/rion
REMOTE_IMAGE := $(REGISTRY)/$(IMAGE_NAME):$(VERSION)

.PHONY: build-img
build-img:
	@echo ">>> 开始构建 go-job node 镜像: $(FULL_IMAGE)"
	@if [ -d "$(BUILD_DIR)" ]; then rm -rf $(BUILD_DIR); fi
	@git clone git@github.com:Ri0nGo/go-job-admin.git $(BUILD_DIR)
	@cd $(BUILD_DIR) && \
		docker build -t $(FULL_IMAGE) . -f Dockerfile
	@echo ">>> 构建完成: $(FULL_IMAGE)"

