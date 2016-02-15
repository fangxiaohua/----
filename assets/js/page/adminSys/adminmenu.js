//@author:fangxiaohua
//@邮箱：abc2710712@qq.com
//@qq:1295168875
// 2014年10月27日 下午2:03:16 
//加载jqgrid相关依赖js包	
	ace.load_ajax_scripts([
	                       null
	], function() {
		
		var adminmenu={
				//页面初始化
				init:function(){
					//创建jqgrid
					adminmenu.jqgrid_adminmenuList();
					//创建新的父节点
					adminmenu.addMenu();
					//添加子节点
					adminmenu.addChild();
					//添加子级菜单弹窗，回调函数
					adminmenu.beforeAddModelshowCallback();
				},
				grid_selector : "#menu-treegrid",
				pager_selector :  "#menu-treegrid-pager",
				//菜单列表相关设置
				jqgrid_adminmenuList:function(){
					//jqgrid宽度自适应
					yl_tools.jqGrid_autowidth(adminmenu.grid_selector);
					jQuery(adminmenu.grid_selector).jqGrid({
						ajaxGridOptions : {
							timeout : 500000  //设置ajax加载超时时间
						},
					    treeGrid: true,
					    treedatatype: "json",
					    datatype: "json",
						treeGridModel:"adjacency",
						ExpandColumn:"tree",
						ExpandColClick: true, 
						url : "/adminMenu/getMenuList", //这是Action的请求地址   
						prmNames:{
							 page:"pageNo",    // 表示请求页码的参数名称  
							 rows:"pageSize"    // 表示请求行数的参数名称
						}, 
						postData:{//条件查询后台传值
							q:""
						},
						mtype: "POST",
						width: $(".page-content").width(),
						caption: "菜单管理",
						jsonReader: {      
							root:"records", // json中代表实际模型数据的入口  
							page:"currentpage", // json中代表当前页码的数据  
							total:"totalpage", // json中代表页码总数的数据  
							records:"totalrecord",  // json中代表数据行总数的数据  
							repeatitems:false    // 如果设为false，则jqG    
						},
						treeReader : {  
							level_field: "level",  
						    parent_id_field: "parent_id",   
						    leaf_field: "isLeaf",
						    expanded_field: "expanded"
						},
					   	colNames:["","id","名称","描述", "地址","logo","上级菜单","父id","排序","是否显示",'操作'],
					   	colModel:[
					   	    {name:"tree",index:"tree", viewable:true,align:"left",width:80,sortable:false,
					   	    	formatter:function(cellvalue,options,rowObject){
					   				if(rowObject.isLeaf==true){
					   					return "<span style='padding-left:"+(rowObject.level)*25+"px;' class='ui-icon ace-icon fa fa-circle-o center  blue'></span>";
					   				}else{
					   					var num = 0;
					   					return "<span id='Pid_"+rowObject.id+"' style='padding-left:"+(rowObject.level)*25+"px;' class='ui-icon ace-icon fa fa-caret-right center bigger-110 blue' data-closeif='close'></span>";
					   				}
					   			}
					   	    },
					   		{name:'id',index:'id',sorttype:"int",hidden:true,search:false,sortable:false,editable:false,align:"center",key:true},
					   		{name:'name',index:'name',  viewable:true,editable:true,sortable:false,align:"left",editoptions: {maxlength:25}},
					   		{name:'description',index:'description', viewable:true,editable:true,sortable:false, align:"center",editoptions: {maxlength:127}},
					   		{name:'url',index:'url', editable:true,viewable:true,  sortable:false,align:"center",editoptions: {maxlength:127}},	
					   		{name:'logo',index:'logo', editable:true,viewable:true, sortable:false, align:"center",editoptions: {maxlength:127}},	
					   		{name:'parent_name',index:'parent_name',editable:false, sortable:false,viewable:true,align:"center"},	
					   		{name:'parent_id',index:'parent_id',align:"center",hidden:true},
					   		{name:'sort',index:'', fixed:true, sortable:false, resize:false,editable:false,viewable:false,sortable:false,
								formatter:function(cellvalue,options,rowObject){
									var records=$(adminmenu.grid_selector).getGridParam('records');
									if(records==1||rowObject.sort_index==null){
										return "";
									}else if(rowObject.sort_index==1){
										return '<div style="margin-left:8px;">'+yl_tools.jqGrid_banbtnstr+yl_tools.jqGrid_downbtnstr("menu-treegrid")+'</div>';
									}else if(rowObject.number==rowObject.sort_index){
										return '<div style="margin-left:8px;">'+yl_tools.jqGrid_uphbtnstr("menu-treegrid")+yl_tools.jqGrid_banbtnstr+'</div>';
									}
									return '<div style="margin-left:8px;">'+yl_tools.jqGrid_uphbtnstr("menu-treegrid")+yl_tools.jqGrid_downbtnstr("menu-treegrid")+'</div>';
								}
							},
					   		//是否显示
							{name:'status',index:'status',  viewable:true,sortable:false,
								editable: true,edittype:"checkbox",editoptions: {value:"是:否"},unformat: adminmenu._aceSwitch,
								formatter:function(cellvalue,options,rowObject){
								return cellvalue=="是"?"是":"否";
							}},
							//操作
							{name:'myac',index:'', fixed:true, sortable:false, resize:false, viewable:false,
								formatter:'actions', 
								formatoptions:{ 
									keys:true,
									delbutton:false,
									delOptions:{recreateForm: true, beforeShowForm:adminmenu._beforeDeleteCallback},
								}
							}
					   	],
					   	//编辑保存路径
						editurl: "/adminMenu/menuOperal",
						viewrecords : true, //是否显示行数
						rowNum:10, //每页显示记录数  
						rowList:[10,20,50,100], //可调整每页显示的记录数
						altRows: true,
						loadComplete : function(data) {
							var datalist = data.records;
							$(".jqGrid_delbtnstr").closest("div").remove();
							
							for(var i in datalist){
								$("#jEditButton_"+datalist[i].id+"").before(juicer(yl_tools.jqGrid_addbtnstr,{}));
								if(datalist[i].isLeaf){
									$("#jEditButton_"+datalist[i].id+"").after(juicer(yl_tools.jqGrid_delbtnstr,{}));
								}
							}
							
							
							var table = this;
							setTimeout(function(){
								//排序操作
								adminmenu._menuSort(".jqGrid_sortbtnstrmenu-treegrid");
								//替换jqgrid中的分页按钮图标
								yl_tools.jqGrid_updatePagerIcons(table);
								//更换导航栏中的行为图标
								yl_tools.jqGrid_updateActionIcons(table);
								//更换选择框的样式
								yl_tools.jqGrid_styleCheckbox(table);
								$(adminmenu.grid_selector).jqGrid( 'setGridHeight', $(window).height()*0.5 );
								adminmenu._enableTooltips(table);
								adminmenu._treenode();
								//删除原默认的图标层
								$(".tree-wrap.tree-wrap-ltr").remove();
								adminmenu._deltreenode();
							},0);
						}
					});
					//条件查询
					$("#admin_menu_search_btn").off("click.adminmenu").on("click.adminmenu",function(){
						$(adminmenu.grid_selector).jqGrid('setGridParam',{page:1,	postData:{q:$("#admin_menu_search").val().trim()}}).trigger('reloadGrid');
					});
					//回车条件查询
					 $('#admin_menu_search').bind('keypress',function(event){
				            if(event.keyCode == "13")    
				            {
				            	$(adminmenu.grid_selector).jqGrid('setGridParam',{page:1,	postData:{q:$("#admin_menu_search").val().trim()}}).trigger('reloadGrid');
				            }
				      });
				},
				//删除行
				_deltreenode:function(){
					$(".jqGrid_delbtnstr").off("click.adminmenu").on("click.adminmenu",function(e){
						setTimeout(function(){
							var rowId=$(adminmenu.grid_selector).jqGrid('getGridParam','selrow');
							//验证成功,ajax保存
							$.ajax({
								type : 'GET',
								cache : false,
								url : '/adminMenu/menuOperal',
								datatype:"script",
								data :{
									id:rowId,
									oper:"del"
								},
								success : function(data) {
									if(data==true){
										yl_tips.success("删除成功！");
										$(adminmenu.grid_selector).jqGrid().trigger('reloadGrid');
										$(".tooltip").remove();
									}else{
										yl_tips.error("删除失败！");
									}
								}
							});
						},0);
					});
				},
				//树的图标及缩进设置
				 _treenode:function(){
						$("span[data-closeif]").off("click.adminmenu").on("click.adminmenu",function(){
							setTimeout(function(){
									var rowId=$(adminmenu.grid_selector).jqGrid('getGridParam','selrow');
									var rowData = $(adminmenu.grid_selector).jqGrid('getRowData',rowId);
									var obj = $(adminmenu.grid_selector).jqGrid("getRowData");
									for(var i=0;i<obj.length;i++){
										if(obj[i].parent_id==rowId){
											console.log(obj[i].id);
											$($("#"+obj[i].id+"").children()[2]).attr("style","padding-left:"+(obj[i].level)*20+"px;")
										}
									}
									var closeif = $("#Pid_"+rowId+"").attr("data-closeif");
									if(closeif=="close"){
										$("#Pid_"+rowId+"").attr("data-closeif","open");
										$("#Pid_"+rowId+"").attr("class","ui-icon ace-icon fa fa-caret-down center bigger-110 blue");
									}else if(closeif=="open"){
										$("#Pid_"+rowId+"").attr("data-closeif","close");
										$("#Pid_"+rowId+"").attr("class","ui-icon ace-icon fa fa-caret-right center bigger-110 blue");
									}else{
										return;
									}
							},0);
							
						})
				 },
				//将编辑复选框格式化
				 _aceSwitch:function( cellvalue, options, cell ){
					 setTimeout(function(){
							var target=$(cell).find('input[type=checkbox]');
								target.addClass('ace ace-switch ace-switch-5')
								.after('<span class="lbl"></span>');
						}, 0); 
				 },
					//排序
				 _menuSort:function(sort_selector){
						 $(sort_selector).off("click.adminmenu").on("click.adminmenu",function(e){
								 setTimeout(function(){
										var id = jQuery(adminmenu.grid_selector).jqGrid('getGridParam','selrow');
										var sortType=$(e.target).attr("data-oper");
										//验证成功,ajax保存
										$.ajax({
											type : 'GET',
											cache : false,
											url : '/adminMenu/sortMenu',
											datatype:"script",
											data :{
												sortType:sortType,
												id:id
											},
											success : function(data) {
												if(data==true){
													$(adminmenu.grid_selector).jqGrid().trigger('reloadGrid');
												}
											}
										});
								 }, 0); 
					});
				 },
				 _enableTooltips:function(table){
					 	$('.navtable .ui-pg-button').tooltip({container:'body'});
						$(table).find('.ui-pg-div').tooltip({container:'body'});
				 },
				 _beforeDeleteCallback :function(e){
					 	var form = $(e[0]);
						yl_tools.jqGrid_style_delete_form(form);
				 },
				//添加子节点
				 addChild:function(){
						//添加页面保存按钮，验证
						$("#add-child-save-btn").off("click.adminmenu").on("click.adminmenu",function(){
							var add_pchild_id=$("#add-pchild-id").val();
							var add_child_name=$("#add-child-name").val();
							var add_child_description = $("#add-child-description").val();
							var add_child_url=$("#add-child-url").val();
							//验证
							var _url = "^((https|http|ftp|rtsp|mms)?://)?" // 
						         + "(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?" // ftp的user@ 
						         + "(([0-9]{1,3}.){3}[0-9]{1,3}" // IP形式的URL- 199.194.52.184 
						         + "|" // 允许IP和DOMAIN（域名） 
						         + "([0-9a-z_!~*'()-]+.)*" // 域名- www. 
						         + "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]." // 二级域名 
						         + "[a-z]{2,6})" // first level domain- .com or .museum 
						         + "(:[0-9]{1,4})?" // 端口- :80 
						         + "((/?)|" // a slash isn't required if there is no file name 
						         + "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$"; 
							var char =new RegExp(_url);
							if(yl_tools.isEmpty(add_child_name)){
								yl_tips.error("子目录名称不能为空！");
								$("#add-child-name").focus();
								return false;	
							}/*else if(!char.test(add_child_url)){
								yl_tips.error("链接地址格式错误！");
								$("#add-child-url").focus();
								return false;	
							}*/
							
							else{
								//验证成功,ajax保存
								$.ajax({
									type : 'POST',
									cache : false,
									url : "/adminMenu/addChild",
									datatype:"script",
									data :{
										pid:add_pchild_id,
										cname:add_child_name,
										cdescription:add_child_description,
										curl:add_child_url
									},
									error : function(request) {
										yl_tips.error("服务器响应错误，请稍后再试！");
										return false;
									},
									success : function(data) {
										if(data==true){
											$(adminmenu.grid_selector).jqGrid().trigger('reloadGrid');
											yl_tips.success("添加成功！");
											$("#add-child-cancel-btn").trigger('click');
										}
									}
								});
							}
						});
				 },
				//添加父节点，保存
				 addMenu:function(){
						//添加页面保存按钮，验证
						$("#add-parent-save-btn").off("click.adminmenu").on("click.adminmenu",function(){
							var add_parent_name=$("#add-parent-name").val();
							var add_parent_url = $("#add-parent-url").val();
							var add_parent_description=$("#add-parent-description").val();
							//验证
							var _url = "^((https|http|ftp|rtsp|mms)?://)?" // 
						         + "(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?" // ftp的user@ 
						         + "(([0-9]{1,3}.){3}[0-9]{1,3}" // IP形式的URL- 199.194.52.184 
						         + "|" // 允许IP和DOMAIN（域名） 
						         + "([0-9a-z_!~*'()-]+.)*" // 域名- www. 
						         + "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]." // 二级域名 
						         + "[a-z]{2,6})" // first level domain- .com or .museum 
						         + "(:[0-9]{1,4})?" // 端口- :80 
						         + "((/?)|" // a slash isn't required if there is no file name 
						         + "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$"; 
							var char =new RegExp(_url);
							if(yl_tools.isEmpty(add_parent_name)){
								yl_tips.error("菜单名称不能为空！");
								$("#add-parent-name").focus();
								return false;	
							}/*else if(!char.test(add_parent_url)){
								yl_tips.error("链接地址格式错误！");
								$("#add-parent-url").focus();
								return false;	
							}*/
							
							else{
								//验证成功,ajax保存
								$.ajax({
									type : 'POST',
									cache : false,
									url : "/adminMenu/addParent",
									datatype:"script",
									data :{
										name:add_parent_name,
										url:add_parent_url,
										description:add_parent_description
									},
									error : function(request) {
										yl_tips.error("服务器响应错误，请稍后再试！");
										return false;
									},
									success : function(data) {
										if(data==true){
											$(adminmenu.grid_selector).jqGrid().trigger('reloadGrid');
											yl_tips.success("添加成功！");
											$("#add-parent-cancel-btn").trigger('click');
										}
									}
								});
							}
						});
				 },
				//添加子级菜单弹窗，回调函数
				 beforeAddModelshowCallback:function(){
					 $('#add-adminmenu-modal-form').on('shown.bs.modal', function () {
							$("#add-parent-name").val("");
							$("#add-parent-description").val("");
							$("#add-parent-url").val("");
						});
						$('#add-modal-form').on('shown.bs.modal', function () {
							$("#add-child-name").val("");
							$("#add-child-description").val("");
							$("#add-child-url").val("");
							var id=$(adminmenu.grid_selector).jqGrid('getGridParam','selrow');
							var rowData = $(adminmenu.grid_selector).jqGrid('getRowData',id);
							$("#add-pchild-name").val(rowData.name);
							$("#add-pchild-id").val(rowData.id);
							$("#add-pchild-name").attr("readOnly",true);
							$("#add-child-div").hide();
						});
						
				 },
		};
		
		adminmenu.init();
});