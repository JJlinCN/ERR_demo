<template>
  <div>
  <el-row class="first_row">
    <el-col :span="16">
      <div class="title">
        <span><font-awesome-icon icon="fa-solid fa-rss" style="color:orange;margin-right: 8px;" />采购协议</span>
      </div>
    </el-col>
    <el-col :span="8" class="first_row_second_col">
      <div class="btn_group">
        <el-button type="success" plain size="small" @click="addDialogVisible = true"><font-awesome-icon icon="fa-solid fa-circle-plus" />新增</el-button>
        <el-divider direction="vertical"></el-divider>
        <el-button type="primary" plain size="small"><font-awesome-icon icon="fa-solid fa-pen-to-square" />修改</el-button>
        <el-divider direction="vertical"></el-divider>
        <el-button type="info" plain size="small"><font-awesome-icon icon="fa-solid fa-trash-can" />删除</el-button>
        <el-divider direction="vertical"></el-divider>
        <el-button type="danger" plain size="small"><font-awesome-icon icon="fa-solid fa-ban" />停用</el-button>
        <el-divider direction="vertical"></el-divider>
        <el-button color="#626aef" plain size="small"><font-awesome-icon icon="fa-solid fa-magnifying-glass" />详情查看</el-button>
      </div>
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="24" class="second_row_first_col"><!--横跨一行-->
      <el-table :data="searchTableData"
                :show-header="false"
                :span-method="searchSpanMethod">
        <!--由于完全是通过插槽自定义列组件的展示模板，所以不需要数据源，但是还是得需要告诉表组件我要创建多少行，所以这里用空的行数据对象，目的是占位告诉表组件我准备渲染多少行的表格-->
        <el-table-column width="95">
          <template #default>
            <span style="font-weight: bold;">制定期间：</span>
          </template>
        </el-table-column>
        <el-table-column width="150">
          <template #default="{$index}">
            <el-date-picker type="datetime" size="small" placeholder="选择开始时间" v-model="startDate" v-if="$index === 0" style="width: 100%"></el-date-picker>
            <el-date-picker type="datetime" size="small" placeholder="选择结束时间" v-model="endDate" v-if="$index === 1" style="width: 100%"></el-date-picker>
          </template>
        </el-table-column>
        <el-table-column width="80">
          <template #default="{$index}">
            <span style="font-weight: bold" v-if="$index === 0">供应商：</span>
            <span style="font-weight: bold" v-if="$index === 1">采购员：</span>
          </template>
        </el-table-column>
        <el-table-column width="150">
          <template #default="{$index}">
            <el-select v-model="supplier" size="small" clearable placeholder="请选择供应商" style="width: 100%;" v-if="$index === 0">
              <el-option label="选项一" value="option1"></el-option>
              <el-option label="选项二" value="option2"></el-option>
              <el-option label="选项三" value="option3"></el-option>
            </el-select>
            <el-select v-model="buyer" size="small" clearable placeholder="请选择采购员" style="width: 100%;" v-if="$index === 1">
              <el-option label="选项一" value="option1"></el-option>
              <el-option label="选项二" value="option2"></el-option>
              <el-option label="选项三" value="option3"></el-option>
            </el-select>

          </template>
        </el-table-column>
        <el-table-column width="110" align="right">
          <template #default="{$index}">
            <span style="font-weight: bold" v-if="$index === 0">供应原材料：</span>
            <span style="font-weight: bold" v-if="$index === 1">协议编号：</span>
          </template>
        </el-table-column>
        <el-table-column width="150">
          <template #default="{$index}">
            <el-select v-model="rawMaterial" size="small" clearable placeholder="请选择原材料" style="width: 100%;" v-if="$index===0">
              <el-option label="选项一" value="option1"></el-option>
              <el-option label="选项二" value="option2"></el-option>
              <el-option label="选项三" value="option3"></el-option>
            </el-select>
            <el-input v-model="protocolNumber" size="small" clearable placeholder="请输入协议编号" v-if="$index===1"></el-input>
          </template>
        </el-table-column>
        <el-table-column width="70">
          <template #default>
            <el-button type="primary" plain :icon="Search" style="flex-direction: column;height: 50px;width: 40px;">
              <div style="font-size: 12px;margin-top: 3px;margin-right: 4px">查询</div>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
  </el-row>
  <el-row class="third_row">
    <el-col :span="18" class="third_row_first_col">
        <el-table :data="orderTableData" style="height: 100%" stripe :max-height="730">
            <el-table-column align="center" label="序号">
                <template #default="{$index}">
                  <div>{{$index+1}}</div>
                </template>
            </el-table-column>
            <el-table-column prop="protocolNumber" label="协议编号" align="center" width="120"></el-table-column>
            <el-table-column label="状态" align="center">
            <template #default="{row}">
              <el-tag effect="dark" type="primary" size="small" v-if="row.state==='执行中'" style="width: 52px">{{row.state}}</el-tag>
              <el-tag effect="dark" type="info" size="small" v-if="row.state==='制单'" style="width: 52px">{{row.state}}</el-tag>
              <el-tag effect="dark" type="warning" size="small" v-if="row.state==='审核中'" style="width: 52px">{{row.state}}</el-tag>
              <el-tag effect="dark" type="danger" size="small" v-if="row.state==='停用'" style="width: 52px">{{row.state}}</el-tag>
              <el-tag effect="dark" type="success" size="small" v-if="row.state==='已完成'" style="width: 52px">{{row.state}}</el-tag>
            </template>
            </el-table-column>
            <el-table-column prop="startDate" label="制定时间" align="center" :width="160"></el-table-column>
            <el-table-column prop="supplier" label="供应商" align="center" :width="160"></el-table-column>
            <el-table-column prop="rawMaterial" label="供应原材料" align="center"></el-table-column>
            <el-table-column prop="buyTime" label="开始采购时间" align="center" :width="160"></el-table-column>
            <el-table-column prop="orderName" label="联系人" align="center"></el-table-column>
            <el-table-column prop="orderTelNumber" label="联系方式" align="center" width="110"></el-table-column>
            <el-table-column prop="remarks" label="备注" align="center"></el-table-column>
        </el-table>
      <div class="footer1">
        <el-pagination
          v-model:page-size="pageSize1"
          :page-sizes="[20,30,40,50]"
          layout="sizes, prev, pager, next"
          :total="pageTotal1"
          small
          @size-change="(newPage)=>{pageSize1 = newPage}"
        />
        <el-divider direction="vertical"/>
        <el-button size="small" @click="refresh"><font-awesome-icon icon="fa-solid fa-rotate" /></el-button>
        <el-divider direction="vertical"/>
        <el-space :size="4">
          <el-button size="small" type="info" :class="buttonClasses(0)" @click="buttonGroup.toggleButtonState(0)">制单</el-button>
          <el-button size="small" type="warning" :class="buttonClasses(1)" @click="buttonGroup.toggleButtonState(1)">审核中</el-button>
          <el-button size="small" type="primary" :class="buttonClasses(2)" @click="buttonGroup.toggleButtonState(2)">执行中</el-button>
          <el-button size="small" type="danger" :class="buttonClasses(3)" @click="buttonGroup.toggleButtonState(3)">停用</el-button>
          <el-button size="small" type="success" :class="buttonClasses(4)" @click="buttonGroup.toggleButtonState(4)">已完成</el-button>
        </el-space>
        <div style="margin-left: auto;margin-right: 20px">显示1到{{pageSize1}}，总{{pageSize1}}条。每页显示：{{pageSize1}}</div>
      </div>
    </el-col>
    <el-col :span="6" class="third_row_second_col">
      <el-table :data="sideInfoDisplayTableDate" style="flex:1">
        <el-table-column prop="rawMaterial" label="供应原材料"></el-table-column>
        <el-table-column prop="price" label="单价"></el-table-column>
        <el-table-column label="执行日期"></el-table-column>
      </el-table>
      <div class="footer2">
        <el-pagination
          v-model:page-size="pageSize2"
          :page-sizes="[20,30,40,50]"
          layout="sizes, prev, pager, next"
          :total="pageTotal2"
          small
          @size-change="(newPage)=>{pageSize2 = newPage}"
        />
        <el-divider direction="vertical"/>
        <el-button size="small" @click="refresh"><font-awesome-icon icon="fa-solid fa-rotate" /></el-button>
        <el-divider direction="vertical"/>
      </div>
    </el-col>
  </el-row>
  <!-- 新增弹窗组件 父组件用v-model预定义的update:propsname监听事件来得到子组件传递的数据从而自动更新父组件数据-->
  <add-dialog v-model:dialog-visible="addDialogVisible" @done="handelDone"/>

  </div>
