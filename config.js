/**
 * Created by dyc on 2017/2/23.
 * 配置文件
 */
let requestConfig= {
    hostName: "http://192.168.1.68:8811",
    urlPrefix: "/wbVideoManager/api",///Video/getVideoDetail
    defaultHeader: {},
    defaultAddParams: {},
    isPrintLog: true,
    defaultCallback: function (fetchResponse, callback) {
        console.log("in default call back ==>", fetchResponse);
        return callback(fetchResponse);
    }
};
export default  requestConfig;
