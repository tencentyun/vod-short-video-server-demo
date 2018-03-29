



const APP_BASE_PATH = '../../../';
const enums = require(APP_BASE_PATH + 'include/enums');

module.exports = {
    
    getVideoList:async function(req,res){

        try{
            let pageSize = 10;
            let pageNum = 0;
            if(req.query.page_size){
                pageSize = req.query.page_size;
                if(pageSize > 100){
                    pageSize = 10;
                }
            }
    
            if(req.query.page_num){
                pageNum = req.query.page_num;
            }
            try{
                pageNum = parseInt(pageNum);
                pageSize = parseInt(pageSize);
            }catch(err){
                pageSize = 10;
                pageNum = 0;
            }
    
            let pageClause = ' limit ? offset ? ';

            let total = 0;
            let items = [];
            let results = null;
            let conn = null;

            try {
                conn = await gDataBases["db_voddemo"].getConnection();

                let sql = "select a.fileId,a.name,a.size,a.duration,a.coverUrl,unix_timestamp(a.createTime) as createTime from t_basic_info a order by a.createTime desc "+pageClause;
                items = await conn.queryAsync(sql,[pageSize,(pageNum * pageSize)]);

                let results = await conn.queryAsync('select count(*) as total from t_basic_info');
                total = results[0].total;
            } catch (err) {
                console.error(err);
                return res.status(404).json({
                    'code': enums.ReturnCode.FAILED,
                    'message':'服务器错误'
                });
            } finally {
                if (conn != null) {
                    conn.release();
                }
            }
    
            return  res.json({
                'code': enums.ReturnCode.SUCCESS,
                'message':'ok',
                'data':{
                    'list':items,
                    'total': total,
                }
            });
        }catch(err){
            console.error(err);
        }
      

    },

    getVideoDetail:async function(req,res){

        let fileId = req.params.file_id;
        if(!fileId){
            return res.status(404).json({
                'code': enums.ReturnCode.FAILED,
            });
        }

        let results = null;
        let conn = null;
        let item = {};
        try {
            conn = await gDataBases["db_voddemo"].getConnection();
            let basicSql = "select a.fileId,a.name,a.size,a.duration,a.coverUrl,a.description,a.sourceVideoUrl from t_basic_info a  where a.fileId=? ";
            results = await conn.queryAsync(basicSql,[fileId]);
            if(results.length==0){
                return res.status(404).json({
                    'code': enums.ReturnCode.RES_NOT_EXISTS,
                });
            }
            item.basicInfo = results[0];

        } catch (err) {
            console.error(err);
            return res.status(404).json({
                'code': enums.ReturnCode.FAILED,
            });
        } finally {
            if (conn != null) {
                conn.release();
            }
        }
  
        return  res.json({
            'code': enums.ReturnCode.SUCCESS,
            'message':'ok',
            'data':{
                'detail':item
            }
        });
    }
}