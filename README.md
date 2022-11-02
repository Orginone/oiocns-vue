# ogocns-vue
奥集能平台前端VUE版本  
框架使用Vue3 + TypeScript + Vite实现
## 目录介绍

```
.
├── build/dist              # 生成压缩包
├── public             # 静态资源，不需要 webpack 处理
└── src
    ├── assets
    │   ├── fonts      # 字体文件
    │   ├── img        #图片
    │   ├── js         # 不经过 npm 或 yarn 下载的第三方依赖包
    │   └── style       # reset 样式，及定义的常量文件等
    ├── components
    │   └── global     # 全局注册组件
    │       └── SvgIcon
    ├── icons          # svg 文件
    │   └── svg
    ├── router         # 路由及拦截器
    ├── services       # 统一的服务接口请求处理
    └── views
        ├── Chat         # 消息聊天
        ├── Home         # 主页
        ├── Layout       # 布局
        ├── Login        # 登录注册
        ├── Organization # 关系(集团、单位、群组)
        ├── Others       # 其他：如404页
        ├── Person       # 我的(个人)
        ├── Thing        # 数据
        ├── Work         # 工作台
```
## 文件命名规范
1. 路由文件夹 大驼峰
2. 页面文件本身 小驼峰
3. 页面级组件 写入 页面文件夹下 components下
4. 全局组件 写入 src/components 下
## git规范
1.  命名要求：  
    1.1 统一前缀-姓名缩写-描述及日期。如 增加XX功能 ``feature-lw-addmain1101``  
    1.2 分支名称前缀如下：  
● common：调整通用组件、通用功能、通用数据接口、通用样式等  
● feature：新功能  
● fix：bug修复  
● hotfix：线上紧急修复  
● perf：性能优化  
● other：配置信息调整等非上面5种的改动改动  

2. 迭代要求：  
    2.1 main分支为主干，所有迭代基于此分支进行获取  
    2.2 所有新功能迭代，问题修复等，需要进行发布，需要提交PR请求到mainw分支。  
    2.3 待系统上线后会拉出test,后续迭代与ISSUE中问题进行关联的模式  
