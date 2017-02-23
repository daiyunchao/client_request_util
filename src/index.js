/**
 * Created by dyc on 2017/2/22.
 * 请求辅助
 */
require('es6-promise').polyfill();
import fetch from 'isomorphic-fetch'
class requestUtils {

    /**
     * 初始化
     * @param hostName 请求的Host,用于构建请求的URL
     * @param urlPrefix 请求URL的前缀
     * @param defaultHeader 默认请求头
     * @param defaultAddParams 默认请求参数
     * @param isPrintLog 是否要开启日志打印 默认值:true
     * @param defaultCallback 默认请求回调函数
     */
    constructor({
        hostName = "",
        urlPrefix = "",
        defaultHeader = {},
        defaultAddParams = {},
        isPrintLog = true,
        defaultCallback = null
    }) {
        //setting value
        this.hostName = hostName;
        this.urlPrefix = urlPrefix;
        this.defaultHeader = defaultHeader;
        this.defaultAddParams = defaultAddParams;
        this.isPrintLog = isPrintLog;
        this.defaultCallback = defaultCallback;
    }

    /**
     * 使用application/jsonContent-Type的POST方法:
     * @param postURL 请求的URL
     * @param isCompleteUrl 是否是完整的URL,如果是完整的URL则只使用postUrl当作请求URL 默认值:false
     * @param newHeader 是否有新的请求Header
     * @param addDefaultHeader 是否添加默认的DefaultHeader到newHeader中去,默认值为:false
     * @param postArgs 请求参数
     * @param addDefaultArgs 是否添加默认参数到请求参数中去,默认值:true
     * @param callback 回调函数
     * @param beforeDoDefaultCallBack 在执行回调前是否执行默认的回调函数
     */
    postByApplicationJson({
        postURL,
        isCompleteUrl = false,
        newHeader = null,
        addDefaultHeader = false,
        postArgs = {},
        addDefaultArgs = true,
        callback = function(){},
        beforeDoDefaultCallBack = true
    }
    ) {
        this.log("in postByApplicationJson params==>", arguments);
        let self = this;
        let requestUrl = "";
        let requestHeader = {};

        //构建请求Url:
        if (isCompleteUrl) {
            //如果用户输入的是完整的URL,则放弃初始设定的HOST和前缀
            requestUrl = postURL;
        }
        else {
            requestUrl = self.hostName + self.urlPrefix + postURL;
        }
        this.log("requestUrl==>", requestUrl);

        //构建请求头:
        if (newHeader) {
            //如果要求使用新的请求头,则使用新的请求头:
            self.changeObjectValue(
                {
                    "changeObj": newHeader,
                    "changeKey": "Content-Type",
                    "newValue": "application/json"
                });
            requestHeader = newHeader;
            if (addDefaultHeader) {
                //如果要加默认头,则添加:
                requestHeader = self.mergeObject(
                    {
                        "oldObj": self.defaultHeader,
                        "newObj": requestHeader
                    });
            }
        }
        else {
            //如果newHeader是空,则说明要使用默认的header
            //相同的方法,将content-type代替成application/json
            self.changeObjectValue(
                {
                    "changeObj": self.defaultHeader,
                    "changeKey": "Content-Type",
                    "newValue": "application/json"
                });
            requestHeader = self.defaultHeader;
        }

        //打印header:
        self.log("request Header ===>", requestHeader);


        //构建请求参数:
        let postDataStr = "";
        if (addDefaultArgs) {
            //如果要添加默认参数,则添加默认参数
            postArgs = self.mergeObject({
                "oldObj": self.defaultAddParams,
                "newObj": postArgs
            })
        }
        try {
            postDataStr = JSON.stringify(postArgs);
        }
        catch (e) {
            self.log("JSON stringify Has Error ==>", e);

            //需要传输的参数不是一个对象,抛出异常
            throw e;
        }
        self.log("postDataStr===>", postDataStr);
        fetch(
            requestUrl,
            {
                method: "POST",
                headers: requestHeader,
                body: postDataStr,
            })
            .then(response => {
                self.log("request fetch response ==>", response);
                //转换为JSON类型,然后输出:
                return response.json();
            })
            .then(responseJson => {
                //收到JSON数据,执行回调处理函数:
                //判断执行自定义回调函数还是默认回调函数
                self.log("in response json data===>", responseJson);
                if (beforeDoDefaultCallBack) {
                    //如果调用指定了回调函数,则使用自定义的回调函数
                    self.log("has new callback do new callback");
                    if (self.defaultCallback) {
                        return self.defaultCallback(responseJson, callback);
                    }
                    return callback(responseJson);
                }
                else {
                    self.log("not has new callback do default callback");
                    return callback(responseJson);
                }
            })
    }

    //将对象进行URIComponent处理
    encodeObject(sourceObj) {
        var objStr = JSON.stringify(sourceObj);
        return encodeURIComponent(objStr);
    }

    /**
     * 修改对象中的值:
     * @param changeObj 要修改的对象
     * @param changeKey 要替换的Key
     * @param newValue 被替换的值
     */
    changeObjectValue({changeObj,changeKey,newValue}) {
        let found = false;
        for (let item in changeObj) {
            //如果key相同,则进行替换:
            if (item.toUpperCase() === changeKey.toUpperCase()) {
                found = true;
                //如果用户设定了自己的content-type,删除该类型,添加新的类型:
                delete changeObj[item];
                changeObj[changeKey] = newValue;
                break;
            }
        }
        if (!found) {
            //如果找到了该属性,则不添加
            //如果没找到该属性,则添加该属性
            changeObj[changeKey] = newValue;
        }
    }

    /**
     * 合并两个对象中的值,但不改变两个对象本身
     * 如遇相同项,则新对象中的值会代替旧对象中的值
     * @param oldObj 原来的对象
     * @param newObj 新的对象
     * @returns {{}} 包含新对象和旧对象全部Key
     */
    mergeObject({oldObj,newObj}) {
        this.log("in mergeObject===>", arguments);
        let partyObj = {};
        //复制一个oldObj对象到第三方对象中去:
        Object.assign(partyObj, oldObj, {});

        for (let newObjItem in newObj) {
            if (newObj.hasOwnProperty(newObjItem)) {
                partyObj[newObjItem] = newObj[newObjItem];
            }
        }
        this.log("out mergeObject===>", partyObj);
        return partyObj;
    }



    //打印日志:
    log() {
        if (this.isPrintLog) {
            console.log(...arguments);
        }
    }
}

export default  requestUtils;