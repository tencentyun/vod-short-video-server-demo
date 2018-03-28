# 短视频后台DEMO
## 项目
采用es6语法，基于express框架，使用mysql做数据存储，提供了腾讯云点播平台视频上传，回调处理以及媒资管理等功能的演示
## 开发构建
### 帐号申请

 1. 申请[腾讯云](https://cloud.tencent.com/)帐号，获取[API密钥](https://console.cloud.tencent.com/cam/capi)
 2. 设置点播平台回调配置:部署域名+/taskcb,参考[腾讯云点播回调配置](https://cloud.tencent.com/document/product/266/7829)

### 环境准备
 1. mysql 5.7 
 2. node.js 8.10
### 快速开始
数据库准备,创建数据库以及视频基本信息数据表

    create database db_voddemo default charset utf8
    use db_voddemo;
    CREATE TABLE `t_basic_info` (
      `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增ID',
      `fileId` bigint(20)  NOT NULL COMMENT '视频ID',
      `name` varchar(256) NOT NULL DEFAULT '' COMMENT '视频名称',
      `size` int(11)  NOT NULL DEFAULT 0 COMMENT '视频文件大小',
      `duration` int(11)  NOT NULL DEFAULT 0 COMMENT '视频时间长度',
      `description` varchar(1024)  NOT NULL DEFAULT '' COMMENT '简介',
      `status` tinyint(4)  NOT NULL DEFAULT 0 COMMENT '视频状态',
      `createTime` datetime NOT NULL DEFAULT '1970-01-01 00:00:00' COMMENT '创建时间',
      `updateTime` datetime NOT NULL DEFAULT '1970-01-01 00:00:00' COMMENT '更新时间',
      `expireTime` datetime NOT NULL DEFAULT '1970-01-01 00:00:00' COMMENT '过期时间',
      `classificationId` int(11)  NOT NULL DEFAULT 0 COMMENT '视频分类Id',
      `classificationName` varchar(256)  NOT NULL DEFAULT '' COMMENT '视频分类名称',
      `playerId` int(11)  NOT NULL DEFAULT 0 COMMENT '播放器Id',
      `coverUrl` varchar(1024)  NOT NULL DEFAULT '' COMMENT '视频封面图',
      `type` varchar(256)  NOT NULL DEFAULT '' COMMENT '视频封装格式，例如mp4',
      `sourceVideoUrl` varchar(1024)  DEFAULT '' NOT NULL COMMENT '视频渊文件地址',
      PRIMARY KEY (`id`),
      UNIQUE KEY `uk_file_id` (`fileId`),
      KEY `update_time` (`updateTime`),
      KEY `create_time` (`createTime`),
      KEY `name` (`name`)
    ) ENGINE=InnoDB AUTO_INCREMENT=10000 DEFAULT CHARSET=utf8 COMMENT='基础信息表';

克隆项目文件

    git clone https://github.com/tencentyun/vod-short-video-server-demo.git

在conf文件夹下，复制config_template.json文件并命名为localconfig.json文件，修改腾讯云API密钥、数据库参数配置，以及服务启动IP和端口

    {
        "dbconfig":{
            "host":"127.0.0.1",
            "user":"username",
            "password":"password",
            "database":"db_voddemo",
            "port":3306,
            "supportBigNumbers": true,
            "connectionLimit":10
        },
        "tencentyunaccout":{
            "appid":"1250000000",
            "SecretId": "AKIDxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
            "SecretKey": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
        },
        "server":{
            "ip":"0.0.0.0",
            "port":8000
        }
    }
进入目录安装相应依赖

    npm install            //安装项目所需依赖
    npm install -g mocha   //安装测试所需依赖
启动服务

    npm start

测试

    mocha                 //api测试需要在本地服务启动情况下

## 设计说明
### 框架设计
后台业务逻辑主要为三个模块功能，媒资管理，上传签名以及消息回调处理

 - 媒资管理： 提供客户端视频列表拉取，视频详细信息获取功能
 - 上传签名： 提供给客户端向vod上传短视频时所需的鉴权信息
 - 消息回调：处理当VOD完成视频上传，视频转码等功能的回调请求

![图片标题](https://3gimg.qq.com/trom_s/vrbrowser/zion_test/pic/4950b9a03bf5a7fe2c8e12f63e196a9f.png)
### 目录结构

    ├── api                              #功能模块文件夹
    │   └── v1
    │       ├── entry.js                 #功能模块入口
    │       ├── handlers                 #功能模块实现
    │       │   ├── misc.js              #签名模块实现
    │       │   └── resource.js          #媒资模块实现
    │       └── routes                   #功能模块路由
    │           ├── misc.js              #签名模块路由
    │           └── resource.js          #媒资模块路由
    ├── app.js                           #服务启动文件
    ├── conf                             #配置文件
    │   ├── config_template.json         #配置文件模版
    │   └── localconfig.json
    ├── include                         #常量配置
    │   └── enums.js                    
    ├── middleware                      #访问中间件模块，如授权校验，频率限制
    │   └── misc.js
    ├── package.json
    ├── routes                          #路由组件
    │   └── taskcb.js                   #消息回调路由
    │   └── taskcbHandlers.js           #消息回调处理
    ├── scripts                         #脚本
    │   └── voddemosqls.sql             #数据库脚本
    ├── test                            #测试文件
    │   ├── api.v1.test.js              #功能模块测试
    │   ├── taskcb.test.js              #回调模块测试
    │   └── vod_helper.test.js          #工具模块测试
    ├── utils                           #工具函数
    │   ├── mysql_helper.js             #数据库工具函数
    │   └── vod_helper.js               #vod服务接口封装文件

## 参考
腾讯云点播平台视频上传签名：https://cloud.tencent.com/document/product/266/9219
腾讯云点播平台事件回调：https://cloud.tencent.com/document/product/266/7829
腾讯云点播平台媒资获取：https://cloud.tencent.com/document/product/266/8586
腾讯云Node.js SDK：https://cloud.tencent.com/document/sdk/Node.js