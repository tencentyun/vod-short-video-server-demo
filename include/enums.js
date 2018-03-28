var _enumValidator = {}

var ENUM = {

    //返回码
    ReturnCode: {
        SUCCESS: 0,
        FAILED: 1000,
        PARAM_ERROR: 1001,
        TOO_OFTEN: 1004,
        RES_NOT_EXISTS: 1003,
        UNAUTHORIZED_OPT: 1002,
    },

    ResourceStatus:{
        READY:1,
        NOT_READY:0
    },

    //具体介绍见：https://cloud.tencent.com/document/product/266/7829
    TaskCBEventType : {
        ProcedureStateChanged: "ProcedureStateChanged",
        NewFileUpload: "NewFileUpload",
        PullComplete: "PullComplete",
        TranscodeComplete: "TranscodeComplete",
        ConcatComplete: "ConcatComplete",
        ClipComplete: "ClipComplete",
        CreateImageSpriteComplete: "CreateImageSpriteComplete",
        CreateSnapshotByTimeOffsetComplete: "CreateSnapshotByTimeOffsetComplete",
        FileDeleted: "FileDeleted",
    },
    //具体介绍见：https://cloud.tencent.com/document/product/266/9636#processtasklist.EF.BC.88.E4.BB.BB.E5.8A.A1.E5.88.97.E8.A1.A8.EF.BC.89
    ProcessTaskType:{
        Trancode:"Trancode",
        SampleSnapshot:"SampleSnapshot",
        CoverBySnapshot:"CoverBySnapshot",
        SnapshotByTimeOffset:"SnapshotByTimeOffset",
        PullFile:"PullFile",
        ImageSprites:"ImageSprites"
    }
};


module.exports = ENUM;
