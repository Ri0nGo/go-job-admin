<script setup>
import { ref } from 'vue'
import {useUserStore} from "../../store/index.js";
import dayjs from "dayjs";

const userStore = useUserStore()
const userInfo = userStore.userInfo
const activeName = ref('first')

const handleClick = (tab, event) => {
  console.log(tab, event)
}

const formatDay = (time) => {
  return dayjs(time).format('YYYY-MM-DD HH:mm');
}


</script>

<template>
  <el-card class="account-center">
    <el-tabs v-model="activeName" class="custom-tabs" @tab-click="handleClick">
      <el-tab-pane label="基本信息" name="first">
        <div class="profile">
          <div class="introduction">
            <div class="title">个人简介</div>
            <div class="descript">{{userInfo?.about}}</div>
          </div>
          <div class="account-info">
            <div class="title">账号信息</div>
            <div class="section">
              <div class="label-name">呢称</div>
              <div class="content">{{userInfo?.nickname}}</div>
            </div>
            <div class="section">
              <div class="label-name">用户名</div>
              <div class="content">{{userInfo?.username}}</div>
            </div>
            <div class="section">
              <div class="label-name">邮箱</div>
              <div class="content">{{userInfo?.email}}</div>
            </div>
          </div>
          <div class="system-info">
            <div class="title">系统信息</div>
            <div class="section">
              <div class="label-name">注册时间</div>
              <div class="content">{{formatDay(userInfo?.created_time)}}</div>
            </div>
            <div class="section">
              <div class="label-name">更新时间</div>
              <div class="content">{{ formatDay(userInfo?.updated_time) }}</div>
            </div>
            <div class="section">
              <div class="label-name">登录时间</div>
              <div class="content">{{formatDay(userInfo?.login_time)}}</div>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="账号安全" name="second">Config</el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<style scoped>
.account-center{
  overflow: hidden;
  height: calc(100vh - 107px);
}

.profile {
  border-radius: 15px;
  border: 1px #e6e6e6 solid;
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
}


.introduction{
  height: 160px;
  width: 100%;
  padding: 20px;
  border-bottom: 1px #e6e6e6 solid;
  box-sizing: border-box;
}

.title{
  color: #4e6ef2;
  font-size: 14px;
  margin-bottom: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
}

.title::before {
  content: '';
  width: 4px;
  height: 16px;
  background: linear-gradient(to bottom, #4e6ef2, #7c96ff);
  margin-right: 8px;
  border-radius: 2px;
}
.descript{
  color: #666;
  font-size: 14px;
  padding: 12px;
  background: linear-gradient(145deg, #f8faff, #fff);
  border-radius: 8px;
  border: 1px solid #eaedf3;
  box-sizing: border-box;
}

.section{
  display: grid;
  grid-template-columns: 60px 1fr;
  align-items: center;
  margin-bottom: 10px;
  gap: 10px;
}

.content{
  width: 100%;
  color: #666;
  font-size: 14px;
  padding: 12px;
  background: linear-gradient(145deg, #f8faff, #fff);
  border-radius: 8px;
  border: 1px solid #eaedf3;
  box-sizing: border-box;
}

.label-name{
  font-size: 14px;
  width: 60px;
  font-weight: 500;
  color: #666;
  flex-shrink: 0; /* 不压缩 */
}

.account-info{
  display: flex;
  flex-direction: column;
  justify-content: center; /* 垂直居中 */
  height: 240px;
  width: 100%;
  padding: 20px;
  border-bottom: 1px #e6e6e6 solid;
  box-sizing: border-box;
}

.system-info{
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
}

/* ------ 标签页样式 ------*/


/* 自定义 tab 宽度 + 居中 */
::v-deep(.custom-tabs .el-tabs__item) {
  width: 120px;
  text-align: center;
  justify-content: center; /* 有时还需要 */
  display: flex;
  align-items: center;
  padding: 12px 0;
  font-size: 16px;
  color: #555;
  transition: background-color 0.3s;
}

/* 给 tabs 的标签页标题部分添加背景 */
::v-deep(.custom-tabs .el-tabs__nav-wrap) {
  background-color: #f5f7fa; /* 浅灰色背景 */
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}

/* 激活 tab 样式 */
::v-deep(.custom-tabs .el-tabs__item.is-active) {
  color: #6f42c1;
  font-weight: bold;
  background-color: #e2daf1;
  border-radius: 10px 10px 0 0;
}

/* hover 效果 */
::v-deep(.custom-tabs .el-tabs__item:hover) {
  background-color: #f5f0fa;
  cursor: pointer;
  border-radius: 10px 10px 0 0;
}

/* 隐藏底部横线 */
::v-deep(.custom-tabs .el-tabs__nav-wrap::after) {
  display: none;
}
</style>