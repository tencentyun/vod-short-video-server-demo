


const assert = require('assert');
const fs = require('fs');
const request = require('request');

let config = {};
let httpUrl = "";

before(async function () {
   
    //配置文件加载
    const fs = require('fs');
    config =  JSON.parse(fs.readFileSync('./conf/localconfig.json'));
    httpUrl = "http://127.0.0.1:"+config.server.port;

});



describe('taskCallback test', function () {
  
    this.timeout(10000);
    it('newVideo', function (done) {

        var options = {
            method: 'POST',
            url: 'http://localhost:8000/taskcb',
            headers:
            {
                'content-type': 'application/json'
            },
            body:
            {
                version: '4.0',
                eventType: 'NewFileUpload',
                data:
                {
                    status: 0,
                    message: '',
                    vodTaskId: '',
                    fileId: '7447398155217586128',
                    fileUrl: 'http://1256244234.vod2.myqcloud.com/104ab380vodgzp1256244234/953bd0f27447398155121589617/uuY6v6BQxLwA.mp4',
                    continued: 0,
                    author: '',
                    streamId: '',
                    sourceType: 'ClientUpload',
                    sourceContext: '',
                    metaData:
                    {
                        height: 180,
                        width: 320,
                        bitrate: 67322,
                        size: 56345,
                        container: 'mov,mp4,m4a,3gp,3g2,mj2',
                        md5: '',
                        duration: 6,
                        floatDuration: 6.083628177642822,
                        videoStreamList: [{ bitrate: 65218, height: 180, width: 320, codec: 'h264', fps: 30 }],
                        audioStreamList: [{ samplingRate: 44100, bitrate: 2104, codec: 'aac' }]
                    }
                }
            },
            json: true
        };


        request.post(options, function (error, response, body) {
            assert.equal(error, null);
            assert.equal(body.code, 0)
            done();
        })
    });

    it('transcode', function (done) {

        var options = {
            method: 'POST',
            url: 'http://localhost:8000/taskcb',
            headers:
            {
                'content-type': 'application/json'
            },
            body:
            {
                version: '4.0',
                eventType: 'TranscodeComplete',
                data:
                {
                    vodTaskId: '1256244234-transcode-1a8faffe0b532904f9e26604f583e9c7',
                    status: 0,
                    message: '',
                    fileId: '7447398155217586128',
                    fileName: 'test',
                    duration: 6,
                    coverUrl: 'http://1256244234.vod2.myqcloud.com/c4725628vodtransgzp1256244234/953bd0f27447398155121589617/snapshot/1521525157_2025046270.100_0.jpg',
                    playSet:
                    [{
                        url: 'http://1256244234.vod2.myqcloud.com/104ab380vodgzp1256244234/953bd0f27447398155121589617/uuY6v6BQxLwA.mp4',
                        definition: 0,
                        vbitrate: 67322,
                        vheight: 180,
                        vwidth: 320
                    },
                    {
                        url: 'http://1256244234.vod2.myqcloud.com/c4725628vodtransgzp1256244234/953bd0f27447398155121589617/v.f20.mp4',
                        definition: 20,
                        vbitrate: 399115,
                        vheight: 360,
                        vwidth: 640
                    }]
                }
            },
            json: true
        };




        request.post(options, function (error, response, body) {
            assert.equal(error, null);
            assert.equal(body.code, 0)
            done();
        })
    });

    it('ProcedureState', function (done) {


        var options = {
            method: 'POST',
            url: 'http://localhost:8000/taskcb',
            headers:
            {
                'postman-token': 'fc2721bc-c399-a605-e892-13b90da4547b',
                'cache-control': 'no-cache',
                'content-type': 'application/json'
            },
            body:
            {
                version: '4.0',
                eventType: 'ProcedureStateChanged',
                data:
                {
                    vodTaskId: '1256244234-Procedure-a3937a361e1d2183654d40905b24eb11',
                    status: 'FINISH',
                    message: '',
                    errCode: 0,
                    fileId: '7447398155217586128',
                    metaData:
                    {
                        height: 540,
                        width: 960,
                        bitrate: 1118543,
                        size: 1945066,
                        container: 'mov,mp4,m4a,3gp,3g2,mj2',
                        md5: '',
                        duration: 13,
                        floatDuration: 13.766016006469727,
                        videoStreamList:
                        [{
                            bitrate: 1029679,
                            height: 540,
                            width: 960,
                            codec: 'h264',
                            fps: 30
                        }],
                        audioStreamList: [{ samplingRate: 48000, bitrate: 88864, codec: 'aac' }]
                    },
                    processTaskList:
                    [{
                        taskType: 'Transcode',
                        status: 'SUCCESS',
                        message: 'SUCCESS',
                        errCode: 0,
                        input: { definition: 20, watermark: 0, multiWatermarks: null },
                        output:
                        {
                            url: 'http://1256244234.vod2.myqcloud.com/c4725628vodtransgzp1256244234/eb521f527447398155217586128/v.f20.mp4',
                            size: 966187,
                            container: 'mov,mp4,m4a,3gp,3g2,mj2',
                            height: 360,
                            width: 640,
                            bitrate: 554136,
                            md5: '4be97b01e92b489e44e5f88273c92e61',
                            duration: 13,
                            floatDuration: 13.79170036315918,
                            videoStreamList:
                            [{
                                bitrate: 505777,
                                height: 360,
                                width: 640,
                                codec: 'h264',
                                fps: 24
                            }],
                            audioStreamList: [{ samplingRate: 44100, bitrate: 48359, codec: 'aac' }]
                        }
                    },
                    {
                        taskType: 'Transcode',
                        status: 'SUCCESS',
                        message: 'SUCCESS',
                        errCode: 0,
                        input: { definition: 230, watermark: 0, multiWatermarks: null },
                        output:
                        {
                            url: 'http://1256244234.vod2.myqcloud.com/c4725628vodtransgzp1256244234/eb521f527447398155217586128/v.f230.m3u8',
                            size: 538,
                            container: 'hls,applehttp',
                            height: 720,
                            width: 1280,
                            bitrate: 1162281,
                            md5: '87f70650b428c8ed4b2ca228667c84ca',
                            duration: 13,
                            floatDuration: 13.75,
                            videoStreamList:
                            [{
                                bitrate: 1114392,
                                height: 720,
                                width: 1280,
                                codec: 'h264',
                                fps: 24
                            }],
                            audioStreamList: [{ samplingRate: 44100, bitrate: 47889, codec: 'aac' }]
                        }
                    }]
                }
            },
            json: true
        };

        request.post(options, function (error, response, body) {
            assert.equal(error, null);
            assert.equal(body.code, 0)
            done();
        })
    });

});


after(function () {



});