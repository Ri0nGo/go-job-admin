<script setup>
const props = defineProps({
  currentPage: {
    type: Number,
    default: 1
  },
  pageSize: {
    type: Number,
    default: 10
  },
  total: {
    type: Number,
    default: 0,
  },
  layout: {
    type: String,
    default: "total, prev, pager, next, sizes, jumper"
  },
  pageSizes: {
    type: Array,
    default: () => [10, 20, 50, 100]
  }
})

const emit = defineEmits([
  'update:pageSize',
  'update:currentPage',
  'pageSizeChange',
  'pageCurrentChange'
])

const pageSizeChange = (val) => {
  emit('update:pageSize', val)
  emit('pageSizeChange', val)
}

const pageCurrentChange = (val) => {
  emit('update:currentPage', val)
  emit('pageCurrentChange', val)
}

defineExpose({
  pageCurrentChange,
  pageSizeChange
})

</script>

<template>
  <div class="demo-pagination-block">
    <el-pagination
        :current-page="currentPage"
        :page-size="pageSize"
        :page-sizes="pageSizes"
        :size="'default'"
        :disabled="false"
        :background="false"
        :layout="layout"
        :total="total"
        @size-change="pageSizeChange"
        @current-change="pageCurrentChange"
    />
  </div>
</template>

<style scoped>

</style>