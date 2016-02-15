/**
 * @author:fangxiaohua
*  @邮箱：abc2710712@qq.com
*  @qq:1295168875
*   举报审核
*/	
ace.load_ajax_scripts([
					"js/page/commons/chatLib.js",
					"js/page/commons/DateUtil.js",
					"js/page/commons/zTool.js",
					"http://localhost:9090/socket.io/socket.io.js",
					"js/jquery.inputlimiter.1.3.1.min.js"
	 ], function() {
				var HOST = chatLib.HOST;
				var EVENT_TYPE = chatLib.EVENT_TYPE;
				var PORT = chatLib.PORT;
				var socket=null;
				var onlineUserMap = new zTool.SimpleMap();
				var fromUser = null;
				var toUser = "all";
				var currentRoom=null;
	
	
				 $(window).keydown(function(e){
						if(e.keyCode == 116)
						{
							if(!confirm("刷新可能丢失链接数据所有数据情况，确定要刷新么？"))
							{
								e.preventDefault();
							}
						}
				  });
	
	
		var chat_room_tpl={
				online_user:[
				             			'<div id="online-users">',
				         				'{@each_ as item,key}',
										'<div class="profile-activity clearfix">',
										'	<div>',
										'		<img class="pull-left" alt="${item.user.account}" title="${item.user.account}"  src="${item.user.avatar}">',
										'		<a class="user" > ${item.user.name} </a>',
										'		({@if item.user.sex==1}<font color="green">帅锅</font>{@/if}{@if item.user.sex==0}<font color="pink">美铝</font>{@/if}) ',
										'		<br/>',
										'		<a>${item.user.roleName}</a>',
										'',
										'		<div class="time">',
										'			<i class="ace-icon fa fa-clock-o bigger-110"></i>',
										'			${item.time}',
										'		</div>',
										'	</div>',
										'',
										'	<div class="tools action-buttons" data-uId="${item.user.id}">',
										'		<a href="#chat-user-modal-form" role="button" data-toggle="modal" class="blue" title="私聊" data-uId="${item.user.id}" data-account="${item.user.account}">',
										'			<i class="ace-icon fa  fa-comments-o bigger-125"></i>',
										'		</a>',
										'',
										'		<a href="#report-user-modal-form" role="button" data-toggle="modal" class="red" title="举报" data-uId="${item.user.id}" data-account="${item.user.account}">',
										'			<i class="ace-icon fa fa-external-link bigger-125"></i>',
										'		</a>',
										'	</div>',
										'</div>',
										'{@/each}',
										'</div>'
								].join(""),
					chat_text:[
					           			'<div  id="conversation">',
					           			'{@each_ as item,key}',
										'<div class="itemdiv dialogdiv">',
										'<div class="user">',
										'	<img alt="Alexa" src="/avatars/avatar1.png" />',
										'</div>',
										'',
										'<div class="body">',
										'	<div class="time">',
										'		<i class="ace-icon fa fa-clock-o"></i>',
										'		<span class="green">4 sec</span>',
										'	</div>',
										'',
										'	<div class="name">',
										'		<a href="#">Alexa</a>',
										'	</div>',
										'	<div class="text">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque commodo massa sed ipsum porttitor facilisis.</div>',
										'',
										'	<div class="tools">',
										'		<a href="#" class="btn btn-minier btn-info">',
										'			<i class="icon-only ace-icon fa fa-share"></i>',
										'		</a>',
										'	</div>',
										'</div>',
										'</div>',
										'{@/each}',
										'</div>'
					 ].join("")
		};
	
	
	
	
	
	
	
	
	
	
	
	
			var chatroom={
					init:function(){
						$('#conversation-scoll').ace_scroll({
							size: 600
					    });
						this.sendMessage();
						this.switchChatRoom();
						this.leaveChatRoom();
						this.beforeModelshowCallback();
					},
					//在线用户列表处理
					onlineUser:function(){
							var data=onlineUserMap.values();
							$("#online-users").remove();
							$("#online-users-div").html(juicer(chat_room_tpl.online_user,data));
							$(".action-buttons").each(function(i,e){
									var uId=$(e).attr("data-uId");
									if(uId==fromUser.user.id){
										$(e).remove();
									}
							});
							$('#online-users').ace_scroll({
								size:480,
								mouseWheelLock: true,
								alwaysVisible : true
							});
					},
					sendMessage:function(){
						$("#message-send-btn").off("click.chatroom").on("click.chatroom",function(){
							 var reqData = JSON.stringify({
						            'event' : EVENT_TYPE.SPEAK,
						            'uid' : fromUser.uid,
						            "roomTab":currentRoom
						        });
						        socket.emit('message',reqData);
						});
						$("#message-input").keyup(function(event) {
							if (13 == event.keyCode) {
								$("#message-send-btn").trigger("click");
							}
						});
					},
					switchChatRoom:function(){
						$("a.switch-chat-room").off("click.chatroom").on("click.chatroom",function(e){
								var roomTab=$(e.currentTarget).data("tab");
								$("#switch-chat-room-div").addClass("hide");
								$("#chat-room-main-div").removeClass("hide");
								$("#chat-room-title").html($(e.currentTarget).find(".chat-room-title").html());
								var user=$("#session-user").val()
								user=JSON.parse(user);
								var option={
										"roomTab":roomTab,
										"user":user
								};
								chatroom.initChatRoom(option);
						});
					},
					//离开房间
					leaveChatRoom:function(){
						$("#leave-chat-room").off("click.chatroom").on("click.chatroom",function(){
							$("#chat-room-main-div").addClass("hide");
							$("#switch-chat-room-div").removeClass("hide");
							 var reqData = JSON.stringify({
						            'event' : EVENT_TYPE.LOGOUT,
						            'uid' : fromUser.uid,
						            "roomTab":currentRoom
						        });
						        socket.emit('message',reqData);
						});
					},
					//初始化用户当前信息
					 clearCurrentData:function(){
						 console.log("======clearCurrentData======");
						onlineUserMap=new zTool.SimpleMap();
						fromUser = null;
						currentRoom=null;
						if (socket) {
							socket.close();
						}
						socket=null;
						$("#online-users").remove();
						$("#conversation-div").empty();
						
					},
					//弹窗回调函数
					beforeModelshowCallback:function(){
						$('#report-user-modal-form').on('show.bs.modal', function (e) {
								var uId=$(e.relatedTarget).attr("data-uId");
								var account=$(e.relatedTarget).attr("data-account");
								$("#report-user-modal-form").find("i.title-account").html(account);
								$("#add-report-save-btn").attr("data-uId",uId);
						});
						//文本框字数限制
						$('textarea.limited').inputlimiter({
							remText: '%n 字符 %s 剩余...',
							limitText: '最大允许字符数 : %n.'
						});
						//举报
						$("#add-report-save-btn").off("click").on("click",function(){
							var reason=$("#report-user-modal-form").find("textarea").val();
							if(yl_tools.isEmpty(reason)){
								yl_tips.error("举报理由不可为空!");
								return false;
							}
							yl_ajaxAction.ajax_add({
							  			addActionUrl:"/verify/add",
							  			addActionParams:{
							  					uId:$("#add-report-save-btn").attr("data-uId"),
							  					reason:reason
							  			},
							  			addReponseFun:function(data){
							  					if(data){
							  						yl_tips.success("举报成功!");
							  						$("#add-report-cancel-btn").trigger("click");
							  					}
							  			}
								 });
						});
						//私聊弹窗
						$('#chat-user-modal-form').on('show.bs.modal', function (e) {
							   $(e.relatedTarget)
						});
					},
					//播放声音
					play_ring:function(url){
						if($("#ring")[0]){
							$("#ring").remove();
						}
						var embed = '<embed id="ring" src="'+url+'" loop="0" autostart="true" hidden="true" style="height:0px; width:0px;0px;"></embed>';
						$("#ring").html(embed);
					}
			};
			chatroom.init();
			
				
			
			var msg_tpl={
					join_message_tpl:[
											'<div class="itemdiv dialogdiv">',
											'<div class="user">',
											'	<img alt="Alexa" src="/avatars/avatar-sys.jpg" alt="系统"  title="系统" />',
											'</div>',
											'',
											'<div class="body">',
											'	<div class="time">',
											'		<i class="ace-icon fa fa-clock-o"></i>',
											'		<span class="green">${time}</span>',
											'	</div>',
											'',
											'	<div class="name">',
											'		<a>系统消息</a>',
											'	</div>',
											'	<div class="text">欢迎&nbsp; {@if user.sex==1}<font color="green">帅锅</font>{@/if}{@if user.sex==0}<font color="pink">美铝</font>{@/if}&nbsp;<font color="blue">${user.name}</font>&nbsp;加入房间</div>',
											'',
											'</div>',
											'</div>'
					                  ].join(""),
					                  //退出消息模板
					                  leave_message_tpl:[
														'<div class="itemdiv dialogdiv">',
														'<div class="user">',
														'	<img alt="Alexa" src="/avatars/avatar-sys.jpg" alt="系统"  title="系统" />',
														'</div>',
														'',
														'<div class="body">',
														'	<div class="time">',
														'		<i class="ace-icon fa fa-clock-o"></i>',
														'		<span class="green">${time}</span>',
														'	</div>',
														'',
														'	<div class="name">',
														'		<a>系统消息</a>',
														'	</div>',
														'	<div class="text">送别&nbsp; {@if user.sex==1}<font color="green">帅锅</font>{@/if}{@if user.sex==0}<font color="pink">美铝</font>{@/if}&nbsp;<font color="blue">${user.name}</font>&nbsp;离开房间</div>',
														'',
														'</div>',
														'</div>'
								                  ].join(""),
								                  //历史消息模板
								                  history_message_tpl:[
							                            '{@each_ as item,key}',
														'<div class="itemdiv dialogdiv">',
														'<div class="user">',
														'	<img alt="Alexa" src="/avatars/avatar-sys.jpg" alt="系统"  title="系统" />',
														'</div>',
														'',
														'<div class="body">',
														'	<div class="time">',
														'		<i class="ace-icon fa fa-clock-o"></i>',
														'		<span class="green">${time}</span>',
														'	</div>',
														'',
														'	<div class="name">',
														'		<a>系统消息</a>',
														'	</div>',
														'	<div class="text">送别&nbsp; {@if user.sex==1}<font color="green">帅锅</font>{@/if}{@if user.sex==0}<font color="pink">美铝</font>{@/if}&nbsp;<font color="blue">${user.name}</font>&nbsp;离开房间</div>',
														'',
														'</div>',
														'</div>',
														'{@/each}',
									              ].join("")
					
			};
			
			
			var msg_deal={
					join_message:function(join_user){
						console.log("=====加入房间======");
						console.log(join_user);
						console.log("===================");
						$("#conversation-div").append(juicer(msg_tpl.join_message_tpl,join_user));
						chatroom.play_ring("/ring/online.wav");
					},
					leave_message:function(leave_user){
						console.log("=====离开房间======");
						console.log(leave_user);
						console.log("==================");
						$("#conversation-div").append(juicer(msg_tpl.leave_message_tpl,leave_user));
						chatroom.play_ring("/ring/online.wav");
					},
					history_message:function(history_data){
						console.log("=====历史消息======");
						console.log(history_data);
						if(history_data.length){
							$("#conversation-div").append(juicer(msg_tpl.history_message_tpl,history_data));
						}
						console.log("==================");
					},
					chat_message:function(chat_data){
						console.log("=====聊天消息======");
						console.log(chat_data);
						console.log("==================");
						$("#conversation").remove();
						$("#conversation-div").html(juicer(chat_room_tpl.chat_text,data));
						$('#conversation').ace_scroll({
							size:400,
							mouseWheelLock: true,
							alwaysVisible : true
						});
					}
				
					
					
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
			
			
			
			
			
			
			
			
			chatroom.initChatRoom=function(args){

				console.log("==================");
				console.log("====初始化房间======");
				console.log(socket);
				console.log("==================");
				currentRoom=args.roomTab;
				fromUser =args.user;
				
				if (socket) {
					socket.close();
				}
				socket=null;
				 socket = io.connect('http://'+HOST+':'+PORT+'');//socket连接
				 
			       //用户连接成功后执行
			        socket.on('connect', function () {
			        	console.log(socket+"连接成功!");
			        	//向服务端发送消息
			            socket.emit('message', JSON.stringify({
			                'event' : EVENT_TYPE.LOGIN,
			                'user' : fromUser,
			                "time":new Date().format("hh:mm:ss"), 
			                'roomTab':currentRoom
			            }));
			        });
			        
			        
			        //更新在线用户统计
			        socket.on('update_userno',function(data){
			        	console.log(data);
			        	$("#room1-user-no").html(data.no1);
			        	$("#room2-user-no").html(data.no2);
			        	$("#room3-user-no").html(data.no3);
			        	$("#room4-user-no").html(data.no4);
			        });
			        
			        
			        
			        
			        
			        
			        
			        
			        
			        
			        
			        
			        
			        
			        
			        
			        
			        //监听服务器端发回来的消息
			        socket.on("message",function(message){
			            var mData = JSON.parse(message);
				            if (!mData ||!mData.roomTab||!mData.event) {
				            	return false;
				            }
				            console.log(mData.roomTab+"=================");
			            	 //判断是否是本房间的消息
			            	if(currentRoom!=mData.roomTab){
			            		return false;
			            	}
			            	//判断服务器端发回来的消息类型
			                switch (mData.event) {
			                    case EVENT_TYPE.LOGIN: // 新用户连接
			                        var join_uid = mData.nUser;//新用户信息
			                        //获得所有在线用户
			                        var users = mData.users;//用户信息列表
			                        //更新用户列表
			                        //把服务端返回的用户列表放到本地缓存中
			                        onlineUserMap.clear();
		                            for ( var i=0;i<users.length;i++) {
		                            	onlineUserMap.put(users[i].uid, users[i]);
		                            	if(fromUser.id==users[i].user.id){
		                            		fromUser=users[i];
		                            	}
		                            }
		                            //历史消息
		                            msg_deal. history_message(mData.historyContent);
		                            //在线用户
			                        chatroom.onlineUser();
			                        //添加系统欢迎词
			                        msg_deal.join_message(onlineUserMap.get(join_uid));
			                        
			                        break;
			                    case EVENT_TYPE.LOGOUT: // 用户退出
			                        var uid = mData.uid;
			                        //消息
			                        msg_deal.leave_message(onlineUserMap.get(uid));
			                        //更新用户列表
			                        console.log(fromUser.uid==uid);
			                        if(fromUser.uid==uid){
			                        	chatroom.clearCurrentData();
			                        }else{
			                        	onlineUserMap.remove(uid);
				                        chatroom.onlineUser();
			                        }
			                        break;
			                    case EVENT_TYPE.SPEAK: // 用户发言
			                        var content = mData.values[0];
			                        msg_deal.chat_message(content);
			                        break;
			
			                    case EVENT_TYPE.ERROR: // 出错了
			                        appendMessage("[系统繁忙...]");
			                        break;
			                    default:
			                        break;
			                }
			        });
			        
			        socket.on("error",function(){
			            appendMessage("[网络出错啦，请稍后重试...]");
			        });
			
			
			        socket.on("close",function(){
			            appendMessage("[网络连接已被关闭...]");
			            close();
			        });
			}

		
});

