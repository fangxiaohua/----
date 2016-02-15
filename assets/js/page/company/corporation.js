//@author:fangxiaohua
//@邮箱：abc2710712@qq.com
//@qq:1295168875
// 2014年10月27日 下午2:03:16 
//加载jqgrid相关依赖js包
	ace.load_ajax_scripts([
	], function() {
		var corporation={
				//页面初始化
				init:function(){
					//数据列表
					corporation.jqgird_corlist();
				},
				grid_selector : "#cor-grid-table",
				pager_selector : "#cor-grid-pager",
				//数据列表
				jqgird_corlist:function(){

					//jqgrid宽度自适应//jqgrid宽度自适应
					yl_tools.jqGrid_autowidth(corporation.grid_selector);
					//jqgrid相关配置
					$(corporation.grid_selector).jqGrid({
						ajaxGridOptions : {
							timeout : 500000  //设置ajax加载超时时间
						},
						url : "/corporation/getCorList", //这是Action的请求地址   
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
						caption:"公司管里",//表格标题
						//重置默认json解析参数
						jsonReader:{ 
							root:"records", // json中代表实际模型数据的入口  
							page:"currentpage", // json中代表当前页码的数据  
							total:"totalpage", // json中代表页码总数的数据  
							records:"totalrecord",  // json中代表数据行总数的数据  
							repeatitems:false    // 如果设为false，则jqGrid在解析json时，会根据name来搜索对应的数据元素（即可以json中元素可以不按顺序）；而所使用的name是来自于colModel中的name设定。  
		
						},
						colNames:['ID','公司全程','简称','邮件后缀','是否可用','是否认证','发布的岗位数','操作'],
						colModel:[
							{name:'id',index:'id', width:0, sorttype:"int",hidden:true,search:false,sortable:false,editable:false,align:"center",key:true}, 
							//公司全称
							{name:'cor_name',index:'cor_name',width:150, editable:false, viewable:true},
							//公司简称
							{name:'full_name',index:'full_name', width:100},
							//邮箱后缀
							{name:'domain_name',index:'domain_name', width:80,
								formatter:function(cellvalue,options,rowObject){
									return "@"+cellvalue;
								}	
							},
							//是否可用
							{name:'status',index:'status',width:40,align:"center",sortable:false,
								editable: true,edittype:"checkbox",editoptions: {value:"是:否"},unformat: aceSwitch,
							},
							//是否认证
							{name:'rz',index:'rz',width:40,align:"center",sortable:false,
								editable: true,edittype:"checkbox",editoptions: {value:"是:否"},unformat: aceSwitch,
								formatter:function(cellvalue,options,rowObject){
									return "是";
								}
							},
							//发布的岗位数
							{name:'jobnum',index:'jobnum', width:40,sortable:false},
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
						rowNum:10, //每页显示记录数  
						rowList:[10,20,50,100], //可调整每页显示的记录数
						pager : corporation.pager_selector, //分页工具栏  
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
									
									var datalist = data.records;
									//密码重置按钮处理
									for(var i in datalist){
										$("#jEditButton_"+datalist[i].id+"").after("&nbsp;"+yl_tools.jqGrid_viewbtnstr("cor"));
									}
									//条件查询
									$(".jqGrid_viewbtnstrcor").off("click.cor").on("click.cor",function(){
										yl_tips.success("跳往公司详情");
									});
							}, 0);
						},
						//编辑保存路径
						editurl: "/corporation/updateCor"
					});
					//trigger window resize to make the grid get the correct size
					$(window).triggerHandler('resize.jqGrid');
		
					//分页工具栏设置
					jQuery(corporation.grid_selector).jqGrid('navGrid',corporation.pager_selector,
						{ 	//navbar options
							edit: true,
							editicon : 'ace-icon fa fa-pencil blue',
							add: false,
							addicon : 'ace-icon fa fa-plus-circle purple',
							del: false,
							delicon : 'ace-icon fa fa-trash-o red',
							search: false,
							searchicon : 'ace-icon fa fa-search orange',
							refresh: true,
							refreshicon : 'ace-icon fa fa-refresh green',
							view: false,
							viewicon : 'ace-icon fa fa-search-plus grey',
						},
						{
							//edit record form
							//closeAfterEdit: true,
							//width: 700,
							top : 100,  //位置
		 					left: 200, //位置
							recreateForm: true,
							beforeShowForm : function(e) {
								var form = $(e[0]);
								yl_tools.jqGrid_style_edit_form(form);
							}
						},{},{},{},{}
					);
					$(document).on('ajaxloadstart', function(e) {
						$(corporation.grid_selector).jqGrid('GridUnload');
						$('.ui-jqdialog').remove();
					});
					
					//条件查询
					$("#cor-search-btn").off("click.cor").on("click.cor",function(){
						$(corporation.grid_selector).jqGrid('setGridParam',{page:1,	postData:{q:$("#cor-search-input").val().trim()}}).trigger('reloadGrid');
					});
					
					//回车条件查询
					 $('#cor-search-input').bind('keypress',function(event){
				            if(event.keyCode == "13")  {
				            	$(corporation.grid_selector).jqGrid('setGridParam',{page:1,	postData:{q:$("#cor-search-input").val().trim()}}).trigger('reloadGrid');
				            }
				      });
					 
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
				}
		};
		corporation.init();
});