</template>

<script setup>
import {Search} from "@element-plus/icons-vue";
import {computed, onMounted, reactive, ref, watch, watchEffect} from "vue";
import AddDialog from "./components/add-dialog.vue";
import {pageOrders} from "@/api/system/Purchase";
import {ElMessageBox} from "element-plus";

const searchTableData = [{ //查询表格数据源

},{

}];
function searchSpanMethod({ rowIndex, columnIndex }){
    if(columnIndex === 0){ //合并规则[1,1]为默认值，默认不合并，[2,1]表示rowspan合并1格，列不合并，[0，0]表示不渲染对应单元格
      if(rowIndex === 0){
        return {
          rowspan:2,
          colspan:1
        }
      }else return {
        rowspan: 0,
        colspan: 0
      }
    }//并行条件控制自定义列的对应单元格合并
    if(columnIndex === 6){
      if (rowIndex === 0){
        return {
          rowspan: 2,
          colspan: 1
        }
      }else return {
        rowspan: 0,
        colspan: 0
      }
    }
}

const orderTableData = ref([]);//展示的表格数据源
const sideInfoDisplayTableDate = computed(()=>{//侧边详细信息展示栏数据源
    return [{
      rawMaterial:"原材料水泥",
      price:"100/吨"
    }]
})
const startDate = ref('');
const endDate = ref('');
const supplier = ref('');
const buyer = ref('');
const rawMaterial = ref('');
const protocolNumber = ref('');
const pageSize1 = ref(20);
const pageSize2 = ref(20);
const pageTotal1 = ref(100);
const pageTotal2 = ref(100);
const pages1 = computed(() => {
  // 使用 Math.ceil() 函数向上取整，确保页面总数为整数
  return Math.ceil(pageTotal1.value / pageSize1.value);
});
const pages2 = computed(() => {
  return Math.ceil(pageTotal2.value / pageSize2.value);
});
const addDialogVisible = ref(false);
const pageDatas = ref([]);//请求过来的数据的本地变量存储
const pageIndex = ref(0);//当前页索引，默认分页数据展示为第一页

