const moment = require('moment');
const APP_BASE_PATH = '../';
const enums = require(APP_BASE_PATH + 'include/enums');


/**
 * 上传事件处理函数
 * @param {消息} taskCbMsg 
 */
async function NewFileUploadHandler(taskCbMsg) {
    if (!taskCbMsg || taskCbMsg.eventType != enums.TaskCBEventType.NewFileUpload) {
        throw { message: "can not process this task in NewFileUploadHandler" };
    }
    let param = taskCbMsg.data;

    let conn = null;
    try {
        conn = await gDataBases["db_voddemo"].getConnection();
        let basicInfoItem = {};
        basicInfoItem['name'] = param['name'] ? param['name'] : '';
        basicInfoItem['fileId'] = param['fileId'];
        basicInfoItem['sourceVideoUrl'] = param['fileUrl'];
        basicInfoItem['size'] = param['metaData'].size;
        basicInfoItem['duration'] = param['metaData'].duration;
        let results = null;
        results = await conn.queryAsync('insert ignore into t_basic_info set ?', basicInfoItem);
     
    } catch (err) {

        console.error(err);
    } finally {
        if (conn != null) {
            conn.release();
        }
    }
}


/**
 * 
 * @param {*} fileId 
 * @param {*} conn 
 */
async function updateBasicInfo(fileId) {


    /*
    *调用腾讯云点播平台API，获取详细信息
    *备注：采用腾讯云web端,Android,IOS端播放SDK，SDK内部会根据fileId拉取各个转码格式播放地址，如果使用自研播放器，可以获取详细转码信息后保存在数据库中并分发给客户端
    */
    let conn = null;
    try {
        conn = await gDataBases["db_voddemo"].getConnection();
        let data = await gVodHelper.getVideoInfo({ fileId, infoFilter: ['basicInfo'], extraOpt: { } });
        if(data.code!=0){
            throw data;
        }
        let basicInfo = data.basicInfo;
        let basicInfoItem = {};
        basicInfoItem['name'] = basicInfo.name;
        basicInfoItem['size'] = basicInfo.size;
        basicInfoItem['duration'] = basicInfo.duration;
        basicInfoItem['description'] = basicInfo.description;
        basicInfoItem['createTime'] = moment(basicInfo.createTime, 'X').format('YYYY-MM-DD HH:mm:ss');
        basicInfoItem['updateTime'] = moment(basicInfo.updateTime, 'X').format('YYYY-MM-DD HH:mm:ss');
        basicInfoItem['classificationId'] = basicInfo.classificationId;
        basicInfoItem['classificationName'] = basicInfo.classificationName;
        basicInfoItem['playerId'] = basicInfo.playerId;
        basicInfoItem['coverUrl'] = basicInfo.coverUrl;
        basicInfoItem['type'] = basicInfo.type;
        basicInfoItem['sourceVideoUrl'] = basicInfo.sourceVideoUrl;
        let results = null;
        results = await conn.queryAsync('select * from t_basic_info where fileId=?', [fileId]);
        if (results.length == 0) {
            throw 'no such fileID';
        }
        await conn.queryAsync('update t_basic_info set ? where fileId=?', [basicInfoItem, fileId]);
    } catch (err) {
        console.error(err);
    } finally {
        if (conn != null) {
            conn.release();
        }
    }
    
}



/**
 * 转码事件处理函数
 * @param {回调消息} taskCbMsg 
 */
async function TranscodeCompleteHandler(taskCbMsg) {
    if (!taskCbMsg || taskCbMsg.eventType != enums.TaskCBEventType.TranscodeComplete) {
        throw { message: "can not process this task in TranscodeComplete" };
    }
    let param = taskCbMsg.data;
    try {
        let fileId = param.fileId;
        await updateBasicInfo(fileId);
    } catch (err) {
        console.error(err);
    }
}

/**
 * 
 * @param {*} taskCbMsg 
 */
async function ProcedureStateChangedHandler(taskCbMsg){

    if (!taskCbMsg || taskCbMsg.eventType != enums.TaskCBEventType.ProcedureStateChanged) {
        throw { message: "can not process this task in ProcedureStateChangedHandler" };
    }
    let param = taskCbMsg.data;
    try {
        let fileId = param.fileId;
        await updateBasicInfo(fileId);
      
    } catch (err) {
        console.error(err);
    } 
}


async function defaultTaskCbHandler(taskCbMsg) {
    console.log("can not handler this task cb");
}


//注册handler
let taskHandlerMap = {};
taskHandlerMap[enums.TaskCBEventType.NewFileUpload] = NewFileUploadHandler;
taskHandlerMap[enums.TaskCBEventType.TranscodeComplete] = TranscodeCompleteHandler;
taskHandlerMap[enums.TaskCBEventType.ProcedureStateChanged] = ProcedureStateChangedHandler;

function getTaskHandler(type) {
    let handler = taskHandlerMap[type];
    if(!handler){
        handler = defaultTaskCbHandler;
    }
    return handler;
}

module.exports = {
    getTaskHandler
}