//@author:fangxiaohua
//@邮箱：abc2710712@qq.com
//@qq:1295168875
// 2014年10月27日 下午2:03:16 
/**
 * 云路的ajax基本增删改查
 * 引包要求1. jquery.js  2.yl.tips.js   4.bootbox.js  5.ajaxfileupload.js
 * 
 **/
void (function($,window){
	//禁用ajax缓存
	$.ajaxSetup ({cache:false});
	var 	yl_ajaxAction={
			/**
			 * del 使用说明
			 * yl_ajaxAction.ajax_del({
			 * 			delConfirmMsgHtml:"<p>您确定删除该条数据</p>",
			 * 			delActionUrl:"#",
			 * 			delActionParams:{
			 * 					a:"1",
			 * 					b:"2"
			 * 			},
			 * 			delReponseFun:function(data){
			 * 				alert("删除成功");
			 * 			}
			 * });
			 */
			ajax_del:function(args){
				
				var delConfirmMsgHtml="您确定删除该条数据",
				delActionUrl="#",
				delActionParams={},
				delReponseFun=function(){}
				
				if(typeof(args.delConfirmMsgHtml)=="string")
					delConfirmMsgHtml=args.delConfirmMsgHtml;
				if(typeof(args.delActionUrl)=="string")
					delActionUrl=args.delActionUrl;
				if(typeof(args.delActionParams)=="object")
					delActionParams=args.delActionParams;
				if(typeof(args.delReponseFun)=="function")
					delReponseFun=args.delReponseFun;
				
				
				bootbox.confirm({
					message:delConfirmMsgHtml, 
					buttons: {
						  confirm: {
							 label: "确定",
							 className: "btn-primary btn-sm",
						  },
						  cancel: {
							 label: "取消",
							 className: "btn-sm",
						  }
					},	
					callback:function(result) {
						if(result){
							var option={
									actionType:"GET",
									actionUrl:delActionUrl,
									reposeType:"script",
									actionParams:delActionParams,
									succFun:function(data){
										delReponseFun(data);
									}
							};
							yl_ajaxAction.ajax_base(option);
						}
					}
				});
			},
			/**
			 * yl_ajaxAction.ajax_update({
			 * 			updateActionUrl:"#",
			 * 			updateActionParams:{
			 * 					a:"1",
			 * 					b:"2"
			 * 			},
			 * 			updateReponseFun:function(data){
			 * 					alert("修改成功");
			 * 			}
			 * 
			 * });
			 */
			ajax_update:function(args){
				
				var updateActionUrl="#",
				updateActionParams={},
				updateReponseFun=function(){};
				
				if(typeof(args.updateActionUrl)=="string")
					updateActionUrl=args.updateActionUrl;
				if(typeof(args.updateActionParams)=="object")
					updateActionParams=args.updateActionParams;
				if(typeof(args.updateReponseFun)=="function")
					updateReponseFun=args.updateReponseFun;
				
				var option={
						actionType:"POST",
						actionUrl:updateActionUrl,
						reposeType:"script",
						actionParams:updateActionParams,
						succFun:function(data){
							updateReponseFun(data);
						}
				};
				yl_ajaxAction.ajax_base(option);
			},
			/**
			 * yl_ajaxAction.ajax_add({
			 * 			addActionUrl:"#",
			 * 			addActionParams:{
			 * 					a:"1",
			 * 					b:"2"
			 * 			},
			 * 			addReponseFun:function(data){
			 * 					alert("修改成功");
			 * 			}
			 * 
			 * });
			 */
			ajax_add:function(args){ 
				
				var addActionUrl="#",
				addActionParams={},
				addReponseFun=function(){};
				
				if(typeof(args.addActionUrl)=="string")
					addActionUrl=args.addActionUrl;
				if(typeof(args.addActionParams)=="object")
					addActionParams=args.addActionParams;
				if(typeof(args.addReponseFun)=="function")
					addReponseFun=args.addReponseFun;
				
				var option={
						actionType:"POST",
						actionUrl:addActionUrl,
						reposeType:"script",
						actionParams:addActionParams,
						succFun:function(data){
							addReponseFun(data);
						}
				};
				yl_ajaxAction.ajax_base(option);
			},
			/**
			 * ajax查询使用，使用方式
			 * yl_ajaxAction.ajax_select({
			 * 			selectActionUrl:"#",
			 * 			selectActionParams:{
			 * 				a:"1",
			 * 				b:"2"
			 * 			},
			 * 			selectRequestType:"POST",
			 * 			selectReponseFun:function(data){
			 * 				alert("===");
			 * 			}
			 * });
			 */
			ajax_select:function(args){
				
				var selectActionUrl="#",
				selectActionParams={},
				selectRequestType="GET",
				selectReponseFun=function(data){};
				
				if(typeof(args.selectActionUrl)=="string")
					selectActionUrl=args.selectActionUrl;
				if(typeof(args.selectActionParams)=="object")
					selectActionParams=args.selectActionParams;
				if(typeof(args.selectReponseFun)=="function")
					selectReponseFun=args.selectReponseFun;
				if(typeof(args.selectRequestType)=="string")
					selectRequestType=args.selectRequestType;
				
				var option={
						actionType:selectRequestType,
						actionUrl:selectActionUrl,
						reposeType:"json",
						actionParams:selectActionParams,
						succFun:function(data){
							selectReponseFun(data);
						}
				};
				yl_ajaxAction.ajax_base(option);
			},
			/**
			 * 基本ajax使用方式
			 * yl_ajaxAction.ajax_base({
			 * 			actionType:"post",
			 * 			actionUrl:"#",
			 * 			isAsync:false,
			 * 			reposeType:"json",
			 * 			actionParams:{
			 * 					a:"1",
			 * 					b:"2"
			 * 			},
			 * 			errorFun:function(request){
			 * 				alert("error");
			 * 			},
			 * 			succFun:function(data){
			 * 				alert(data);
			 * 			}
			 * })
			 */
			ajax_base:function(args){
				var type="get",
				url="#",
				datatype="text",
				data={},
				errorFun=function(request){},
				isAsync=true,
				succFun=function(data){};
				
				if(typeof(args.actionType)=="string")
					type=args.actionType;
				if(typeof(args.actionUrl)=="string")
					url=args.actionUrl;
				if(typeof(args.reposeType)=="string")
					datatype=args.reposeType;
				if(typeof(args.actionParams)=="object")
					data=args.actionParams;
				if(typeof(args.errorFun)=="function")
					errorFun=args.errorFun;
				if(typeof(args.succFun)=="function")
					succFun=args.succFun;
				if(typeof(args.isAsync)=="boolean")
					isAsync=args.isAsync;
				
				$.ajax({
					type : type,
					cache : false,
					url : url,
					async:isAsync,
					datatype:datatype,
					data :data,
					error : function(request) {
						yl_tips.error("操作请求失败，请稍后再试！");
						errorFun(request);
						return false;
					},
					success : function(data) {
						succFun(data);
					}
				});
			},
			/**
			 * ajax 文件上传使用方式
			 * yl_ajaxAction.ajax_upload({
			 * 			btn_selector:"#aaa",
			 * 			fileId:"bbb",
			 * 			preview_selector:"#ccc"
			 * 			beforefileShow:function(){
			 * 				return true;
			 * 			},
			 * 			uploadParams:{
			 * 				fileType:"picture",
			 *				type:"school",
			 *				id:"YL",
			 * 			},
			 * 			uploadUrl:"/comm/fileUpload",
			 * 			uploadStart:function(){
			 * 				alert("aaa");
			 * 			},
			 * 			errorFun:function(){
			 * 				alert("fasdf");	
			 * 			},
			 * 			succFun:function(){
			 * 				alert("ddddd");
			 * 			}
			 * });
			 * btn_selector:上传按钮的选择器
			 * fileId: input type=file 的id 
			 * preview_selector:预览上传后的图片 img  的选择器
			 */
			ajax_upload:function(args){
				
					var btn_selector=args.btn_selector,
					file_selector="#"+args.fileId,
					preview_selector=args.preview_selector,
					data={fileType:"picture",type:"school",id:"YL"},
					url="/comm/fileUpload",
					errorFun=function(data,status,e){},
					beforefileShow=function(){},
					succFun=function(data){},
					uploadStart=function(){};
					
					if(typeof(args.uploadUrl)=="string"){
						url=args.uploadUrl;
					}
					if(typeof(args.uploadParams)=="object"){
						data=args.uploadParams;
					}
					if(typeof(args.errorFun)=="function"){
						errorFun=args.errorFun;
					}
					 if(typeof(args.uploadStart)=="function"){
						 uploadStart=args.uploadStart;
					 }
					 if(typeof(args.succFun)=="function"){
						 succFun=args.succFun;
                	 }
					  if(typeof(args.beforefileShow)=="function"){
						  beforefileShow= args.beforefileShow;
					  }
					
					//禁用默认的回车事件
					 $("body").off("keypress").on('keypress',function(event){
						 if(event.keyCode==13)
			                {
			                    return false;
			                }
					 });
					
					//url构建
					if(data.fileType&&data.type&&data.id){
						if(/\?+/.test(url)){
					    	url += "&fileType="+data.fileType+"&type="+data.type+"&id="+data.id;
					    }else{
					    	url += "?fileType="+data.fileType+"&type="+data.type+"&id="+data.id;
					    }
					}
					 
					$(btn_selector).off("click.yl_ajaxAction").on("click.yl_ajaxAction",function(){	
					    
						beforefileShow();
					   	$(file_selector).trigger("click");
		  
		         	    $(file_selector).change(function(){
		         	    	
		         	    	 if($(file_selector).val() != ""){    
		         	    		uploadStart();
		             	    	 $.ajaxFileUpload({
		                              url:url,            //需要链接到服务器地址
		                              secureuri:false,
		                              type:'POST',
		                              fileElementId:args.fileId,   //文件选择框的id属性
		                              dataType: 'text',
		                              success: function(data){
		                            	  if(data){
		                            		  succFun(data);
					                          $(preview_selector).attr("src",data);
		                            	  }else{
		                            		  yl_tips.error("文件上传失败!");
		                            		  return false;
		                            	  }
		                              },
		                              error: function (data, status, e)            
		                              {		
		                            	  yl_tips.error("操作请求失败，请稍后再试！");
		                            	  errorFun(data,status,e);
		                            	  return false;
		                              }
		                        });
		         	    	 }
		         	    });    
					});
				}
	}
	window['yl_ajaxAction']=yl_ajaxAction;
})(jQuery,window);

	
	
	

