<template>
  <div class="node-management">
    <el-card class="main-card">
      <div class="header-container">
        <h2 class="title">节点管理</h2>
        <div class="action-container">
          <el-input
              v-model="searchQuery"
              placeholder="搜索节点..."
              prefix-icon="el-icon-search"
              clearable
              @input="filterNodes"
              class="search-input"
          />
          <el-select v-model="statusFilter" placeholder="状态筛选" @change="filterNodes" class="status-filter">
            <el-option label="全部" value="" />
            <el-option label="在线" value="online" />
            <el-option label="离线" value="offline" />
            <el-option label="错误" value="error" />
          </el-select>
          <el-button type="primary" icon="el-icon-plus" @click="showCreateDialog">创建节点</el-button>
          <el-button
              type="danger"
              icon="el-icon-delete"
              :disabled="selectedNodes.length === 0"
              @click="confirmDeleteSelected"
          >
            删除所选
          </el-button>
        </div>
      </div>

      <el-row :gutter="20" class="node-container">
        <el-col :span="6" v-for="node in filteredNodes" :key="node.id" class="node-col">
          <el-card
              :class="['node-card', { 'selected': node.selected }]"
              :shadow="node.selected ? 'always' : 'hover'"
              @click.native="toggleNodeSelection(node)"
          >
            <div class="node-header">
              <div class="node-status-container">
                <div :class="['status-indicator', `status-${node.status}`]"></div>
                <span class="status-text">{{ getStatusText(node.status) }}</span>
              </div>
              <el-checkbox
                  v-model="node.selected"
                  @click.stop
                  @change="updateSelectedNodes"
              ></el-checkbox>
            </div>

            <div class="node-content">
              <h3 class="node-name">{{ node.name }}</h3>
              <div class="node-id">ID: {{ node.id }}</div>
              <div class="node-ip">IP: {{ node.ip }}</div>
            </div>

            <div class="node-footer">
              <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-setting"
                  @click.stop="manageNode(node)"
              >
                管理
              </el-button>
              <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click.stop="confirmDeleteNode(node)"
              >
                删除
              </el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>

    </el-card>

    <!-- 创建节点对话框 -->
    <el-dialog title="创建新节点" :visible.sync="createDialogVisible" width="500px">
      <el-form :model="newNode" :rules="nodeRules" ref="newNodeForm" label-width="100px">
        <el-form-item label="节点名称" prop="name">
          <el-input v-model="newNode.name" placeholder="请输入节点名称"></el-input>
        </el-form-item>
        <el-form-item label="IP地址" prop="ip">
          <el-input v-model="newNode.ip" placeholder="例如：192.168.1.100"></el-input>
        </el-form-item>
        <el-form-item label="节点类型" prop="type">
          <el-select v-model="newNode.type" placeholder="选择节点类型" style="width: 100%">
            <el-option label="工作节点" value="worker"></el-option>
            <el-option label="主节点" value="master"></el-option>
            <el-option label="边缘节点" value="edge"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述">
          <el-input type="textarea" v-model="newNode.description" placeholder="节点描述（可选）"></el-input>
        </el-form-item>
        <el-form-item label="标签">
          <el-tag
              :key="tag"
              v-for="tag in newNode.tags"
              closable
              :disable-transitions="false"
              @close="removeTag(tag)"
              class="tag-item"
          >
            {{tag}}
          </el-tag>
          <el-input
              class="tag-input"
              v-if="tagInputVisible"
              v-model="tagInputValue"
              ref="tagInput"
              size="small"
              @keyup.enter.native="addTag"
              @blur="addTag"
          >
          </el-input>
          <el-button v-else class="button-new-tag" size="small" @click="showTagInput">+ 添加标签</el-button>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="createDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="createNode">创 建</el-button>
      </span>
    </el-dialog>

    <!-- 确认删除对话框 -->
    <el-dialog
        title="确认删除"
        :visible.sync="deleteDialogVisible"
        width="400px"
    >
      <div v-if="deleteMode === 'single'">
        确定要删除节点 "{{ nodeToDelete ? nodeToDelete.name : '' }}" 吗？
      </div>
      <div v-else>
        确定要删除选中的 {{ selectedNodes.length }} 个节点吗？
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteDialogVisible = false">取 消</el-button>
        <el-button type="danger" @click="deleteConfirmed">确认删除</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'NodeManagement',
  data() {
    return {
      searchQuery: '',
      statusFilter: '',
      nodes: [],
      filteredNodes: [],
      selectedNodes: [],
      currentPage: 1,
      pageSize: 8,
      totalNodes: 0,
      createDialogVisible: false,
      deleteDialogVisible: false,
      deleteMode: 'single', // 'single' or 'multiple'
      nodeToDelete: null,
      tagInputVisible: false,
      tagInputValue: '',
      newNode: {
        name: '',
        ip: '',
        type: 'worker',
        description: '',
        tags: []
      },
      nodeRules: {
        name: [
          { required: true, message: '请输入节点名称', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        ip: [
          { required: true, message: '请输入IP地址', trigger: 'blur' },
          { pattern: /^(\d{1,3}\.){3}\d{1,3}$/, message: 'IP地址格式不正确', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择节点类型', trigger: 'change' }
        ]
      }
    };
  },
  created() {
    this.initData();
  },
  methods: {
    initData() {
      // 模拟数据 - 实际应用中应从API获取
      const mockNodes = [];
      const statusOptions = ['online', 'offline', 'error'];

      for (let i = 1; i <= 50; i++) {
        const randomStatus = statusOptions[Math.floor(Math.random() * statusOptions.length)];
        mockNodes.push({
          id: `node-${Math.random().toString(36).substr(2, 8)}`,
          name: `节点 ${i}`,
          ip: `192.168.1.${100 + i}`,
          status: randomStatus,
          type: i % 3 === 0 ? 'master' : i % 5 === 0 ? 'edge' : 'worker',
          selected: false
        });
      }

      this.nodes = mockNodes;
      this.totalNodes = mockNodes.length;
      this.filterNodes();
    },

    filterNodes() {
      let result = [...this.nodes];

      // 应用搜索过滤
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        result = result.filter(node =>
            node.name.toLowerCase().includes(query) ||
            node.id.toLowerCase().includes(query) ||
            node.ip.toLowerCase().includes(query)
        );
      }

      // 应用状态过滤
      if (this.statusFilter) {
        result = result.filter(node => node.status === this.statusFilter);
      }

      this.filteredNodes = result;
      this.totalNodes = result.length;
      this.handleCurrentChange(1);
    },

    getStatusText(status) {
      switch(status) {
        case 'online': return '在线';
        case 'offline': return '离线';
        case 'error': return '错误';
        default: return '未知';
      }
    },

    toggleNodeSelection(node) {
      node.selected = !node.selected;
      this.updateSelectedNodes();
    },

    updateSelectedNodes() {
      this.selectedNodes = this.nodes.filter(node => node.selected);
    },

    handleSizeChange(size) {
      this.pageSize = size;
      this.filterNodes();
    },

    handleCurrentChange(page) {
      this.currentPage = page;
      const start = (page - 1) * this.pageSize;
      const end = page * this.pageSize;
      this.filteredNodes = this.nodes.slice(start, end);
    },

    showCreateDialog() {
      this.newNode = {
        name: '',
        ip: '',
        type: 'worker',
        description: '',
        tags: []
      };
      this.createDialogVisible = true;
    },

    createNode() {
      this.$refs.newNodeForm.validate((valid) => {
        if (valid) {
          // 模拟后端API调用
          const id = `node-${Math.random().toString(36).substr(2, 8)}`;
          const newNode = {
            ...this.newNode,
            id,
            status: 'offline', // 默认为离线状态
            selected: false
          };

          this.nodes.unshift(newNode);
          this.totalNodes = this.nodes.length;
          this.filterNodes();

          this.createDialogVisible = false;
          this.$message({
            message: `节点 ${newNode.name} 创建成功！`,
            type: 'success'
          });
        } else {
          return false;
        }
      });
    },

    confirmDeleteNode(node) {
      this.deleteMode = 'single';
      this.nodeToDelete = node;
      this.deleteDialogVisible = true;
    },

    confirmDeleteSelected() {
      this.deleteMode = 'multiple';
      this.deleteDialogVisible = true;
    },

    deleteConfirmed() {
      if (this.deleteMode === 'single' && this.nodeToDelete) {
        const index = this.nodes.findIndex(n => n.id === this.nodeToDelete.id);
        if (index !== -1) {
          this.nodes.splice(index, 1);
          this.$message({
            message: `节点 ${this.nodeToDelete.name} 已成功删除！`,
            type: 'success'
          });
        }
        this.nodeToDelete = null;
      } else if (this.deleteMode === 'multiple') {
        const nodesToKeep = this.nodes.filter(node => !node.selected);
        const deletedCount = this.nodes.length - nodesToKeep.length;
        this.nodes = nodesToKeep;
        this.selectedNodes = [];

        this.$message({
          message: `成功删除 ${deletedCount} 个节点！`,
          type: 'success'
        });
      }

      this.deleteDialogVisible = false;
      this.totalNodes = this.nodes.length;
      this.filterNodes();
    },

    manageNode(node) {
      // 在实际应用中，可能会跳转到节点详情页或打开管理对话框
      this.$message({
        message: `管理节点: ${node.name}`,
        type: 'info'
      });
    },

    showTagInput() {
      this.tagInputVisible = true;
      this.$nextTick(() => {
        this.$refs.tagInput.$refs.input.focus();
      });
    },

    addTag() {
      if (this.tagInputValue) {
        if (!this.newNode.tags.includes(this.tagInputValue)) {
          this.newNode.tags.push(this.tagInputValue);
        }
      }
      this.tagInputVisible = false;
      this.tagInputValue = '';
    },

    removeTag(tag) {
      this.newNode.tags.splice(this.newNode.tags.indexOf(tag), 1);
    }
  }
};
</script>

<style scoped>
.node-management {
  padding: 20px;
}

.main-card {
  background-color: #fff;
  border-radius: 4px;
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.title {
  font-size: 22px;
  color: #303133;
  margin: 0;
}

.action-container {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
}

.search-input {
  width: 220px;
}

.status-filter {
  width: 120px;
}

.node-container {
  margin-bottom: 20px;
}

.node-col {
  margin-bottom: 20px;
}

.node-card {
  height: 150px;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.node-card.selected {
  border-color: #409EFF;
}

.node-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.node-status-container {
  display: flex;
  align-items: center;
}

.status-indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 6px;
}

.status-online {
  background-color: #67C23A;
}

.status-offline {
  background-color: #909399;
}

.status-error {
  background-color: #F56C6C;
}

.status-text {
  font-size: 14px;
  color: #606266;
}

.node-content {
  flex-grow: 1;
}

.node-name {
  margin: 0 0 8px;
  font-size: 16px;
  color: #303133;
}

.node-id, .node-ip {
  font-size: 13px;
  color: #909399;
  margin-bottom: 5px;
}

.node-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.tag-item {
  margin-right: 6px;
  margin-bottom: 6px;
}

.tag-input {
  width: 100px;
  margin-right: 6px;
  vertical-align: bottom;
}

.button-new-tag {
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
</style>