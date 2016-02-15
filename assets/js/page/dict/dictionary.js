//@author:fangxiaohua
//@邮箱：abc2710712@qq.com
//@qq:1295168875
// 2014年10月27日 下午2:03:16 
//加载jqgrid相关依赖js包
	ace.load_ajax_scripts([
	                    null
	], function() {
		
		
			jQuery(function($) {
				var grid_selector = "#grid-table";
				var pager_selector = "#grid-pager";
				//加载学科分类
				jqGrid();
				function jqGrid(){
					//jqgrid宽度自适应//jqgrid宽度自适应
					yl_tools.jqGrid_autowidth(grid_selector);
					//jqgrid相关配置
					jQuery(grid_selector).jqGrid({
						ajaxGridOptions : {
							timeout : 500000  //设置ajax加载超时时间
						},
						url : "/zdgl/getDictTypeList", //这是Action的请求地址   
						//重置默认 请求参数
						datatype : "json", //将这里改为使用JSON数据   
						mtype : "POST", //提交类型
						height:400,
						emptyrecords:"无匹配结果",//对查询条数为0时显示的 
						caption:"字典管理",//表格标题
						//重置默认json解析参数
						jsonReader:{ 
							root:"records", // json中代表实际模型数据的入口  
							page:"currentpage", // json中代表当前页码的数据  
							total:"totalpage", // json中代表页码总数的数据  
							records:"totalrecord",  // json中代表数据行总数的数据  
							repeatitems:false    // 如果设为false，则jqGrid在解析json时，会根据name来搜索对应的数据元素（即可以json中元素可以不按顺序）；而所使用的name是来自于colModel中的name设定。  
						},
						colNames:['ID','字典类型名称','排序',' ',' '],
						colModel:[
						     //主键ID
							{name:'id',index:'id', width:0, sorttype:"int", 
								hidden:true,search:false,sortable:false,editable:false,align:"center",key:true
							},
							//课程名称
							{name:'name',index:'name', editable:true},
							{name:'sort_index',index:'sort_index', editable:false,
								formatter:function(cellvalue,options,rowObject){
									return '<span class="badge badge-warning">'+cellvalue+'</span>';
								}
							},
							{name:'sort',index:'', width:120, fixed:true, sortable:false, resize:false,editable:false,
								formatter:function(cellvalue,options,rowObject){
									var records=$(grid_selector).getGridParam('records');
									if(records==1){
										return '<div style="margin-left:8px;">'+yl_tools.jqGrid_banbtnstr+yl_tools.jqGrid_banbtnstr+'</div>';
									}else if(rowObject.sort_index==1){
										return '<div style="margin-left:8px;">'+yl_tools.jqGrid_banbtnstr+yl_tools.jqGrid_downbtnstr("grid-table")+'</div>';
									}else if(records==rowObject.sort_index){
										return '<div style="margin-left:8px;">'+yl_tools.jqGrid_uphbtnstr("grid-table")+yl_tools.jqGrid_banbtnstr+'</div>';
									}
									return '<div style="margin-left:8px;">'+yl_tools.jqGrid_uphbtnstr("grid-table")+yl_tools.jqGrid_downbtnstr("grid-table")+'</div>';
								}
							},
							//操作
							{name:'myac',index:'', width:80, fixed:true, sortable:false, resize:false,editable:false,
								formatter:'actions', 
								formatoptions:{ 
									keys:true,
									//delbutton: false,//disable delete button
									delOptions:{recreateForm: true, beforeShowForm:beforeDeleteCallback},
									//editformbutton:true, editOptions:{recreateForm: true, beforeShowForm:beforeEditCallback}
								}
							}
						], 
						viewrecords : true, //是否显示行数
						rownumbers:true,//添加左侧行号
						rowNum:1000, //每页显示记录数  
						altRows: true,
						loadComplete : function() {
							setTimeout(function(){
								dictTypeSort(".jqGrid_sortbtnstrgrid-table");
							}, 0);
						},
						//编辑保存路径
						editurl: "/zdgl/typeDataOperal",
						////////////////////////////以下是subGird的设置
						//subgrid options
						subGrid : true,
						subGridOptions : {
							plusicon : "ace-icon fa fa-plus center bigger-110 blue",
							minusicon  : "ace-icon fa fa-minus center bigger-110 blue",
							openicon : "ace-icon fa fa-chevron-right center orange"
						},
						//for this example we are using local data
						subGridRowExpanded: function (subgrid_id, row_id) {
							  var subgrid_table_id = subgrid_id+"_t";
							  var pager_id = "p_"+subgrid_table_id;
							  var subgrid_selector = "#"+subgrid_table_id;
							  var subpager_selector = "#"+pager_id;
							  $("#"+subgrid_id).html("<table id='"+subgrid_table_id+"' class='scroll'></table><div id='"+pager_id+"' class='scroll'></div>");
								//subGrid 样式
							  jQuery(subgrid_selector).jqGrid({
								   url:"/zdgl/getDictList",
								   datatype: "json",
								   prmNames:{
										 page:"pageNo",    // 表示请求页码的参数名称  
										 rows:"pageSize"    // 表示请求行数的参数名称
									}, 
									postData:{//条件查询后台传值
										q:"",
										parentId:row_id
									},
									//重置默认json解析参数
									jsonReader:{ 
										root:"records", // json中代表实际模型数据的入口  
										page:"currentpage", // json中代表当前页码的数据  
										total:"totalpage", // json中代表页码总数的数据  
										records:"totalrecord",  // json中代表数据行总数的数据  
										userdata: "userdata",  
										repeatitems:false    // 如果设为false，则jqGrid在解析json时，会根据name来搜索对应的数据元素（即可以json中元素可以不按顺序）；而所使用的name是来自于colModel中的name设定。  
									},
								  	colNames: ['ID','所属字典类型id','值项名称','key','value','排序',' ',' '],
								   	colModel: [
											//主键ID
											{name:'id',index:'id', width:0, sorttype:"int", 
												hidden:true,search:false,sortable:false,editable:false,align:"center",key:true
											},
											{name:'parent_id',index:'parent_id', width:0, sorttype:"int", 
												hidden:true,search:false,sortable:false,editable:true,align:"center",viewable:true,editrules:{edithidden:false}
											},
										    {name:"name",index:"name",width:400,sortable:false,editable:true},
											{name:'dict_key',index:'dict_key',hidden:true, width:0, editable:false, viewable:true,editrules:{edithidden:true},
										           formatter:function(cellvalue,options,rowObject){
										            return cellvalue==null?"":cellvalue;
										           },
										     },
										   	{name:'dict_value',index:'dict_value',hidden:true, width:0, editable:false, viewable:true,editrules:{edithidden:true},
										           formatter:function(cellvalue,options,rowObject){
										            return cellvalue==null?"":cellvalue;
										           },
										     },
										    {name:"sort_index",index:"sort_index",width:100,sortable:false,editable:false,
										    	formatter:function(cellvalue,options,rowObject){
													return '<span class="badge badge-success">'+cellvalue+'</span>';
												}
										   	},
										   	{name:'sort',index:'', width:120, fixed:true, sortable:false, resize:false,editable:false, viewable:false,
												formatter:function(cellvalue,options,rowObject){
													var records=$(subgrid_selector).jqGrid('getGridParam', 'records');
													if(records==1){
														return '<div style="margin-left:8px;">'+yl_tools.jqGrid_banbtnstr+yl_tools.jqGrid_banbtnstr+'</div>';
													}else if(rowObject.sort_index==1){
														return '<div style="margin-left:8px;">'+yl_tools.jqGrid_banbtnstr+yl_tools.jqGrid_downbtnstr(subgrid_table_id)+'</div>';
													}else if(records==rowObject.sort_index){
														return '<div style="margin-left:8px;">'+yl_tools.jqGrid_uphbtnstr(subgrid_table_id)+yl_tools.jqGrid_banbtnstr+'</div>';
													}
													return '<div style="margin-left:8px;">'+yl_tools.jqGrid_uphbtnstr(subgrid_table_id)+yl_tools.jqGrid_downbtnstr(subgrid_table_id)+'</div>';
												}
											},
										 	 //操作
											{name:'myac',index:'', width:80, fixed:true, sortable:false, resize:false,viewable:false,
												formatter:'actions', 
												formatoptions:{ 
													keys:true,
													//delbutton: false,//disable delete button
													
													delOptions:{recreateForm: true, beforeShowForm:beforeDeleteCallback},
													//editformbutton:true, editOptions:{recreateForm: true, beforeShowForm:beforeEditCallback}
												}
											}
								    ],
								    viewrecords : true, //是否显示行数
									rowNum:10, //每页显示记录数  
									rownumbers:true,//添加左侧行号
									emptyrecords:"无匹配结果",//对查询条数为0时显示的 
									rowList:[1,10,20,50,100], //可调整每页显示的记录数
									pager : subpager_selector, //分页工具栏  
								    height: 600,
								    viewrecords: true,
		
									//multikey: "ctrlKey",
									//jqgrid加载完成后执行
									loadComplete : function() {
										var table = this;
										setTimeout(function(){
											dictSort(subgrid_table_id);
											//替换jqgrid中的分页按钮图标
											yl_tools.jqGrid_updatePagerIcons(table);
											//更换导航栏中的行为图标
											yl_tools.jqGrid_updateActionIcons(table);
										}, 0);
									},
									//编辑保存路径
									editurl: "/zdgl/dataOperal"
								  });
							//分页工具栏设置
								jQuery(subgrid_selector).jqGrid('navGrid',subpager_selector,
									{ 	//navbar options
										edit: true,
										editicon : 'ace-icon fa fa-pencil blue',
										add: true,
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
											//添加parentId进form表单中
											$("#parent_id").val(row_id);
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
									{},
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
						}
					});
					//trigger window resize to make the grid get the correct size
					$(window).triggerHandler('resize.jqGrid');
					
					$(document).on('ajaxloadstart', function(e) {
						$(grid_selector).jqGrid('GridUnload');
						$('.ui-jqdialog').remove();
					});
				}
				
				
				
				//
				
				
				
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
				
				addType();
				//添加新类型验证，保存
				function addType(){
					//添加页面保存按钮，验证
					$("#add-save-btn").on("click",function(){
						var add_type_name=$("#add-type-name").val();
						//验证
						if(yl_tools.isEmpty(add_type_name)){
							bootbox.dialog({
								message: "<span class='bigger-110'>字典类型名称不能为空！</span>",
							});
							return false;	
						}
						else{
							//验证成功,ajax保存
							$.ajax({
								type : 'POST',
								cache : false,
								url : '/zdgl/addDictType',
								datatype:"script",
								data :{
									name:add_type_name
								},
								error : function(request) {
									alert("服务器响应错误，操作失败！");
									return false;
								},
								success : function(data) {
									if(data==true){
										$(grid_selector).jqGrid().trigger('reloadGrid');
										bootbox.dialog({
											message: "<span class='bigger-110'>新的字典类型成功！</span>",
											buttons: 			
											{
												"success" :
												 {
													"label" : "<i class='ace-icon fa fa-check'></i> Success!",
													"className" : "btn-sm btn-success",
													"callback": function() {
													}
												}
											}
										});
										$("#add-cancel-btn").trigger('click');
									}
								}
							});
						}
					});
				}
				//字典类型排序
				function dictTypeSort(sort_selector){
						$(sort_selector).on("dblclick",function(e){
							var id = jQuery(grid_selector).jqGrid('getGridParam','selrow');
							var sortType=$(e.target).attr("data-oper");
							//验证成功,ajax保存
							$.ajax({
								type : 'GET',
								cache : false,
								url : '/zdgl/sortDict',
								datatype:"script",
								data :{
									sortType:sortType,
									id:id
								},
								success : function(data) {
									if(data==true){
										$(grid_selector).jqGrid().trigger('reloadGrid');
									}
								}
							});
						});
				}
				
				//字典排序
				function dictSort(subgrid_table_id){
						$(".jqGrid_sortbtnstr"+subgrid_table_id).on("dblclick",function(e){
							var id = jQuery("#"+subgrid_table_id).jqGrid('getGridParam','selrow');
							var sortType=$(e.target).attr("data-oper");
							//验证成功,ajax保存
							$.ajax({
								type : 'GET',
								cache : false,
								url : '/zdgl/sortDict',
								datatype:"script",
								data :{
									sortType:sortType,
									id:id
								},
								success : function(data) {
									if(data==true){
										$("#"+subgrid_table_id).jqGrid().trigger('reloadGrid');
									}
								}
							});
						});
				}
			 });
});

