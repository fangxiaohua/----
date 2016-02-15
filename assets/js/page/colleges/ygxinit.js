//@author:fangxiaohua
//@邮箱：abc2710712@qq.com
//@qq:1295168875
// 2014年10月27日 下午2:03:16 
//加载jqgrid相关依赖js包
	//加载jqgrid相关依赖js包
	ace.load_ajax_scripts([
	                       "/assets/js/jquery-ui.min.js",
	                       "/assets/js/jquery.gritter.min.js"
	 ], function() {
		void(function($){
					var ygxinit={
							  //重置密码
							  jqGrid_resetpw:['<div title="" style="float:left;cursor:pointer;margin-left:5px;" class="ui-pg-div ui-inline-del" name="jqGrid_reflashbtnstr"  onmouseover="jQuery(this).addClass('+"'ui-state-hover'"+');" onmouseout="jQuery(this).removeClass('+"'ui-state-hover'"+');" title="重置密码" data-original-title="重置密码">',
									  '<span class="ui-icon ace-icon fa fa-refresh green jqGrid_resetpw"></span>',
							  '</div>'].join(""),						
					     	//页面初始化
							init:function(){
								ygxinit.jqgird_ygxinitlist();
								ygxinit.initSchool();
								
								//机构动态查询框
								yl_tools.group_search({
									div:"sch-search-2",
									openbtn:"#init-sch-id",
									title:"机构查询",
									dafvalue:"",
									url:"/ygxInit/getGroupList",
									onSelect:function(rowData){
										$("#init-sch-id").val(rowData.sch_name);
										$("#init-sch-id").attr("data-id",rowData.id);
									}
								});
							},
							//主列表
							grid_selector : "#ygxinit-grid-table",
							pager_selector : "#ygxinit-grid-pager",
							jqgird_ygxinitlist:function(){
								//jqgrid宽度自适应//jqgrid宽度自适应
								yl_tools.jqGrid_autowidth(ygxinit.grid_selector);
								//jqgrid相关配置
								$(ygxinit.grid_selector).jqGrid({
									ajaxGridOptions : {
										timeout : 500000  //设置ajax加载超时时间
									},
									url : "/ygxInit/getAlreadInitList", //这是Action的请求地址   
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
									caption:"云高校",//表格标题
									//重置默认json解析参数
									jsonReader:{ 
										root:"records", // json中代表实际模型数据的入口  
										page:"currentpage", // json中代表当前页码的数据  
										total:"totalpage", // json中代表页码总数的数据  
										records:"totalrecord",  // json中代表数据行总数的数据  
										repeatitems:false    // 如果设为false，则jqGrid在解析json时，会根据name来搜索对应的数据元素（即可以json中元素可以不按顺序）；而所使用的name是来自于colModel中的name设定。  
									},
									colNames:['id','sch_id','云高校域名前缀','云高校名称','云高校编号','云高校介绍','是否启用','操作'],
									colModel:[
									     //高校主键ID
									     {name:'id',index:'id', width:0, sorttype:"int", 
											hidden:true,search:false,sortable:false,editable:false,align:"center",key:true
										},
										{name:'schId',index:'schId', width:0, sorttype:"int", 
											hidden:true,search:false,sortable:false,editable:false,align:"center"
										},
										//云高校域名前缀
										{name:'domain_name',index:'domain_name',width:90, editable:false,
											editoptions: {maxlength:11},
											editrules:{required:true,custom:true, custom_func: function(value, colname){ 
												var id = jQuery(ygxinit.grid_selector).jqGrid('getGridParam','selrow');
													    if (!ygxinit.validateDomain({"id":id,"sch_domain":value})) {  
													         return [false,value+"已被使用"];  
													    }else{  
													           return [true,""];  
													    }  	
												}
											}
										},
										//云高校名称名称
										{name:'sch_name',index:'sch_name',width:90, editable:false},
										//云高校编号
										{name:'sch_no',index:'sch_no', width:100, editable: false},
										//机构介绍
										{name:'introduction',index:'introduction',width:100, editable: false,
										      formatter:function(cellvalue,options,rowObject){
										    	    return cellvalue==null?"":cellvalue;
										      },
										},
										{name:'status',index:'status',  viewable:true,
											editable: true,edittype:"checkbox",editoptions: {value:"是:否"},unformat: aceSwitch
										},
										//操作
										{name:'myac',index:'', width:100, fixed:true, sortable:false, resize:false,viewable:false,
											formatter:'actions', 
											formatoptions:{ 
												keys:true,
												delbutton: false,//disable delete button
												//delOptions:{recreateForm: false, beforeShowForm:beforeDeleteCallback},
												//editformbutton:true, editOptions:{recreateForm: true, beforeShowForm:beforeEditCallback}
											}							
										}
									], 
									viewrecords : true, //是否显示行数
									rowNum:10, //每页显示记录数  
									rowList:[1,10,20,50,100], //可调整每页显示的记录数
									pager : ygxinit.pager_selector, //分页工具栏  
									altRows: true,
									//toppager: true,
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
											
											enableTooltips(table);
											
												var datalist = data.records;
												//密码重置按钮处理
												for(var i in datalist){
													$("#jEditButton_"+datalist[i].id+"").after("&nbsp;"+ygxinit.jqGrid_resetpw);
												}
												//重置密码
												$(".jqGrid_resetpw").off("click.ygxinit").on("click.ygxinit",function(){
													setTimeout(function(){
														var id = $(ygxinit.grid_selector).jqGrid('getGridParam','selrow');
														var domain_name = $(ygxinit.grid_selector).jqGrid("getRowData", id).domain_name;   //获得第一行的数据
														var sch_name=$(ygxinit.grid_selector).jqGrid("getRowData", id).sch_name;  
														var schId=$(ygxinit.grid_selector).jqGrid("getRowData", id).schId;  
														yl_ajaxAction.ajax_update({
												 			updateActionUrl:'/ygxInit/resetPwd',
												  			updateActionParams:{
												  				domain:domain_name,
												  				schId:schId
												  			},
												  			updateReponseFun:function(data){
												  					if(data){
												  						$.gritter.add({
												  							title: '密码重置成功',
												  							text: "<span class='bigger-110'>"+sch_name+"云高校密码重置完成，重置的高校内置超级管理员密码为：<font color='red'>yunlu2008</font></span>",
												  							class_name: 'gritter-info gritter-center gritter-warning gritter-light'
												  						});
												  					}else{
												  						yl_tips.error("系统错误,密码重置失败!");
												  					}
												  			}
														});
													},0);
												});
										}, 0);
									},
									//编辑保存路径
									editurl: "/ygxInit/dataOpearl"
								});
								//trigger window resize to make the grid get the correct size
								$(window).triggerHandler('resize.jqGrid');
					
								//分页工具栏设置
								jQuery(ygxinit.grid_selector).jqGrid('navGrid',ygxinit.pager_selector,
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
									},{
										//edit record form
										closeAfterEdit: true,
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
									$(ygxinit.grid_selector).jqGrid('GridUnload');
									$('.ui-jqdialog').remove();
								});
								//条件查询
								$("#search_btn").off("click.ygxinit").on("click.ygxinit",function(){
										$(ygxinit.grid_selector).jqGrid('setGridParam',{page:1,	postData:{q:$("#search").val().trim()}}).trigger('reloadGrid');
								});
								//回车条件查询
								 $('#search').bind('keypress',function(event){
							            if(event.keyCode == "13")    
							            {
							            	$(ygxinit.grid_selector).jqGrid('setGridParam',{page:1,	postData:{q:$("#search").val().trim()}}).trigger('reloadGrid');
							            }
							      });
								 
								function enableTooltips(table) {
									$('.navtable .ui-pg-button').tooltip({container:'body'});
									$(table).find('.ui-pg-div').tooltip({container:'body'});
								}
								//将编辑复选框格式化
								function aceSwitch( cellvalue, options, cell ) {
									setTimeout(function(){
										var target=$(cell).find('input[type=checkbox]');
											target.addClass('ace ace-switch ace-switch-5')
											.after('<span class="lbl"></span>');
										
									}, 0);
								}
							},
							//初始化云高校
							initSchool:function(){
								$("#initsch-save-btn").off("click.ygxinit").on("click.ygxinit",function(){
									var sch_id = $("#init-sch-id").attr("data-id");
									var  schName= $("#init-sch-id").val();
									var sch_domain=$("#init-sch-domain").val();
									if(yl_tools.isEmpty(sch_domain)){
										yl_tips.error("高校二级域名前缀不能为空!");
										return false;
									}
									if(sch_id==-1){
										yl_tips.error("请选择需要初始化的机构或高校!");
										return false;
									}
									bootbox.confirm({
										message:"<p>您确定初始化<font style='color:red;'>"+schName+"</font>为云高校吗?域名前缀为<font  style='color: red;'>"+sch_domain+"</font>吗?</p><p style='color: red;'>注:云高校初始化后将不可修改!</p>", 
										buttons: {
											  confirm: {
												 label: "确定",
												 className: "btn-primary btn-sm",
											  },
											  cancel: {
												 label: "取消",
												 className: "btn-sm",
											  }
										},	
										callback:function(result) {
											if(result){
												yl_ajaxAction.ajax_add({
										  			addActionUrl:'/ygxInit/initSchool',
										  			addActionParams:{
											  				id:sch_id,
															domain:sch_domain,
															schName:schName
										  			},
										  			addReponseFun:function(data){
										  				if(data==1){
										  					$("#initsch-cancel-btn").trigger('click');
															$(ygxinit.grid_selector).jqGrid('setGridParam',{page:1,	postData:{q:$("#search").val().trim()}}).trigger('reloadGrid');
										  						$.gritter.add({
										  							title: '初始化云高校成功！',
										  							text: "<span class='bigger-110'>"+schName+"云高校初始化完成，初始化的高校内置超级管理员为账号：<font color='red'>"+sch_domain+"admin</font>，密码：<font color='red'>yunlu2008</font></span>",
										  							class_name: 'gritter-info gritter-center gritter-light'
										  						});
														}else if(data==2){
															yl_tips.error(sch_domain+"已被使用");
														}
										  			}
											 });
											}
										}
									});
								});
							},
							//domain唯一性验证验证
							validateDomain:function(args){
								 yl_ajaxAction.ajax_base({
							  			actionType:"POST",
							  			actionUrl:'/ygxInit/validateDomain',
							  			isAsync:false,
							  			reposeType:"script",
							  			actionParams:{
							 				"id":args.id,
												"domain":$.trim(args.sch_domain)
							  			},
							  			succFun:function(data){
							  				$("#add-modal-form").data("flag",data);
							 			}
								})
								return  $("#add-modal-form").data("flag");
						}
				}
			ygxinit.init();
		})(jQuery);	
});