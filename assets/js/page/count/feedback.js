//@author:fangxiaohua
//@邮箱：abc2710712@qq.com
//@qq:1295168875
// 2014年10月27日 下午2:03:16 
//加载jqgrid相关依赖js包
	ace.load_ajax_scripts([
	                      null
	        ], function() {
		var feedback={
				//页面初始化
				init:function(){
					//意见反馈列表加载
					this.jqgird_feedbackList();
					//查看弹窗回调函数
					this.beforeViewModelshowCallback();
					//标记已读
					this.flagRead();
				},
				grid_selector :"#feedback-grid-table",
				pager_selector:"#feedback-grid-pager",
				//jqgird列表
				jqgird_feedbackList:function(){
					//jqgrid宽度自适应//jqgrid宽度自适应
					yl_tools.jqGrid_autowidth(feedback.grid_selector);
					//jqgrid相关配置
					jQuery(feedback.grid_selector).jqGrid({
						ajaxGridOptions : {
							timeout : 500000  //设置ajax加载超时时间
						},
						url : "/feedback/getFeedBackList", //这是Action的请求地址   
						//重置默认 请求参数
						prmNames:{
							 page:"pageNo",    // 表示请求页码的参数名称  
							 rows:"pageSize"    // 表示请求行数的参数名称
						}, 
						postData:{//条件查询后台传值
							q:""
						},
						datatype : "json", //将这里改为使用JSON数据   
						mtype : "POST", //提交类型
						height: 250,
						caption:"用户反馈",//表格标题
						emptyrecords:"无匹配结果",//对查询条数为0时显示的 
						//重置默认json解析参数
						jsonReader:{ 
							root:"records", // json中代表实际模型数据的入口  
							page:"currentpage", // json中代表当前页码的数据  
							total:"totalpage", // json中代表页码总数的数据  
							records:"totalrecord",  // json中代表数据行总数的数据  
							repeatitems:false    // 如果设为false，则jqGrid在解析json时，会根据name来搜索对应的数据元素（即可以json中元素可以不按顺序）；而所使用的name是来自于colModel中的name设定。  
						},
						colNames:['ID','意见内容','联系方式','提交时间','状态','操作'],
						colModel:[
						     //主键ID
							{name:'id',index:'id', width:0, sorttype:"int", 
								hidden:true,search:false,sortable:false,editable:false,align:"center",key:true
							},
							//意见内容
							{name:'content',index:'content',width:200, editable:false},
							//联系方式
							{name:'contact',index:'contact',width:60 ,editable:false, viewable:true,editrules:{edithidden:true},
							      formatter:function(cellvalue,options,rowObject){
							       return cellvalue==null?"":cellvalue;
							      },
							},
							//提交时间
							{name:'submit_time',index:'submit_time', width:60,editable:false},
							//阅读状态
							{name:'status',index:'status', width:60, editable:false, viewable:true,editrules:{edithidden:true},
							      formatter:function(cellvalue,options,rowObject){
							    	  return cellvalue==1?"已读":"未读";
							      },
							},
							//操作
							{name:'myac',index:'', width:60, fixed:true, sortable:false, resize:false,viewable:false,
								formatter:function(cellvalue,options,rowObject){
									return '<div style="margin-left:8px;">'+yl_tools.jqGrid_viewbtnstr("ygxinit")+'</div>';
								}
							}
						], 
						viewrecords : true, //是否显示行数
						rowNum:10, //每页显示记录数  
						rowList:[10,20,50,100], //可调整每页显示的记录数
						pager : feedback.pager_selector, //分页工具栏  
						altRows: true,
						//toppager: true,
						rownumbers:true,//添加左侧行号
						//jqgrid加载完成后执行
						loadComplete : function() {
							var table = this;
							setTimeout(function(){
								//替换jqgrid中的分页按钮图标
								yl_tools.jqGrid_updatePagerIcons(table);
								//更换导航栏中的行为图标
								yl_tools.jqGrid_updateActionIcons(table);
								//更换选择框的样式
								yl_tools.jqGrid_styleCheckbox(table);
								
								enableTooltips(table);
							}, 0);
						}
					});
					//trigger window resize to make the grid get the correct size
					$(window).triggerHandler('resize.jqGrid');
		
					$(document).on('ajaxloadstart', function(e) {
						$(feedback.grid_selector).jqGrid('GridUnload');
						$('.ui-jqdialog').remove();
					});
					
					//条件查询
					$("#search_btn").on("click",function(){
						$(feedback.grid_selector).jqGrid('setGridParam',{page:1,	postData:{q:$("#search").val().trim()}}).trigger('reloadGrid');
					});
					//回车条件查询
					 $("#search").keypress( function(e) {
						   if(e.keyCode == 13)    
				            {
				            	$("#search_btn").trigger('click');
				            }
					 });
					 function enableTooltips(table) {
							$('.navtable .ui-pg-button').tooltip({container:'body'});
							$(table).find('.ui-pg-div').tooltip({container:'body'});
					}
				},
				//查看弹窗回调函数
				beforeViewModelshowCallback:function(){
					$('#view-modal-form').on('shown.bs.modal', function () {
						var id = $(feedback.grid_selector).jqGrid('getGridParam','selrow');
						var rowDatas = $(feedback.grid_selector).jqGrid('getRowData', id);
							$("#feedback-content").html(rowDatas["content"]);
							$("#feedback-contact").html(rowDatas["contact"]);
							$("#feedback-save-btn").attr("data-id",rowDatas["id"]);
							if(rowDatas["status"]=="已读"){
									$("#feedback-save-btn").attr("disabled","disabled").text("已读");
							}else{
								$("#feedback-save-btn").removeAttr("disabled").text("标记已读");
							}
					});
				},
				//标记已读
				flagRead:function(){
					$("#feedback-save-btn").off("click.feedback").on("click.feedback",function(){
						$.ajax({
							type : 'GET',
							cache : false,
							url : '/feedback/flagRead',
							datatype:"script",
							data :{
								id:	$("#feedback-save-btn").attr("data-id")
							},
							error : function(request) {
								alert("服务器响应错误，操作失败！");
								return false;
							},
							success : function(data) {
									if(data==1){
										$("#feedback-save-btn").attr("disabled","disabled").text("已读");
										$(feedback.grid_selector).jqGrid('setGridParam',{page:1,	postData:{q:$("#search").val().trim()}}).trigger('reloadGrid');
									}
							}
						});
					})
				}
		};
		//初始化页面
		feedback.init();
});