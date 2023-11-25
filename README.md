# 快红

> 2021 春季学期软件工程的玩具级项目，主要用于训练规范化的多人合作开发
> 
> 项目使用 [SECODER](https://sep.secoder.net) 平台进行开发与部署
> 
> 感谢几个组员的贡献，以及项目的助教和甲方的宽容 o(≧v≦)o

## 1. 项目概述

### 1.1 项目背景

		短视频行业的飞速发展，诞生了许多短视频领域的创业者。众所周知，想要做好一个短视频账号，内容质量方面必须要高，除此之外，日常的数据分析也是非常的重要。通过专业的视频分析工具，不仅能了解到行业内的最新玩法，还能学到竞品上热门的套路。下面我们就准备为快手的短视频作者做一款分析工具 -- 快手网红分析师。

### 1.2 项目目标

		快手上每天有数千万作者上传自己的视频和图片作品，这些作品会被在快手平台全网分发，快手用户能看到这些作品并对它们进行浏览、评论和点赞。为了帮助视频作者更好的了解自己拍摄作品的受欢迎程度，我们需要一个提供一个面向作者的辅助分析工具，通过使用这个工具用户可以比较清晰的了解自己作品每天被浏览的情况。

### 1.3 功能需求

| 模块         | 功能描述                                                               |
| ------------ | ---------------------------------------------------------------------- |
| 登录注册授权 | 设置本站登陆注册功能，且登陆之后用户能够与快手账号进行绑定             |
| 首页信息展示 | 展示用户基本信息；展示用户近三天活跃度增长情况                         |
| 用户通知中心 | 获取用户收到的所有通知、并进行通知状态管理                             |
| 作品展示管理 | 展示所有作品信息、对视频实现标签管理                                   |
| 作品数据分析 | 展示作品近三天内各项指标变化及环比变化情况、作品各项指标变化情况可视化 |

### 1.4 用户故事

我是一位快手视频创作者，刚刚创建了自己的账号，发了几条视频，粉丝不多，但是我非常想知道自己每条账号的活跃度以及粉丝观看的情况，从而对我之后的策略做出调整。

我希望有一个数据分析平台，他的账号要能够和快手独立，方便我和其他的团队成员进行管理，并且要能快捷的绑定我的快手账号。

这个平台应该可以让我看到我的快手账号整体的统计信息，比如评论、播放、点赞数；可以看到过去一段时间的视频指标的变化；还应该让我看到我发的每一条视频的相应数据和图表展示，最好能让我在看视频数据时预览我发的视频。

同时，我希望我能对自己发布的视频做出标注，比如标上一些视频种类的tag，也希望机器能够自动帮我做出这一步，让我更好的分析视频。

由于我会时刻关注视频账号数据上视频的播放数据，所以我希望这个平台能够在我的视频数据指标出现比较大增长或者下降时，给我发送通知；同时我还希望这个视频平台能够每天给我发送日报来展示当天的数据变化情况。

我希望这个平台能够在 PC端使用、并且拥有美观性和易用性。我还希望这个平台能够保证数据安全，保证我的快手账号和快手数据信息不会泄露。

我希望这个平台能让我创造出用户更加喜爱的视频，并实现视频数、评论观看点赞数的稳步增长，让我成功成为一名具有影响力的网红。

## 2. 登录注册授权

**简要说明**

1. 用户首次使用本站时需要进行用户注册，注册信息为用户名与密码；注册之后进入本站首页，需要通过首页提供的链接进行快手账号授权。
2. 用户再次使用本站可以通过之前已有的账号登录，不需要再次授权账号。

**界面原型**

[![g8TPAO.png](https://i.loli.net/2021/05/08/kFZ86vrqp7SL5AR.png)](https://imgtu.com/i/g8TPAO)

[![g8Tmut.png](https://i.loli.net/2021/05/08/z6MAdxryb4P8QIf.png)](https://imgtu.com/i/g8Tmut)

[![g8TnDP.png](https://i.loli.net/2021/05/08/bhnmVR3BxZW4GSu.png)](https://imgtu.com/i/g8TnDP)

**逻辑规则**

1. 注册

   | 字段   | 必填 | 格式要求                | 校验点                         | 错误提示语                                                                  |
   | ------ | ---- | ----------------------- | ------------------------------ | --------------------------------------------------------------------------- |
   | 用户名 | 是   | 字符串，长度大于5小于19 | 长度要求、不能与已有用户名重复 | 'Username: length between 6 and 18' 'This user name had already been used!' |
   | 密码   | 是   | 字符串，长度大于5       | 长度要求                       | 'Password: length longer than 6'                                            |

2. 登录

   | 字段   | 必填 | 格式要求                | 校验点                         | 错误提示语                                                                                     |
   | ------ | ---- | ----------------------- | ------------------------------ | ---------------------------------------------------------------------------------------------- |
   | 用户名 | 是   | 字符串，长度大于5小于19 | 长度要求、用户名与密码输入正确 | 'Please enter the correct username(length between 6-18)' 'Account and password are incorrect.' |
   | 密码   | 是   | 字符串，长度大于5       | 长度要求                       | 'Please enter the correct password(longer than 6)'                                             |

3. 授权

   利用快手提供的开放接口获取用户的个人信息和视频数据。具体流程为，首先向快手提供的api接口请求权限，在请求中包含回调url，用户在授权界面完成授权后，将code回调给后端提供的url，后端获取code后使用code取得用户的access_token，使用access_token向快手请求用户数据。

   [![g8Th5D.png](https://i.loli.net/2021/05/08/FulazQK7BpU6EGx.png)](https://imgtu.com/i/g8Th5D)

## 3. 首页信息展示

**简要说明**

1. 授权登录后需要在首页展示用户的基本信息，如头像、昵称、粉丝数量、共获点赞/评论/播放数
2. 展示24h内点赞、评论、播放增量
3. 将24h内每个小时的活跃度增量可视化展示
4. 可视化展示标签数量

**界面原型**

[![g8TuHf.png](https://i.loli.net/2021/05/08/l1GPOwnB2cfaNkK.png)](https://imgtu.com/i/g8TuHf)

[![g8To2d.png](https://i.loli.net/2021/05/08/Q7jycrOe5BtJ9oP.png)](https://imgtu.com/i/g8To2d)

**逻辑规则**

1. 进入首页之后，调用后端接口返回所有数据。

   数据包括：用户基本信息；三个数组，分别代表点赞、评论、播放，每个数组包括近24小时内每个小时对应指标的总量。前端在获取这些数据之后，计算出每个小时内对应指标的增量，传入图表组件进行可视化展示。

2. 图表展示规则

   横坐标表示从当前时间往前数的24个小时；纵坐标有四个，分别表示点赞、评论、播放以及三者总和（a.k.a 总活跃度）。图表要有标题说明图表内容。另外应该提供数据展示选项：通过对应的开关选择在图表中是否展示某一数据。

3. 上方表格中的数据如果过大可能会产生溢出，应该进行缩写处理。

   [![g8TWVK.png](https://i.loli.net/2021/05/08/MW4TvH3xaVL2kRC.png)](https://imgtu.com/i/g8TWVK)

## 4. 用户通知中心

**简要说明**

1. 向用户展示所有通知，用户可对通知进行读取操作
2. 用户可以编辑通知读取状态，并对通知范围进行选取

**界面原型**

[![g8TI8H.png](https://i.loli.net/2021/05/08/RdbUpgzxIhjWq18.png)](https://imgtu.com/i/g8TI8H)

**逻辑规则**

1. 通知中心页面默认展示未读通知，以标题为项目陈列，点击标题可展开阅读内容。排列顺序为：未读优先于已读、较新的通知靠前
2. 未读通知标题旁会有醒目标记，一旦展开标题，标记消失，阅读完毕后该通知加入已读状态
3. 页面顶部可以选择是否展示所有通知，用户若选择是，已读的通知也会显示在最下方
4. 导航栏中，点击用户头像出现的下拉菜单中也有通知中心的入口，未读通知数量会标记在该条目旁
5. 通知中心的展开条目的方式为风琴式，一次只能阅览一条通知的内容

[![g8T5Pe.png](https://i.loli.net/2021/05/08/6IwUNYEJuDzgRki.png)](https://imgtu.com/i/g8T5Pe)

## 5. 作品展示管理

**简要说明**

1. 通过对时间范围的选取，展示一段时间内发布的视频信息，包括发布时间、获得点赞、评论、播放数据等。
2. 实现添加标签功能：包括通过视频标题自动生成标签，手动添加标签
3. 单击视频标题进入单个视频的数据分析界面
4. 提供分页功能对单页视频数量进行选择

**界面原型**

[![g8TME8.png](https://i.loli.net/2021/05/08/URdqMgVwJc6lfzN.png)](https://imgtu.com/i/g8TME8)

**逻辑规则**

1. 进入作品管理页面时通过后端接口默认返回最近一周的视频数据。通过上方的日期选择其他时间范围。

2. 底部用一个分页器选择单页最多展示视频数量，提供点击跳转和输入跳转方式。

3. 表格第一栏展示作品标题，提供点击跳转至对应作品分析界面，鼠标悬浮时应该显示视频封面。

   中间四栏分别展示发布时间、获得点赞、评论、播放数。

   最右侧一栏是对应视频的标签管理页，可以添加或删除视频标签。默认标签在后端自动生成；可以选择手动给视频添加标签，点击添加标签时会产生云图显示较多的标签作为参考。标签应当为字符串类型，且添加标签字数不得超过20个字符。

   [![g8TTxA.png](https://i.loli.net/2021/05/08/1xTCG9vdYc2hUwl.png)](https://imgtu.com/i/g8TTxA)

## 6. 作品数据分析

**简要说明**

1. 提供一个作品数据分析页面，需要显示作品近三天内各项指标（点赞、评论、播放）变化数及环比变化情况

2. 通过时间范围选择器与图表展示选定时间范围内各项指标变化情况
3. 如果没有选定单个作品则分析所有视频

**界面原型**

[![g8TZjI.png](https://i.loli.net/2021/05/08/sETuVf72IikMQZU.png)](https://imgtu.com/i/g8TZjI)

[![g8Tl4g.png](https://i.loli.net/2021/05/08/zyHM3L659SxZPB7.png)](https://imgtu.com/i/g8Tl4g)

[![g8T3CQ.png](https://i.loli.net/2021/05/08/CU7uFJVroEihw1b.png)](https://imgtu.com/i/g8T3CQ)

**规则逻辑**

1. 左侧导航栏默认进入全局作品分析页，作品管理页点击标题根据视频id跳转到单个作品分析页

2. 全局作品分析页展示所有作品最近三日的播放、点赞、评论的变化量与环比变量；单作品分析页展示单个作品最近三日的播放、点赞、评论的变化量与环比变量。

   单作品分析页左侧标题如果过长需要进行切割处理，通过鼠标悬浮完整展示。

3. 底部图表默认展示最近三天的数据变化量，通过滑动上方时间范围选择器改变图表展示方式。

   当滑杆两点同时处于24h时，图表展示最近24小时数据变化量，标题显示为过去24小时的作品数据。

   当滑杆两点同时处于其他点时，图表展示当天数据变化量，标题显示为过去第x天的数据。

   当滑杆处于其他状态时，图表展示的是该段时间内每天的数据变化量，标题显示为过去第x天到第y天的作品数据。

   [![g8TfUO.png](https://i.loli.net/2021/05/08/Z5JD8dUXEy4TwrL.png)

## 7. 后端逻辑

数据库中储存了四个类:User, Kuaishouuser, Video, Notice，实现了后端与快手api的分离，其交互示意图如下：

![未命名文件.jpg](https://i.loli.net/2021/05/08/WOfCzTHrYthk9io.png)

**User类：** 本网站的用户类，为了让用户登陆网站而设计。

**Kuaishouuser类：** 快手用户类，记录了快手的唯一id与快手用户进行一一对应，以`User`类的用户名作为主键与`User`类形成对应。

**Video类：**快手视频类，以快手的唯一视频id与快手视频进行一一对应，以`Kuaishouuser`类作为外键与`Kuaishouuser`类形成对应。

**Notice类：**网站通知类，以`User`类作为外键与`User`类形成对应。

**后端与快手api分离：**后端仅会在用户授权和轮询时调用快手api，在前端进行请求时只会从数据库中拉取数据，从而实现后端与快手api分离。

**轮询：**后端部署完成后轮询就会开始，按照一定周期访问`快手api`并对数据库中的`Video`类和`Video`类对应的`Kuaishouuser`类进行更新，如果有用户活跃度激增则调用`Notice`类进行通知。

**上述实现保证了在用户请求用户信息时后端直接从数据库中获取信息，而不是调用快手api获取信息。**

## 8. 前后端交互逻辑及API文档

后端采用规范的`RESTFUL API`格式书写，并将通过`SWAGGER`自动生成的文档交付前端，方便前端开发人员在线预览调试，减少前后端沟通成本。

**API文档详情可见在线版本：[API Document](https://backend-securepapersnake.app.secoder.net/swagger/)**，此处由于软件工程平台自身的安全性远低于我们的标准设计，以及方便第三方检查，只能部署在公网之上。

![backend-securepapersnake.app.secoder.net_swagger](https://i.loli.net/2021/05/08/r2HxbeJaM7omwTR.png)

## 9. 解决用户信息获取过慢问题

**问题：** 在网站的1.1版本遇到了访问`api/kuaishou/videolist`等接口时加载速度过慢的问题，其中对于一个拥有2000+视频的用户网站的加载时间需要3秒左右。

1.1版本的后端逻辑如下：

在网站收到用户请求所有视频时调用快手的`access_token`接口保证用户的token没有过期，之后调用快手的`videoklist`接口，等待快手返回所有视频的信息，这样就能得到最新的用户信息。

这样做是为了保证能够在新注册的用户立即使用网站时可以查询得到正确的信息，如果不在这里调用`videoklist`接口，那么新注册的用户只能在下一次轮询后才能看到自己的视频（如果是以1小时为周期做轮询，那么在1小时后才能看道信息）。

当用户的视频数较多时，快手api需要将所有视频的基本信息传回来，网站需要等待得到所有视频信息后才能加载，所以很慢。

其他接口由于每次在调用前需要调用快手的`access_token`来接口验证用户的正确性，所以当快手端返回数据较慢时仍然会出现网站加载速度慢的问题。

**解决方案**：

我们将轮询函数的工作周期改为了1分钟一次。每次只对上次更新时间与现在时间相差一小时的视频进行更新，同时对从未进行更新过的视频进行更新。

这样每个视频仍然是1小时更新一次，但是我们将之前的1小时一次的更新分散成了现在的分批次更新，一小时内服务器对快手api的访问次数与之前相同。并且我们删除了在网站收到用户请求所有视频时对快手的`videoklist`接口的调用，这是由于我们的轮询逻辑保证新注册的用户信息将会在1分钟内储存在数据库中。

此外，我们同样删除了调用快手的`access_token`接口保证用户的token没有过期的步骤，转而在用户等我们网站时统一验证用户的token没有过期，如果过期了就让他授权。

这样就保证了所有的用于返回用户信息的函数中没有调用快手api。

在实际的测试中，我们将平均3s的后端处理时间缩短到平均50ms，P99时间大约200ms。

## 10. 监控

我们采用 goaccess 对 nginx 进行打点统计，用于优化前后端响应时间，并方便维护人员在线预览。

在线版本可参考https://goaccess-securepapersnake.app.secoder.net/ ，此处由于软件工程平台自身的安全性远低于我们的标准设计，以及方便第三方检查，只能部署在公网之上。

![goaccess-securepapersnake.app.secoder.net_](https://i.loli.net/2021/05/08/K2npMxRPEroFOy5.png)

## 11. 部署

### 前端

**框架：**nodejs + Vue + ElementUI + Echarts

**Build Setup**

```bash
git clone https://gitlab.secoder.net/securepapersnake/frontend
cd frontend
yarn install
yarn dev
```

浏览器访问 [http://localhost:8000](http://localhost:8000)

**发布**

```bash
# 构建生产环境
yarn build
```

**调试**

```bash
# 构建开发环境
yarn dev

# 预览发布环境效果（反向代理后端api）
HOST=<api_url> yarn preview

# 预览发布环境效果 + 静态资源分析
HOST=<api_url> yarn preview --report

# 代码格式检查
yarn lint

# 代码格式检查并自动修复
yarn lint --fix

# Unit-test
```

![unittest](https://i.loli.net/2021/05/16/aQvVzR6TMgPrS8b.png)

### 后端

**框架：**主体使用django，数据库mysql，后端api文档：restful

**后端部署运行：**

```shell
pip install -r requirements.txt
sh script/hook.sh
sh script/start.sh
```

**config文件**：后端的所有有关密码均储存在了位于服务器的文件中，一个config文件的内容示例如下：

```json
{
    "DJANGO_SUPERUSER_EMAIL": "prnake@gmail.com",
    "DJANGO_SUPERUSER_USERNAME": "papersnake",
    "DJANGO_SUPERUSER_PASSWORD": "password",
    "DJANGO_SECRET_KEY": "key",
    "DJANGO_DEBUG": "False",
    "MYSQL_NAME": "django",
    "MYSQL_USER": "root",
    "MYSQL_PASSWORD": "password",
    "MYSQL_HOST": "mysql.securepapersnake.secoder.local",
    "MYSQL_PORT": 3306,
    "app_id": "ks12345678",
    "app_secret": "12345678",
    "redirection_uri": "https://frontend-securepapersnake.app.secoder.net/api/kuaishou/handle-code",
    "refresh_time": 3600,
    "renew_time": 3600,
    "salt": "salt",
    "admin":"testuser"
}
```

![unittest](https://i.loli.net/2021/05/16/WcirXdsgoGBOZu9.png)

### Secoder 部署流程

详情可参考**frontend**，**backend**，**goaccess**，**mysql**，**phpmyadmin**五个仓库的 `Dockerfile`。

## 13. 项目工作流程示意图

![frontend](https://7.dusays.com/2021/05/08/71ac0863ae3f6.svg)

