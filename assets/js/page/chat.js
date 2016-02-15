	/**
	 * @author:fangxiaohua
	*  @邮箱：abc2710712@qq.com
	*  @qq:1295168875
	*  profile
	*/
	ace.load_ajax_scripts([
	                       "js/page/commons/chatLib.js",
	                       "js/page/commons/DateUtil.js",
	                       "js/page/commons/zTool.js",
	                       "http://localhost:9090/socket.io/socket.io.js"
	], function() {
			
		
					var HOST = chatLib.HOST;
					var EVENT_TYPE = chatLib.EVENT_TYPE;
					var PORT = chatLib.PORT;
					(function($) {
						
							var socket = null;
							var onlineUserMap = new zTool.SimpleMap();
							var currentUser = null;
							var currentUserInfo = null;
						
							if (typeof WebSocket === 'undefined') {
								$("#prePage").hide();
								$("#errorPage").show();
							}
							
							
							
							
							
							$("#open").click(function(event) {
								currentUserInfo = $("#session-user").val();
						
								$("#prePage").hide();
								$("#mainPage").show();
								reset();//重置socket
								function reset() {
									if (socket) {
										socket.close();
									}
									socket = null;
									onlineUserMap = null;
									currentUser = null;
									$("#onlineUsers").html("");
									$("#talkFrame").html("");
									$("#nickInput").val("");
								}
						
						        socket = io.connect('http://'+HOST+':'+PORT+'');//socket连接
						        onlineUserMap = new zTool.SimpleMap();//创建在线用户列表对象
						       //用户连接成功后执行
						        socket.on('connect', function () {
						            socket.emit('message', JSON.stringify({
						                'EVENT' : EVENT_TYPE.LOGIN,
						                'user' : currentUserInfo
						            }));
						        });
						
						        
						        
						        
						        
						        
						        
						        
						        
						        
						        
						        
						        
						        //监听服务器端发回来的消息
						        socket.on("message",function(message){
						            var mData = JSON.parse(message);
						            if (mData && mData.EVENT) {
						            	//判断服务器端发回来的消息类型
						                switch (mData.EVENT) {
						                    case EVENT_TYPE.LOGIN: 
						                    	// 新用户连接
						                        var nuser = mData.nuser;//新用户信息
						                        //获得所有在线用户
						                        var ousers = mData.ousers;//所有已有用户信息ousers
						                        if (ousers && ousers.length) {
						                            var number = ousers.length;//获取已有用户个数
						                            for ( var i=0;i<number;i++) {
						                                onlineUserMap.put(ousers[i].uid, ousers[i]);//把老用户重新放入用户列表中
						                                if (mData.nuser.uid == ousers[i].uid) {
						                                    currentUser = ousers[i];
						                                }
						                            }
						                        }
						                        //获取最近的历史消息
						                        var data = mData.historyContent;
						
						                        if (data && data.length) {
						                            var number = data.length;
						                            for ( var i=0;i<number;i++) {
						                                appendMessage(formatUserTalkHisString(data[i].user, data[i].time));
						                                appendMessage("<span>&nbsp;&nbsp;</span>" + data[i].content);
						                            }
						                            appendMessage("<span class='gray'>==================以上为最近的历史消息==================</span>");
						                        }
						
						
						                        updateOnlineUser();
						                        appendMessage(formatUserTalkString(nuser) + "[进入房间]");
						                        break;
						
						                    case EVENT_TYPE.LOGOUT: // 用户退出
						                        var user = mData.nuser;
						                        onlineUserMap.remove(user.uid);
						                        updateOnlineUser();
						                        appendMessage(formatUserTalkString(user) + "[离开房间]");
						                        break;
						
						                    case EVENT_TYPE.SPEAK: // 用户发言
						                        var content = mData.values[0];
						                        appendMessage(formatUserTalkString(mData.user));
						                        appendMessage("<span>&nbsp;&nbsp;</span>" + content);
						                        break;
						
						                    case EVENT_TYPE.ERROR: // 出错了
						                        appendMessage("[系统繁忙...]");
						                        break;
						
						                    default:
						                        break;
						                }
						
						            }
						
						        });
						
						        socket.on("error",function(){
						            appendMessage("[网络出错啦，请稍后重试...]");
						        });
						
						
						        socket.on("close",function(){
						            appendMessage("[网络连接已被关闭...]");
						            close();
						        });
							});
						
						
							$("#message").keyup(function(event) {
								if (13 == event.keyCode) {
									sendMsg();
								}
							});
							
							
							$("#send").click(function(event) {
								sendMsg();
							});
							
							$("#logout").click(function(event){
						        logout();
						        $("#prePage").show();
						        $("#mainPage").hide();
						    });
							
							
							
							
							
							
							function updateOnlineUser() {
								var html = ["<div>在线用户(" + onlineUserMap.size() + ")</div>"];
								if (onlineUserMap.size() > 0) {
									var users = onlineUserMap.values();
						            var number = users.length;
									for ( var i=0;i<number;i++) {
										html.push("<div>");
										if (users[i].uid == currentUser.uid) {
											html.push("<b>" + formatUserString(users[i]) + "(我)</b>");
										} else {
											html.push(formatUserString(users[i]));
										}
										html.push("</div>");
									}
								}
						
								$("#onlineUsers").html(html.join(''));
							}
						
							function appendMessage(msg) {
								$("#talkFrame").append("<div>" + msg + "</div>");
							}
						
							function formatUserString(user) {
								if (!user) {
									return '';
								}
								return user.user + "<span class='gray'>(" + user.uid + ")</span> ";
							}
						
							function formatUserTalkString(user) {
								return formatUserString(user) + new Date().format("hh:mm:ss") + " ";
							}
						
							function formatUserTalkHisString(user, time) {
								return formatUserString(user) + new Date(time).format("yyyy-MM-dd hh:mm:ss") + " ";
							}
						
							
						
						
							
							
							function sendMsg() {
								var value = $.trim($("#message").val());
								if (value) {
									$("#message").val('');
						            var data = JSON.stringify({
						                'EVENT' : EVENT_TYPE.SPEAK,
						                'values' : [value]
						            });
						            socket.emit('message',data);
								}
							};
						
							
						
							function show(value) {
								$("#response").html(value);
							};
						
						    function logout(){
						        var data = JSON.stringify({
						            'EVENT' : EVENT_TYPE.LOGOUT,
						            'values' : [currentUser]
						        });
						        socket.emit('message',data);
						    }
						    
	})(jQuery);
});
