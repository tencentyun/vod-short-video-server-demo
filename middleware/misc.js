const APP_BASE_PATH = '../';
const enums = require(APP_BASE_PATH + 'include/enums');
const RateLimiter = require('rolling-rate-limiter');
const crypto = require('crypto');


let rateLimiterNSGlobal = null;

//生产环境如果是多进程或者多机部署，建议将nonce信息保存在共享内存
let nonceInfo = {
    flushTime:new Date().getTime(),
    nonceMap:new Set(),
    timeOut:60*1000
}


async function checkNonce(nonce = ''){
    //清理nonce集合
    if(new Date().getTime() - flushTime > nonceInfo.timeOut){
        nonceInfo.nonceMap = new Set();
        nonceInfo.flushTime = new Date();
    }
    
    let checkNonce = false;
    if(nonce){
        if(nonceInfo.nonceMap.has(nonce)){
            checkNonce =  false;
        }else{
            checkNonce = true;
            nonceInfo.nonceMap.add(nonce);
        }
    }
    return checkNonce;
}

function checkRateLimit(limiter, identify) {
    return new Promise(function(resolve, reject){
        limiter(identify, function(err, timeLeft) {
            if (err) {
                reject();
            } else if (timeLeft) {
                reject();
            } else {
                resolve();
            }
        });
    })
}

function createRateLimiter(namespace){
    return RateLimiter({
        namespace: namespace,
        interval: 3*60*1000,
        maxInInterval: 100,
    });
}

module.exports = {

    //通过timestamp，对称密钥以及nonce实现简要的访问控制
    autho:async function(req,res,next){
        let param = req.query;
        if(!param.uid || !timestamp ||! param.signature ||!param.nonce){
            return res.status(429).json({
                code: enums.ReturnCode.UNAUTHORIZED_OPT,message:"缺失校验参数"
            });
        }
        if(Math.asb(new Date().getTime() / 1000 - param.timestamp) > 60 ){
            return res.status(429).json({
                code: enums.ReturnCode.UNAUTHORIZED_OPT,message:"时间戳超时"
            });
        }
        let nonceCheck = await checkNonce(param.nonce);
        if(!nonceCheck){
            return res.status(429).json({
                code: enums.ReturnCode.UNAUTHORIZED_OPT,message:"重复请求"
            });
        }
        let conn = null;
        try {
            conn = await DataBases["voddemo"].getConnection();
            let results = await conn.queryAsync("select appId,appKey from t_application where status=1 and appId=?", [param.uin]);
            if (results.length == 0) {
                return res.status(429).json({
                    code: enums.ReturnCode.UNAUTHORIZED_OPT, message: "uin不存在"
                });
            }
        } catch (err) {
            return res.status(429).json({
                code: enums.ReturnCode.FAILED, message: "内部错误"
            });
        } finally {
            if (conn != null) {
                conn.release();
            }
        }
      
        let sSignature = crypto.createHash('md5').update(`${results[0].appId}${timestamp}${nonce}${results[0].appKey}`).digest('hex');
        if(sSignature!=param.signature){
            return res.status(429).json({
                code: enums.ReturnCode.UNAUTHORIZED_OPT,message:"校验不通过"
            });
        }
        next();
    },

    //获取客户端IP
    remoteIp: async function(req, res, next) {
        let clientIp = req.get('X-Forwarded-For');
        if(!clientIp){
            clientIp = req.connection['remoteAddress'];
        }

        if(clientIp){
            req.remoteIp = clientIp;
        }
        next();
    },

    //频率访问控制
    rateLimiterGlobal: async function(req, res, next) {
        if(!rateLimiterNSGlobal){
            rateLimiterNSGlobal = createRateLimiter('ns_global');
        }
        try {
            await checkRateLimit(rateLimiterNSGlobal, req.remoteIp);
        } catch (e) {
            console.error('rate limit triggered(' + req.remoteIp + ')');
            return res.status(429).json({
                code: enums.ReturnCode.TOO_OFTEN,message:"该ip访问过于频繁，请稍后再试"
            });
        }
        next();
    },

};


