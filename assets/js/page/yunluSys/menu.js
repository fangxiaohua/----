
ace.load_ajax_scripts([
	 "/assets/js/jquery.inputlimiter.1.3.1.min.js"
	 ], function() {
			var menu_grid_selector = "#menu-grid-table";
			var menu_pager_selector = "#menu-grid-pager";
			jQuery(function($) {
				
					jqGrid();
					
					addMenu();	
			});
			
			function jqGrid(){
				//jqgrid宽度自适应//jqgrid宽度自适应
				yl_tools.jqGrid_autowidth(menu_grid_selector);
				//jqgrid相关配置
				jQuery(menu_grid_selector).jqGrid({
					ajaxGridOptions : {
						timeout : 500000  //设置ajax加载超时时间
					},
					url : "/menu/getAllMenu", //这是Action的请求地址   
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
					emptyrecords:"无匹配结果",//对查询条数为0时显示的 
					caption:"菜单管理",//表格标题
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
							hidden:true,search:false,sortable:false,editable:true,align:"center",key:true
						},
						//菜单名称
						{name:'name',index:'name',width:200, editable:true,sortable:false,editoptions: {maxlength:25}
//							formatter:function(cellvalue,options,rowObject){
//								return cellvalue;
//							}
						},
						//链接地址
						{name:'url',index:'url', width:50,editable:true,sortable:false,editoptions: {maxlength:127}},
						
						//菜单描述
						{name:'description',index:'description',sortable:false, width:50,editable:true,editoptions: {maxlength:127}},
						
						//操作
						{name:'myac',index:'',  fixed:true, sortable:false, resize:false,editable:false,viewable:false,
							formatter:'actions', 
							formatoptions:{ 
								keys:true,
								delOptions:{recreateForm: true, beforeShowForm:beforeDeleteCallback}
							}
						},
					], 
					editurl: "/menu/MenuOperal",
					viewrecords : true, //是否显示行数
					rowNum:10, //每页显示记录数  
					rowList:[10,20,50,100], //可调整每页显示的记录数
					pager : menu_pager_selector, //分页工具栏  
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
				jQuery(menu_grid_selector).jqGrid('navGrid',menu_pager_selector,
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
					$(menu_grid_selector).jqGrid('GridUnload');
					$('.ui-jqdialog').remove();
				});
				//条件查询
				$("#menu_search_btn").on("click",function(){
					$(menu_grid_selector).jqGrid('setGridParam',{page:1,	postData:{q:$("#menu-search").val().trim()}}).trigger('reloadGrid');
				});
				//回车条件查询
				 $('#menu-search').bind('keypress',function(event){
			            if(event.keyCode == "13")    
			            {
			            	$(menu_grid_selector).jqGrid('setGridParam',{page:1,	postData:{q:$("#menu-search").val().trim()}}).trigger('reloadGrid');
			            }
			      });
				//角色改变重新加载jqgrid
				$("#menu-select").on("change",function(){
					$(menu_grid_selector).jqGrid('setGridParam',{page:1,	postData:{id:$("#menu-select").val(),q:""}}).trigger('reloadGrid');
					//重新加载技能列表
				});
			}
			//添加菜单
			function addMenu(){
				//添加页面保存按钮，验证
				$("#add-menu-save-btn").on("click",function(){
					
					var add_menu_name=$("#add-menu-name").val();
					var add_menu_url = $("#add-menu-url").val();
					var add_menu_description=$("#add-menu-description").val();
					
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
					var char = new RegExp(_url);
					if(yl_tools.isEmpty(add_menu_name)){
						yl_tips.error("菜单名称不能为空！");
						$("#add-menu-name").focus();
						return false;	
					}else if(add_menu_name.length>25){
						yl_tips.error("菜单名过长！");
						$("#add-menu-name").focus();
						return false;	
					}else if(!char.test(add_menu_url)){
						yl_tips.error("链接地址格式错误！！");
						$("#add-menu-url").focus();
						return false;	
					}
					
					else{
						//验证成功,ajax保存
						$.ajax({
							type : 'POST',
							cache : false,
							url : "/menu/addMenu",
							datatype:"script",
							data :{
								name:add_menu_name,
								url:add_menu_url,
								description:add_menu_description
							},
							error : function(request) {
								yl_tips.error("服务器响应错误，请稍后再试！");
								return false;
							},
							success : function(data) {
								if(data==true){
									$(menu_grid_selector).jqGrid().trigger('reloadGrid');
									yl_tips.success("添加成功！");
									$("#add-menu-cancel-btn").trigger('click');
								}
							}
						});
					}
				});
			}
			//二次打开窗口时清空一次的输入值
			function beforeAddModelshowCallback(){
				$('#add-menu-modal-form').on('shown.bs.modal', function () {
					$("#add-menu-name").val("");
					$("#add-menu-url").val("");
					$("#add-menu-description").val("");
				});
			}
			
			//分配菜单保存点击事件
			
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

