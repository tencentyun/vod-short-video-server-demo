
--在root权限下数据库用户与权限
create user 'voddemo'@'localhost' identified by 'voddemo';
create database db_voddemo default charset utf8 collate utf8_general_ci;
grant all privileges on `db_voddemo`.* to 'voddemo'@'%' identified by 'voddemo';

use db_voddemo;


--创建基础信息表
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


--原始视频元数据表
CREATE TABLE `t_meta_data` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增ID',
  `fileId` bigint(20)  NOT NULL  COMMENT '视频ID',
  `definition` int(11) NOT NULL DEFAULT 0 COMMENT '模版',
  `bitrate` int(11) NOT NULL DEFAULT 0 COMMENT '码率',
  `height` int(11) NOT NULL DEFAULT 0 COMMENT '高',
  `width` int(11) NOT NULL DEFAULT 0 COMMENT '宽',
  `container` varchar(256) NOT NULL DEFAULT '' COMMENT '容器类型，例如m4a，mp4等',
  `size` int(11)  NOT NULL DEFAULT 0 COMMENT '视频文件大小',
  `duration` int(11)  NOT NULL DEFAULT 0 COMMENT '视频时间长度',
  `md5` varchar(32) NOT NULL DEFAULT '' COMMENT '文件md5',
  PRIMARY KEY (`id`),
  UNIQUE KEY `file_id` (`fileId`,`definition`)
) ENGINE=InnoDB AUTO_INCREMENT=1000 DEFAULT CHARSET=utf8 COMMENT='视频元信息';


CREATE TABLE `t_drm` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增ID',
  `fileId` bigint(20)  NOT NULL COMMENT '视频ID',
  `definition` int(11) NOT NULL DEFAULT 0 COMMENT '模版',
  `getKeyUrl` varchar(256) NOT NULL DEFAULT '' COMMENT '获取解密秘钥的URL',
  `encryptType` varchar(256) NOT NULL DEFAULT 'SingleKey' COMMENT '加密类型，目前只有SingleKey一种',
  `keySource` varchar(256) NOT NULL DEFAULT 'VodBuildInKMS' COMMENT 'KMS（秘钥管理服务）的类型，总共三种，分别为 VodBuildInKMS：腾讯云点播内置KMS；QCloudKMS：腾讯云KMS系统（暂不支持）；PrivateKMS：用于自有KMS系统（暂不支持）',
  `edkList` varchar(1024) NOT NULL DEFAULT 0 COMMENT '密钥列表',
  PRIMARY KEY (`id`),
  UNIQUE KEY `file_id` (`fileId`,`definition`)
) ENGINE=InnoDB AUTO_INCREMENT=1000 DEFAULT CHARSET=utf8 COMMENT='加密信息'


CREATE TABLE `t_transcode_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增ID',
  `fileId` bigint(20)  NOT NULL  COMMENT '视频ID',
  `idrAlignment` TINYINT(2) NOT NULL DEFAULT 0 COMMENT '转码的视频是否IDR对齐。0：不对齐；1对齐。',
  `url` varchar(256) NOT NULL DEFAULT '' COMMENT '转码后的视频文件地址',
  `definition` int(11) NOT NULL DEFAULT 0 COMMENT '模版',
  `bitrate` int(11) NOT NULL DEFAULT 0 COMMENT '码率',
  `height` int(11) NOT NULL DEFAULT 0 COMMENT '高',
  `width` int(11) NOT NULL DEFAULT 0 COMMENT '宽',
  `container` varchar(256) NOT NULL COMMENT '容器类型，例如m4a，mp4等',
  `size` int(11)  NOT NULL DEFAULT 0 COMMENT '视频文件大小',
  `duration` int(11)  NOT NULL DEFAULT 0 COMMENT '视频时间长度',
  `md5` varchar(32) NOT NULL COMMENT '文件md5',
  PRIMARY KEY (`id`),
  UNIQUE KEY `file_id` (`fileId`,`definition`)
) ENGINE=InnoDB AUTO_INCREMENT=1000 DEFAULT CHARSET=utf8 COMMENT='视频转码信息';


CREATE TABLE `t_video_stream` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增ID',
  `infoId` int(11) NOT NULL  COMMENT '上级ID',
  `infoType` tinyint(4)  NOT NULL DEFAULT 0 COMMENT '上级类型 0 meta信息，1 转码信息',
  `fps` int(11) NOT NULL DEFAULT 0 COMMENT '',
  `bitrate` int(11) NOT NULL DEFAULT 0 COMMENT '码率',
  `height` int(11) NOT NULL DEFAULT 0 COMMENT '高',
  `width` int(11) NOT NULL DEFAULT 0 COMMENT '宽',
  `codec` varchar(256) NOT NULL COMMENT '视频流的编码格式，例如h264',
  PRIMARY KEY (`id`),
  KEY `info_id` (`infoId`)
) ENGINE=InnoDB AUTO_INCREMENT=1000 DEFAULT CHARSET=utf8 COMMENT='视频流表';


CREATE TABLE `t_audio_stream` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增ID',
  `infoId` int(11) NOT NULL  COMMENT '上级ID',
  `infoType` tinyint(4)  NOT NULL DEFAULT 0 COMMENT '上级类型 0 meta信息，1 转码信息',
  `samplingRate` int(11) NOT NULL DEFAULT 0 COMMENT '音频流的采样率。 单位：hz',
  `bitrate` int(11) NOT NULL DEFAULT 0 COMMENT '音频流的码率。 单位：bps',
  `codec` varchar(256) NOT NULL COMMENT '音频流的编码格式，例如aac',
  PRIMARY KEY (`id`),
  KEY `info_id` (`infoId`)
) ENGINE=InnoDB AUTO_INCREMENT=1000 DEFAULT CHARSET=utf8 COMMENT='音频流表';


CREATE TABLE `t_sample_snapshot_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增ID',
  `fileId` bigint(20)  NOT NULL  COMMENT '视频ID',
  `definition` int(11) NOT NULL DEFAULT 0 COMMENT '模板参数',
  `interval` varchar(256) NOT NULL DEFAULT 0 COMMENT '若type为Percent，表示多少百分比一张图； 若type为Time，表示多少时间间隔一张图，单位秒。 第一张图均为视频首帧',
  `sampleType` tinyint(4) NOT NULL COMMENT '若type为Percent，表示多少百分比一张图； 若type为Time，表示多少时间间隔一张图，单位秒。 第一张图均为视频首帧',
  `imageUrls` varchar(1024) NOT NULL COMMENT '字符串数组，生成的截图url列表',
  PRIMARY KEY (`id`),
  UNIQUE KEY `file_id` (`fileId`,`definition`)
) ENGINE=InnoDB AUTO_INCREMENT=1000 DEFAULT CHARSET=utf8 COMMENT='音频流表'


