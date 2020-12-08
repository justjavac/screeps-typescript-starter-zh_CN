# 使用 Typescript 开发 Screeps

本项目是 [Screeps Typescript Starter](https://github.com/screepers/screeps-typescript-starter) 的简体中文版。基于此项目你可以快速的使用 Typescript 开发属于自己的 Screeps AI 程序。

## 使用

前置需求

- [Node.js](https://nodejs.org/zh-cn/) 10.x 版本。目前 Node.js 最新 LTS 版为 14.x，但是和 Screeps 不兼容，所以推荐使用 Screeps 官方推荐的 10.x 版本。
- 包管理工具 ([Yarn](https://yarnpkg.com/en/docs/getting-started) 或者 [npm](https://docs.npmjs.com/getting-started/installing-node))

使用 git 克隆本仓库：

```shell
git clone https://github.com/justjavac/screeps-typescript-starter-zh_CN
```

或者直接下载 <https://github.com/justjavac/screeps-typescript-starter-zh_CN/archive/master.zip>

打开终端运行：

```bash
# npm
npm install

# 或者 yarn
yarn
```

如果没报错，那么你就可以打开 src 目录进行开发了。

### 部署

Screeps Typescript Starter 使用 rollup 编译打包 typescript 文件，然后上传到 screeps 服务器。

将 `screeps.sample.json` 改名为 `screeps.json`，根据自己的服务器信息进行配置和修改。配置文件中包含了 3 个官服以及我自己搭建的私服 <https://screeps.devtips.cn>。

## 类型定义文件

本项目所用到的类型定义文件来自 [typed-screeps-zh_CN](https://github.com/justjavac/typed-screeps-zh_CN)。如果开发过程中发现了不能正在提示的地方，可以提 issue 或者 pr。

## 许可证

本项目 [screeps-typescript-starter-zh_CN](https://github.com/justjavac/screeps-typescript-starter-zh_CN) 基于 [Unlicense License](./LICENSE) 发行到公共领域。
