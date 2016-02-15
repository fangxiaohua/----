//@author:fangxiaohua
//@邮箱：abc2710712@qq.com
//@qq:1295168875
// 2014年10月27日 下午2:03:16 
ace.load_ajax_scripts([
	 "/assets/js/jquery.inputlimiter.1.3.1.min.js"
	 ], function() {
			jQuery(function($) {
				var grid_selector = "#grid-table";
				var pager_selector = "#grid-pager";
				var skistr="";
					//加载kno
					$.ajax({
						type : 'POST',
						cache : true,
						url : '/xtgl/getKnoList',
						datatype:"json",
						error : function(request) {
							alert("服务器响应错误，操作失败！");
							return false;
						},
						success : function(data) {
							var kno_select="";
							for(var i in data) {
								kno_select+='<option value="'+data[i].id+'">'+data[i].kno_name+'</option>';
							}
							$("#kno-select").html(kno_select);
							var kno_id=$("#kno-select").val();
							jqGrid(kno_id);
							//加载 技能列表
							getSkiList(kno_id);
						}	
					});
					
				function jqGrid(kno_id){
					//jqgrid宽度自适应//jqgrid宽度自适应
					yl_tools.jqGrid_autowidth(grid_selector);
					//jqgrid相关配置
					jQuery(grid_selector).jqGrid({
						ajaxGridOptions : {
							timeout : 500000  //设置ajax加载超时时间
						},
						url : "/xtgl/getKnoTestList", //这是Action的请求地址   
						//重置默认 请求参数
						prmNames:{
							 page:"pageNo",    // 表示请求页码的参数名称  
							 rows:"pageSize"    // 表示请求行数的参数名称
						}, 
						postData:{//条件查询后台传值
							q:"",
							id:kno_id
						},
						datatype : "json", //将这里改为使用JSON数据   
						mtype : "POST", //提交类型
						height: 250,
						emptyrecords:"无匹配结果",//对查询条数为0时显示的 
						caption:"习题管理",//表格标题
						//重置默认json解析参数
						jsonReader:{ 
							root:"records", // json中代表实际模型数据的入口  
							page:"currentpage", // json中代表当前页码的数据  
							total:"totalpage", // json中代表页码总数的数据  
							records:"totalrecord",  // json中代表数据行总数的数据  
							repeatitems:false    // 如果设为false，则jqGrid在解析json时，会根据name来搜索对应的数据元素（即可以json中元素可以不按顺序）；而所使用的name是来自于colModel中的name设定。  
						},
						colNames:['ID','题目','考察技能点','是否可用','排序','','','A.','B.','C.','D.','D.','F.','答案：'],
						colModel:[
						     //主键ID
							{name:'id',index:'id', width:0, sorttype:"int", 
								hidden:true,search:false,sortable:false,editable:false,align:"center",key:true
							},
							//习题问题
							{name:'question',index:'question',width:200, editable:false,
								formatter:function(cellvalue,options,rowObject){
									return cellvalue;
								}
							},
							//所属技能名称
							{name:'ski_name',index:'ski_name', width:50,editable:false},
							//是否可用
							{name:'status',index:'status', width:50, editable: false,align:"center",
								formatter:function(cellvalue,options,rowObject){
									return cellvalue==1?"可用":"不可用";
								}
							},
							//排序
							{name:'sort_index',index:'sort_index', width:50,align:"center",
								formatter:function(cellvalue,options,rowObject){
									return '<span class="badge badge-purple">'+cellvalue+'</span>';
								}
							},
							//排序操作
							{name:'sort',index:'status', width:50,editable:false,align:"center",viewable:false,
								formatter:function(cellvalue,options,rowObject){
									var records=$(grid_selector).getGridParam('records');
									if(records==1||$("#search").val()){
										return '<div style="margin-left:8px;">'+yl_tools.jqGrid_banbtnstr+yl_tools.jqGrid_banbtnstr+'</div>';
									}else if(rowObject.sort_index==1){
										return '<div style="margin-left:8px;">'+yl_tools.jqGrid_banbtnstr+yl_tools.jqGrid_downbtnstr("grid-table")+'</div>';
									}else if(rowObject.sort_index==records){
										return '<div style="margin-left:8px;">'+yl_tools.jqGrid_uphbtnstr("grid-table")+yl_tools.jqGrid_banbtnstr+'</div>';
									}
									return '<div style="margin-left:8px;">'+yl_tools.jqGrid_uphbtnstr("grid-table")+yl_tools.jqGrid_downbtnstr("grid-table")+'</div>';
								}
							},
							//操作
							{name:'myac',index:'', width:100, fixed:true, sortable:false, resize:false,viewable:false,
								formatter:function(cellvalue,options,rowObject){
									return '<div style="margin-left:8px;">'+yl_tools.jqGrid_editbtnstr+yl_tools.jqGrid_delbtnstr+'</div>';
								}									
							},
							//以下是隐藏字段
							{name:'option_a',index:'option_a', width:0, sorttype:"int",hidden:true,search:false,sortable:false,editable:false,viewable:true,editrules:{edithidden:true}},
							{name:'option_b',index:'option_b', width:0, sorttype:"int",hidden:true,search:false,sortable:false,editable:false,viewable:true,editrules:{edithidden:true}},
							{name:'option_c',index:'option_c', width:0, sorttype:"int",hidden:true,search:false,sortable:false,editable:false,viewable:true,editrules:{edithidden:true}},
							{name:'option_d',index:'option_d', width:0, sorttype:"int",hidden:true,search:false,sortable:false,editable:false,viewable:true,editrules:{edithidden:true}},
							{name:'option_e',index:'option_e', width:0, sorttype:"int",hidden:true,search:false,sortable:false,editable:false,viewable:true,editrules:{edithidden:true}},
							{name:'option_f',index:'option_f', width:0, sorttype:"int",hidden:true,search:false,sortable:false,editable:false,viewable:true,editrules:{edithidden:true}},
							{name:'answers',index:'answers', width:0, sorttype:"int",hidden:true,search:false,sortable:false,editable:false,viewable:true,editrules:{edithidden:true}}	
						], 
						viewrecords : true, //是否显示行数
						rowNum:10, //每页显示记录数  
						rowList:[1,10,20,50,100], //可调整每页显示的记录数
						pager : pager_selector, //分页工具栏  
						altRows: true,
						rownumbers:true,//添加左侧行号
						//jqgrid加载完成后执行
						loadComplete : function() {
							var table = this;
							setTimeout(function(){
								//绑定习题排序功能
								excerciseSort(".jqGrid_sortbtnstr"+"grid-table");
								//绑定习题删除功能
								excercisedel();
								//替换jqgrid中的分页按钮图标
								yl_tools.jqGrid_updatePagerIcons(table);
								//更换导航栏中的行为图标
								yl_tools.jqGrid_updateActionIcons(table);
								enableTooltips(table);
							}, 0);
						},
						//编辑保存路径
						editurl: "/kcgl/dataOperal",
						//subGrid option
						subGrid : true,
						subGridOptions : {
							plusicon : "ace-icon fa fa-plus center bigger-110 blue",
							minusicon  : "ace-icon fa fa-minus center bigger-110 blue",
							openicon : "ace-icon fa fa-chevron-right center orange"
						},
						subGridRowExpanded: function (subgrid_id, row_id) {
							var rowDatas = jQuery(grid_selector).jqGrid('getRowData', row_id);
							//console.log(rowDatas);
							//答案
							var optionnum=6;
							var flag=true;
							//获取所有值
							var answers=rowDatas["answers"];
							 var option=rowDatas["option_a"]+
									","+rowDatas["option_b"]+
									","+rowDatas["option_c"]+
									","+rowDatas["option_d"]+
									","+rowDatas["option_e"]+
									","+rowDatas["option_f"];
							option=option.split(",");
							//获取option有效长度
							for(var j=0;j<optionnum;j++){
								if(yl_tools.isEmpty(option[j])){
									optionnum=j;
									break;
								}
							}
							//构建json str 
							var subgrid_str ='[';
								for(var i=0 ;i<optionnum;i++){
								 if(i==optionnum-1){
									 subgrid_str+='{"id":"'+i+'","option":"'+encodeURIComponent(option[i])+'","name":"'+yl_tools.intToChar(i+1)+'"}';
									 break;
								 }	
								 subgrid_str+='{"id":"'+i+'","option":"'+encodeURIComponent(option[i])+'","name":"'+yl_tools.intToChar(i+1)+'"},';
								}
						    subgrid_str +=']';
						   // console.log(subgrid_str);
							var subgrid_data=JSON.parse(subgrid_str);
							
						    var subgrid_table_id = subgrid_id+"_t";
						    var subgrid_selector = "#"+subgrid_table_id;
							  $("#"+subgrid_id).html("<table id='"+subgrid_table_id+"' class='scroll'></table>");
							 //subGrid 样式
							 jQuery(subgrid_selector).jqGrid({
								   datatype: 'local',
								   data: subgrid_data,
								   colNames: ['ID',' ','答案项','<div title="" id="ans-'+row_id+'-jqGrid_addbtnstr" style="float:left;cursor:pointer;margin-left:5px;"  name="jqGrid_addbtnstr"  class="ui-pg-div ui-inline-add" onmouseover="jQuery(this).addClass('+"'ui-state-hover'"+');" onmouseout="jQuery(this).removeClass('+"'ui-state-hover'"+');" data-original-title="添加新记录">'+
									 '<span class="ui-icon ace-icon fa fa-plus-circle purple"></span>'+
						 			 '</div>'],
								   colModel: [
											//主键ID
											{name:'id',index:'id', width:0, sorttype:"int",hidden:true,search:false,sortable:false,editable:false,align:"center",key:true},
											{name:"name",index:"name",width:50,sortable:false,editable:false,
												formatter:function(cellvalue,options,rowObject){
													var ans=answers.split(" ");
													if(yl_tools.isInArray(cellvalue.toUpperCase(),ans)){
														return '<span class="label label-success arrowed">'+cellvalue+'</span>.';
													}else{
														return cellvalue+".";
													}
													
												}
											},
											{name:"option",index:"option",width:400,sortable:false,editable:true,
												formatter:function(cellvalue,options,rowObject){
													return decodeURIComponent(cellvalue);
												}
											},
										 	 //操作
											{name:'myac',index:'', width:80, fixed:true, sortable:false, resize:false,
												formatter:function(cellvalue,options,rowObject){
													var str='<div style="margin-left:8px;">'+
																'<div title="" style="float:left;cursor:pointer;margin-left:5px;" name="jqGrid_editbtnstr"  class="ui-pg-div ui-inline-edit"  onmouseover="jQuery(this).addClass('+"'ui-state-hover'"+');" onmouseout="jQuery(this).removeClass('+"'ui-state-hover'"+')" data-original-title="编辑所选记录">'+
																	'<span class="ui-icon ui-icon-pencil jqGrid_editbtnstr_answers"></span>'+
														  	   '</div>';
														  	  if(rowObject.id!=(subgrid_data.length-1)) {
														  		str+=yl_tools.jqGrid_banbtnstr;
														  	  }else{
														  		str+='<div title="" style="float:left;cursor:pointer;margin-left:5px;"  class="ui-pg-div ui-inline-del"  onmouseover="jQuery(this).addClass('+"'ui-state-hover'"+');" onmouseout="jQuery(this).removeClass('+"'ui-state-hover'"+');" data-original-title="删除所选记录">'+
															        '<span class="ui-icon ui-icon-trash jqGrid_delbtnstr_answers" ></span>'+
															   	'</div>';
														  	  }
														   	 str+='</div>';
													return str;
												}
											}
								    ],
									rowNum:10, //每页显示记录数  
								    height: 600,
								    altRows: true,
									//jqgrid加载完成后执行
									loadComplete : function() {
										var table = this;
										setTimeout(function(){
											//添加
											fun_add_answers(rowDatas,optionnum);
											//修改
											fun_edit_answers({"id":row_id,"subgrid_selector":subgrid_selector});
											//删除
											fun_del_answers({"id":row_id,"subgrid_selector":subgrid_selector});
										}, 0);
									},
									//编辑保存路径
									//editurl: "/zdgl/dataOperal"
								  }); 
						}
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
						$(grid_selector).jqGrid('setGridParam',{page:1,	postData:{q:$("#search").val().trim()}}).trigger('reloadGrid');
					});
					//回车条件查询
					 $('#search').bind('keypress',function(event){
				            if(event.keyCode == "13")    
				            {
				            	$(grid_selector).jqGrid('setGridParam',{page:1,	postData:{q:$("#search").val().trim()}}).trigger('reloadGrid');
				            }
				      });
					//kno条件查询
					$("#kno-select").on("change",function(){
						$(grid_selector).jqGrid('setGridParam',{page:1,	postData:{id:$(this).val(),q:""}}).trigger('reloadGrid');
						//重新加载技能列表
						getSkiList($(this).val());
					});
				}
				
				
				
				//修改页面保存按钮,验证
				 $("#edit-save-btn").on("click",function(){
					var edit_id = jQuery(grid_selector).jqGrid('getGridParam','selrow');
					var edit_quesetion=$("#edit-quesetion").val();
					var edit_status=$("#edit-status")[0].checked==true?1:0;
					var edit_skiId=$("#edit-skiId").val();
					//console.log($("#edit-skiId"));
					
					if(yl_tools.isEmpty(edit_quesetion)){
						bootbox.dialog({
							message: "<span class='bigger-110'>习题问题不能为空！</span>",
						});
						return false;	
					}
					else if(yl_tools.isEmpty(edit_skiId)){
						bootbox.dialog({
							message: "<span class='bigger-110'>习题考察技能不能为空！</span>",
						});
						return false;	
					}
					else{
						$.ajax({
							type : 'POST',
							cache : false,
							url : '/xtgl/updateKnoSkiTest',
							datatype:"script",
							data :{
								id:edit_id,
								question:edit_quesetion,
								skiId:edit_skiId,
								knoId:$("#kno-select").val(),
								status:edit_status
							},
							error : function(request) {
								alert("服务器响应错误，操作失败！");
								return false;
							},
							success : function(data) {
								if(data==true){
									$(grid_selector).jqGrid().trigger('reloadGrid');
									bootbox.dialog({
										message: "<span class='bigger-110'>修改习题信息成功！</span>",
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
									$("#edit-cancel-btn").trigger('click');
								}
							}
						});
					}
				}); 
				//删除
				function excercisedel(){
					$(".jqGrid_delbtnstr").on("click",function() {
						setTimeout(function(){
							var del_id = jQuery(grid_selector).jqGrid('getGridParam','selrow');
							if(yl_tools.isEmpty(del_id)){
								bootbox.dialog({
									message: "<span class='bigger-110'>请先选择一条记录！</span>"
								});
								return false;
							}
							bootbox.confirm({
								message:"你确定删除该习题信息吗?", 
								buttons: {
									  confirm: {
										 label: "删除",
										 className: "btn-primary btn-sm",
									  },
									  cancel: {
										 label: "取消",
										 className: "btn-sm",
									  }
								},	
								callback:function(result) {
										if(result) {
											$.ajax({
												type : 'GET',
												cache : false,
												url : '/xtgl/delKnoSkiTest',
												datatype:"script",
												async:false,
												data :{
													id:del_id
												},
												error : function(request) {
													alert("服务器响应错误，操作失败！");
													return false;
												},
												success : function(data) {
													if(data==true){
														$(grid_selector).jqGrid().trigger('reloadGrid');
														bootbox.dialog({
															message: "<span class='bigger-110'>删除选定习题信息成功！</span>",
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
													}
												}
											});
										}
								}
							});
						},0);
					});
				}
				//删除答案项 
				function fun_del_answers(args){
					//console.log(args);
					$(".jqGrid_delbtnstr_answers").on("click",function(){
						setTimeout(function(){
							var del_id = jQuery(args.subgrid_selector).jqGrid('getGridParam','selrow');
							bootbox.confirm({
									message:"你确定删除该项答案信息吗?", 
									buttons: {
										  confirm: {
											 label: "删除",
											 className: "btn-primary btn-sm",
										  },
										  cancel: {
											 label: "取消",
											 className: "btn-sm",
										  }
									},	
									callback:function(result) {
									if(result) {
										$.ajax({
											type : 'GET',
											cache : false,
											url : '/xtgl/delKnoSkiTestAns',
											datatype:"script",
											async:false,
											data :{
												id:del_id,
												zid:args.id
											},
											error : function(request) {
												alert("服务器响应错误，操作失败！");
												return false;
											},
											success : function(data) {
												if(data==true){
													$(grid_selector).jqGrid().trigger('reloadGrid');
													bootbox.dialog({
														message: "<span class='bigger-110'>删除选定答案成功！</span>",
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
												}
											}
										});
									}
								}
							});
						},0);			
					});
				}
				
				
				
				//题目下答案点击按钮
				function fun_add_answers(rowDatas,optionnum ){
					$('#ans-'+rowDatas.id+'-jqGrid_addbtnstr').on("click",function(){
						if(optionnum==6){
							bootbox.dialog({
								message: "<span class='bigger-110'>同一题的答案上限为6个,您已满上限,不可再添！</span>",
							});
							return false;
						}
						//一些值初始化
						$("#add-quesetion-show").val(rowDatas.question);
						$("#add-quesetion-show").attr("data-aread-num",optionnum);
						$("#add-answers-save-btn").attr("data-qusid",rowDatas.id);
						//初始化答案输入框
						$(".ans-list").remove();
						ans_list_add();
						$("#add-answers-btn").trigger("click");
					});
				}
				//习题答案添加页面点击添加答案按钮
				$("#add-one-ans").on("click",function(){
					var aleard_num=$("#add-quesetion-show").attr("data-aread-num");
					var new_num=$(".ans-list").length;
					//console.log(parseInt(aleard_num)+parseInt(new_num));
					if(parseInt(aleard_num)+parseInt(new_num)>=6){
						bootbox.dialog({
							message: "<span class='bigger-110'>同一题的答案上限为6个,您已存在"+aleard_num+"个答案,最多新添的答案数为"+(6-aleard_num)+"个!</span>",
						});
						return false;
					}
					ans_list_add();
				});
				//答案选项添加
				function ans_list_add(){
					var template=$("#ans-list-template").clone(true);
					//元素初始化
					template.addClass("ans-list");
					template.removeAttr("style");
					template.removeAttr("id");
					//console.log(template[0]);
					if($(".ans-list:last")[0]){
						$(".ans-list:last").after(template);
					}else{
						$("#ans-list-template").after(template);
					}
				}
				//答案选项删除
				$(".delete-one-ans").on("click",function(e){
					$(e.target).closest(".ans-list").remove();
				}); 
				//添加习题答案保存,验证
				$("#add-answers-save-btn").on("click",function(){
					var flag=true;
					var ans_text_str="";
					var ans_is_right_str="";
					//验证和取值
					var total=$(".ans-list").length;
					if(total==0){
						bootbox.dialog({
							message: "<span class='bigger-110'>请至少添加一个答案！</span>",
						});
						flag=false;
					};
					$(".ans-list").each(function(index,element){
						var ans_text=$(this).find(".ans-text").val();
						if(yl_tools.isEmpty(ans_text)){
							bootbox.dialog({
								message: "<span class='bigger-110'>第"+(index+1)+"行的答案不能为空！</span>",
							});
							flag=false;
						}
						var ans_is_right=$(this).find(".ans-is-right")[0].checked==true?1:0;
						if(index==total-1){
							ans_text_str+=ans_text;
							ans_is_right_str+=ans_is_right;
						}	
						else {
							ans_text_str+=ans_text+",";
							ans_is_right_str+=ans_is_right+",";
						}
					});
					if(flag){
						//提交后台，保存 
						$.ajax({
							type : 'POST',
							cache : false,
							url : '/xtgl/addKnoSkiTest',
							datatype:"script",
							async:false,
							data :{
								id:$(this).attr("data-qusid"),
								optionA:ans_text_str,
								answers:ans_is_right_str
							},
							error : function(request) {
								alert("服务器响应错误，操作失败！");
								return false;
							},
							success : function(data) {
								if(data==true){
									$(grid_selector).jqGrid().trigger('reloadGrid');
									bootbox.dialog({
										message: "<span class='bigger-110'>添加习题答案成功！</span>",
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
									$("#add-answers-cancel-btn").trigger('click');
								}
							}
						}); 
					};
				});
				
				//修改习题答案项
				function fun_edit_answers(args){
					$(".jqGrid_editbtnstr_answers").on("click",function(){
						//初始化修改页面
						setTimeout(function(){
							var id = jQuery(args.subgrid_selector).jqGrid('getGridParam','selrow');
							var rowDatas = jQuery(args.subgrid_selector).jqGrid('getRowData', id);
							//初始化选项文本
							$("#edit-ans-text").val(rowDatas["option"]);
							if(rowDatas["name"].length>20)$("#eidt-ans-is-right")[0].checked=true;
							else $("#eidt-ans-is-right")[0].checked=false;
							$("#edit-answers-save-btn").attr("data-qusid",args.id);
							$("#edit-answers-save-btn").attr("data-id",id);
							$("#edit-answers-btn").trigger('click');
						},0);	
						
					});
				}
				
				//保存验证习题答案选线
				fun_edit_answers_save();
				function fun_edit_answers_save(){
					//点击保存
					$("#edit-answers-save-btn").on("click",function(e){
						var option_text=$("#edit-ans-text").val();
						var is_right=$("#eidt-ans-is-right")[0].checked==true?1:0;
						if(yl_tools.isEmpty(option_text)){
							bootbox.dialog({
								message: "<span class='bigger-110'>答案文本不能为空！</span>",
							});
							return false;
						}else{
							$.ajax({
								type : 'POST',
								cache : false,
								url : '/xtgl/updateKnoSkiTest',
								datatype:"script",
								async:false,
								data :{
									zid:$(this).attr("data-qusid"),
									id:$(this).attr("data-id"),
									optionA:option_text,
									answers:is_right
								},
								error : function(request) {
									alert("服务器响应错误，操作失败！");
									return false;
								},
								success : function(data) {
									if(data==true){
										$(grid_selector).jqGrid().trigger('reloadGrid');
										bootbox.dialog({
											message: "<span class='bigger-110'>修改指定习题答案选项信息成功！</span>",
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
										$("#edit-answers-cancel-btn").trigger('click');
									}
								}
							});
						}
					});
				}
				
				
				
				
				//进入添加习题页 回调
				beforeAddQuestionModelshowCallback();
				function beforeAddQuestionModelshowCallback(){
					/*modal-form 弹出时所执行*/
					$('#add-question-modal-form').on('shown.bs.modal', function () {
						//添加技能下拉
						$("#add-skiId").html(skistr);
					});
				}
				
				
				
				
				
				beforeEditModelshowCallback();
				//修改弹窗回调函数
				function beforeEditModelshowCallback(){
					/*modal-form 弹出时所执行*/
					$('#edit-modal-form').on('shown.bs.modal', function () {
						   //设置用户 原有信息
							var id = jQuery(grid_selector).jqGrid('getGridParam','selrow');
						   	//初始习题信息
						   	getExcercise({"id":id,"oper":"edit"});
						   	
					});
				}
				
				
				beforeViewModelshowCallback();
				//查看弹窗回调函数
				function beforeViewModelshowCallback(){
					/*modal-form 弹出时所执行*/
					$('#view-modal-form').on('shown.bs.modal', function () {
						
					});
				}	
				
				//构建习题修改页面
				function initEditPage(data){
					$("#edit-skiId").html(skistr);
					setTimeout(function(){
						$("#edit-quesetion").val(data.question);
						$("#edit-skiId").val(data.ski_id);
						////console.log(data.status);
						if(data.status==1){
							$("#edit-status")[0].checked=true;
						}else{
							$("#edit-status")[0].checked=false;
						}
					},0);
				}
				
				//加载技能列表
				function getSkiList(kno_id){
					$.ajax({
						type : 'GET',
						cache : false,
						url : '/xtgl/getKnoSkiList',
						datatype:"json",
						async:false,
						data :{
							id:kno_id
						},
						error : function(request) {
							alert("服务器响应错误，操作失败！");
							return false;
						},
						success : function(data) {
							skistr="";
							for(var i in data){
								////console.log(data[i].id);
								skistr+='<option value="'+data[i].id+'">'+data[i].ski_name+'</option>';
							}
						}
					});
				}
				
				//获取一条组织信息
				function getExcercise(args){
					$.ajax({
						type : 'GET',
						cache : false,
						url : '/xtgl/getKnoSkiTest',
						datatype:"script",
						async:false,
						data :{
							id:args.id
						},
						error : function(request) {
							alert("服务器响应错误，操作失败！");
							return false;
						},
						success : function(data) {
							var flag=args.oper;
							if(flag=="edit"){
								initEditPage(data);
							}else if(flag=="view"){
								
							}
						}
					});
				}
				
				//字典类型排序
				function excerciseSort(sort_selector){
					$(sort_selector).on("dblclick",function(e){
						var id = jQuery(grid_selector).jqGrid('getGridParam','selrow');
						var sortType=$(e.target).attr("data-oper");
						//验证成功,ajax保存
						$.ajax({
							type : 'GET',
							cache : false,
							url : '/xtgl/sortTest',
							datatype:"script",
							data :{
								sortType:sortType,
								id:id
							},
							success : function(data) {
								if(data==true){
									$(grid_selector).jqGrid().trigger('reloadGrid');
								}
							}
						});
					});
				}
				//添加问题保存按钮
				$("#add-question-save-btn").on("click",function(){
					var add_quesetion=$("#add-quesetion").val();
					var add_status=$("#add-status")[0].checked==true?1:0;
					var add_skiId=$("#add-skiId").val();
					//console.log($("#add-skiId"));
					//验证
					if(yl_tools.isEmpty(add_quesetion)){
						bootbox.dialog({
							message: "<span class='bigger-110'>习题问题不能为空！</span>",
						});
						return false;	
					}
					else if(yl_tools.isEmpty(add_skiId)){
						bootbox.dialog({
							message: "<span class='bigger-110'>习题考察技能不能为空！</span>",
						});
						return false;	
					}
					else{
						$.ajax({
							type : 'POST',
							cache : false,
							url : '/xtgl/addKnoSkiTest',
							datatype:"script",
							data :{
								question:add_quesetion,
								skiId:add_skiId,
								knoId:$("#kno-select").val(),
								status:add_status
							},
							success : function(data) {
								if(data==true){
									$(grid_selector).jqGrid().trigger('reloadGrid');
									bootbox.dialog({
										message: "<span class='bigger-110'>添加习题成功！</span>",
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
									$("#add-question-cancel-btn").trigger('click');
								}
								
							}
						});
					}
				});
				
				$('textarea.limited').inputlimiter({
					remText: '%n 字符 %s 剩余...',
					limitText: '最大允许字符数 : %n.'
				});
				
			
				function enableTooltips(table) {
					$('.navtable .ui-pg-button').tooltip({container:'body'});
					$(table).find('.ui-pg-div').tooltip({container:'body'});
				}
		
			});
});

