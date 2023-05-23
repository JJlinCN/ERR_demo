<template>
  <div class="mhtml-viewer">
    <!-- 导航栏 -->
    <div class="navbar">
      <!-- 添加分页功能 -->
      <el-pagination
        v-if="curFileList.length > 1"
        :pageSize="1"
        background
        :currentPage="curPage"
        :total="curFileList.length"
        @current-change="changePageNum"
      />
      <!-- 使用下拉组件实现选择前端还是后端 -->
      <el-select v-model="curState" placeholder="请选择类型" style="width:120px;margin-left:20px;" @change="selectChange">
        <el-option label="前端" value="page"></el-option>
        <el-option label="后端" value="api"></el-option>
      </el-select>
    </div>
    <!-- 加载MHTML文件 -->
    <iframe ref="viewer" class="viewer" ></iframe>
  </div>
</template>

<script>
import axios from 'axios';
import { defineComponent } from 'vue';
import {API_BASE_URL} from "@/config/setting";
import mhtml2html from "mhtml2html"


const service = axios.create({
  baseURL: API_BASE_URL
});

export default defineComponent({
  // 定义数据
  data() {
    return {
      dirName:{
        page:"C:\\Users\\JJlin\\Desktop\\软工设计体系结构实验\\ele-admin-api(开发指南)\\ElEAdinPro\\", //前端页面目录路径
        api:"C:\\Users\\JJlin\\Desktop\\软工设计体系结构实验\\ele-admin-api(开发指南)\\ele-admin-api\\" //后端页面目录路径
      },
      fileName: {
        page:["1.开始使用.mhtml", "2.框架配置.mhtml", "3.快速上手.mhtml", "4.公共样式.mhtml", "5.公共方法.mhtml" ,"6.1框架布局.mhtml", "6.2高级表格.mhtml" ,"6.3图片裁剪.mhtml"
          ,"6.4 图标选择.mhtml" ,"6.5 标签组件.mhtml" ,"6.6 地图组件.mhtml" ,"6.7 文件列表.mhtml" ,"6.8头像列表.mhtml" ,"6.9 颜色选择.mhtml" ,"6.10打印组件.mhtml"
          ,"6.11 excel插件.mhtml" ,"6.12拖拽排序.mhtml" ,"6.13统计图表.mhtml" ,"6.14富文本框.mhtml" ,"6.15城市选择.mhtml" ,"6.16滚动数字.mhtml" ,"6.17视频播放.mhtml"
          ,"6.18弹窗扩展.mhtml" ,"6.19二维码.mhtml" ,"6.20分割布局.mhtml" ,"6.21markdown.mhtml" ,"6.22表格下拉.mhtml" ,"7. 主题功能.mhtml" ,"8. 其他功能.mhtml"
          ,"9.打包部署.mhtml" ,"10. 常见问题.mhtml" ,"11. 常用实例.mhtml" ,"12. 旧版配置.mhtml" ,"更新日志.mhtml"],
        api:["0.更新日志.mhtml", "1.开始使用.mhtml" ,"2.配置说明.mhtml" ,"3.常用功能.mhtml" ,"4.PageParam.mhtml" ,"5.CRUD示例.mhtml" ,"6.工具类.mhtml" ,"7.更多功能.mhtml"
          ,"8. 代码生成.mhtml" ,"9.打包部署.mhtml" ,"10.常见问题.mhtml"]
      },
      curState:'page',
      mhtmlData: '',
      curPage: 1
    };
  },
  computed:{
    pageFileFullPath(){//前端路径计算
      return this.getFileFullPath(this.dirName.page, this.fileName.page[this.curPage - 1]);
    },
    apiFileFullPath() {//后端路径计算
      return this.getFileFullPath(this.dirName.api, this.fileName.api[this.curPage - 1]);
    },
    curFileList(){
      return this.curState === 'page' ? this.fileName.page : this.fileName.api;
    },
    curFilePath(){
      return this.curState==='page'?this.pageFileFullPath:this.apiFileFullPath;
    }
  },
  // 定义方法
  methods: {
    //文件绝对路径拼接
    getFileFullPath(dirName, fileName){
      return dirName + fileName;
    },
    // 分页组件切换页面
    changePageNum(pageNum) {
      if (this.curPage !== pageNum) {
        this.curPage = pageNum;
        this.loadPage();
      }
    },
    selectChange(val){
      this.curPage = 1;//切换前后端文档的时候，需要维护curPage数据将其初始化1，避免因为分页组件的影响使curPage的值未知造成未知错误
      this.curState = val;
      this.loadPage();//重新加载对应的文档
    },
    // 加载指定页码对应的文件
    async loadPage() {
      try{
        const response = await service.get(`/fileContent?filePath=${encodeURIComponent(this.curFilePath)}`)
        this.mhtmlData = response.data;
        const {index, frames, media} = await mhtml2html.parse(this.mhtmlData);
        // 查找第一个 MHTML 资源中的 HTML 内容
        const htmlResourceKey = Object.keys(media).find(
          key => media[key].type === "text/html"
        );
        const htmlResource = media[htmlResourceKey];
        const {data: htmlData} = htmlResource;
        const iframe = this.$refs.viewer;
        iframe.setAttribute('height',`${window.innerHeight}`)//采用es6新模板字符串语法动态计算iframe页面高度
        const doc = iframe.contentDocument || iframe.contentWindow.document
        doc.open();
        doc.write(htmlData);
        doc.close();
        // 插入 CSS 代码
        const cssResources = Object.values(media).filter(
          (resource) => resource.type === "text/css"
        );
        cssResources.forEach((cssResource) => {
          const style = doc.createElement("style");
          style.appendChild(doc.createTextNode(cssResource.data));
          doc.head.appendChild(style);
        });

        // 插入 JavaScript 代码
        const jsResources = Object.values(media).filter(
          (resource) => resource.type === "application/javascript"
        );
        jsResources.forEach((jsResource) => {
          const script = doc.createElement("script");
          script.type = "text/javascript";
          script.text = jsResource.data;
          doc.head.appendChild(script);
        });
        // 禁用上一页和下一页按钮
        const pageBtns = document.querySelectorAll(".el-pager button");
        if (pageBtns.length > 0) {
          const prevBtn = pageBtns[0];
          const nextBtn = pageBtns[pageBtns.length - 1];
          if (this.curPage === 1) {
            prevBtn.setAttribute("disabled", true);
          } else if (this.curPage === this.curFileList.length) {
            nextBtn.setAttribute("disabled", true);
          } else {
            prevBtn.removeAttribute("disabled");
            nextBtn.removeAttribute("disabled");
          }
        }
      }catch(error){
        console.error(error);
      }
    },
  },
  // 加载初始页面
  mounted() {
    this.loadPage();
  },
});
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
.viewer {
  width: 100%;
  border: none;
}
</style>
