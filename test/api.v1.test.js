


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



describe('api test', function () {
    this.timeout(10000);
    it('getSignature', function (done) {
        request(httpUrl+"/api/v1/misc/upload/signature",function(error,response,body){
            assert.equal(error,null);
            body = JSON.parse(body); 
            assert.equal(body.code,0)
            done();
        })
    });

    it('getVideoList', function (done) {
        request(httpUrl+"/api/v1/resource/videos",function(error,response,body){
            assert.equal(error,null);
            body = JSON.parse(body); 
            assert.equal(body.code,0)
            done();
        })
    });

    it('getVideoDetail', function (done) {
        request(httpUrl+"/api/v1/resource/videos",function(error,response,body){
            assert.equal(error,null);
            body = JSON.parse(body); 
            assert.equal(body.code,0);
            if(body.data.total > 0){

                let fileId = body.data.list[0].fileId;
                request(httpUrl+"/api/v1/resource/videos/"+fileId,function(error,response,body){
                    assert.equal(error,null);
                    body = JSON.parse(body); 
                    assert.equal(body.code,0);
                    done();
                });

            }else{
                done();
            }

           
          
        })
    });


});


after(function () {



});