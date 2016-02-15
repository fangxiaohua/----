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
				jqGrid();
				function jqGrid(){
					//jqgrid宽度自适应//jqgrid宽度自适应
					yl_tools.jqGrid_autowidth(grid_selector);
					//jqgrid相关配置
					jQuery(grid_selector).jqGrid({
						ajaxGridOptions : {
							timeout : 500000  //设置ajax加载超时时间
						},
						url : "/org/getOrgList", //这是Action的请求地址   
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
						caption:"组织管理",//表格标题
						//重置默认json解析参数
						jsonReader:{ 
							root:"records", // json中代表实际模型数据的入口  
							page:"currentpage", // json中代表当前页码的数据  
							total:"totalpage", // json中代表页码总数的数据  
							records:"totalrecord",  // json中代表数据行总数的数据  
							repeatitems:false    // 如果设为false，则jqGrid在解析json时，会根据name来搜索对应的数据元素（即可以json中元素可以不按顺序）；而所使用的name是来自于colModel中的name设定。  
						},
						colNames:['ID','机构名称','机构类型','机构编号','机构介绍','是否在首页显示', '首页显示排序 ','该机构发布的课程前缀','该机构网站标题',' '],
						colModel:[
						     //主键ID
							{name:'id',index:'id', width:0, sorttype:"int", 
								hidden:true,search:false,sortable:false,editable:false,align:"center",key:true
							},
							//机构名称
							{name:'sch_name',index:'sch_name',width:90, editable:false},
							//机构类型
							{name:'org_type',index:'org_type', width:90,editable:false,
								formatter:function(cellvalue,options,rowObject){
									if(cellvalue==0) return "高校";
									if(cellvalue==1) return "第三方机构";
								}		
							},
							//机构编号
							{name:'sch_no',index:'sch_no', width:100, editable: false},
							//机构介绍
							{name:'introduction',index:'introduction',hidden:true, width:0, editable:false, viewable:true,editrules:{edithidden:true},
							      formatter:function(cellvalue,options,rowObject){
							    	    return cellvalue==null?"":cellvalue;
							      },
							},
							//是否首页显示
							{name:'is_on_homepage',index:'is_on_homepage', width:0, editable:false, viewable:true,editrules:{edithidden:true},
							      formatter:function(cellvalue,options,rowObject){
							      		 return cellvalue==1?"是":"否";
							      },
							},
							//首页排序
							{name:'sort_index',index:'sort_index', width:90},
							//发布的课程前缀
							{name:'course_prefix',index:'course_prefix',hidden:true, width:0, editable:false, viewable:true,editrules:{edithidden:true},
							      formatter:function(cellvalue,options,rowObject){
							    	    return cellvalue==null?"":cellvalue;
							      },
							},
							//该机构网站标题
							{name:'sch_website_title',index:'sch_website_title',hidden:true, width:0, editable:false, viewable:true,editrules:{edithidden:true},
							      formatter:function(cellvalue,options,rowObject){
							    	    return cellvalue==null?"":cellvalue;
		
							      },
							},
							//操作
							{name:'myac',index:'', width:100, fixed:true, sortable:false, resize:false,viewable:false,
								formatter:function(cellvalue,options,rowObject){
									return '<div style="margin-left:8px;">'+/*yl_tools.jqGrid_viewbtnstr("group")+*/yl_tools.jqGrid_editbtnstr+yl_tools.jqGrid_delbtnstr+'</div>';
								}									
							}
						], 
						viewrecords : true, //是否显示行数
						rowNum:10, //每页显示记录数  
						rowList:[1,10,20,50,100], //可调整每页显示的记录数
						pager : pager_selector, //分页工具栏  
						altRows: true,
						//toppager: true,
						rownumbers:true,//添加左侧行号
						//jqgrid加载完成后执行
						loadComplete : function() {
							del();
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
						editurl: "/org/delOrg"
					});
					//trigger window resize to make the grid get the correct size
					$(window).triggerHandler('resize.jqGrid');
		
					//分页工具栏设置
					jQuery(grid_selector).jqGrid('navGrid',pager_selector,
						{ 	//navbar options
							edit: false,
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
						},{},{},
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
						$("#grid-table").jqGrid('setGridParam',{page:1,	postData:{q:$("#search").val().trim()}}).trigger('reloadGrid');
					});
					//回车条件查询
					 $('#search').bind('keypress',function(event){
				            if(event.keyCode == "13")    
				            {
				            	$(grid_selector).jqGrid('setGridParam',{page:1,	postData:{q:$("#search").val().trim()}}).trigger('reloadGrid');
				            }
				      });
				}
				//添加页面保存按钮，验证
				$("#add-save-btn").on("click",function(){
					var add_name=$("#add-name").val();
					var add_type=$("#add-type").val();
					var add_no=$("#add-no").val();
					//验证
					if(yl_tools.isEmpty(add_name)){
						yl_tips.error("机构全称不能为空！");
						return false;	
					}
					else if(yl_tools.isEmpty(add_no)){
						yl_tips.error("机构编号不能为空！");
						return false;
					}
					else if(!validSchNo({"no":add_no,"id":0})){
							yl_tips.error("该机构编号已被使用,请更换！");
					}
					else{
						//验证成功,ajax保存
						$.ajax({
							type : 'POST',
							cache : false,
							url : '/org/addOrg',
							datatype:"script",
							data :{
								schNo:add_no,
								schName:add_name,
								orgType:add_type
							},
							error : function(request) {
								yl_tips.error("服务器响应错误，操作失败！");
								return false;
							},
							success : function(data) {
								if(data==true){
									$(grid_selector).jqGrid().trigger('reloadGrid');
									yl_tips.success("添加机构信息成功！");
									$("#add-cancel-btn").trigger('click');
								}
							}
						});
					}
				});
				
				
				//修改页面保存按钮,验证
				$("#edit-save-btn").on("click",function(){
					var edit_id = jQuery(grid_selector).jqGrid('getGridParam','selrow');
					var edit_name=$("#edit-name").val();
					var edit_no=$("#edit-no").val();
					var edit_type=$("#edit-type").val();
					
					if(yl_tools.isEmpty(edit_name)){
						yl_tips.error("机构编号不能为空！");
						return false;
					}
					else if(yl_tools.isEmpty(edit_no)){
						yl_tips.error("机构编号不能为空！");
						return false;
					}
					else if(!validSchNo({"no":edit_no,"id":edit_id})){
							yl_tips.error("该机构编号已被使用,请更换！");
					}else{
						$.ajax({
							type : 'POST',
							cache : false,
							url : '/org/updateOrg',
							datatype:"script",
							data :{
								id:edit_id,
								schNo:edit_no,
								schName:edit_name,
								orgType:edit_type
							},
							error : function(request) {
								yl_tips.error("服务器响应错误，操作失败！");
								return false;
							},
							success : function(data) {
								if(data==true){
									$(grid_selector).jqGrid().trigger('reloadGrid');
									yl_tips.success("修改机构信息成功！");
									$("#edit-cancel-btn").trigger('click');
								}
							}
						});
					}
				});
				//删除
				function del(){
					$(".jqGrid_delbtnstr").on("click",function() {
						setTimeout(function(){
							var del_id = jQuery(grid_selector).jqGrid('getGridParam','selrow');
							if(yl_tools.isEmpty(del_id)){
								yl_tips.error("请先选择一条记录！");
								return false;
							}
							bootbox.confirm({
								message:"你确定删除该条机构信息吗?",
								buttons: {
									  confirm: {
										 label: "删除",
										 className: "btn-primary btn-sm",
									  },
									  cancel: {
										 label: "取消",
										 className: "btn-sm",
									  }
								},callback: function(result){
										if(result) {
											$.ajax({
												type : 'GET',
												cache : false,
												url : '/org/delOrg',
												datatype:"script",
												async:false,
												data :{
													id:del_id
												},
												error : function(request) {
													yl_tips.error("服务器响应错误，操作失败！");
													return false;
												},
												success : function(data) {
													if(data==true){
														$(grid_selector).jqGrid().trigger('reloadGrid');
														yl_tips.success("删除选定机构信息成功！");
													}
												}
											});
										}
									}
							   });
						},0);
					});
				}
				//重置密码
				$("#initsch-reset-psw").on("click.group",function(){
					yl_tips.error("该操作会将密码重置为123456，还没做。。。。。。");
				});
				
				//初始化云高校
				$("#initsch-save-btn").on("click",function(){
					var sch_id = jQuery(grid_selector).jqGrid('getGridParam','selrow');
					var rowDatas = $(grid_selector).jqGrid('getRowData', sch_id);
					var  schName= rowDatas["sch_name"];
					var sch_domain=$("#sch-domain").val();
					
					if(yl_tools.isEmpty(sch_domain)){
						yl_tips.error("高校域名前缀不可为空！");
						return false;
					/*}
					else if(!validSchNo({"no":edit_no,"id":edit_id})){
							bootbox.dialog({
								message: "<span class='bigger-110'>该高校域名前缀已被使用,请更换！</span>",
							});*/
					}else{
						$.ajax({
							type : 'POST',
							cache : false,
							url : '/org/initSchool',
							datatype:"script",
							data :{
								id:sch_id,
								domain:sch_domain,
								schName:schName
							},
							error : function(request) {
								yl_tips.error("服务器响应错误，操作失败！");
								return false;
							},
							success : function(data) {
								if(data==1){
									bootbox.dialog({
										message: "<span class='bigger-110'>初始化云高校成功！，初始化的高校内置超级管理员为账号："+sch_domain+"admin，密码：123456</span>",
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
									$("#initsch-cancel-btn").trigger('click');
								}else if(data==2){
									yl_tips.error(sch_domain+"已被使用");
								}
							}
						});
					}
				});
				
				//验证机构编号重复
				function validSchNo(args){
					$.ajax({
						type : 'POST',
						cache : false,
						url : '/org/validNo',
						datatype:"script",
						async:false,
						data :{
							schNo:args.no,
							id:args.id
						},
						error : function(request) {
							yl_tips.error("服务器响应错误，操作失败！");
							return false;
						},
						success : function(data) {
							$("#add-no").attr("data-vaild",data);
						}
					});
					if($("#add-no").attr("data-vaild")=="true") return true;
					else return false;
				}
				
				//获取一条组织信息
				function getOrg(args){
					$.ajax({
						type : 'GET',
						cache : false,
						url : '/org/getOrg',
						datatype:"script",
						async:false,
						data :{
							id:args.id
						},
						error : function(request) {
							yl_tips.error("服务器响应错误，操作失败！");
							return false;
						},
						success : function(data) {
							var flag=args.oper;
							if(flag=="edit"){
								$("#edit-no").val(data.sch_no);
								$("#edit-name").val(data.sch_name);
								$("#edit-type").val(data.org_type);
							}else if(flag=="view"){
								
							}
							
						}
					});
				}
				
				
				//获取一条组织信息
				function getOrgDomain(args){
					$.ajax({
						type : 'GET',
						cache : false,
						url : '/org/getDomain',
						datatype:"json",
						data :{
							schId:args.id
						},
						error : function(request) {
							yl_tips.error("服务器响应错误，操作失败！");
							return false;
						},
						success : function(data) {
							args.success(data);
						}
					});
				}
				
				beforeEditModelshowCallback();
				//修改弹窗回调函数
				function beforeEditModelshowCallback(){
					/*modal-form 弹出时所执行*/
					$('#edit-modal-form').on('shown.bs.modal', function () {
						   //设置用户 原有信息
							var id = jQuery(grid_selector).jqGrid('getGridParam','selrow');
							console.log(id+"edit_id");
						   	//初始用户信息
							getOrg({"id":id,"oper":"edit"});
					});
				}
				
				
				beforeViewModelshowCallback();
				//查看弹窗回调函数
				function beforeViewModelshowCallback(){
					/*modal-form 弹出时所执行*/
					$('#view-modal-form').on('shown.bs.modal', function () {
						getOrgDomain({
							id:jQuery(grid_selector).jqGrid('getGridParam','selrow'),
							success:function(data){
								if(data){
									$("#sch-domain").val(data.domain_name).attr("disabled","disabled");
									$("#initsch-cancel-btn").hide();
									$("#initsch-save-btn").hide();
									$("#init-sch-title1").hide();
									$("#init-sch-title2").show();
									$("#initsch-reset-psw").show();
								}else{
									$("#init-sch-title1").show();
									$("#init-sch-title2").hide();
									$("#initsch-cancel-btn").show();
									$("#initsch-save-btn").show();
									$("#sch-domain").val("").removeAttr("disabled");
									$("#initsch-reset-psw").hide();
								}
							}
						});
						
					});
				}	
				
				function enableTooltips(table) {
					$('.navtable .ui-pg-button').tooltip({container:'body'});
					$(table).find('.ui-pg-div').tooltip({container:'body'});
				}
		
			});
});