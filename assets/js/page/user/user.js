//@author:fangxiaohua
//@邮箱：abc2710712@qq.com
//@qq:1295168875
// 2014年10月27日 下午2:03:16 
//加载jqgrid相关依赖js包
	ace.load_ajax_scripts([
	                       "/assets/js/jquery-ui.min.js",
	    	               "/assets/js/jquery.ui.touch-punch.min.js"
	        ], function() {
			jQuery(function($) {
				var user={
						grid_selector : "#grid-table",
						pager_selector :"#grid-pager",
						init:function(){
							this.list();
							this.beforeEditModelshowCallback();
							this.edit_save();
							//机构查询
							yl_tools.group_search({
								div:"sch-search-1",
								openbtn:"#edit-sch",
								title:"机构查询",
								dafvalue:"",
								url:"/comm/getGroupList",
								onSelect:function(rowData){
									$("#edit-sch").val(rowData.sch_name);
									
									$("#edit-sch").attr("data-id",rowData.id);
								}
							});
						},
						list:function(){
							//jqgrid宽度自适应//jqgrid宽度自适应
							yl_tools.jqGrid_autowidth(user.grid_selector);
							//jqgrid相关配置
							jQuery(user.grid_selector).jqGrid({
								ajaxGridOptions : {
									timeout : 500000  //设置ajax加载超时时间
								},
								url : "/yhgl/getUserList", //这是Action的请求地址   
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
								colNames:['ID','邮件','昵称','真实姓名','最后登入时间','最后登录ip','注册时间','性别','年龄','住址','电话','职称','个人简介','机构名称','用户权限','是否可用 ',''],
								colModel:[
								     //主键ID
									{name:'id',index:'id', width:0, sorttype:"int", 
										hidden:true,search:false,sortable:false,editable:false,align:"center",key:true
									},
									//邮件
									{name:'email',index:'email',width:90, editable:false},
									//昵称
									{name:'nick_name',index:'nick_name',hidden:true, width:0, editable:false, viewable:true,editrules:{edithidden:true},
									      formatter:function(cellvalue,options,rowObject){
									       return cellvalue==null?"":cellvalue;
									      },
									},
									//真实姓名
									{name:'real_name',index:'real_name', width:150,editable:false},
									//最后登入时间
									{name:'last_login_time',index:'last_login_time',hidden:true, width:0, editable:false, viewable:true,editrules:{edithidden:true},
									      formatter:function(cellvalue,options,rowObject){
									       return cellvalue==null?"":cellvalue;
									      },
									},
									//最后登录时间
									{name:'ip',index:'ip',hidden:true, width:0, editable:false, viewable:true,editrules:{edithidden:true},
									      formatter:function(cellvalue,options,rowObject){
									       return cellvalue==null?"":cellvalue;
									      },
									},
									//注册时间
									{name:'join_time',index:'join_time',hidden:true, width:0, editable:false, viewable:true,editrules:{edithidden:true},
									      formatter:function(cellvalue,options,rowObject){
									       return cellvalue==null?"":cellvalue;
									      },
									},
									//性别 
									{name:'gender',index:'gender', width:70, editable: false,
										formatter:function(cellvalue,options,rowObject){
											if(cellvalue==0) return "男";
											if(cellvalue==1) return "女";
											else{
												return "未知";
											}
										}	
									},
									//年龄
									{name:'age',index:'age',hidden:true, width:0, editable:false, viewable:true,editrules:{edithidden:true},
									      formatter:function(cellvalue,options,rowObject){
									       return cellvalue==null?"":cellvalue;
									      },
									},
									//地址
									{name:'address',index:'address',hidden:true, width:0, editable:false, viewable:true,editrules:{edithidden:true},
									      formatter:function(cellvalue,options,rowObject){
									       return cellvalue==null?"":cellvalue;
									      },
									},
									//电话
									{name:'phone',index:'phone',hidden:true, width:0, editable:false, viewable:true,editrules:{edithidden:true},
									      formatter:function(cellvalue,options,rowObject){
									       return cellvalue==null?"":cellvalue;
									      },
									},
									//职称
									{name:'title',index:'title',hidden:true, width:0, editable:false, viewable:true,editrules:{edithidden:true},
									      formatter:function(cellvalue,options,rowObject){
									       return cellvalue==null?"":cellvalue;
									      },
									},
									//个人简介
									{name:'introducation',index:'introducation',hidden:true, width:0, editable:false, viewable:true,editrules:{edithidden:true},
									      formatter:function(cellvalue,options,rowObject){
									       return cellvalue==null?"":cellvalue;
									      },
									},
									//机构名称
									{name:'sch_name',index:'sch_name', width:90},
									//角色名称
									{name:'roleName',index:'roleName', width:90},
									//是否显示状态
									{name:'status',index:'status', width:70, 
										formatter:function(cellvalue,options,rowObject){
											return cellvalue==1?"可用":"不可用";
										}
									},
									//操作
									{name:'myac',index:'', width:80, fixed:true, sortable:false, resize:false,viewable:false,
										formatter:function(cellvalue,options,rowObject){
											//yl_tools.jqGrid_viewbtnstr("user")
											return '<div style="margin-left:8px;">'+yl_tools.jqGrid_editbtnstr+'</div>';
										}
									}
								], 
								viewrecords : true, //是否显示行数
								rowNum:10, //每页显示记录数  
								rowList:[1,10,20,50,100], //可调整每页显示的记录数
								pager : user.pager_selector, //分页工具栏  
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
										
										$('.navtable .ui-pg-button').tooltip({container:'body'});
										$(table).find('.ui-pg-div').tooltip({container:'body'});
									}, 0);
								},
								//编辑保存路径
								editurl: "/kcgl/dataOperal"
							});
							//trigger window resize to make the grid get the correct size
							$(window).triggerHandler('resize.jqGrid');
				
							//分页工具栏设置
							jQuery(user.grid_selector).jqGrid('navGrid',user.pager_selector,
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
									view: true,
									viewicon : 'ace-icon fa fa-search-plus grey',
								},{},{},{},{},
								{
									//view record form
									top : 100,  //位置
				 					left: 200, //位置
									recreateForm: true,
									beforeShowForm: function(e){
										var form = $(e[0]);
										form.closest('.ui-jqdialog').find('.ui-jqdialog-title').wrap('<div class="widget-header" />');
									}
								}
							);
							$(document).on('ajaxloadstart', function(e) {
								$(user.grid_selector).jqGrid('GridUnload');
								$('.ui-jqdialog').remove();
							});
							
							//条件查询
							$("#search_btn").on("click",function(){
								$(user.grid_selector).jqGrid('setGridParam',{page:1,	postData:{q:$("#search").val().trim()}}).trigger('reloadGrid');
							});
							//回车条件查询
							 $('#search').bind('keypress',function(event){
						            if(event.keyCode == 13)    
						            {
						            	$("#search_btn").trigger('click');
						            }
						      });
						
						},
						//修改弹窗回调函数
						beforeEditModelshowCallback:function(){
							/*modal-form 弹出时所执行*/
							$('#edit-modal-form').on('show.bs.modal', function () {
								   $('#edit-modal-form').find('a:first-child').css('width' , '270px');
								   $('#edit-modal-form').find('.chosen-drop').css('width' , '270px'); 
								  	//加载角色列表
								    getRoleList();
								   //设置用户 原有信息
									var id = jQuery(user.grid_selector).jqGrid('getGridParam','selrow');
								   	//初始用户信息
									getUser({
										"id":id,
										success:function(data){
											$("#edit-eamil").val(data.email);
											$("#edit-name").val(data.real_name);
											$("#edit-sch").attr("data-id",data.sch_id);
											$("#edit-sch").val(data.sch_name);
											if(data.status==1){
												$("#edit-status")[0].checked=true;
											}else{
												$("#edit-status")[0].checked=false;
											}
											$("#edit-role").val(data.role_id);
										}
									});
									//获取 角色列表	
									function getRoleList(){
										yl_ajaxAction.ajax_select({
										  			selectActionUrl: '/yhgl/getRoleList',
										  			selectReponseFun:function(data){
										  				var rolestr="";
														for(var i=0;i<data.length;i++){
															rolestr+="<option value="+data[i].id+">"+data[i].name+"</option>";
														}
														$("#edit-role").html(rolestr);
										 			}
											});
									}
									
									//根据id获取一条用户信息 
									function getUser(args){
										yl_ajaxAction.ajax_select({
								  			selectActionUrl: '/yhgl/getUser',
								  			selectActionParams:{
								  				id:args.id
								  			},
								  			selectReponseFun:function(data){
								  				args.success(data);
								 			}
										});
									}
							});
						},
						edit_save:function(){
							//添加页面中的保存按钮,验证,提交
							$("#edit-save-btn").off("click.user").on("click.user",function(e){
								//获取用户填值
								var edit_id = jQuery(user.grid_selector).jqGrid('getGridParam','selrow');
								var edit_sch=$("#edit-sch").attr("data-id");
								var edit_status="";
								if($("#edit-status")[0].checked){
									edit_status=1;
								}else{
									edit_status=0;
								};
								var edit_role=$("#edit-role").val();
								if(yl_tools.isEmpty(edit_sch)){
									yl_tips.error("请先为该用户选一个机构！");
									return false;
								}
								else if(yl_tools.isEmpty(edit_role)){
									yl_tips.error("请先为该用户选一个角色！");
									return false;
								}else{
									//验证成功,ajax保存
									yl_ajaxAction.ajax_update({
								  			updateActionUrl:'/yhgl/updateUser',
								  			updateActionParams:{
								  				id:edit_id,
												status:edit_status,
												schId:edit_sch,
												roleId:edit_role,
								  			},
								  			updateReponseFun:function(data){
								  				if(data==true){
													$(user.grid_selector).jqGrid().trigger('reloadGrid');
													yl_tips.success("修改成功!");
													$("#edit-cancel-btn").trigger('click');
												}
								  			}
									 });
								}
							});
						}
				};
				user.init();
			});
});