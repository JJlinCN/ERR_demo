<template>
<el-dialog
  v-model="dialogVisible"
  width="70%"
  title="新增"
  :close-on-click-modal="false"
  :close-on-press-escape="false"
  :draggable="true"
  :before-close="closeDialog"
  align-center
>
    <el-row>
      <el-space :size="20">
        <div class="title">
          <span><font-awesome-icon icon="fa-solid fa-rss" style="color:orange;margin-right: 5px;" />采购协议</span>
        </div>
        <div>编号: <span style="color: #0000ff;font-weight: bold">{{testNumber}}</span></div>
        <div>制定日期: <span>{{testDate}}</span></div>
      </el-space>
    </el-row>
    <el-row>
      <el-table :data="secondTableDate" :span-method="formSpanMethod" :show-header="false">
        <el-table-column prop="name1" align="right"></el-table-column>
        <el-table-column>
          <template #default="{$index}">
            <el-select v-model="company" size="small" clearable placeholder="请选择往来单位" style="width: 100%;" v-if="$index===0">
              <el-option label="选项一" value="option1"></el-option>
              <el-option label="选项二" value="option2"></el-option>
              <el-option label="选项三" value="option3"></el-option>
            </el-select>
            <el-date-picker type="datetime" size="small" placeholder="选择开始时间" v-model="startDate" style="width: 100%" v-if="$index === 1"></el-date-picker>
          </template>
        </el-table-column>
        <el-table-column prop="name2" align="right"></el-table-column>
        <el-table-column>
          <template #default="{$index}">
            <el-select v-model="supply" size="small" clearable placeholder="请选择供应方式" style="width: 100%;" v-if="$index===0">
              <el-option label="选项一" value="option1"></el-option>
              <el-option label="选项二" value="option2"></el-option>
              <el-option label="选项三" value="option3"></el-option>
            </el-select>
            <el-input v-model="address" size="small" clearable placeholder="请输入交货地点" v-if="$index===1"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="name3" align="right"></el-table-column>
        <el-table-column>
          <template #default="{$index}">
            <el-select v-model="people" size="small" clearable placeholder="请选择联系人" style="width: 100%;" v-if="$index===0">
              <el-option label="选项一" value="option1"></el-option>
              <el-option label="选项二" value="option2"></el-option>
              <el-option label="选项三" value="option3"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="name4" align="right"></el-table-column>
        <el-table-column>
          <template #default="{$index}">
            <el-input v-model="telNumber" size="small" clearable placeholder="请输入联系方式" v-if="$index===0"></el-input>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-row>
      <el-col :span="24" style="display: flex;flex-direction: column;height: 400px;">
        <div style="display: flex;align-items: center;width: 100%;border-bottom: 1px solid #ebeef5;height: 35px">
          <span style="margin-left: 10px;font-weight: bold">原材料价格</span>
          <el-button style="margin-left: auto" type="success" plain size="small" @click="innerVisible = true"><font-awesome-icon icon="fa-solid fa-circle-plus"/>添加执行期</el-button>
        </div>
        <el-table :data="displayTable" style="flex:1">
          <el-table-column label="供应原材料"></el-table-column>
          <el-table-column label="平台原材料"></el-table-column>
          <el-table-column label="计价单位"></el-table-column>
          <el-table-column label="转换系数"></el-table-column>
          <el-table-column label="计划数量"></el-table-column>
          <el-table-column label="单价"></el-table-column>
          <el-table-column label="计划金额"></el-table-column>
          <el-table-column label="操作"></el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-row style="background-color: #2b2b2b">
      <el-col :span="24">
        <el-table :data="footerTableDate" :show-header="false">
          <el-table-column prop="name1" align="right" :width="100"></el-table-column>
          <el-table-column>
            <template #default = {$index}>
              <el-input v-model="errDeal" size="small" clearable v-if="$index===0"></el-input>
              <el-input v-model="remark" size="small" clearable v-if="$index===1"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="name2" align="right" :width="100"></el-table-column>
          <el-table-column>
            <template #default = {$index}>
              <el-input v-model="responsibility" size="small" clearable v-if="$index===0"></el-input>
              <el-select v-model="buyer" size="small" clearable style="width: 100%;" v-if="$index===1">
                <el-option label="选项一" value="option1"></el-option>
                <el-option label="选项二" value="option2"></el-option>
                <el-option label="选项三" value="option3"></el-option>
              </el-select>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  <el-dialog
    v-model="innerVisible"
    width="30%"
    title="添加执行期"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :draggable="true"
    :before-close="closeInnerDialog"
    align-center
    append-to-body
  >
    <el-row>
      <el-col :span="24">
        <div style="display:flex;align-items: center">
          <span>
            执行期间：
          </span>
          <el-date-picker type="datetime" size="small" placeholder="选择执行时间" v-model="innerDialogDate"></el-date-picker>
        </div>
      </el-col>
    </el-row>
    <template #footer>
      <el-space :size="8">
        <el-button size="small" type="success" plain @click="confirmInnerDone">确认</el-button>
        <el-button size="small" type="danger" plain @click="closeInnerDone">关闭</el-button>
      </el-space>
    </template>
  </el-dialog>
  <template #footer>
    <el-space :size="8">
      <el-button size="small" type="primary" plain @click="cancelDone"><font-awesome-icon icon="fa-solid fa-floppy-disk" style="margin-right: 2px"/>保存</el-button>
      <el-button size="small" type="success" plain @click="confirmDone"><font-awesome-icon icon="fa-solid fa-square-check" style="margin-right: 2px"/>提交</el-button>
      <el-button size="small" type="danger" plain @click="confirmDone"><font-awesome-icon icon="fa-solid fa-xmark" style="margin-right: 2px"/>关闭</el-button>
    </el-space>
  </template>
