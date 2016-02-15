//@author:fangxiaohua
//@邮箱：abc2710712@qq.com
//@qq:1295168875
// 2014年10月27日 下午2:03:16 
//加载jqgrid相关依赖js包
	ace.load_ajax_scripts([
	], function() {
		
		var professionDict={
				//添加按钮
				add_hot_btn:['<div class="col-xs-12 col-sm-12" id="profession-tab-add-hot-btn">',
					        			'<button class="btn btn-primary pull-right"  href="#add-profession-dict-form" role="button" data-toggle="modal" id="add-profession-dict-form">',
					        				'<i class="ace-icon fa fa-hand-o-right green"></i>添加首页热门</button>',
							  '</div>'].join(''),
				//添加专业按钮
				add_profession_btn:[
				                '<div class="col-xs-12 col-sm-12" id="profession-tab-add-btn">',
									'<button class="btn btn-primary pull-right"  id="add-kno-btn" href="#add-modal-form" role="button" data-toggle="modal">',
										'<i class="ace-icon fa fa-hand-o-right green"></i>添加新体系',
									'</button>',
								'</div>'].join(''),
				init:function(){
					$('#profession-tab a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
						var divId=$(e.target).attr("href");
						if($("#profession-tab-add-hot-btn")){
							 $("#profession-tab-add-hot-btn").remove();
						}
						if($("#profession-tab-add-btn")){
							 $("#profession-tab-add-btn").remove();
						}
						switch(divId){
								case "#profession-dict":{
									professionDict.jqgird_dictList({
										divId:"#profession-dict",
										url:"/professionDict/getProfessionDictList",
										tilte:"专业字典",
										colNames:['id','体系名称','体系阶段数','体系知识点数','体系测试题数','是否可用','排序','操作'],
										colModel:[
							          					//id
														{name:'id',index:'id', width:0, sorttype:"int",hidden:true,search:false,sortable:false,editable:false,align:"center",key:true}, 
														//体系名称
														{name:'kno_name',index:'kno_name',width:150, editable:false,align:"center"},
														//体系阶段数
														{name:'levelnum',index:'levelnum', width:150 ,editable:false,align:"center"}, 
														//体系知识点数
														{name:'skillnum',index:'skillnum',width:150, editable:false, align:"center"},
														//体系测试题数
														{name:'quesnum',index:'quesnum',width:150, editable:false, viewable:true},
														//是否可用
														{name:'status',index:'status',width:100,align:"center",sortable:false,
															editable: true,edittype:"checkbox",editoptions: {value:"是:否"},unformat: aceSwitch,
														},
														//排序
														{name:'sort',index:'', width:120, fixed:true, sortable:false, resize:false,editable:false,
															formatter:function(cellvalue,options,rowObject){
																	var records=$("#"+options.gid).getGridParam('records');
																	if(records==1){
																		return '<div style="margin-left:8px;">'+yl_tools.jqGrid_banbtnstr+yl_tools.jqGrid_banbtnstr+'</div>';
																	}else if(rowObject.sort_index==1){
																		return '<div style="margin-left:8px;">'+yl_tools.jqGrid_banbtnstr+yl_tools.jqGrid_downbtnstr("profession-dict-grid-table")+'</div>';
																	}else if(records==rowObject.sort_index){
																		return '<div style="margin-left:8px;">'+yl_tools.jqGrid_uphbtnstr("profession-dict-grid-table")+yl_tools.jqGrid_banbtnstr+'</div>';
																	}
																	return '<div style="margin-left:8px;">'+yl_tools.jqGrid_uphbtnstr("profession-dict-grid-table")+yl_tools.jqGrid_downbtnstr("profession-dict-grid-table")+'</div>';
																}
														},
														//操作
														{name:'myac',index:'', width:120, fixed:true, sortable:false, resize:false, viewable:false,
															formatter:'actions', 
															formatoptions:{ 
																keys:true,
																delbutton: false,//disable delete button
																//editformbutton:true, editOptions:{recreateForm: true, beforeShowForm:beforeEditCallback}
															}
														}
													],
													loadComplete:function(data){
														if($("#profession-tab-add-btn")){
															 $("#profession-tab-add-btn").remove();
														}
														$("#profession-tab-page").before(juicer(professionDict.add_profession_btn,{}));
													}
									});
									break;
								}
								case "#profession-hot":{
									professionDict.jqgird_dictList({
										divId:"#profession-hot",
										url:"/professionDict/getKnoListByOnTop",
										tilte:"首页热门专业",
										colNames:['id','体系名称','英文名称','操作'],
										colModel:[
													{name:'id',index:'id', width:0, sorttype:"int",hidden:true,search:false,sortable:false,editable:false,align:"center",key:true}, 
													//类型名称
													{name:'kno_name',index:'kno_name',width:120, editable:false, viewable:true},
													//英文名称
													{name:'english_name',index:'english_name',width:120, editable:false, viewable:true},
													//操作
													{name:'myac',index:'', width:80, fixed:true, sortable:false, resize:false, viewable:false,
														formatter:function(cellvalue,options,rowObject){
															return '<div style="margin-left:8px;">'+yl_tools.jqGrid_delbtnstr+'</div>';
														}
													}
												]
									});
									break;
								}
								default:{
									break;
								}
						}
					});
					//数据列表
					$("#profession-dict-first").trigger("click");
					//将编辑复选框格式化
					function aceSwitch( cellvalue, options, cell ) {
						setTimeout(function(){
							var target=$(cell).find('input[type=checkbox]');
								target.addClass('ace ace-switch ace-switch-5')
								.after('<span class="lbl"></span>');
						}, 0);
					}
				},
				//高校学习经历数据列表
				jqgird_dictList:function(args){
					var divId=args.divId;
					 var selector=args.divId+"-grid-table"
					 var grid_url=args.url;
					 var grid_title=args.tilte;
					 var grid_colNames=args.colNames;
					 var  grid_colModel=args.colModel;
					 var grid_loadComplete=args.loadComplete;
					 var str='<table id="'+divId.split("#")[1]+'-grid-table"></table>';
					 $(divId).empty().html(str)
					setTimeout(function(){
						//jqgrid宽度自适应//jqgrid宽度自适应
						autoWidth(selector);
						//jqgrid相关配置
						$(selector).jqGrid({
							ajaxGridOptions : {
								timeout : 500000  //设置ajax加载超时时间
							},
							url :grid_url, //这是Action的请求地址   
							//重置默认 请求参数
							prmNames:{
								 page:"pageNo",    // 表示请求页码的参数名称  
								 rows:"pageSize"   // 表示请求行数的参数名称
							}, 
							postData:{//条件查询后台传值
								q:""
							},
							datatype : "json", //将这里改为使用JSON数据   
							mtype : "POST", //提交类型
							height: 250,
							caption:grid_title,//表格标题
							//重置默认json解析参数
							jsonReader:{ 
								root:"records", // json中代表实际模型数据的入口  
								page:"currentpage", // json中代表当前页码的数据  
								total:"totalpage", // json中代表页码总数的数据  
								records:"totalrecord",  // json中代表数据行总数的数据  
								repeatitems:false    // 如果设为false，则jqGrid在解析json时，会根据name来搜索对应的数据元素（即可以json中元素可以不按顺序）；而所使用的name是来自于colModel中的name设定。  
							},
							colNames:grid_colNames,
							colModel:grid_colModel,
							viewrecords : true, //是否显示行数
							rownumbers:true,//添加左侧行号
							altRows: true,
							//toppager: true,
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
										if(typeof(grid_loadComplete)=="function"){
											grid_loadComplete(data);
										}
										if($("#profession-tab-add-btn")){
											professionDict.addKno(selector);
										};
										//字典排序
										dictSort(selector);
										//用于判断是否添加添加按钮
										if(data.userdata){
											//删除热门
											hotdel(selector);
											//添加热门
											hotadd(selector);
											
											if(data.totalrecord<data.userdata.limitnum){
													//添加添加按钮
													if($("#profession-tab-add-hot-btn")){
														 $("#profession-tab-add-hot-btn").remove();
													}
													$("#profession-tab-page").before(juicer(professionDict.add_hot_btn,{}));
											}else{
													if($("#profession-tab-add-hot-btn")){
														 $("#profession-tab-add-hot-btn").remove();
													}
											}
										}
								}, 0);
							},
							//编辑保存路径
							editurl: "/professionDict/updateKnoStatus"
						});
						//trigger window resize to make the grid get the correct size
						$(window).triggerHandler('resize.jqGrid');
			
						$(document).on('ajaxloadstart', function(e) {
							$(selector).jqGrid('GridUnload');
							$('.ui-jqdialog').remove();
						});
					},0);
				
					
						function beforeEditCallback(e) {
							var form = $(e[0]);
							yl_tools.jqGrid_style_edit_form(form);
						}
					
					
						function enableTooltips(table) {
							$('.navtable .ui-pg-button').tooltip({container:'body'});
							$(table).find('.ui-pg-div').tooltip({container:'body'});
						}
						
						//字典排序
						function dictSort(selector){
								$(".jqGrid_sortbtnstr"+selector.split("#")[1]).off("click."+selector.split("#")[1]).on("click."+selector.split("#")[1],function(e){
											setTimeout(function(){
														var id = $(selector).jqGrid('getGridParam','selrow');
														var sortType=$(e.target).attr("data-oper");
														//验证成功,ajax保存
														 yl_ajaxAction.ajax_update({
													  			updateActionUrl: '/professionDict/professionSort',
													  			updateActionParams:{
													  				sortType:sortType,
																	id:id
													  			},
													  			updateReponseFun:function(data){
													  				if(data==true){
																		yl_tips.success("排序成功!");
																		$(selector).jqGrid().trigger('reloadGrid');
																	}else{
																		yl_tips.error("排序失败!");
																	}
													  			}
														 });
											},0);
								});
						}
						//删除首页热门推荐
						function hotdel(selector){
							if($(".jqGrid_delbtnstr")){
									$(".jqGrid_delbtnstr").off("click.profession").on("click.profession",function(e){
										setTimeout(function(){
													var id = $(selector).jqGrid('getGridParam','selrow');
													//验证成功,ajax保存
													  yl_ajaxAction.ajax_del({
													  			delConfirmMsgHtml:"<p>您确定要将该体系移除热门吗?</p>",
													  			delActionUrl: '/professionDict/updateHotProfession',
													 			delActionParams:{
													 				oper:"del",
																	id:id
													 			},
													  			delReponseFun:function(data){
													  				if(data==true){
																		yl_tips.success("删除成功!");
																		$(selector).jqGrid().trigger('reloadGrid');
																	}else{
																		yl_tips.error("添加失败!");
																	}
													  			}
													  });
										},0);
									});
							}
						}
						//添加体系热门
						function hotadd(selector){
							if($("#add-profession-hot-save-btn")){
										$("#add-profession-hot-save-btn").off("click.profession").on("click.profession",function(e){
													yl_ajaxAction.ajax_add({
												  			addActionUrl:'/professionDict/updateHotProfession',
												  			addActionParams:{
												  				oper:"add",
																id:$("#profession-kno-select").val()
												  			},
												  			addReponseFun:function(data){
												  				if(data==true){
																	yl_tips.success("添加成功!");
																	$(selector).jqGrid().trigger('reloadGrid');
																	$("#add-profession-hot-cancel-btn").trigger('click');
																}else{
																	yl_tips.error("添加失败!");
																}
												  			}
												  });
										});	
							}
						}
						
						
						function autoWidth(grid_selector){
							$(window).on('resize.jqGrid', function () {
								$(grid_selector).jqGrid( 'setGridWidth', $(".tab-content").width() );
								$(grid_selector).jqGrid( 'setGridHeight', $(window).height()*0.5 );
								
						    });
						
							//resize on sidebar collapse/expand
							var parent_column = $(grid_selector).closest('[class*="col-"]');
							$(document).on('settings.ace.jqGrid' , function(ev, event_name, collapsed) {
								if( event_name === 'sidebar_collapsed' || event_name === 'main_container_fixed' ) {
									//setTimeout is for webkit only to give time for DOM changes and then redraw!!!
									setTimeout(function() {
										$(grid_selector).jqGrid( 'setGridWidth', parent_column.width() );
									}, 0);
								}
						    });
							
							/*modal-form 弹出时所执行*/
							$('#add-profession-dict-form').on('show.bs.modal', function () {
								yl_ajaxAction.ajax_select({
							  			selectActionUrl:'/professionDict/getNoHotKnoList',
							  			selectReponseFun:function(data){
							  				$("#add-profession-hot-save-btn").show();
											var selstr="";
											for(var i=0;i<data.length;i++){
												selstr+="<option value="+data[i].id+">"+data[i].kno_name+"</option>";
											}
											if(!selstr){
												selstr="<option value=''>未找到可添加热门的体系</option>";
												$("#add-profession-hot-save-btn").hide();
											}
											$("#profession-kno-select").html(selstr);
							  			}
								});
							});
						}
				},
				//添加新的专业
				addKno:function(selector){
					 //添加保存验证
					 $("#add-save-btn").off("click").on("click",function(){
						 var add_kno_name=$("#add-name").val();
						 if(yl_tools.isEmpty(add_kno_name)){
							 yl_tips.error("体系名称不能为空！");
							 return false;
						 }
						 yl_ajaxAction.ajax_add({
							    addActionUrl:'/professionDict/addKno',
					  			addActionParams:{
					  				name:add_kno_name
					  			},
					  			addReponseFun:function(data){
					  				 if(data==true){
										 yl_tips.success("添加新的体系成功!");
										 $(selector).jqGrid().trigger('reloadGrid');
										 $("#add-cancel-btn").trigger("click");
									 }
					 			}
						 });
					 });
				}
		};
		professionDict.init();
});