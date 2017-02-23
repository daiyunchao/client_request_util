> 客户端fetch的工具类

> 该类是对fetch的一个包装,让fetch使用的更方便,目前暂时只支持application/json的POST请求,后续会添加上去

#### 使用
> 安装:

```
npm i client_request_util

```

> 测试: 可打开test.html 查看测试(注:测试中的配置为开发者局域网的地址),测试结果可f12 console中查看

#### 使用:

```
//配置:
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

//调用:
import requestUtils from 'client_request_util';
var requestObj=new requestUtils({
    hostName: requestConfig.hostName,
    urlPrefix: requestConfig.urlPrefix,
    defaultHeader: requestConfig.defaultHeader,
    defaultAddParams: requestConfig.defaultAddParams,
    isPrintLog: requestConfig.isPrintLog,
    defaultCallback: requestConfig.defaultCallback
});


//执行Request请求:
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

```
#### 参数说明:

> 实例化参数:(实例化时传入的参数为后面的请求提供默认值)

参数名 | 含义 | 例子 | 默认值 |
---|---|---|---
hostName | 访问主机 | http://192.168.1.69 | "" 
urlPrefix | 请求时的URL前缀 | "/post" | "" 
defaultHeader | 默认请求头 | {} | {} 
defaultAddParams | 默认在请求时添加的参数 | {} | {}  
isPrintLog | 是否打印日志 | true | true 
defaultCallback | 当执行完fetch请求后的回调事件 | 函数 | null

> postByApplicationJson方法:请求时的参数:

参数名 | 含义 | 例子 | 默认值 |
---|---|---|---
postURL | 请求的URL | "/getUserDetail" | "" 
isCompleteUrl | postURL是否为完整的URL,如果值为false,则请求的URL构建成:hostName+urlPrefix+postURL ,如果值为true,则请求的URL为postURL | false | "" 
newHeader | 如果此次请求,不想使用初始化传入的请求头,则可传入该参数 | null | null 
addDefaultHeader | 是否添加默认请求头,如果值为true,请求头的值为:旧的请求头+新的请求头 ,如果值为false,则请求头为newHeader或是defaultHeader的一个(如果addDefaultHeader有值则为addDefaultHeader,反之亦然) | false | false  
postArgs | 请求时候的参数 | {"noticeId":"123"} | {} 
addDefaultArgs | 是否添加默认参数,如果值为true,则请求时参数为postArgs+defaultAddParams,如果值为false,则请求时参数为:postArgs | true | true
callback | 回调函数,fetch执行完成后的回调函数 | 函数 | 空函数
beforeDoDefaultCallBack | 在执行callback前是否要执行:defaultCallback | true | true
