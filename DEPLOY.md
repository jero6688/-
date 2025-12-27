# 部署指南

本系统是纯静态网站，可以非常免费、简单地部署到公网。以下推荐两种最简单的方案：

## 方案一：Netlify Drop (最推荐，无需命令行)

这是目前最简单的部署方式，只需要拖拽文件夹即可上线。

1.  打开浏览器访问 [Netlify Drop](https://app.netlify.com/drop)。
2.  在文件资源管理器中找到本项目下的 **`client`** 文件夹。
3.  将 **`client`** 文件夹直接拖拽到 Netlify 网页上的虚线框区域。
4.  等待几秒钟，部署完成后，页面会显示一个绿色的链接（例如 `https://random-name.netlify.app`）。
5.  你可以将这个链接发给你的客户，他们就能访问了。

## 方案二：Vercel (适合开发者)

如果你安装了 Vercel CLI 或有 GitHub 账号。

1.  **使用 GitHub**:
    *   将本项目推送到你的 GitHub 仓库。
    *   登录 [Vercel](https://vercel.com)，点击 "Add New..." -> "Project"。
    *   导入你的仓库，Vercel 会自动识别并部署。

2.  **使用命令行**:
    *   确保安装了 Node.js。
    *   安装 Vercel CLI: `npm install -g vercel`
    *   进入 client 目录: `cd client`
    *   运行部署命令: `vercel deploy`
    *   按照提示登录并确认即可。

## 方案三：GitHub Pages

1.  将本项目推送到 GitHub 仓库。
2.  进入仓库的 "Settings" -> "Pages"。
3.  在 "Source" 下选择 `main` 分支，文件夹选择 `/client` (如果支持) 或根目录（需要调整）。
4.  保存后，GitHub 会生成一个 `username.github.io/repo-name` 的链接。

---

**注意**：由于本系统是纯静态的，部署后不需要任何后端配置，所有数据处理都在用户的浏览器中完成。
