
ace.load_ajax_scripts([
	 "/assets/js/jquery.inputlimiter.1.3.1.min.js"
	 ], function() {
			var role_id = "";
			var rolemenu_grid_selector = "#rolemenu-grid-table";
			var rolemenu_pager_selector = "#rolemenu-grid-pager";
			var role_menu_table = "#role_menu_table";
			var role_menu_pager = "#role_menu_pager";
			jQuery(function($) {
					//加载kno
					$.ajax({
						type : 'POST',
						cache : true,
						url : '/rolemenu/getRoleList',
						datatype:"json",
						error : function(request) {
							yl_tips.error("服务器响应错误，请稍后再试！");
							return false;
						},
						success : function(data) {
							var role_select="";
							for(var i in data) {
								role_select+='<option value="'+data[i].id+'">'+data[i].name+'</option>';
							}
							$("#rolemenu-select").html(role_select);
							role_id=$("#rolemenu-select").val();
							jqGrid();
						}	
					});
					
					//分配角色菜单回调函数
					putRoleMenu();
					//保存关系
					saveRoleMenu();
			});
			
			function jqGrid(){
				//jqgrid宽度自适应//jqgrid宽度自适应
				yl_tools.jqGrid_autowidth(rolemenu_grid_selector);
				//jqgrid相关配置
				jQuery(rolemenu_grid_selector).jqGrid({
					ajaxGridOptions : {
						timeout : 500000  //设置ajax加载超时时间
					},
					url : "/rolemenu/getMenuList", //这是Action的请求地址   
					//重置默认 请求参数
					prmNames:{
						 page:"pageNo",    // 表示请求页码的参数名称  
						 rows:"pageSize"    // 表示请求行数的参数名称
					}, 
					postData:{//条件查询后台传值
						q:"",
						id:role_id
					},
					datatype : "json", //将这里改为使用JSON数据   
					mtype : "POST", //提交类型
					emptyrecords:"无匹配结果",//对查询条数为0时显示的 
					caption:"已分配菜单",//表格标题
					//重置默认json解析参数
					jsonReader:{ 
						root:"records", // json中代表实际模型数据的入口  
						page:"currentpage", // json中代表当前页码的数据  
						total:"totalpage", // json中代表页码总数的数据  
						records:"totalrecord",  // json中代表数据行总数的数据  
						repeatitems:false    // 如果设为false，则jqGrid在解析json时，会根据name来搜索对应的数据元素（即可以json中元素可以不按顺序）；而所使用的name是来自于colModel中的name设定。  
					},
					colNames:['ID','菜单名称','链接地址','菜单描述',' '],
					colModel:[
					     //主键ID
						{name:'id',index:'id', width:0, sorttype:"int", 
							hidden:true,search:false,sortable:false,editable:false,align:"center",key:true
						},
						//习题问题
						{name:'name',index:'name',width:200, editable:false,sortable:false},
						//所属技能名称
						{name:'url',index:'url', width:50,sortable:false,editable:false},
						
						//菜单描述
						{name:'description',index:'description', width:50,sortable:false,editable:false},
						
						//操作
						{name:'myac',index:'',  fixed:true, sortable:false, resize:false,editable:false,viewable:false,
							formatter:'actions', 
							formatoptions:{ 
								keys:true,
								editbutton:false,
								delOptions:{recreateForm: true, beforeShowForm:beforeDeleteCallback}
							}
						},
					], 
					editurl: "/rolemenu/roleMenuOperal?role_id="+role_id+"",
					viewrecords : true, //是否显示行数
					rowNum:10, //每页显示记录数  
					rowList:[10,20,50,100], //可调整每页显示的记录数
					pager : rolemenu_pager_selector, //分页工具栏  
					altRows: true,
					rownumbers:true,//添加左侧行号
					//jqgrid加载完成后执行
					loadComplete : function() {
						var table = this;
						setTimeout(function(){
							
							//替换jqgrid中的分页按钮图标
							yl_tools.jqGrid_updatePagerIcons(table);
							//更换导航栏中的行为图标
							yl_tools.jqGrid_updateActionIcons(table);
							enableTooltips(table);
						}, 0);
					}
				});
				//trigger window resize to make the grid get the correct size
				$(window).triggerHandler('resize.jqGrid');
	
				//分页工具栏设置
				jQuery(rolemenu_grid_selector).jqGrid('navGrid',rolemenu_pager_selector,
					{ 	//navbar options
						edit: false,
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
					},{},{},{},{},
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
					$(rolemenu_grid_selector).jqGrid('GridUnload');
					$('.ui-jqdialog').remove();
				});
				//条件查询
				$("#rolemenu_search_btn").on("click",function(){
					$(rolemenu_grid_selector).jqGrid('setGridParam',{page:1,	postData:{q:$("#rolemenu-search").val().trim()}}).trigger('reloadGrid');
				});
				//回车条件查询
				 $('#rolemenu-search').bind('keypress',function(event){
			            if(event.keyCode == "13")    
			            {
			            	$(rolemenu_grid_selector).jqGrid('setGridParam',{page:1,	postData:{q:$("#rolemenu-search").val().trim()}}).trigger('reloadGrid');
			            }
			      });
				//角色改变重新加载jqgrid
				$("#rolemenu-select").on("change",function(){
					$(rolemenu_grid_selector).jqGrid('setGridParam',{page:1,	postData:{id:$("#rolemenu-select").val(),q:""}}).trigger('reloadGrid');
					//重新加载技能列表
//					getMenuList($(this).val());
				});
			}
			//添加菜单
			
			function putRoleMenu(){
				
				$('#add-rolemenu-form').on('shown.bs.modal', function () {
					otherJqgrid();
				});
			}
			function otherJqgrid(){
				var id = $("#rolemenu-select").val();
				//jqgrid相关配置
				jQuery(role_menu_table).jqGrid({
					ajaxGridOptions : {
						timeout : 500000  //设置ajax加载超时时间
					},
					url : "/rolemenu/getOtherMenuList", //这是Action的请求地址   
					//重置默认 请求参数
					prmNames:{
						 page:"pageNo",    // 表示请求页码的参数名称  
						 rows:"pageSize"    // 表示请求行数的参数名称
					}, 
					postData:{//条件查询后台传值
						q:"",
						id:id
					},
					datatype : "json", //将这里改为使用JSON数据   
					mtype : "POST", //提交类型
					width:565,
					height:215,
					emptyrecords:"无匹配结果",//对查询条数为0时显示的 
					caption:"分配菜单",//表格标题
					multiselect: true,
					//重置默认json解析参数
					jsonReader:{ 
						root:"records", // json中代表实际模型数据的入口  
						page:"currentpage", // json中代表当前页码的数据  
						total:"totalpage", // json中代表页码总数的数据  
						records:"totalrecord",  // json中代表数据行总数的数据  
						repeatitems:false    // 如果设为false，则jqGrid在解析json时，会根据name来搜索对应的数据元素（即可以json中元素可以不按顺序）；而所使用的name是来自于colModel中的name设定。  
					},
					colNames:['ID','菜单名称','链接地址','菜单描述'],
					colModel:[
					     //主键ID
						{name:'id',index:'id', width:0, sorttype:"int", 
							hidden:true,search:false,sortable:false,editable:false,align:"center",key:true
						},
						//习题问题
						{name:'name',index:'name',width:200, editable:false,
//							formatter:function(cellvalue,options,rowObject){
//								return cellvalue;
//							}
						},
						//所属技能名称
						{name:'url',index:'url', width:50,editable:false},
						
						//菜单描述
						{name:'description',index:'description', width:50,editable:false},
						
					], 
//					onSelectRow: function (rowId, status, e) {       
//				        var rowIds = jQuery(role_menu_table).jqGrid('getGridParam', 'selarrrow');    
//					},
					viewrecords : true, //是否显示行数
					rowNum:10, //每页显示记录数  
					rowList:[10,20,50,100], //可调整每页显示的记录数
					pager : role_menu_pager, //分页工具栏  
					altRows: true,
					rownumbers:true,//添加左侧行号
					//jqgrid加载完成后执行
					loadComplete : function() {
						var table = this;
						setTimeout(function(){
							//替换jqgrid中的分页按钮图标
							yl_tools.jqGrid_updatePagerIcons(table);
							//更换导航栏中的行为图标
							yl_tools.jqGrid_updateActionIcons(table);
							
							enableTooltips(table);
						}, 0);
					}
				});
				//trigger window resize to make the grid get the correct size
				$(window).triggerHandler('resize.jqGrid');
	
				//分页工具栏设置
				jQuery(role_menu_table).jqGrid('navGrid',role_menu_pager,
					{ 	//navbar options
						edit: false,
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
					},{},{},{},{}
					
				);
				$(document).on('ajaxloadstart', function(e) {
					$(rolemenu_grid_selector).jqGrid('GridUnload');
					$('.ui-jqdialog').remove();
				});
				//条件查询
				$("#rolemenu_grid_search_btn").on("click",function(){
					$(role_menu_table).jqGrid('setGridParam',{page:1,	postData:{q:$("#rolemenu_grid_search").val().trim()}}).trigger('reloadGrid');
				});
				//回车条件查询
				 $('#rolemenu_grid_search').bind('keypress',function(event){
			            if(event.keyCode == "13")    
			            {
			            	$(role_menu_table).jqGrid('setGridParam',{page:1,	postData:{q:$("#rolemenu_grid_search").val().trim()}}).trigger('reloadGrid');
			            }
			      });
			}
			
			
			//分配菜单保存点击事件
			function saveRoleMenu(){
				$("#addrole-save-btn").on("click",function(){
					 var rowIds = jQuery(role_menu_table).jqGrid('getGridParam', 'selarrrow');   
					 console.log(rowIds.join(''));
					 $.ajax({
							type : 'POST',
							cache : false,
							url : "/rolemenu/addRoleMenu",
							datatype:"json",
							data :{
								id:role_id,
								menu_id:rowIds.join(',')
							},
							error : function(request) {
								yl_tips.error("服务器响应错误，请稍后再试！");
								return false;
							},
							success : function(data) {
								if(data==true){
									$(rolemenu_grid_selector).jqGrid().trigger('reloadGrid');
									yl_tips.success("分配成功！");
									$("#addrole-cancel-btn").trigger('click');
								}
							}
						});
				});
			}
			
			function enableTooltips(table) {
				$('.navtable .ui-pg-button').tooltip({container:'body'});
				$(table).find('.ui-pg-div').tooltip({container:'body'});
			}
			//删除弹框回调函数，控制样式
			function beforeDeleteCallback(e) {
				var form = $(e[0]);
				yl_tools.jqGrid_style_delete_form(form);
			}
			
});

