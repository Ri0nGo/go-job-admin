<script setup>
import {Plus, UploadFilled, Bell} from "@element-plus/icons-vue";
import dayjs from "dayjs";
import FormDrawer from "../../components/formDrawer/formDrawer.vue";
import {useUserStore} from "../../store/index.js";
import {nextTick, onMounted, ref} from "vue";
import {getNodes} from "../../apis/node/node.js";
import {ElMessage} from "element-plus";
import {createJob, deleteJob, getJobs, updateJob, uploadJobFile} from "../../apis/job/job.js";
import DefaultPagination from "../../components/pagination/defaultPagination.vue";
import JobRecord from "../jobRecords/jobRecord.vue";

// ---------- 初始化任务列表数据 ---------- //
const tableData = ref([]);
const loading = ref(false)
const userStore = useUserStore()

// 获取任务列表数据
const fetchJobs = async () => {
  try {
    const res = await getJobs({
      page_size: pageSize.value,
      page_num: currentPage.value,
      sort: "created_time",
      order: "desc"
    })
    tableData.value = res.data
    total.value = res.total
  } catch (err) {
    ElMessage.error('获取任务列表失败: ' + err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchJobs()
})

// ---------- 抽屉组件初始化数据 ---------- //
const formDrawerRef = ref(null);
const formRef = ref(null);
const defaultFormData = {
  name: '',
  node_id: null,
  exec_type: null,
  cron_expr: null,
  active: 2,
  filename: null,
  file_key: null,
  notify_status: 2,   // 通知状态，1启用；2停用
  notify_strategy: 2, // 通知策略；1成功后通知，2失败后通知，3总是通知
  notify_type: 1,     // 通知类型；1邮箱
  notify_mark: "",     // 邮箱地址标志
}
const formData = ref({...defaultFormData});
const resetForm = (row) => {
  if (formRef.value) {
    formRef.value.resetFields();
  }

  if (row) {
    for (const key in row) {
      formData.value[key] = row[key];
    }
    if (row.filename.length > 1) {
      setFileList(row.filename, 'success')
    }
  }
}
const rules = {
  name: [
    {
      required: true,   // 表示这是必填项
      message: '任务名称不能为空',  // 这是不符合规则是出发的消息
      trigger: 'blur'  // 这是鼠标移动到输入框外是会触发的回调
    },
  ], node_id: [
    {
      required: true,   // 表示这是必填项
      message: '工作节点不能为空',  // 这是不符合规则是出发的消息
      trigger: 'blur'  // 这是鼠标移动到输入框外是会触发的回调
    },
  ], exec_type: [
    {
      required: true,   // 表示这是必填项
      message: '执行方式不能为空',  // 这是不符合规则是出发的消息
      trigger: 'blur'  // 这是鼠标移动到输入框外是会触发的回调
    },
  ], cron_expr: [
    {
      required: true,   // 表示这是必填项
      message: '表达式不能为空',  // 这是不符合规则是出发的消息
      trigger: 'blur'  // 这是鼠标移动到输入框外是会触发的回调
    },
  ]
}

// ---------- 节点数据 ---------- //
const nodes = ref([])
const loadNodes = async () => {
  try {
    const res = await getNodes()
    nodes.value = res.data
  } catch (error) {
    console.error('获取节点列表失败:', error)
    ElMessage.error(error?.message || '网络异常')
  }
}

// ---------- 子组件回调事件处理 ---------- //
const onSubmit = async () => {
  if (formRef.value) {
    const valid = await formRef.value.validate()
    if (!valid) {
      return
    }
  }

  // 校验文件是否上传
  if (
      formData.value.exec_type === 3 &&
      fileList.value.length === 0
  ) {
    ElMessage.error("请上传文件")
    return
  }

  // 校验通知
  if (formData.value.notify_status === 1 &&
      formData.value.notify_type === 1 &&
      !userStore.userInfo?.email) {
    ElMessage.error("请先绑定邮箱才可以发送通知哦~")
    return
  }

  formData.value.notify_mark = userStore.userInfo.email
  formDrawerRef.value.showLoading()
  try {
    await (operationId.value === 0 ? createJob(formData.value) : updateJob(formData.value))
    await fetchJobs()
    resetForm()
  } finally {
    formDrawerRef.value.closeLoading()
    formDrawerRef.value.closeDrawer()
  }
}
const onClose = async () => {
  formDrawerRef.value.closeDrawer()
}

// ---------- 数据枚举类 ---------- //
function formatExecType(type) {
  switch (type) {
    case 1:
      return 'shell'
    case 2:
      return 'http'
    case 3:
      return 'file'
    default:
      return ''
  }
}

const operationId = ref(0)
// 任务状态切换
const handleStatusChange = (row) => {
  formData.value.status = row.status
  delete (formData.value.file_key)
  resetForm(row)
  operationId.value = row.id
  onSubmit()
}

// ---------- 按钮点击事件处理 ---------- //
const handleAdd = async () => {
  await loadNodes()
  operationId.value = 0
  resetForm()
  Object.assign(formData.value, defaultFormData);
  fileList.value = []
  formDrawerRef.value.openDrawer()
}
const handleEdit = async (row) => {
  await loadNodes()
  operationId.value = row.id
  // 清空file_key，若上传了文件才会有file_key，否则是没有file_key的
  delete (formData.value.file_key)
  resetForm(row)
  formDrawerRef.value.openDrawer()
}
const handleDelete = async (row) => {
  await deleteJob(row.id)
  await fetchJobs()
}

// ---------- 文件上传处理 ---------- //
const fileList = ref([])
const validExtensions = ['py'];
const uploadFileValidator = (file) => {
  if (!file || file.length === 0) {
    ElMessage.error('请上传文件')
    return false
  }
  const fileExt = file.name.split('.').pop().toLowerCase();
  if (!validExtensions.includes(fileExt)) {
    ElMessage.error("仅支持 py 格式的文件")
    return false
  }
  if (file.size > 5 * 1024 * 1024) {
    ElMessage.error('文件大小不能超过5MB')
    return false
  }
  return true;
}
const handleFileUpload = async (uploadFile) => {
  if (!uploadFileValidator(uploadFile)) {
    setFileList(null, null, true)
    return;
  }
  // 立即更新文件列表显示
  setFileList(uploadFile.name, 'ready')

  try {
    const res = await uploadJobFile(uploadFile.raw)
    formData.value.file_key = res.key
    formData.value.filename = uploadFile.name
    // 更新上传成功后的状态，保持原始文件名显示
    setFileList(uploadFile.name, 'success')
  } catch (error) {
    ElMessage.error('文件上传失败，请重试')
    // 上传失败时清空文件列表
    setFileList(null, null, true)
  }
}
const handleFileRemove = (row) => {
  setFileList(null, null, true)
  formData.file_key = null
  formData.filename = null
}

function setFileList(filename, status, clear = false) {
  if (clear) {
    return fileList.value = []
  }
  fileList.value = [{
    name: filename,
    status: status,
  }]
}

// ---------- 分页处理 ---------- //
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const handleSizeChange = async (val) => {
  loading.value = true
  await fetchJobs()
  loading.value = false
}
const handleCurrentChange = async (val) => {
  loading.value = true
  await fetchJobs()
  loading.value = false

}

// ---------- 通知处理 ---------- //
const notifyStrategyOptions = [
  {label: '成功后通知', value: 1},
  {label: '失败后通知', value: 2},
  {label: '总是通知', value: 3},
]

// ---------- 日志处理 ---------- //
const logRef = ref(null)
const currentJobId = ref(0)
const currentJobName = ref("")

const handleLog = async (row) => {
  currentJobId.value = row.id
  currentJobName.value = row.name
  await nextTick()
  await logRef.value.openDrawer()

}


</script>

<template>
  <el-card>
    <div class="container">
      <div class="box-top">
        <el-button type="primary" :icon="Plus" @click="handleAdd">新增任务</el-button>
      </div>
      <div class="box-table">
        <el-table
            :data="tableData"
            style="width: 100%; height: 100%;"
            class="table-column"
            :header-cell-style="{background: '#EAF3FB', color: '#2C3E50'}"
        >
          <el-table-column align="center" prop="name" sortable label="任务名称"/>
          <el-table-column align="center" prop="node_name" sortable label="工作节点"/>
          <el-table-column align="center" label="执行方式" sortable width="120">
            <template #default="scope">
              <div class="code-block">
                {{ formatExecType(scope.row.exec_type) }}
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="cron_expr" label="表达式">
            <template #default="scope">
              <div class="code-block">
                {{ scope.row.cron_expr }}
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="状态" sortable :sort-by="row => row.active" width="120">
            <template #default="scope">
              <el-switch
                  v-model="scope.row.active"
                  :active-value="1"
                  :inactive-value="2"
                  style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ececec"
                  @change="handleStatusChange(scope.row)"
              />
            </template>
          </el-table-column>

          <el-table-column align="center" label="通知" sortable
                           :sort-by="row => row.notify_status" width="100"
                           :formatter="(row) => +row.notify_status === 1 ? '启用' : +row.notify_status === 2 ? '停用' : ''">
          </el-table-column>
          <el-table-column align="center" prop="created_time" sortable label="创建时间">
            <template #default="scope">
              {{ dayjs(scope.row.created_time).format('YYYY-MM-DD HH:mm') }}
            </template>
          </el-table-column>
          <el-table-column align="center" fixed="right" label="操作" width="260">
            <template #default="scope">
              <el-button link type="primary" size="default" @click="handleEdit(scope.row)">
                编辑
              </el-button>
              <el-button link type="primary" size="default" @click="handleDelete(scope.row)">删除</el-button>
              <el-button link type="primary" size="default" @click="handleLog(scope.row)">日志</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="box-pagination">
        <DefaultPagination
            v-model:currentPage="currentPage"
            v-model:pageSize="pageSize"
            :total="total"
            @pageCurrentChange="handleCurrentChange"
            @pageSizeChange="handleSizeChange"
        />
      </div>
    </div>
  </el-card>

  <FormDrawer
      ref="formDrawerRef"
      :title="operationId === 0? '新增任务' : '修改任务'"
      @submit="onSubmit"
      @close="onClose"
  >
    <el-form
        ref="formRef"
        :rules="rules"
        :model="formData"
        label-width="100px"
        class="mt-2">

      <el-form-item label="任务名称" prop="name">
        <el-input v-model="formData.name" placeholder="请输入任务名称"/>
      </el-form-item>
      <el-form-item label="工作节点" prop="node_id">
        <el-select v-model="formData.node_id" placeholder="请选择节点" style="width: 100%">
          <el-option v-for="node in nodes" :key="node.id" :value="node.id" :label="node.name"/>
        </el-select>
      </el-form-item>
      <el-form-item label="执行方式" prop="exec_type">
        <el-select v-model="formData.exec_type" placeholder="请选择执行方式"
                   style="width: 100%;font-family: monospace">
          <el-option disabled :value="1" label="shell" class="select-item"/>
          <el-option disabled :value="2" label="http" class="select-item"/>
          <el-option :value="3" label="file" class="select-item"/>
        </el-select>
      </el-form-item>

      <el-upload v-if="formData.exec_type===3"
                 prop="uploadFile"
                 class="upload-demo"
                 drag
                 style="margin-left: 80px"
                 :auto-upload="false"
                 :file-list="fileList"
                 :on-change="handleFileUpload"
                 :on-remove="handleFileRemove"
      >
        <el-icon class="el-icon--upload">
          <upload-filled/>
        </el-icon>
        <div class="el-upload__text">
          拖拽文件到此处或 <em>点击上传</em>
        </div>
        <template #tip>
          <div class="el-upload__tip">
            只能上传python文件且大小不超过5M
          </div>
        </template>
      </el-upload>

      <el-form-item label="表达式" prop="cron_expr">
        <el-input class="cron-expr-stype" v-model="formData.cron_expr" placeholder="秒 分 时 日 月 周"/>
        <div class="cron-tip">示例：0 */10 * * * * （每十分钟执行）</div>
      </el-form-item>
      <el-form-item label="状态" prop="active">
        <el-switch
            v-model="formData.active"
            :active-value="1"
            :inactive-value="2"
            style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ececec"
        />
      </el-form-item>
      <el-form-item label="通知设置">
        <template #label>
          <div style="display: inline-flex; align-items: center;">
            <el-icon style="margin-right: 4px;">
              <Bell/>
            </el-icon>
            <span>通知设置</span>
          </div>
        </template>

        <el-switch
            v-model="formData.notify_status"
            :active-value="1"
            :inactive-value="2"
            style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ececec"
        />
      </el-form-item>
      <el-form-item v-if="formData.notify_status===1">
        <div class="notify">
          <div class="notify-strategy">
            <!-- user-select: none 可以防止点击Switch时，浏览器自动聚焦到文字上 -->
            <span style="color: #666; user-select: none;">通知策略</span>
            <el-radio-group v-model="formData.notify_strategy">
              <el-radio-button
                  v-for="(item, index) in notifyStrategyOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
              />
            </el-radio-group>
          </div>
          <div class="notify-type">
            <div class="notify-tip" v-if="userStore.userInfo?.email">注：默认发送到当前用户邮箱</div>
            <div class="notify-tip" v-else>无法发送邮件通知，请先绑定邮箱</div>
          </div>
        </div>
      </el-form-item>
    </el-form>
  </FormDrawer>

  <JobRecord ref="logRef" :job-id="currentJobId" :job-name="currentJobName"/>

</template>

<style scoped>

.el-card {
  height: 100%;
  border: none;
}


.container {
  height: calc(100vh - 105px);
  display: flex;
  flex-direction: column;
}

/* 去掉el-table 底部白色的线 */
:deep(.el-table__inner-wrapper::before) {
  height: 0;
}

.box-table {
  flex: 1;
  color: #8ac78a;
  overflow: auto;
}

.box-top {
  height: 56px;
  margin-top: 12px;
  margin-right: 4px;
}

.box-pagination {
  height: 64px;
  margin-top: 12px;
  margin-right: 4px;
  display: flex;
  justify-content: flex-end;
}

.code-block {
  font-family: monospace;
  background-color: #f5f5f5;
  color: #333;
  padding: 2px 6px;
  border-radius: 4px;
  display: inline-block;
  font-size: 12px;
}

.select-item, .cron-expr-stype {
  font-family: monospace;
  font-weight: 500;
  font-size: 14px;
}

.cron-tip {
  font-family: monospace;
  font-weight: 400;
  font-size: 12px;
  color: #666;
}

/* --------  通知相关样式 -------- */
.notify {
  display: flex;
  align-items: flex-start;
  flex-direction: column;
}

.notify-strategy {
  padding: 2px 8px;
  border-radius: 8px;
  background-color: #f6f6f6;
}

.notify-strategy .el-radio-group {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding-bottom: 5px;
}

.notify-type {
  margin-top: 10px;
  padding: 2px 8px;
  border-radius: 8px;
  background-color: #f6f6f6;
}

.notify-type .el-radio-group {
  padding-bottom: 5px;
}

.notify-tip {
  font-size: 12px;
  color: #666;
}


/* --------  表头相关样式修改 -------- */
/* 表头左上角、右上角圆角处理 */
:deep(.table-column .el-table__header-wrapper thead th:first-child) {
  border-top-left-radius: 8px;
  overflow: hidden;
}

/* 表头单元格中间加一个小竖线（伪元素实现） */
:deep(.table-column .el-table__header-wrapper thead th:not(:last-child))::after {
  content: "";
  display: block;
  width: 1px;
  height: 16px; /* 控制线的长度 */
  background-color: #ccc;
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}

:deep(.table-column .el-table__header-wrapper thead th:last-child) {
  border-top-right-radius: 8px;
  overflow: hidden;
}

</style>