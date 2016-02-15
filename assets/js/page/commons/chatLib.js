/**
 * 自定义模块，常量模块
 */
(function(exports){
	exports.HOST="127.0.0.1";
	exports.PORT="9090";
	exports.EVENT_TYPE={'LOGIN':'LOGIN', 'LOGOUT':'LOGOUT', 'SPEAK':'SPEAK', 'LIST_USER':'LIST_USER', 'ERROR':'ERROR', 'LIST_HISTORY':'LIST_HISTORY'};
	
	
	//消息序列化为json对象
	var analyzeMessageData = exports.analyzeMessageData = function(message) {
		try {
			return JSON.parse(message);
		} catch (error) {
			// 收到了非正常格式的数据
			console.log('method:analyzeMsgData,error:' + error);
		}

		return null;
	}
	
	//用户发送的信息不为空判断
	var getMsgFirstDataValue = exports.getMsgFirstDataValue = function (mData) {
		if (mData && mData.values && mData.values[0]) {
			return mData.values[0];
		}

		return '';
	}

})( (function(){
    if(typeof exports === 'undefined') {
        window.chatLib = {};
        return window.chatLib;
    } else {
        return exports;
    }
})() );