const refresh = ()=>{
  ElMessageBox.alert('向后端发送请求并获取数据,更新到展示区', 'refresh', {
    confirmButtonText: 'OK',
  })
}

const buttonGroup = reactive({
  Label:['制单', '审核中', '执行中', '停用', '已完成'],
  state:[false, false, false, false, false],
  toggleButtonState:(index) => {//单个按钮状态切换
    const newButtonStates = [...buttonGroup.state];
    newButtonStates[index] = !newButtonStates[index];
    buttonGroup.state = newButtonStates;
    filterButtons(buttonGroup.state);
  }
})

// 计算属性，根据按钮状态生成对应类样式对象，最后:class解析该样式对象融合进原来的class样式列表
const buttonClasses = computed(() => {
  return (index) => {
    return {
      'active-button': buttonGroup.state[index] // 添加一个凹陷效果的样式类
    }
  }
})

const filterButtons = (buttonStates) => {//过滤
  let temp = [];
  updateOrderTableFields(pageDatas.value[pageIndex.value]);//保证每次过滤的数据都是源数据，而不是之前修改过的数据

  if (buttonStates.every(state => !state)) {
    // 如果按钮组全是 false，则显示原表格数据
    temp = pageDatas.value[pageIndex.value];
  } else {//否则过滤
    for (let i = 0; i < orderTableData.value.length; i++) {
      if (buttonStates.some((state, index) => state && orderTableData.value[i].state === buttonGroup.Label[index])) {
        temp.push(orderTableData.value[i]);
      }
    }
  }

  updateOrderTableFields(temp);//统一更新过滤操作后的数组
};

function handelDone(value){
  console.log(value,addDialogVisible.value)
}
const updateOrderTableFields = (data)=>{
  orderTableData.value.length = 0;//清空数组
  orderTableData.value = JSON.parse(JSON.stringify(data));//深拷贝data赋值
}
//---------重构-----------------------------------

onMounted(()=>{
  watch(pages1,(newvalue)=>{
    pageOrders({page:newvalue,limit:pageSize1.value}) //发送网络请求获取数据，用.then链式调用解构async异步函数返回的promise对象，获取其data数据，然后用获取到的数据更新表格数据源
      .then(data => {
        pageDatas.value = JSON.parse(JSON.stringify(data.pageDatas));//数组的深拷贝
        updateOrderTableFields(pageDatas.value[pageIndex.value])//默认表格数据源展示第一页的数据
      })//更新表格数据
      .catch(error => console.error(error)); // 捕获异常并打印错误信息
  },{immediate:true})//立即执行回调
});
</script>

<style scoped>
.first_row{
  border-top: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
  padding:3px 0;
  background-color: #ffffff;
  margin: 0 5px;
}
.title{
  display: flex;
  height: 100%;
  align-items: center;/*设置弹性子元素垂直居中*/
  margin-left: 10px
}
.title span{
  color: #478FCA;
  font-weight: bold;
}
.first_row_second_col{
  display: flex;
  justify-content: end;
}
.btn_group{
  border-left: 1px solid #ddd;
  padding: 0 10px;
}
.second_row_first_col{
  margin: 2px 5px;
  display: flex;
  align-items: center;
}
.third_row{
  height: 750px;
  margin: 2px 5px;
}
.third_row_first_col{
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid #ddd;
  padding-right: 3px;
}
.footer1{
  display: flex;
  align-items: center;
  width: 100%;
  background-color: #ffffff;
}
.third_row_second_col{
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid #ddd;
  padding-left: 3px;
}
.footer2{
  display: flex;
  align-items: center;
  width: 100%;
  background-color: #ffffff;
}
.active-button {
  box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.5); /* 调整阴影的可见度和深度 */
}
</style>
