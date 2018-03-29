



const APP_BASE_PATH = '../../../';


module.exports = {
    getUploadSignature: function (req, res) {
        res.json({
            code: 0,
            message: 'ok',
            data: {
                //上传时指明模版参数与任务流
                signature: gVodHelper.createFileUploadSignature({procedure:'QCVB_SimpleProcessFile(1)'})
            }
        });
    }
}