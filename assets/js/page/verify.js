/**
 * @author:fangxiaohua
*  @邮箱：abc2710712@qq.com
*  @qq:1295168875
*   举报审核
*/	
ace.load_ajax_scripts([
                       null
	 ], function() {
	
			var verify={
					init:function(){
						//初始化用户类型下拉框
						verify.initUserType();
						//用户审核列表
						this.user_authList();
						
						this.verify_message();
					},
					//初始化用户类型下拉框
					initUserType:function(){
						var data =["所有","进行中","已解决","已关闭"];
						var options="";
						for(var i in data){
							options+='<option value="'+i+'">'+data[i]+'</option>';
						}
						$("#verify-status").html(options);
					},
					audit_grid_table:"#audit-grid-table",
					audit_grid_pager:"#audit-grid-pager",
					//用户审核列表
					user_authList:function(){
						//jqgrid宽度自适应
						yl_tools.jqGrid_autowidth(verify.audit_grid_table);
						//jqgrid相关配置
						jQuery(verify.audit_grid_table).jqGrid({
							ajaxGridOptions : {
								timeout : 500000  //设置ajax加载超时时间
							},
							url : "/verify/list", //这是Action的请求地址   
							//重置默认 请求参数
							prmNames:{
								 page:"pageNo",    // 表示请求页码的参数名称  
								 rows:"pageSize"    // 表示请求行数的参数名称
							}, 
							postData:{//条件查询后台传值
								q:"",
								status:"0"
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
							colNames:['ID','被举报账号','举报账号','举报理由','举报时间','信息状态','操作'],
							colModel:[
							     //主键ID
								{name:'id',index:'id', width:0, sorttype:"int", 
									hidden:true,search:false,sortable:false,editable:false,align:"center",key:true
								},
								//举报人员
								{name:'raccount',index:'raccount',editable:false,sortable:false},
								//被举报人员
								{name:'braccount',index:'braccount',editable:false,sortable:false},
								//举报理由
								{name:'reason',index:'reason',sortable:false, editable:false},
								//举报时间
								{name:'report_time',index:'report_time',sortable:false,editable:false},
								//信息状态
								{name:'status',index:'status',sortable:false,editable:false,
									formatter:function(cellvalue,options,rowObject){
											var flag="进行中";
											switch(cellvalue){
												case 1 : flag = "进行中"; break; 
												case 2 : flag = "已解决"; break; 
												case 3 : flag =  "已关闭"; break;
											}
											return flag;
									}
								},
								//操作
								{name:'myac',index:'',  fixed:true, sortable:false, resize:false,editable:false,viewable:false,
									formatter:function(cellvalue,options,rowObject){
										var status =rowObject.status;
										//申请信息查看按钮  		    
										var jqGrid_verifybtnstr=['<div title="查看举报详情" style="float:left;cursor:pointer;margin-left:5px;" class="ui-pg-div ui-inline-save" name="jqGrid_verifybtnstr" href="#verify-modal-form" role="button" data-toggle="modal"  onmouseover="jQuery(this).addClass('+"'ui-state-hover'"+');" onmouseout="jQuery(this).removeClass('+"'ui-state-hover'"+');" data-original-title="查看举报详情">',
																			 						'<span class="ui-icon ace-icon fa fa-search-plus blue"></span>',
																			 		   '</div>'].join("");
									   //忽略按钮		    
									   var jqGrid_ignorebtnstr=['<div title="关闭" style="float:left;cursor:pointer;margin-left:5px;" class="ui-pg-div ui-inline-save"  role="button"  onmouseover="jQuery(this).addClass('+"'ui-state-hover'"+');" onmouseout="jQuery(this).removeClass('+"'ui-state-hover'"+');" data-original-title="关闭">',
																				 				 		'<span class="ui-icon ace-icon fa fa-power-off  red ignore_auth" data-id=${id}></span>',
																				 		 '</div>'].join(""); 			
									   var jqGrid_activebtnstr=['<div title="激活" style="float:left;cursor:pointer;margin-left:5px;" class="ui-pg-div ui-inline-save"  role="button"  onmouseover="jQuery(this).addClass('+"'ui-state-hover'"+');" onmouseout="jQuery(this).removeClass('+"'ui-state-hover'"+');" data-original-title="激活">',
																			 				 		'<span class="ui-icon ace-icon fa fa-play  green active_auth" data-id=${id}></span>',
																			 		 '</div>'].join(""); 			
									   if(status==1){
										   return '<div style="margin-left:8px;">'+juicer(jqGrid_verifybtnstr,{})+'</div>';
									   }else if(status==2){
										   return '<div style="margin-left:8px;">'+juicer(jqGrid_ignorebtnstr,{"id":rowObject.id})+'</div>';
									   }else{
										   return '<div style="margin-left:8px;">'+juicer(jqGrid_activebtnstr,{"id":rowObject.id})+'</div>';
									   }
									}
								},
							], 
							viewrecords : true, //是否显示行数
							rowNum:10, //每页显示记录数  
							rowList:[10,20,50,100], //可调整每页显示的记录数
							pager : verify.audit_grid_pager, //分页工具栏  
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
									verify.ignore_auth();
								}, 0);
							}
						});
						//trigger window resize to make the grid get the correct size
						$(window).triggerHandler('resize.jqGrid');
			
						//分页工具栏设置
						jQuery(verify.audit_grid_table).jqGrid('navGrid',verify.audit_grid_pager,
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
								$(verify.audit_grid_table).jqGrid('GridUnload');
								$('.ui-jqdialog').remove();
						});
						//条件查询
						$("#audit_search_btn").off("click.userverify").on("click.userverify",function(){
								$(verify.audit_grid_table).jqGrid('setGridParam',{page:1,	postData:{q:$("#audit-search").val().trim(),status:$("#verify-status").val()}}).trigger('reloadGrid');
						});
						//回车条件查询
						 $('#audit-search').bind('keypress',function(event){
					            if(event.keyCode == "13")    
					            {
					            	$(verify.audit_grid_table).jqGrid('setGridParam',{page:1,	postData:{q:$("#audit-search").val().trim(),status:$("#verify-status").val()}}).trigger('reloadGrid');
					            }
					      });
							//角色改变重新加载jqgrid
							$("#verify-status").on("change",function(){
								console.log("========");
								       $(verify.audit_grid_table).jqGrid('setGridParam',{page:1,	postData:{q:$("#audit-search").val().trim(),status:$("#verify-status").val()}}).trigger('reloadGrid');
							});
					},
					//审核忽略
					ignore_auth:function(){
						
							//忽略按钮执行的操作
							$(".ignore_auth").off("click.userverify").on("click.userverify",function(e){
								var rowId=$(e.target).attr("data-id");
								yl_ajaxAction.ajax_update({
						  			updateActionUrl:"/verify/close",
						  			updateActionParams:{
						  				id:rowId
						  			},
						  			updateReponseFun:function(data){
						  				if(data=="true"){
											$(verify.audit_grid_table).jqGrid().trigger('reloadGrid');
											yl_tips.success("关闭成功！");
										}else{
											yl_tips.error("关闭失败！");
										}
						  			}
								});
							});
						
						$(".active_auth").off("click.userverify").on("click.userverify",function(e){
							var rowId=$(e.target).attr("data-id");
							yl_ajaxAction.ajax_update({
					  			updateActionUrl:"/verify/active",
					  			updateActionParams:{
					  				id:rowId
					  			},
					  			updateReponseFun:function(data){
					  				if(data=="true"){
										$(verify.audit_grid_table).jqGrid().trigger('reloadGrid');
										yl_tips.success("激活成功！");
									}else{
										yl_tips.error("激活失败！");
									}
					  			}
							});
						});
					},
					//弹出窗口的操作
					verify_message:function(){
						$('#verify-modal-form').on('show.bs.modal', function () {
							var rowId=$(verify.audit_grid_table).jqGrid('getGridParam','selrow');
							var rowData = $(verify.audit_grid_table).jqGrid('getRowData',rowId);
							$("#view-verify-reason").html(rowData.reason);
							$("#view-verify-raccount").html(rowData.raccount);
							$("#view-verify-braccount").html(rowData.braccount);
							$("#view-verify-report-time").html(rowData.report_time);
							
							$("#verify-save-btn").off("click.userverify").on("click.userverify",function(){
								yl_ajaxAction.ajax_update({
							  			updateActionUrl:"/verify/fix",
							  			updateActionParams:{
							  				id:rowId,
							  			},
							 			updateReponseFun:function(data){
							 				if(data=="true"){
												$(verify.audit_grid_table).jqGrid().trigger('reloadGrid');
												yl_tips.success("确认解决成功!");
												$('#verify-close-model').trigger("click");
											}else{
												yl_tips.error("确认解决失败!");
											}
							  			}
								 });
							});
						});
					}
			};
			verify.init();
});

