# gulp小程序开发模板

## 项目启动
### 1. 安装依赖
```bash
npm install
```

### 2. 开发模式
```bash
npm run watch
```

### 3. 生产打包
```bash
npm run build
```

### 4. 开发方式
在`src`目录下开发, 使用小程序开发者工具打开`weapp-dist`, 打包后也是`weapp-dist`文件夹

### 5. 新建页面文件命令
> 新建后需手动在`src/app.json`文件中添加路由

```bash
npm run genPages 文件名
```

例如, 
```bash
npm run genPages test
```

会在`src/pages`目录下新建`test`文件夹, 里面放入重命名后的模板文件, 模板文件存放在`pageTemplate`目录中

之后在`src/app.json`文件中的`pages`数组中添加
```json
  "pages": [
    //...
    "pages/test/test"
    //...
  ],
```