//@author:fangxiaohua
//@邮箱：abc2710712@qq.com
//@qq:1295168875
// 2014年10月27日 下午2:03:16 
//加载jqgrid相关依赖js包
ace.load_ajax_scripts([
	                       null
	], function() {
	
	void(function($){
		var nationMajorDict={
				//页面初始化
				init:function(){
					//创建jqgrid
					nationMajorDict.jqgrid_nationMarjorList();
					//创建新的根类别
					nationMajorDict.addMenu();
					//添加子节点
					nationMajorDict.addChild();
					//弹出窗口回调函数，二次打开清空之前的操作
					nationMajorDict.beforeAddModelshowCallback();
				},
				grid_selector : "#nationmajor-treegrid",
				pager_selector : "#nationmajor-treegrid-pager",
				//专业字典列表相关设置
				jqgrid_nationMarjorList:function(){
					//jqgrid宽度自适应
					yl_tools.jqGrid_autowidth(nationMajorDict.grid_selector);
					jQuery(nationMajorDict.grid_selector).jqGrid({
						ajaxGridOptions : {
							timeout : 500000  //设置ajax加载超时时间
						},
					    treeGrid: true,
					    treedatatype: "json",
					    datatype: "json",
						treeGridModel:"adjacency",
						ExpandColumn:"treeIcon",
						ExpandColClick: true, 
						url : "/nationMajorDict/getMajorList", //这是Action的请求地址   
						postData:{//条件查询后台传值
							q:""
						},
						mtype: "POST",
						caption: "专业字典管理",
						treeReader : {  
							level_field: "level",  
						    parent_id_field: "parent",   
						    leaf_field: "isLeaf",
						    expanded_field: "expanded"
						},
					   	colNames:["","id","专业名称","专业编号","是否显示"," "],
					   	colModel:[
					   	    {name:'treeIcon',index:'treeIcon',  viewable:true,editable:false,align:"left",width:15,editoptions: {maxlength:25},sortable:false,
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
					   		{name:'maj_name',index:'maj_name',  viewable:true,editable:true,align:"left",editoptions: {maxlength:25},sortable:false,width:100},
					   		{name:'maj_no',index:'maj_no', viewable:true,editable:true, align:"center",sortable:false,editoptions: {maxlength:127},width:60},
					   		//是否显示
							{name:'status',index:'status',  viewable:true,sortable:false,width:20,align:"center",
								editable: true,edittype:"checkbox",editoptions: {value:"是:否"},unformat:nationMajorDict. _aceSwitch,
								formatter:function(cellvalue,options,rowObject){
								return cellvalue=="是"?"是":"否";
							}},
						    //操作
							{name:'myac',index:'', fixed:true, sortable:false, resize:false, viewable:false,sortable:false,width:140,
								formatter:'actions', 
								formatoptions:{ 
									keys:true,
									delbutton:false,
									delOptions:{recreateForm: true, beforeShowForm:nationMajorDict._beforeDeleteCallback},
								}
							}
					   	],
					   	//编辑保存路径
						editurl: "/nationMajorDict/majorOperal",
						altRows: true,
						width: $(".page-content").width(),
						viewrecords : true, //是否显示行数
						rowNum:10, //每页显示记录数  
						loadComplete : function(data) {
							$(".jqGrid_delbtnstr").closest("div").remove();
							//删除非叶子节点的删除按钮
							for(var i in data){
								$("#jEditButton_"+data[i].id+"").before(juicer(yl_tools.jqGrid_addbtnstr,{}));
								if(data[i].isLeaf){
									$("#jEditButton_"+data[i].id+"").after(juicer(yl_tools.jqGrid_delbtnstr,{}));
								}
							}
							
							var table = this;
							setTimeout(function(){
								//替换jqgrid中的分页按钮图标
								yl_tools.jqGrid_updatePagerIcons(table);
								//更换导航栏中的行为图标
								yl_tools.jqGrid_updateActionIcons(table);
								//更换选择框的样式
								yl_tools.jqGrid_styleCheckbox(table);
								nationMajorDict._enableTooltips(table);
								//树的图标及缩进设置
								nationMajorDict._treenode();
								//删除原默认的图标层
								$(".tree-wrap.tree-wrap-ltr").remove();
								//节点删除操作
								nationMajorDict._deltreenode();
							},0);
						}
					});
					
					//条件查询
					$("#nation_major_search_btn").on("click",function(){
						$(nationMajorDict.grid_selector).jqGrid('setGridParam',{page:1,	postData:{q:$("#nation_major_search").val().trim()}}).trigger('reloadGrid');
					});
					//回车条件查询
					 $('#nation_major_search').bind('keypress',function(event){
				            if(event.keyCode == "13")    
				            {
				            	$(nationMajorDict.grid_selector).jqGrid('setGridParam',{page:1,	postData:{q:$("#nation_major_search").val().trim()}}).trigger('reloadGrid');
				            }
				      });
				},
				_enableTooltips:function(table){
					$('.navtable .ui-pg-button').tooltip({container:'body'});
					$(table).find('.ui-pg-div').tooltip({container:'body'});
				},
				_beforeDeleteCallback:function(e){
					var form = $(e[0]);
					yl_tools.jqGrid_style_delete_form(form);
				},
				//将编辑复选框格式化
				_aceSwitch:function(cellvalue, options, cell){
					setTimeout(function(){
						var target=$(cell).find('input[type=checkbox]');
							target.addClass('ace ace-switch ace-switch-5')
							.after('<span class="lbl"></span>');
						
					}, 0);
				},
				//删除行
				_deltreenode:function(){
					$(".jqGrid_delbtnstr").off("click.nationMajor").on("click.nationMajor",function(e){
						setTimeout(function(){
							var rowId=$(nationMajorDict.grid_selector).jqGrid('getGridParam','selrow');
							//验证成功,ajax保存
							yl_ajaxAction.ajax_del({
						  			delConfirmMsgHtml:"<p>您确定删除该条专业分类吗？</p>",
						  			delActionUrl:'/nationMajorDict/majorOperal',
						  			delActionParams:{
						  				id:rowId,
										oper:"del"
						  			},
						  			delReponseFun:function(data){
						  				if(data==true){
											yl_tips.success("删除成功！");
											$(nationMajorDict.grid_selector).jqGrid().trigger('reloadGrid');
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
					$("span[data-closeif]").off("click.nationMajor").on("click.nationMajor",function(){
						setTimeout(function(){
								var rowId=$(nationMajorDict.grid_selector).jqGrid('getGridParam','selrow');
								var rowData = $(nationMajorDict.grid_selector).jqGrid('getRowData',rowId);
								var obj = $(nationMajorDict.grid_selector).jqGrid("getRowData");
								for(var i=0;i<obj.length;i++){
									if(obj[i].parent==rowId){
										$($("#"+obj[i].id+"").children()[2]).attr("style","padding-left:"+(obj[i].level)*25+"px;")
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
				//添加子节点
				addChild:function(){
					//添加页面保存按钮，验证
					$("#add-child-major-save-btn").off("click.nationMajor").on("click.nationMajor",function(){
						var add_pchild_major_id=$("#add-pchild-major-id").val();
						var add_child_major_name=$("#add-child-major-name").val();
						var add_child_major_no = $("#add-child-major-no").val();
							if(yl_tools.isEmpty(add_child_major_name)){
								yl_tips.error("子专业名称不能为空!");
								return false;
							}
							if(yl_tools.isEmpty(add_child_major_no)){
								yl_tips.error("子专业编号不能为空!");
								return false;
							}
							//验证成功,ajax保存
							yl_ajaxAction.ajax_add({
						  			addActionUrl: "/nationMajorDict/addMajorChild",
						  			addActionParams:{
						  					pid:add_pchild_major_id,
											c_major_name:add_child_major_name,
											c_major_no:add_child_major_no
						  			},
						  			addReponseFun:function(data){
						  					if(data==true){
												$(nationMajorDict.grid_selector).jqGrid().trigger('reloadGrid');
												yl_tips.success("添加成功！");
												$("#add-child-major-cancel-btn").trigger('click');
											}
						  			}
						  });
					});
				},
				//添加父节点，保存
				addMenu:function(){
					//添加页面保存按钮，验证
					$("#add-major-save-btn").on("click",function(){
						var add_parent_major_name=$("#add-parent-major-name").val();
						var add_parent_major_no = $("#add-parent-major-no").val();
						if(yl_tools.isEmpty(add_parent_major_name)){
							yl_tips.error("专业名称不能为空！");
							$("#add-parent-major-name").focus(); 
							return false;
						}else if(yl_tools.isEmpty(add_parent_major_no)){
							yl_tips.error("专业编号不能为空！");
							$("#add-parent-major-no").focus(); 
							return false;
						}else if(add_parent_major_name.length>25){
							yl_tips.error("专业名称过长！");
							$("#add-parent-major-name").focus();
							return false;	
						}else if(add_parent_major_no.length>25){
							yl_tips.error("专业编号过长！");
							$("#add-parent-major-no").focus();
							return false;	
						}
							//验证成功,ajax保存
						yl_ajaxAction.ajax_add({
						  			addActionUrl: "/nationMajorDict/addPMajor",
						  			addActionParams:{
						  				maj_name:add_parent_major_name,
										maj_no:add_parent_major_no
						  			},
						  			addReponseFun:function(data){
						  				if(data==true){
											$(nationMajorDict.grid_selector).jqGrid().trigger('reloadGrid');
											yl_tips.success("添加成功！");
											$("#add-major-cancel-btn").trigger('click');
										}
						  			}
						  });
					});
				},
				//添加子级菜单弹窗，回调函数
				beforeAddModelshowCallback:function(){
					//二次打开窗口，清除第一次打开时填的数据
					$('#add-parent-major-modal-form').on('shown.bs.modal', function () {
						$("#add-parent-major-name").val("");
						$("#add-parent-major-no").val("");
					});
					$('#add-modal-form').on('shown.bs.modal', function () {
						$("#add-child-major-name").val("");
						$("#add-child-major-no").val("");
						var id=$(nationMajorDict.grid_selector).jqGrid('getGridParam','selrow');
						var rowData = $(nationMajorDict.grid_selector).jqGrid('getRowData',id);
						$("#add-pchild-major-id").val(rowData.id);
						
						$("#add-pchild-major-name").val(rowData.maj_name);
						$("#add-pchild-major-no").val(rowData.maj_no);
						$("#add-pchild-major-name").attr("readOnly",true);
						$("#add-pchild-major-no").attr("readOnly",true);
						$("#add-majorchild-div").hide();
					});
				}
		};
		nationMajorDict.init();
	})(jQuery);
});