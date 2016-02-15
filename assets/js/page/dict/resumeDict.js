//@author:fangxiaohua
//@邮箱：abc2710712@qq.com
//@qq:1295168875
// 2014年10月27日 下午2:03:16 
//加载jqgrid相关依赖js包
	ace.load_ajax_scripts([
	], function() {
		void(function($){
			var resumeDict={
					//页面初始化
					init:function(){
						$('#resume-tab a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
							var divId=$(e.target).attr("href");
							switch(divId){
									case "#resume-sch-exp":{
										resumeDict.jqgird_dictList({
											divId:"#resume-sch-exp",
											url:"/resumeDict/getSchExpDictList",
											tilte:"学校经历类型",
											colNames:['ID','学校经历','是否可用','排序','操作']
										});
										//初始化添加页面
										initAddResumePage({
											title:"学校经历类型",
											key:$(e.target).attr("data-key"),
										});
										break;
									}
									case "#resume-degree-grade":{
										resumeDict.jqgird_dictList({
											divId:"#resume-degree-grade",
											url:"/resumeDict/getDegreeGradeDictList",
											tilte:"学历等级",
											colNames:['ID','学历等级','是否可用','排序','操作']
										});
										//初始化添加页面
										initAddResumePage({
											title:"学历类型",
											key:$(e.target).attr("data-key"),
										});
										break;
									}
									case "#resume-person-sill":{
										resumeDict.jqgird_dictList({
											divId:"#resume-person-sill",
											url:"/resumeDict/getPersonSkillDictList",
											tilte:"个人技能标签",
											colNames:['ID','技能标签','是否可用','排序','操作']
										});
										//初始化添加页面
										initAddResumePage({
											title:"技能标签",
											key:$(e.target).attr("data-key"),
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
						 		$("#add-dict-button").text("添加"+args.title);
						 		$("#add-dict-text").text("添加"+args.title);
							 	$("#add-resume-dict-name").val("");
								$("#add-resume-dict-text").text(args.title);
								$("#add-resume-dict-edit-key").val(args.key);
						 }
					},
					//高校学习经历数据列表
					jqgird_dictList:function(args){
						var divId=args.divId;
						 var selector=args.divId+"-grid-table"
						 var grid_url=args.url;
						 var grid_title=args.tilte;
						 var grid_colNames=args.colNames;
						 var str='<table id="'+divId.split("#")[1]+'-grid-table"></table>';
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
								postData:{//条件查询后台传值
									q:""
								},
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
								colNames:['ID','字典名称','是否可用','排序','操作'],
								colModel:[
									{name:'id',index:'id', width:0, sorttype:"int",hidden:true,search:false,sortable:false,editable:false,align:"center",key:true}, 
									//类型名称
									{name:'name',index:'name',width:150, editable:false, viewable:true},
									//是否可用
									{name:'status',index:'status',width:40,align:"center",sortable:false,
										editable: true,edittype:"checkbox",editoptions: {value:"是:否"},unformat: aceSwitch,
									},
									//排序
									{name:'sort',index:'', width:150, fixed:true, sortable:false, resize:false,editable:false,
										formatter:function(cellvalue,options,rowObject){
											var records=$("#"+options.gid).getGridParam('records');
											if(records==1){
												return '<div style="margin-left:8px;">'+yl_tools.jqGrid_banbtnstr+yl_tools.jqGrid_banbtnstr+'</div>';
											}else if(rowObject.sort_index==1){
												return '<div style="margin-left:8px;">'+yl_tools.jqGrid_banbtnstr+yl_tools.jqGrid_downbtnstr(divId.split("#")[1]+"-grid-table")+'</div>';
											}else if(records==rowObject.sort_index){
												return '<div style="margin-left:8px;">'+yl_tools.jqGrid_uphbtnstr(divId.split("#")[1]+"-grid-table")+yl_tools.jqGrid_banbtnstr+'</div>';
											}
											return '<div style="margin-left:8px;">'+yl_tools.jqGrid_uphbtnstr(divId.split("#")[1]+"-grid-table")+yl_tools.jqGrid_downbtnstr(divId.split("#")[1]+"-grid-table")+'</div>';
										}
									},
									//操作
									{name:'myac',index:'', width:120, fixed:true, sortable:false, resize:false, viewable:false,
										formatter:'actions', 
										formatoptions:{ 
											keys:true,
											delbutton: false,//disable delete button
											//editformbutton:true, editOptions:{recreateForm: true, beforeShowForm:beforeEditCallback}
										}
									}
								], 
								viewrecords : true, //是否显示行数
								rownumbers:true,//添加左侧行号
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
											//排序
											dictSort(selector);
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
							
							
						},0);
						//将编辑复选框格式化
							function aceSwitch( cellvalue, options, cell ) {
								setTimeout(function(){
									var target=$(cell).find('input[type=checkbox]');
										target.addClass('ace ace-switch ace-switch-5')
										.after('<span class="lbl"></span>');
								}, 0);
							}
						
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
									$("#add-resume-save-btn").off("click.resume").on("click.resume",function(){
											//验证成功,ajax保存
											var name=$.trim($("#add-resume-dict-name").val());
											if(yl_tools.isEmpty(name)){
												yl_tips.error("名称不能为空!");
												return false;
											}
										 	yl_ajaxAction.ajax_add({
									  			addActionUrl:"/comm/addDict",
									  			addActionParams:{
									  				name:name,
													key: $("#add-resume-dict-edit-key").val()
									  			},
									  			addReponseFun:function(data){
									  				if(data==true){
														$(selector).jqGrid().trigger('reloadGrid');
														yl_tips.success("添加成功！");
														$("#add-resume-cancel-btn").trigger('click');
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
							//字典排序
							function dictSort(selector){
									$(".jqGrid_sortbtnstr"+selector.split("#")[1]).off("click."+selector.split("#")[1]).on("click."+selector.split("#")[1],function(e){
												setTimeout(function(){
															var id = $(selector).jqGrid('getGridParam','selrow');
															var sortType=$(e.target).attr("data-oper");
															//验证成功,ajax保存
															
															yl_ajaxAction.ajax_update({
														  			updateActionUrl:'/comm/sortDict',
														  			updateActionParams:{
														  				sortType:sortType,
																		id:id
														  			},
														  			updateReponseFun:function(data){
														  				if(data==true){
														  					yl_tips.success("排序成功!");
																			$(selector).jqGrid().trigger('reloadGrid');
																		}
														 			}
															});
												},0);
									});
							}
					}
			}
			resumeDict.init();
		})(jQuery);
});
