//@author:fangxiaohua
//@邮箱：abc2710712@qq.com
//@qq:1295168875
// 2014年10月27日 下午2:03:16 
//加载jqgrid相关依赖js包
ace.load_ajax_scripts([
                       null
	        ], function() {
				void(function($){
					
					
					
					
					
					
				})(jQuery);
				jQuery(function($) {
					var grid_selector = "#grid-table";
					var pager_selector = "#grid-pager";
					//加载学科分类
					$.ajax({
						type : 'POST',
						cache : false,
						url : '/course/getCatalogList',
						datatype:"json",
						data :{
							q:""
						},
						error : function(request) {
							alert("服务器响应错误，操作失败！");
							return false;
						},
						success : function(data) {
							var catstr="";
							for(var i=0;i<data.length;i++){
								catstr+=data[i].id+":"+data[i].name;
								if(i<data.length-1){
									catstr+=";";
								}
							}
							jqGrid(catstr);
						}	
					});
					
					
					
					function jqGrid(catstr){
						//jqgrid宽度自适应//jqgrid宽度自适应
						yl_tools.jqGrid_autowidth(grid_selector);
						//jqgrid相关配置
						jQuery(grid_selector).jqGrid({
							ajaxGridOptions : {
								timeout : 500000  //设置ajax加载超时时间
							},
							url : "/course/getCourseList", //这是Action的请求地址   
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
							emptyrecords:"无匹配结果",//对查询条数为0时显示的 
							caption:"课程管理",//表格标题
							//重置默认json解析参数
							jsonReader:{ 
								root:"records", // json中代表实际模型数据的入口  
								page:"currentpage", // json中代表当前页码的数据  
								total:"totalpage", // json中代表页码总数的数据  
								records:"totalrecord",  // json中代表数据行总数的数据  
								repeatitems:false    // 如果设为false，则jqGrid在解析json时，会根据name来搜索对应的数据元素（即可以json中元素可以不按顺序）；而所使用的name是来自于colModel中的name设定。  
							},
							colNames:['ID','课程名称','课程编号','教师名称','所属机构', '学科分类','是否显示 ',' '],
							colModel:[
							     //主键ID
								{name:'id',index:'id', width:0, sorttype:"int", 
									hidden:true,search:false,sortable:false,editable:false,align:"center",key:true
								},
								//课程名称
								{name:'name',index:'name',width:90, editable:false},
								//课程编号
								{name:'crs_no',index:'crs_no', width:150,editable:false},
								//教师名称
								{name:'real_name',index:'real_name', width:70, editable: false},
								{name:'sch_name',index:'sch_name',hidden:true, width:0, editable:false, viewable:true,editrules:{edithidden:true},
							           formatter:function(cellvalue,options,rowObject){
							            return cellvalue==null?"":cellvalue;
							           },
							     },
								//所属学科名称
								{name:'cat_name',index:'cat_name', width:90, 
									editable: true,edittype:"select",editoptions:{value:""+catstr}},
								//是否显示状态
								{name:'status',index:'status', width:70, 
									editable: true,edittype:"checkbox",editoptions: {value:"是:否"},unformat: aceSwitch,
									formatter:function(cellvalue,options,rowObject){
									return cellvalue==1?"是":"否";
								}},
								//操作
								{name:'myac',index:'', width:80, fixed:true, sortable:false, resize:false,viewable:false,
									formatter:'actions', 
									formatoptions:{ 
										keys:true,
										delbutton: false,//disable delete button
										
										delOptions:{recreateForm: true, beforeShowForm:beforeDeleteCallback},
										//editformbutton:true, editOptions:{recreateForm: true, beforeShowForm:beforeEditCallback}
									}
								}
							], 
							viewrecords : true, //是否显示行数
							rownumbers:true,//添加左侧行号
							rowNum:10, //每页显示记录数  
							rowList:[1,10,20,50,100], //可调整每页显示的记录数
							pager : pager_selector, //分页工具栏  
							altRows: true,
							//toppager: true,
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
							},
							//编辑保存路径
							editurl: "/course/dataOperal"
						});
						//trigger window resize to make the grid get the correct size
						$(window).triggerHandler('resize.jqGrid');
			
						//分页工具栏设置
						jQuery(grid_selector).jqGrid('navGrid',pager_selector,
							{ 	//navbar options
								edit: true,
								editicon : 'ace-icon fa fa-pencil blue',
								add: false,
								addicon : 'ace-icon fa fa-plus-circle purple',
								del: true,
								delicon : 'ace-icon fa fa-trash-o red',
								search: false,
								searchicon : 'ace-icon fa fa-search orange',
								refresh: true,
								refreshicon : 'ace-icon fa fa-refresh green',
								view: true,
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
							},
							{
								//new record form
								//width: 700,
								top : 100,  //位置
			 					left: 200, //位置
								closeAfterAdd: true,
								recreateForm: true,
								viewPagerButtons: false,
								beforeShowForm : function(e) {
									var form = $(e[0]);
									yl_tools.jqGrid_style_edit_form(form);
								}
							},
							{
								//delete record form
								top : 100,  //位置
			 					left: 200, //位置
								recreateForm: true,
								beforeShowForm : function(e) {
									var form = $(e[0]);
									yl_tools.jqGrid_style_delete_form(form);
								},
								onClick : function(e) {
									alert(1);
								}
							},
							{
								//search form
								top : 100,  //位置
			 					left: 200, //位置
								recreateForm: true,
								afterShowSearch: function(e){
									var form = $(e[0]);
									yl_tools.jqGrid_style_search_form(form);
								},
								afterRedraw: function(){
									yl_tools.jqGrid_style_search_filters($(this));
								}
								,
								multipleSearch: true,
								/**
								multipleGroup:true,
								showQuery: true
								*/
							},
							{
								//view record form
								top : 100,  //位置
			 					left: 200, //位置
								recreateForm: true,
								beforeShowForm: function(e){
									var form = $(e[0]);
									yl_tools.jqGrid_style_view_form(form);
								}
							}
						);
						$(document).on('ajaxloadstart', function(e) {
							$(grid_selector).jqGrid('GridUnload');
							$('.ui-jqdialog').remove();
						});
						//条件查询
						$("#search_btn").on("click",function(){
							$(grid_selector).jqGrid('setGridParam',{page:1,	postData:{q:$("#search").val().trim()}}).trigger('reloadGrid');
						});
						//回车条件查询
						 $('#search').bind('keypress',function(event){
					            if(event.keyCode == "13")    
					            {
					            	$(grid_selector).jqGrid('setGridParam',{page:1,	postData:{q:$("#search").val().trim()}}).trigger('reloadGrid');
					            }
					      });
					}
					
					
				
					
					//将编辑复选框格式化
					function aceSwitch( cellvalue, options, cell ) {
						setTimeout(function(){
							$(cell).find('input[type=checkbox]')
								.addClass('ace ace-switch ace-switch-5')
								.after('<span class="lbl"></span>');
						}, 0);
					}
				
					
					
					
					function beforeDeleteCallback(e) {
						var form = $(e[0]);
						yl_tools.jqGrid_style_delete_form(form);
						
					}
					
					function beforeEditCallback(e) {
						var form = $(e[0]);
						yl_tools.jqGrid_style_edit_form(form);
					}
				
				
					function enableTooltips(table) {
						$('.navtable .ui-pg-button').tooltip({container:'body'});
						$(table).find('.ui-pg-div').tooltip({container:'body'});
					}
			
				});
});