</el-dialog>

</template>

<script setup>
import { ref } from 'vue'
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

const testNumber = ref("XY230503012")
const testDate = ref("2023-05-03 19:08:59")
const secondTableDate = ref([
  {
    name1:"往来单位：",
    formComponent1:true,
    name2:"供应方式：",
    formComponent2:true,
    name3:"联系人：",
    formComponent3:true,
    name4:"联系方式：",
    formComponent4:true
  },
  {
    name1:"开始采购时间：",
    formComponent1:true,
    name2:"交货地点：",
    formComponent2:true,
    name3:"",
    formComponent3:false,
    name4:"",
    formComponent4:false
  }
])
function formSpanMethod({ rowIndex, columnIndex }){
  if(rowIndex === 1){//控制第二行
    if(columnIndex===3){
      return{
        rowspan:1,
        colspan:5
      }//往右合并
    }else if(columnIndex > 3){//往右合并之后，右边所有的空单元格全部取消渲染设为0，0
      return {
        rowspan: 0,
        colspan: 0
      }
    }
  }
}
const company = ref('')
const startDate = ref('')
const supply = ref('')
const address = ref('')
const people = ref('')
const telNumber = ref('')
const displayTable = ref([
  {

  }
])
const footerTableDate = ref([
  {
    name1:"异常处理：",
    formComponent1:true,
    name2:"违约责任：",
    formComponent2:true
  },
  {
    name1:"备注：",
    formComponent1:true,
    name2:"采购人：",
    formComponent2:true
  }
])
const errDeal = ref('')
const remark = ref('')
const responsibility = ref('')
const buyer = ref('')
const innerVisible = ref(false)
const innerDialogDate = ref('')

const emit = defineEmits(['done','update:dialogVisible']);
//使用v-model预定义的update:propsname监听事件完成父子组件对应props数据的同步更新，即当子组件对应数据被更改时，发送update:propsname事件即可完成子组件数据传到父组件
const props = defineProps({
  // 弹窗是否打开
  dialogVisible: Boolean,
  // 修改回显的数据
  data: Object
});
function confirmDone(){
  props.dialogVisible = false
  updateVisible(false)
  emit('done','Confirm')
}
function cancelDone(){
  props.dialogVisible = false
  updateVisible(false)//结合v-model内置的信号和槽函数同步更新父组件弹窗布尔值
  emit('done','Cancel')
}
function closeDialog(done){
  props.dialogVisible = false
  updateVisible(false)
  emit('done','Close')
  done()//关闭对话框
}
function closeInnerDialog(){
  innerVisible.value = false//不会自动解包，需要.value手动解包赋值
}
function confirmInnerDone(){
  innerVisible.value = false
}
function closeInnerDone(){
  innerVisible.value = false
}
//重构------------------------------------------------------------------------------
const updateVisible = (value) => {
  emit('update:dialogVisible',value)
};
</script>

<style scoped>
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

</style>
