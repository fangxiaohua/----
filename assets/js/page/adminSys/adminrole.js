	//@author:fangxiaohua
	//@邮箱：abc2710712@qq.com
	//@qq:1295168875
	// 2014年10月27日 下午2:03:16 
	//加载jqgrid相关依赖js包
	ace.load_ajax_scripts([
	                       "/assets/js/jquery-ui.min.js",
	                       "/assets/third/easyui/jquery.easyui.min.js"
	], function() {
		
		var adminrole={
			//页面初始化
			init:function(){
				//创建jqgrid
				this.jqgrid_adminroleList();
				//添加角色信息
				this.addRole();
				//清除二次打开弹窗的之前填的内容
				this.beforeAddModelshowCallback()
			},
			grid_selector : "#role-grid-table",
			pager_selector : "#role-grid-pager",
			//角色数据列表设置
			jqgrid_adminroleList:function(){

				//jqgrid宽度自适应//jqgrid宽度自适应
				yl_tools.jqGrid_autowidth(this.grid_selector);
				//jqgrid相关配置
				jQuery(this.grid_selector).jqGrid({
					ajaxGridOptions : {
						timeout : 500000  //设置ajax加载超时时间
					},
					url : "/adminRole/getList", //这是Action的请求地址   
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
					caption:"角色管理",//表格标题
					//重置默认json解析参数
					jsonReader:{ 
						root:"records", // json中代表实际模型数据的入口  
						page:"currentpage", // json中代表当前页码的数据  
						total:"totalpage", // json中代表页码总数的数据  
						records:"totalrecord",  // json中代表数据行总数的数据  
						repeatitems:false    // 如果设为false，则jqGrid在解析json时，会根据name来搜索对应的数据元素（即可以json中元素可以不按顺序）；而所使用的name是来自于colModel中的name设定。  
	
					},
					colNames:['ID','角色名称','角色描述','排序','排序操作','是否可用 ','操作'],
					colModel:[
						{name:'id',index:'id',  sorttype:"int",hidden:true,search:false,sortable:false,editable:false,align:"center",key:true}, 
						{name:'name',index:'name', editable:true, viewable:true,sortable:false,editoptions: {maxlength:25}},
						{name:'description',index:'description', editable:true, viewable:true,sortable:false,editoptions: {maxlength:127}},
						
						{name:'sort_index',index:'sort_index', editable:false,align:"center",sortable:false,
							formatter:function(cellvalue,options,rowObject){
								return '<span class="badge badge-warning">'+cellvalue+'</span>';
							}
						},
						{name:'sort',index:'', fixed:true, sortable:false, resize:false,editable:false,viewable:false,align:"center",
							formatter:function(cellvalue,options,rowObject){
								var records=$(adminrole.grid_selector).getGridParam('records');
								if(records==1){
									return '<div style="margin-left:8px;">'+yl_tools.jqGrid_banbtnstr+yl_tools.jqGrid_banbtnstr+'</div>';
								}else if(rowObject.sort_index==1){
									return '<div style="margin-left:8px;">'+yl_tools.jqGrid_banbtnstr+yl_tools.jqGrid_downbtnstr("role-grid-table")+'</div>';
								}else if(records==rowObject.sort_index){
									return '<div style="margin-left:8px;">'+yl_tools.jqGrid_uphbtnstr("role-grid-table")+yl_tools.jqGrid_banbtnstr+'</div>';
								}
								return '<div style="margin-left:8px;">'+yl_tools.jqGrid_uphbtnstr("role-grid-table")+yl_tools.jqGrid_downbtnstr("role-grid-table")+'</div>';
							}
						},
						
						//是否可用
						{name:'status',index:'status',  viewable:true,align:"center",sortable:false,
							editable: true,edittype:"checkbox",editoptions: {value:"是:否"},unformat: adminrole._aceSwitch,
							formatter:function(cellvalue,options,rowObject){
							return cellvalue=="是"?"是":"否";
						}},
						//操作
						{name:'myac',index:'', fixed:true, sortable:false, resize:false, viewable:false,
							formatter:'actions', 
							formatoptions:{ 
								keys:true,
								delOptions:{recreateForm: true, beforeShowForm:adminrole._beforeDeleteCallback}
							}
						}
					], 
					viewrecords : true, //是否显示行数
					rownumbers:true,//添加左侧行号
					rowNum:10, //每页显示记录数  
					rowList:[10,20,50,100], //可调整每页显示的记录数
					pager : adminrole.pager_selector, //分页工具栏  
					altRows: true,
					//jqgrid加载完成后执行
					loadComplete : function(data) {
						//分配菜单按钮样式
						jqGrid_distributionbtnstr=['<div title="分配权限菜单" style="float:left;cursor:pointer;margin-left:5px; padding-top: 3px;  padding-right: 5px;"',
						                           							'   role="button" class="ui-pg-div ui-inline-add distributemenu" onmouseover="jQuery(this).addClass('+"'ui-state-hover'"+');" ',
						                           							' onmouseout="jQuery(this).removeClass('+"'ui-state-hover'"+');" data-original-title="分配权限菜单">',
														    							 '<span class="ui-icon ace-icon fa  fa-cog purple" data-roleId="${roleId}"></span>',
																 			 '</div>'].join("");
						for(var i=0;i<data.records.length;i++){
							$("#jEditButton_"+data.records[i].id+"").before(juicer(jqGrid_distributionbtnstr,{"roleId":data.records[i].id}));
						}
						var table = this;
						setTimeout(function(){
							
							adminrole._sort(".jqGrid_sortbtnstrrole-grid-table");
							//替换jqgrid中的分页按钮图标
							yl_tools.jqGrid_updatePagerIcons(table);
							//更换导航栏中的行为图标
							yl_tools.jqGrid_updateActionIcons(table);
							//更换选择框的样式
							yl_tools.jqGrid_styleCheckbox(table);
							
							adminrole._enableTooltips(table);
							
							yl_tools.menutree({
								div:"menu-tree-div",
								openbtn:".distributemenu",
								title:"分配菜单",
								paramName:"data-roleId",
								saveURL:"/adminMenu/saveRoleMenu"
							});
						}, 0);
					},
					//编辑保存路径
					editurl: "/adminRole/roleOperal"
				});
				$(window).triggerHandler('resize.jqGrid');
	
				//分页工具栏设置
				jQuery(this.grid_selector).jqGrid('navGrid',this.pager_selector,
					{ 	//navbar options
						closeAfterEdit:true,
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
						viewicon : 'ace-icon fa fa-search-plus grey'
					},
					{
						closeAfterEdit: true,//操作完成后窗口自动关闭
						top : 100,  //位置
	 					left: 600, //位置
						recreateForm: true,
						beforeShowForm : function(e) {
							var form = $(e[0]);
							yl_tools.jqGrid_style_edit_form(form);
						}
					},
					{
						//delete record form
						top : 100,  //位置
	 					left: 600, //位置
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
						top : 100,  //位置
	 					left: 600, //位置
						recreateForm: true,
						beforeShowForm: function(e){
							var form = $(e[0]);
							yl_tools.jqGrid_style_view_form(form);
						}
					}
				);
				//条件查询
				$("#admin_role_search_btn").off("click.adminrole'").on("click.adminrole",function(){
					$(adminrole.grid_selector).jqGrid('setGridParam',{page:1,	postData:{q:$("#admin_role_search").val().trim()}}).trigger('reloadGrid');
				});
				
				//回车条件查询
				 $('#admin_role_search').bind('keypress',function(event){
			            if(event.keyCode == "13")    
			            {
			            	$(adminrole.grid_selector).jqGrid('setGridParam',{page:1,	postData:{q:$("#admin_role_search").val().trim()}}).trigger('reloadGrid');
			            }
			      });
			
			},
			//排序
			_sort:function(sort_selector){
				$(sort_selector).on("click",function(e){
					setTimeout(function(){
						var id = jQuery(adminrole.grid_selector).jqGrid('getGridParam','selrow');
						var sortType=$(e.target).attr("data-oper");
						//验证成功,ajax保存
						$.ajax({
							type : 'GET',
							cache : false,
							url : '/adminRole/sortRole',
							datatype:"script",
							data :{
								sortType:sortType,
								id:id
							},
							success : function(data) {
								if(data==true){
									$(adminrole.grid_selector).jqGrid().trigger('reloadGrid');
								}
							}
						});
					},0);
				});
			},
			//将编辑复选框格式化
			_aceSwitch:function( cellvalue, options, cell ){
				setTimeout(function(){
					var target=$(cell).find('input[type=checkbox]');
						target.addClass('ace ace-switch ace-switch-5')
						.after('<span class="lbl"></span>');
					
				}, 0);
			} ,
			_enableTooltips:function(table){
				$('.navtable .ui-pg-button').tooltip({container:'body'});
				$(table).find('.ui-pg-div').tooltip({container:'body'});
			},
			_beforeDeleteCallback:function(e){
				var form = $(e[0]);
				yl_tools.jqGrid_style_delete_form(form);
			},
			//添加新类型验证，保存
			addRole:function(){
				//添加页面保存按钮，验证
				$("#add-role-save-btn").off("click.adminrole").on("click.adminrole",function(){
					var add_role_name=$("#add-role-name").val();
					var add_role_description=$("#add-role-description").val();
					//验证
					
					if(yl_tools.isEmpty(add_role_name)){
						yl_tips.error("角色名称不能为空！");
						$("#add-role-name").focus();
						return false;	
					}
					else{
						//验证成功,ajax保存
						$.ajax({
							type : 'POST',
							cache : false,
							url : "/adminRole/addRole",
							datatype:"script",
							data :{
								name:add_role_name,
								description:add_role_description
							},
							error : function(request) {
								yl_tips.error("服务器响应错误，请稍后再试！");
								return false;
							},
							success : function(data) {
								$(adminrole.grid_selector).jqGrid().trigger('reloadGrid');
								if(data=="1"){
									yl_tips.success("添加成功！");
									$("#add-role-cancel-btn").trigger('click');
								}else if(data=="0"){
									yl_tips.error("角色名称重复！")
								}else if(data=="2"){
									yl_tips.error("服务器响应错误，请稍后再试！");
								}
							}
						});
					}
				});
			},
			//清除二次打开弹窗的之前填的内容
			beforeAddModelshowCallback:function(){
				$('#add-role-modal-form').on('shown.bs.modal', function () {
					$("#add-role-name").val("");
					$("#add-role-description").val("");
				});
			}
		};
		
		adminrole.init();
});