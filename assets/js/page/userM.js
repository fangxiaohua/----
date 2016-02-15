/**
 * @author:fangxiaohua
*  @邮箱：abc2710712@qq.com
*  @qq:1295168875
*   用户管理
*/	
	ace.load_ajax_scripts([
	                       null
	        ], function() {
		
			var userM={
					//页面初始化
					init:function(){
						//创建jqgrid
						this.jqgrid_userList();
						
						
						this.beforeAddModelshowCallback();
						
						this.saveUserRole();
					},
					user_grid_table : "#user-grid-table",
					user_grid_pager :"#user-grid-pager",
					jqgrid_userList:function(){
						//jqgrid宽度自适应//jqgrid宽度自适应
						yl_tools.jqGrid_autowidth(this.user_grid_table);
						//jqgrid相关配置
						jQuery(this.user_grid_table).jqGrid({
							ajaxGridOptions : {
								timeout : 500000  //设置ajax加载超时时间
							},
							url : "/userM/ulist", //这是Action的请求地址   
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
							caption:"用户管理",//表格标题
							emptyrecords:"无匹配结果",//对查询条数为0时显示的 
							//重置默认json解析参数
							jsonReader:{ 
								root:"records", // json中代表实际模型数据的入口  
								page:"currentpage", // json中代表当前页码的数据  
								total:"totalpage", // json中代表页码总数的数据  
								records:"totalrecord",  // json中代表数据行总数的数据  
								repeatitems:false    // 如果设为false，则jqGrid在解析json时，会根据name来搜索对应的数据元素（即可以json中元素可以不按顺序）；而所使用的name是来自于colModel中的name设定。  
							},
							colNames:['ID','用户账号','姓名','角色名称','角色id','电话','用户状态','最后登录时间','操作'],
							colModel:[
							     //主键ID
								{name:'id',index:'id', sorttype:"int", 
									hidden:true,search:false,sortable:false,editable:false,align:"center",key:true
								},
								//账号
								{name:'account',index:'account',sortable:false, editable:false},
								//真实姓名
								{name:'name',index:'name', editable:true,sortable:false,viewable:true,editoptions: {maxlength:25}},
								//角色
								{name:'roleNames',index:'roleNames', sortable:false,editable:false,viewable:true},
								//角色id
								{name:'roleIds',index:'roleIds', sortable:false,editable:false,viewable:false,hidden:true},
								//电话
								{name:'telephone',index:'telephone',sortable:false,editable:true,viewable:true,editoptions: {maxlength:11}},
								{name:'status',index:'status', sortable:false,editable:false,viewable:true,
									formatter:function(cellvalue,options,rowObject){
										console.log(cellvalue);
										   if(cellvalue=="2"){
											   return "禁止发言";
										   }else{
											   if(cellvalue=="0"){
												   return "禁用";
											   }else{
												   return "正常";
											   }
										   }
									 }
								},
								//最后登入时间
								{name:'last_login_time',index:'last_login_time',hidden:false, width:0,sortable:false, editable:false, viewable:true,editrules:{edithidden:true},
								      formatter:function(cellvalue,options,rowObject){
								       return cellvalue==null?"":cellvalue;
								      }
								},
								//操作
								{name:'myac',index:'',  fixed:true, sortable:false, resize:false,editable:false,viewable:false,
									formatter:'actions', 
									formatoptions:{ 
										keys:true,
										delbutton: false,//disable delete button
										delOptions:{recreateForm: true, beforeShowForm:function(e){
											var form = $(e[0]);
											yl_tools.jqGrid_style_delete_form(form);
										}}
									}
								}
							], 
							viewrecords : true, //是否显示行数
							rowNum:10, //每页显示记录数  
							rowList:[10,20,50,100], //可调整每页显示的记录数
							pager :userM.user_grid_pager, //分页工具栏  
							altRows: true,
							rownumbers:true,//添加左侧行号
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
									
									userM.enableTooltips(table);
									
									//添加按钮动态样式
								    jqGrid_addbtnstr=['<div title="用户授权" style="float:left;cursor:pointer;margin-left:5px;padding-right: 6px;"  href="#distributerole-modal-form" role="button" data-toggle="modal" class="ui-pg-div ui-inline-add" onmouseover="jQuery(this).addClass('+"'ui-state-hover'"+');" onmouseout="jQuery(this).removeClass('+"'ui-state-hover'"+');"   data-original-title="用户授权">',
													    							 '<span class="ui-icon ace-icon fa-users purple"></span>',
															 			 '</div>'].join("");
									var datalist = data.records;
									for(var i in datalist){
										$("#jEditButton_"+datalist[i].id+"").before(juicer(jqGrid_addbtnstr,{}));
									}
								}, 0);
							},
							//编辑保存路径
							editurl: "/userM/uEdit",
						});
						//trigger window resize to make the grid get the correct size
						$(window).triggerHandler('resize.jqGrid');
						//分页工具栏设置
						jQuery(this.user_grid_table).jqGrid('navGrid',this.user_grid_pager,
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
							}
						);
						$(document).on('ajaxloadstart', function(e) {
							$(userM.user_grid_table).jqGrid('GridUnload');
							$('.ui-jqdialog').remove();
						});
						
						//条件查询
						$("#admin_search_btn").off("click.userM'").on("click.userM",function(){
							$(userM.user_grid_table).jqGrid('setGridParam',{page:1,	postData:{q:$("#admin_search").val().trim()}}).trigger('reloadGrid');
						});
						//回车条件查询
						 $('#admin_search').bind('keypress',function(event){
					            if(event.keyCode == 13)    
					            {
					            	$("#admin_search_btn").trigger('click');
					            }
					      });
					},
					//角色标签样式
					roleTip_tpl:'<span class="label label-success arrowed arrowed-right"  data-value="${id}">${roleName}<i style="padding-left:2px;cursor: pointer;" class="ace-icon fa fa-times bigger-120 roleTip_rm"></i></span>',
					//添加弹窗回调函数
					beforeAddModelshowCallback:function(){
						$('#add-admin-modal-form').on('shown.bs.modal', function () {
							$("#add-admin-account").val("");
							$("#add-admin-password").val("");
							$("#add-admin-password2").val("");
							$("#add-admin-name").val("");
							$("#add-admin-telephone").val("");
						});
						
						$('#distributerole-modal-form').on('shown.bs.modal', function () {
								
							$("#checked_role").empty();
							userM.jqgrid_roleList();
							var id=$(userM.user_grid_table).jqGrid("getGridParam","selrow");
							var rowData = $(userM.user_grid_table).jqGrid("getRowData",id);
							var roleNames=rowData.roleNames;
							var roleIds=rowData.roleIds;
							if(roleIds!=""){
								var roleIdArr = roleIds.split(",");
								var roleNameArr = roleNames.split(",");
								for(var i = 0;i<roleIdArr.length;i++){
									$("#checked_role").append(juicer(userM.roleTip_tpl,{"id":roleIdArr[i],"roleName":roleNameArr[i]}));
								}
							}
							userM.delRole();
						});
					},
					//点击保存按钮执行的方法
					saveUserRole:function(){
						$("#addrole-save-btn").off("click.userM").on("click.userM",function(){
							var alreadRole= $("#checked_role").children("span");
							var id=$(userM.user_grid_table).jqGrid("getGridParam","selrow");
							var releIds = [];
							alreadRole.each(function(i,e){
									releIds.push($(this).attr("data-value"));
							})
							yl_ajaxAction.ajax_update({
						  			updateActionUrl: "/userM/rUser",
						  			updateActionParams:{
							  				id:id,
											roleIds:releIds.join("&")
						  			},
						  			updateReponseFun:function(data){
						  				if(data){
											yl_tips.success("用户授权成功！");
											$("#addrole-cancel-btn").trigger('click');
											$(userM.user_grid_table).jqGrid().trigger('reloadGrid');
										}else{
											yl_tips.error("用户授权失败！");
										}
						  			}
						  	});
						});
					},
					//删除已经选中的角色名称
					delRole:function(){
							$(".roleTip_rm").off("click.userM").on("click.userM",function(){
								$(this).closest("span").remove();
							});
					},
					enableTooltips:function(table){
						$('.navtable .ui-pg-button').tooltip({container:'body'});
						$(table).find('.ui-pg-div').tooltip({container:'body'});
					},
					edit_role_table :"#edit_role_table",
					edit_role_pager : "#edit_role_pager",
					//弹出窗口的jqgrid
					jqgrid_roleList:function(){
						//jqgrid相关配置
						jQuery(this.edit_role_table).jqGrid({
							ajaxGridOptions : {
								timeout : 500000  //设置ajax加载超时时间
							},
							url : "/userM/rlist", //这是Action的请求地址   
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
							width:$(".modal-body").width(),
							height:$("#all_check_role").height()*0.9,
							caption:"角色列表",//表格标题
							emptyrecords:"无匹配结果",//对查询条数为0时显示的 
							//重置默认json解析参数
							jsonReader:{ 
								root:"records", // json中代表实际模型数据的入口  
								page:"currentpage", // json中代表当前页码的数据  
								total:"totalpage", // json中代表页码总数的数据  
								records:"totalrecord",  // json中代表数据行总数的数据  
								repeatitems:false    // 如果设为false，则jqGrid在解析json时，会根据name来搜索对应的数据元素（即可以json中元素可以不按顺序）；而所使用的name是来自于colModel中的name设定。  
							},
							colNames:['ID','角色','角色描述'],
							colModel:[
							     //主键ID
								{name:'id',index:'id', sorttype:"int", 
									hidden:true,search:false,sortable:false,editable:false,align:"center",key:true
								},
								//角色名称
								{name:'name',index:'name',editable:true,viewable:true,sortable:false},
								//角色描述
								{name:'description',index:'description', width:400,editable:true,sortable:false,viewable:true},
								
							], 
							viewrecords : true, //是否显示行数
							rowNum:10, //每页显示记录数  
							rowList:[10,20,50,100], //可调整每页显示的记录数
							pager : userM.edit_role_pager, //分页工具栏  
							altRows: true,
							rownumbers:true,//添加左侧行号
							//jqgrid点击行执行的方法
							onSelectRow: function (rowid, status) {
								var rowData = $(userM.edit_role_table).jqGrid("getRowData",rowid);
								var role_name = rowData.name;
								var alreadRole= $("#checked_role").children("span");
								var k=-1;
								alreadRole.each(function(e){
									if(role_name==$(this).text()){
										yl_tips.error("该角色已添加！");
										k=1;
									}
								})
								if(k==-1){
									$("#checked_role").append(juicer(userM.roleTip_tpl,{"id":rowid,"roleName":role_name}));
								}
								userM.delRole();
			                },
							loadComplete : function() {
								var table = this;
								setTimeout(function(){
									//替换jqgrid中的分页按钮图标
									yl_tools.jqGrid_updatePagerIcons(table);
									//更换导航栏中的行为图标
									yl_tools.jqGrid_updateActionIcons(table);
									//更换选择框的样式
									yl_tools.jqGrid_styleCheckbox(table);
									
									userM.enableTooltips(table);
								}, 0);
							},
							//编辑保存路径
						});
						//trigger window resize to make the grid get the correct size
						$(window).triggerHandler('resize.jqGrid');
			
						//分页工具栏设置
						jQuery(this.edit_role_table).jqGrid('navGrid',this.edit_role_pager,
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
								viewicon : 'ace-icon fa fa-search-plus grey'
							}
						);
						$(document).on('ajaxloadstart', function(e) {
							$(this.edit_role_table).jqGrid('GridUnload');
							$('.ui-jqdialog').remove();
						});
						
						//条件查询
						$("#userrole_search_btn").off("click.userM").on("click.userM",function(){
							$(userM.edit_role_table).jqGrid('setGridParam',{page:1,	postData:{q:$("#userrole_search").val().trim()}}).trigger('reloadGrid');
						});
						//回车条件查询
						 $('#userrole_search').bind('keypress',function(event){
					            if(event.keyCode == 13)    
					            {
					            	$("#userrole_search_btn").trigger('click');
					            }
					      });
					
					}
			};
			
			userM.init();
});