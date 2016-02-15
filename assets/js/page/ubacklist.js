//@author:fangxiaohua
//@邮箱：abc2710712@qq.com
//@qq:1295168875
// 2014年10月27日 下午2:03:16 
//加载jqgrid相关依赖js包
	ace.load_ajax_scripts([
	                       	"/js/jquery.inputlimiter.1.3.1.min.js"
	], function() {
		void(function($){
			var resumeDict={
					//页面初始化
					init:function(){
						$('#resume-tab a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
							$("#search").val("");
							var divId=$(e.target).attr("href");
							switch(divId){
									case "#resume-sch-exp":{
										resumeDict.jqgird_dictList({
											divId:"#resume-sch-exp",
											url:"/ubacklist/list",
											tilte:"账号禁言列表",
											colNames:['ID','被禁言账号','禁言原因','操作'],
											data:{
												status:2,
												q:""
											}
										});
										//初始化添加页面
										initAddResumePage({
											title:"设置账号禁言",
											status:"2"
										});
										break;
									}
									case "#resume-degree-grade":{
										resumeDict.jqgird_dictList({
											divId:"#resume-degree-grade",
											url:"/ubacklist/list",
											tilte:"账号禁用列表",
											colNames:['ID','被禁用账号','禁用原因','操作'],
											data:{
												status:0,
												q:""
											}
										});
										//初始化添加页面
										initAddResumePage({
											title:"设置账号禁用",
											status:"0"
										});
										break;
									}
									default:{
										break;
									}
							}
						});
						//数据列表
						$("#resume-dict-first").trigger("click");
						//初始化添加页面
						 function initAddResumePage(args){
						 		$("#add-dict-button").html('<i class="ace-icon fa fa-hand-o-right green"></i>'+args.title);
						 		$("#add-dict-text").text(args.title);
						 		$("#add-backlist-save-btn").attr("status",args.status);
							 	$("#add-resume-dict-name").val("");
								$("#add-resume-dict-text").text(args.title);
						 }
						 $('textarea.limited').inputlimiter({
								remText: '%n 字符%s 剩余...',
								limitText: '最大字数 : %n.'
							});
						 
						 yl_tools.group_search({
								div:"sch-search-1",
								openbtn:"#add-backlist-account",
								title:"账号查询",
								dafvalue:"",
								url:"/ubacklist/ulist",
								onSelect:function(rowData){
									$("#add-backlist-account").val(rowData.name);
									$("#add-backlist-account").attr("data-id",rowData.id);
								}
							});
						
					},
					//高校学习经历数据列表
					jqgird_dictList:function(args){
						var divId=args.divId;
						 var selector=args.divId+"-grid-table"
						 var grid_url=args.url;
						 var grid_title=args.tilte;
						 var grid_data=args.data;
						 var grid_colNames=args.colNames;
						 var str='<table id="'+divId.split("#")[1]+'-grid-table"></table>	<div id="'+divId.split("#")[1]+'-grid-table-page"></div>';
						 $(divId).empty().html(str)
						setTimeout(function(){
							//jqgrid宽度自适应//jqgrid宽度自适应
							autoWidth(selector);
							//jqgrid相关配置
							$(selector).jqGrid({
								ajaxGridOptions : {
									timeout : 500000  //设置ajax加载超时时间
								},
								url :grid_url, //这是Action的请求地址   
								//重置默认 请求参数
								prmNames:{
									 page:"pageNo",    // 表示请求页码的参数名称  
									 rows:"pageSize"   // 表示请求行数的参数名称
								}, 
								postData:grid_data,
								datatype : "json", //将这里改为使用JSON数据   
								mtype : "POST", //提交类型
								height: 250,
								caption:grid_title,//表格标题
								//重置默认json解析参数
								jsonReader:{ 
									root:"records", // json中代表实际模型数据的入口  
									page:"currentpage", // json中代表当前页码的数据  
									total:"totalpage", // json中代表页码总数的数据  
									records:"totalrecord",  // json中代表数据行总数的数据  
									repeatitems:false    // 如果设为false，则jqGrid在解析json时，会根据name来搜索对应的数据元素（即可以json中元素可以不按顺序）；而所使用的name是来自于colModel中的name设定。  
				
								},
								colNames:grid_colNames,
								colModel:[
									{name:'id',index:'id', width:0, sorttype:"int",hidden:true,search:false,sortable:false,editable:false,align:"center",key:true}, 
									//账号
									{name:'account',index:'account',width:100, editable:false, viewable:true},
									//原因
									{name:'reason',index:'reason',width:150, editable:false, viewable:true},
									//操作
									{name:'myac',index:'', width:120, fixed:true, sortable:false, resize:false, viewable:false,
										formatter:function(cellvalue,options,rowObject){
											var status =rowObject.status;
											//申请信息查看按钮  		  
											 var jqGrid_cancelbtnstr=['<div title="取消黑名单" style="float:left;cursor:pointer;margin-left:5px;" class="ui-pg-div ui-inline-save"  role="button"  onmouseover="jQuery(this).addClass('+"'ui-state-hover'"+');" onmouseout="jQuery(this).removeClass('+"'ui-state-hover'"+');" data-original-title="取消黑名单">',
												 				 		'<span class="ui-icon ace-icon fa-paper-plane-o green cancelbacklist" data-id="${id}" ></span>',
												 		 '</div>'].join(""); 			
											 return '<div style="margin-left:8px;">'+juicer(jqGrid_cancelbtnstr,{"id":rowObject.id})
											 +'</div>';
										}
									}
								], 
								viewrecords : true, //是否显示行数
								rownumbers:true,//添加左侧行号
								rowNum:10, //每页显示记录数  
								rowList:[10,20,50,100], //可调整每页显示的记录数
								pager : selector+"-page", //分页工具栏  
								altRows: true,
								//toppager: true,
								//jqgrid加载完成后执行
								loadComplete : function(data) {
									var table = this;
									setTimeout(function(){
											//替换jqgrid中的分页按钮图标
											yl_tools.jqGrid_updatePagerIcons(table);
											//更换导航栏中的行为图标
											yl_tools.jqGrid_updateActionIcons(table);
											//更换选择框的样式
											yl_tools.jqGrid_styleCheckbox(table);
											
											enableTooltips(table);
											//添加保存预定义
											addDict(selector);
									}, 0);
								},
								//编辑保存路径
								editurl: "/comm/updataDictStatus"
							});
							//trigger window resize to make the grid get the correct size
							$(window).triggerHandler('resize.jqGrid');
				
							$(document).on('ajaxloadstart', function(e) {
								$(selector).jqGrid('GridUnload');
								$('.ui-jqdialog').remove();
							});
							
							//条件查询
							$("#search_btn").off("click.userverify").on("click.userverify",function(){
									$(selector).jqGrid('setGridParam',{page:1,	postData:{q:$("#search").val().trim()}}).trigger('reloadGrid');
							});
							//回车条件查询
							 $('#search_btn').bind('keypress',function(event){
						            if(event.keyCode == "13")    
						            {
						            	$(selector).jqGrid('setGridParam',{page:1,	postData:{q:$("#search").val().trim()}}).trigger('reloadGrid');
						            }
						      });
						},0);
						
							function beforeEditCallback(e) {
								var form = $(e[0]);
								yl_tools.jqGrid_style_edit_form(form);
							}
						
						
							function enableTooltips(table) {
								$('.navtable .ui-pg-button').tooltip({container:'body'});
								$(table).find('.ui-pg-div').tooltip({container:'body'});
							}
							
							//添加父节点，保存
								function addDict(selector){
									//添加页面保存按钮，验证
									$("#add-backlist-save-btn").off("click.resume").on("click.resume",function(){
											//验证成功,ajax保存
											var id=$.trim($("#add-backlist-account").attr("data-id"));
											var reason=$.trim($("#add-backlist-reason").val());
											var status=$("#add-backlist-save-btn").attr("status");
											if(yl_tools.isEmpty(id)){
												yl_tips.error("请选择一个用户账号!");
												return false;
											}
										 	yl_ajaxAction.ajax_add({
									  			addActionUrl:"/ubacklist/add",
									  			addActionParams:{
									  				id:id,
									  				reason:reason,
									  				status:status
									  			},
									  			addReponseFun:function(data){
									  				if(data=="true"){
														$(selector).jqGrid().trigger('reloadGrid');
														yl_tips.success("设置成功！");
														$("#add-backlist-cancel-btn").trigger('click');
													}else{
														yl_tips.error("设置失败！");
													}
									  			}
											 });
									});
									
									
									
									//忽略按钮执行的操作
									$(".cancelbacklist").off("click.userverify").on("click.userverify",function(e){
										var rowId=$(e.target).attr("data-id");
										yl_ajaxAction.ajax_update({
								  			updateActionUrl:"/ubacklist/cancel",
								  			updateActionParams:{
								  				id:rowId,
								  				status:"1"
								  			},
								  			updateReponseFun:function(data){
								  				if(data=="true"){
													$(selector).jqGrid().trigger('reloadGrid');
													yl_tips.success("取消黑名单成功！");
												}else{
													yl_tips.error("取消黑名单失败！");
												}
								  			}
										});
									});
								}	
							function autoWidth(grid_selector){
								$(window).on('resize.jqGrid', function () {
									$(grid_selector).jqGrid( 'setGridWidth', $(".tab-content").width() );
									$(grid_selector).jqGrid( 'setGridHeight', $(window).height()*0.5 );
									
							    });
								//resize on sidebar collapse/expand
								var parent_column = $(grid_selector).closest('[class*="col-"]');
								$(document).on('settings.ace.jqGrid' , function(ev, event_name, collapsed) {
									if( event_name === 'sidebar_collapsed' || event_name === 'main_container_fixed' ) {
										//setTimeout is for webkit only to give time for DOM changes and then redraw!!!
										setTimeout(function() {
											$(grid_selector).jqGrid( 'setGridWidth', parent_column.width() );
										}, 0);
									}
							    });
							}
					}
			}
			resumeDict.init();
		})(jQuery);
});
