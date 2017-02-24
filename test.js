/**
 * Created by dyc on 2017/2/22.
 */

import requestUtils from '/index.js';

//为了方便管理,单独将配置放置到了一个config文件中
import requestConfig from './config';
var requestObj=new requestUtils({
    hostName: requestConfig.hostName,
    urlPrefix: requestConfig.urlPrefix,
    defaultHeader: requestConfig.defaultHeader,
    defaultAddParams: requestConfig.defaultAddParams,
    isPrintLog: requestConfig.isPrintLog,
    defaultCallback: requestConfig.defaultCallback
});
console.log("requestObj===>",requestObj);

//request:
requestObj.postByApplicationJson({
    postURL: "/Video/getVideoDetail",
    postArgs: {
        "noticeId": "21412"
    },
    callback: function (responseData) {
        console.log("responseData==>", responseData);
        console.log("test end");
    }
})