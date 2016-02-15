//@author:fangxiaohua
//@邮箱：abc2710712@qq.com
//@qq:1295168875
// 2014年10月27日 下午2:03:16 
//加载jqgrid相关依赖js包
ace.load_ajax_scripts([
                       null
	 ], function() {
	
			var userverify={
					init:function(){
						//初始化用户类型下拉框
						userverify.initUserType();
						//用户审核列表
						this.user_authList();
						
						this.verify_message();
					},
					//初始化用户类型下拉框
					initUserType:function(){
						var data = new Array("云中心教师审核","企业用户审核");
						var role_select="";
						for(var i in data){
							role_select+='<option value="'+i+'">'+data[i]+'</option>';
						}
						$("#user-type-select").html(role_select);
					},
					audit_grid_table:"#audit-grid-table",
					audit_grid_pager:"#audit-grid-pager",
					//用户审核列表
					user_authList:function(){
						//jqgrid宽度自适应
						yl_tools.jqGrid_autowidth(userverify.audit_grid_table);
						//jqgrid相关配置
						jQuery(userverify.audit_grid_table).jqGrid({
							ajaxGridOptions : {
								timeout : 500000  //设置ajax加载超时时间
							},
							url : "/verify/getAuditMessage", //这是Action的请求地址   
							//重置默认 请求参数
							prmNames:{
								 page:"pageNo",    // 表示请求页码的参数名称  
								 rows:"pageSize"    // 表示请求行数的参数名称
							}, 
							postData:{//条件查询后台传值
								q:"",
								id:$("#user-type-select").val()
							},
							datatype : "json", //将这里改为使用JSON数据   
							mtype : "POST", //提交类型
							emptyrecords:"无匹配结果",//对查询条数为0时显示的 
							caption:"用户申请列表",//表格标题
							//重置默认json解析参数
							jsonReader:{ 
								root:"records", // json中代表实际模型数据的入口  
								page:"currentpage", // json中代表当前页码的数据  
								total:"totalpage", // json中代表页码总数的数据  
								records:"totalrecord",  // json中代表数据行总数的数据  
								repeatitems:false    // 如果设为false，则jqGrid在解析json时，会根据name来搜索对应的数据元素（即可以json中元素可以不按顺序）；而所使用的name是来自于colModel中的name设定。  
							},
							colNames:['ID','真实姓名','昵称','电子邮箱','申请理由','注册时间',' '],
							colModel:[
							     //主键ID
								{name:'id',index:'id', width:0, sorttype:"int", 
									hidden:true,search:false,sortable:false,editable:false,align:"center",key:true
								},
								//真实姓名
								{name:'real_name',index:'real_name',editable:false,sortable:false},
								//昵称
								{name:'nick_name',index:'nick_name',sortable:false, editable:false},
								//用户邮箱
								{name:'email',index:'email',sortable:false,editable:false},
								//申请理由
								{name:'reason',index:'reason',sortable:false, editable:false},
								//注册时间
								{name:'join_time',index:'join_time',sortable:false,editable:false},
								//操作
								{name:'myac',index:'',  fixed:true, sortable:false, resize:false,editable:false,viewable:false,
									formatter:function(cellvalue,options,rowObject){
										//申请信息查看按钮  		    
										var jqGrid_verifybtnstr=['<div title="" style="float:left;cursor:pointer;margin-left:5px;" class="ui-pg-div ui-inline-save" name="jqGrid_verifybtnstr" href="#verify-modal-form" role="button" data-toggle="modal"  onmouseover="jQuery(this).addClass('+"'ui-state-hover'"+');" onmouseout="jQuery(this).removeClass('+"'ui-state-hover'"+');" data-original-title="查看申请详情">',
																			 						'<span class="ui-icon ace-icon fa fa-search-plus blue"></span>',
																			 		   '</div>'].join("");
									   //忽略按钮		    
									   var jqGrid_ignorebtnstr=['<div title="" style="float:left;cursor:pointer;margin-left:5px;" class="ui-pg-div ui-inline-save"  role="button"  onmouseover="jQuery(this).addClass('+"'ui-state-hover'"+');" onmouseout="jQuery(this).removeClass('+"'ui-state-hover'"+');" data-original-title="忽略申请">',
																				 				 		'<span class="ace-icon fa fa-paper-plane-o ignore_auth" data-id=${id}></span>',
																				 		 '</div>'].join(""); 			
										return '<div style="margin-left:8px;">'+juicer(jqGrid_verifybtnstr,{})+juicer(jqGrid_ignorebtnstr,{"id":rowObject.id})+'</div>';
									}
								},
							], 
							viewrecords : true, //是否显示行数
							rowNum:10, //每页显示记录数  
							rowList:[10,20,50,100], //可调整每页显示的记录数
							pager : userverify.audit_grid_pager, //分页工具栏  
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
									$('.navtable .ui-pg-button').tooltip({container:'body'});
									$(table).find('.ui-pg-div').tooltip({container:'body'});
									//审核忽略
									userverify.ignore_auth();
								}, 0);
							}
						});
						//trigger window resize to make the grid get the correct size
						$(window).triggerHandler('resize.jqGrid');
			
						//分页工具栏设置
						jQuery(userverify.audit_grid_table).jqGrid('navGrid',userverify.audit_grid_pager,
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
								$(userverify.audit_grid_table).jqGrid('GridUnload');
								$('.ui-jqdialog').remove();
						});
						//条件查询
						$("#audit_search_btn").off("click.userverify").on("click.userverify",function(){
								$(userverify.audit_grid_table).jqGrid('setGridParam',{page:1,	postData:{q:$("#audit-search").val().trim(),id:$("#user-type-select").val()}}).trigger('reloadGrid');
						});
						//回车条件查询
						 $('#audit-search').bind('keypress',function(event){
					            if(event.keyCode == "13")    
					            {
					            	$(userverify.audit_grid_table).jqGrid('setGridParam',{page:1,	postData:{q:$("#audit-search").val().trim(),id:$("#user-type-select").val()}}).trigger('reloadGrid');
					            }
					      });
						//角色改变重新加载jqgrid
						$("#user-type-select").on("change",function(){
								$(userverify.audit_grid_table).jqGrid('setGridParam',{page:1,	postData:{q:$("#audit-search").val().trim(),id:$("#user-type-select").val()}}).trigger('reloadGrid');
						});
					},
					//审核忽略
					ignore_auth:function(){
							//忽略按钮执行的操作
							$(".ignore_auth").off("click.userverify").on("click.userverify",function(e){
								var rowId=$(e.target).attr("data-id");
								$.ajax({
									type : 'get',
									cache : false,
									url : "/verify/ignoreVerify",
									datatype:"json",
									data :{
										id:rowId
									},
									error : function(request) {
										yl_tips.error("服务器响应错误，请稍后再试！");
										return false;
									},
									success : function(data) {
										if(data==true){
											$(userverify.audit_grid_table).jqGrid().trigger('reloadGrid');
											yl_tips.success("忽略成功！！");
										}else{
											yl_tips.error("服务器响应错误，请稍后再试！");
										}
									}
								});
							});
					},
					//弹出窗口的操作
					verify_message:function(){
						$('#verify-modal-form').on('shown.bs.modal', function () {
							var rowId=$(userverify.audit_grid_table).jqGrid('getGridParam','selrow');
							var rowData = $(userverify.audit_grid_table).jqGrid('getRowData',rowId);
							$("#view-verify-realname").html(rowData.real_name);
							$("#view-verify-nick_name").html(rowData.nick_name);
							$("#view-verify-email").html(rowData.email);
							$("#view-verify-join_time").html(rowData.join_time);
							$("#view-verify-reason").html(rowData.reason);
							$("#verify-save-btn").off("click.userverify").on("click.userverify",function(){
								$.ajax({
									type : 'get',
									cache : false,
									url : "/verify/passVerify",
									datatype:"json",
									data :{
										id:rowId,
										s_id:$("#user-type-select").val()
									},
									error : function(request) {
										yl_tips.error("服务器响应错误，请稍后再试！");
										return false;
									},
									success : function(data) {
										if(data==true){
											$(userverify.audit_grid_table).jqGrid().trigger('reloadGrid');
											yl_tips.success("审核通过！");
											$('#verify-close-model').trigger("click");
										}else{
											yl_tips.error("服务器响应错误，请稍后再试！");
										}
									}
								});
							});
							
							$("#verify-cancel-btn").off("click.userverify").on("click.userverify",function(){
								$.ajax({
									type : 'get',
									cache : false,
									url : "/verify/ignoreVerify",
									datatype:"json",
									data :{
										id:rowId
									},
									error : function(request) {
										yl_tips.error("服务器响应错误，请稍后再试！");
										return false;
									},
									success : function(data) {
										if(data==true){
											$(userverify.audit_grid_table).jqGrid().trigger('reloadGrid');
											yl_tips.success("忽略成功！");
											$('#verify-close-model').trigger("click");
										}else{
											yl_tips.error("服务器响应错误，请稍后再试！");
										}
									}
								});
							});
						});
					}
			};
			userverify.init();
});