CREATE TABLE `t_image_sprite_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增ID',
  `fileId` bigint(20)  NOT NULL  COMMENT '视频ID',
  `definition` int(11) NOT NULL DEFAULT 0 COMMENT '模板参数',
  `height` int(11) NOT NULL DEFAULT 0 COMMENT '雪碧图小图的高度',
  `width` int(11) NOT NULL DEFAULT 0 COMMENT '雪碧图小图的宽度',
  `totalCount` int(11) NOT NULL DEFAULT 0 COMMENT '每一张雪碧图中小图的数量',
  `imageUrls` varchar(1024) NOT NULL COMMENT '每一张雪碧图的地址',
  `webVttUrl` varchar(256) NOT NULL COMMENT '雪碧图子图位置与时间关系WebVtt文件地址',
  PRIMARY KEY (`id`),
  UNIQUE KEY `file_id` (`fileId`,`definition`)
) ENGINE=InnoDB AUTO_INCREMENT=1000 DEFAULT CHARSET=utf8 COMMENT='音频流表'


CREATE TABLE `t_snapshot_by_timeoffset_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增ID',
  `fileId` bigint(20)  NOT NULL  COMMENT '视频ID',
  `definition` int(11) NOT NULL DEFAULT 0 COMMENT '高',
  `url` varchar(256) NOT NULL COMMENT '该张截图的地址，如果status非0，则url不存在',
  `timeOffset` int(4) NOT NULL COMMENT '该张截图对应视频文件中的时间偏移。单位：毫秒',
   PRIMARY KEY (`id`),
   KEY `file_id` (`fileId`)
) ENGINE=InnoDB AUTO_INCREMENT=1000 DEFAULT CHARSET=utf8 COMMENT='视频指定时间点截图信息'


CREATE TABLE `t_keyrame_desc_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增ID',
  `fileId` bigint(20) NOT NULL  COMMENT '视频ID',
  `content` varchar(256) NOT NULL COMMENT '经过URL Encoded的打点文本描述信息。',
  `timeOffset` int(11) NOT NULL DEFAULT 0 COMMENT '打点时间偏移，唯一标识一个打点。单位：毫秒',
  PRIMARY KEY (`id`),
  KEY `file_id` (`fileId`)
) ENGINE=InnoDB AUTO_INCREMENT=1000 DEFAULT CHARSET=utf8 COMMENT='打点信息'



CREATE TABLE `t_application` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增ID',
  `appId` varchar(32) NOT NULL  COMMENT '',
  `appKey` varchar(32) NOT NULL  COMMENT '',
  `status` tinyint(4)  NOT NULL DEFAULT 0 COMMENT '状态,1 正常',
  PRIMARY KEY (`id`),
  KEY `app_id` (`appId`)
) ENGINE=InnoDB AUTO_INCREMENT=1000 DEFAULT CHARSET=utf8 COMMENT='帐号记录表'


insert into t_application(appId,appKey,status) values('1256244234','f33f27ca71aa0719b2bef075f34cd0de',1);