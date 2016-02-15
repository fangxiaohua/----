//@author:fangxiaohua
//@邮箱：abc2710712@qq.com
//@qq:1295168875
// 2014年10月27日 下午2:03:16 
//加载jqgrid相关依赖js包
	ace.load_ajax_scripts([
	                       "/assets/js/jquery-ui.min.js",
	                       "/assets/js/jquery.ui.touch-punch.min.js"
	 ], function() {
		void(function($){
			var hotCrs={
					init:function(){
						this.list();
						this.beforeModelshowCallback();
						this.typeChange();
						this.addSave();
						this.crsSearch();
					},
					_grid_selector:"#grid-table",
					_pager_selector:"#grid-pager",
					//将当前推荐类型所具有的 课程 
					_nownum:"",
					//一种类型最大可推荐数量
					_limitnum:"",
					list:function(){
						//提示框
						$('[data-rel=popover]').popover({html:true});
						//jqgrid宽度自适应//jqgrid宽度自适应
						yl_tools.jqGrid_autowidth(hotCrs._grid_selector);
						//jqgrid相关配置
						jQuery(hotCrs._grid_selector).jqGrid({
							ajaxGridOptions : {
								timeout : 500000  //设置ajax加载超时时间
							},
							url : "/hotCrs/getHotCourseList", //这是Action的请求地址   
							datatype : "json", //将这里改为使用JSON数据   
							mtype : "POST", //提交类型
							height: 250,
							caption:"热门课程管理",//表格标题
							emptyrecords:"无匹配结果",//对查询条数为0时显示的 
							//重置默认json解析参数
							jsonReader:{ 
								root:"records", // json中代表实际模型数据的入口  
								page:"currentpage", // json中代表当前页码的数据  
								total:"totalpage", // json中代表页码总数的数据  
								records:"totalrecord",  // json中代表数据行总数的数据  
								repeatitems:false    // 如果设为false，则jqGrid在解析json时，会根据name来搜索对应的数据元素（即可以json中元素可以不按顺序）；而所使用的name是来自于colModel中的name设定。  
							},
							colNames:['ID','课程名称','课程编号','学校名称', '推荐类型','排序 ',' '],
							colModel:[
							     //主键ID
								{name:'id',index:'id', width:0, sorttype:"int", 
									hidden:true,search:false,sortable:false,editable:false,align:"center",key:true
								},
								//课程名称
								{name:'name',index:'crs_no',width:90, editable:false},
								//课程编crsSearch号
								{name:'crs_no',index:'crs_no', width:150,editable:false},
								//学校名称
								{name:'sch_name',index:'sch_name', width:70, editable: false},
								//推荐类型
								{name:'type',index:'type', width:90, 
									editable: true,edittype:"select",editoptions:{value:"0:热门推荐;1:即将开课"},
									formatter:function(cellvalue,options,rowObject){
										return cellvalue==1?"即将开课":"热门课程";
									}
								},
								//排序
								{name:'sort_index',index:'sort_index', width:90, 
										editable: true,edittype:"select",editoptions:{value:"1:1;2:2;3:3;4:4;5:5;6:6"},
										formatter:function(cellvalue,options,rowObject){
											return rowObject.type==1?"<i class='fa fa-flag orange bigger-130'>"+cellvalue+"</i>":'<i class="fa fa-flag green bigger-130">'+cellvalue+'</i>';
										}
								},
								//操作
								{name:'myac',index:'', width:80, fixed:true, sortable:false, resize:false,viewable:false,
									formatter:'actions', 
									formatoptions:{ 
										keys:true,
										delbutton: false,//disable delete button
										delOptions:{recreateForm:true, beforeShowForm:function(e){
											var form = $(e[0]);
											yl_tools.jqGrid_style_delete_form(form);
										}},
										editformbutton:true, editOptions:{recreateForm: true, beforeShowForm:hotCrs._beforeEditCallback}
									}
								}
							], 
							viewrecords : true, //是否显示行数
							rownumbers:true,//添加左侧行号
							rowNum:100, //每页显示记录数  
							altRows: true,
							//pager:hotCrs._pager_selector,//分页工具栏  
							//toppager: true,
							pgbuttons:false,//是否显示翻页按钮
							pginput:false,//是否显示跳页输入框
							//jqgrid加载完成后执行
							loadComplete : function(data) {
								$(".jqGrid_delbtnstr").closest("div").remove();
								for(var i in data){
									$("#jEditButton_"+data[i].id+"").after(juicer(yl_tools.jqGrid_delbtnstr,{}));
								}
								var table = this;
								setTimeout(function(){
									//更换导航栏中的行为图标
									yl_tools.jqGrid_updateActionIcons(table);
									//更换选择框的样式
									yl_tools.jqGrid_styleCheckbox(table);
									
									$('.navtable .ui-pg-button').tooltip({container:'body'});
									$(table).find('.ui-pg-div').tooltip({container:'body'});
									hotCrs._delOne();
								}, 0);
							},
							//编辑保存路径
							editurl: "/hotCrs/dataOperal"
					    });
						//trigger window resize to make the grid get the correct size
						$(window).triggerHandler('resize.jqGrid');
			
						$(document).on('ajaxloadstart', function(e) {
							$(hotCrs._grid_selector).jqGrid('GridUnload');
							$('.ui-jqdialog').remove();
						});
						
						//分页工具栏设置
						$(hotCrs._grid_selector).jqGrid('navGrid',hotCrs._pager_selector,
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
									/* var id = jQuery(hotCrs._grid_selector).jqGrid('getGridParam','selrow');
									alert(id)
									$("#jEditButton_"+id).remove();
									$("#jDeleteButton_"+id).remove(); */
								}
							}
						);
					},
					//删除行
					_delOne:function(){
						$(".jqGrid_delbtnstr").off("click.hotCrs").on("click.hotCrs",function(e){
							setTimeout(function(){
								var rowId=$(hotCrs._grid_selector).jqGrid('getGridParam','selrow');
								yl_ajaxAction.ajax_del({
								  			delConfirmMsgHtml:'<p>您确定删除该条记录吗?</p>',
								  			delActionUrl:'/hotCrs/dataOperal',
								  			delActionParams:{
								  				id:rowId,
												oper:"del"
								  			},
								  			delReponseFun:function(data){
								  				if(data==true){
													yl_tips.success("删除成功！");
													$(hotCrs._grid_selector).jqGrid().trigger('reloadGrid');
													$(".tooltip").remove();
												}else{
													yl_tips.error("删除失败！");
												}
								  			}
								  });
							},0);
						});
					},
					//该页面自定义的修改弹框的样式
					_style_edit_form:function(form){
						form.closest('.ui-jqdialog').find('.ui-jqdialog-titlebar').wrapInner('<div class="widget-header" />');
						var buttons = form.next().find('.EditButton .fm-button');
						buttons.addClass('btn btn-sm').find('[class*="-icon"]').hide();//ui-icon, s-icon
						buttons.eq(0).addClass('btn-primary').prepend('<i class="ace-icon fa fa-check"></i>');
						buttons.eq(1).prepend('<i class="ace-icon fa fa-times"></i>');
						
						buttons = form.next().find('.navButton a');
						buttons.find('.ui-icon').hide();
					},
					//动态加载选顺序号
					_getSortIndex:function(args){
						yl_ajaxAction.ajax_select({
					  			selectActionUrl:'/hotCrs/getTypeHotCourseNum',
					  			selectActionParams:{
					  				type:args.type
					  			},
					 			selectRequestType:"POST",
					  			selectReponseFun:function(data){
									var sortIndex="";
									//修改页
									if(args.oper=="edit"){
										for(var i=0;i<data.num;i++){
											sortIndex+='<option role="option" value="'+(i+1)+'">'+(i+1)+'</option>';
										}
										args.target.html(sortIndex);
										var id = jQuery(hotCrs._grid_selector).jqGrid('getGridParam','selrow');
										var rowDatas = jQuery(hotCrs._grid_selector).jqGrid('getRowData', id);
										var row = rowDatas["sort_index"];
										args.target.val($(row).text());
									}
									//添加页
									else if(args.oper=="add"){
										//将当前推荐类型所具有的 课程 
										hotCrs._nownum=data.num;
										//一种类型最大可推荐数量
										hotCrs._limitnum=data.limitnum;
										for(var i=0;i<=data.num;i++){
											if(i+1>hotCrs._limitnum) break;
											sortIndex+='<option value="'+(i+1)+'">'+(i+1)+'</option>';
										}
										args.target.html(sortIndex);
									}
					  			}
						 });
					},
					//添加框弹出前回调函数
					_beforeEditCallback:function(e){
						var form = $(e[0]);
						//定义修改弹框的样式
						hotCrs._style_edit_form(form);
						//根据推荐类型查询排序编号
						hotCrs._getSortIndex({"type":$("#type").val(),"target":$("#sort_index"),"oper":"edit"});
					},
					beforeModelshowCallback:function(){
						/*modal-form 弹出时所执行*/
						$('#add-modal-form').on('shown.bs.modal', function () {
							//initchosen();
							//动态查询课程列表
							$("#add_crsId").val("");
							$("#add_crsId").attr("data-value","");
							//添加页面按类型下拉框添加change事件
							hotCrs._getSortIndex({"type":$("#add_type").val(),"target":$("#add_sortIndex"),"oper":"add"});
						});
					
					},
					//为类型选择框绑定change事件
					typeChange:function(){
						//为类型选择框绑定change事件
						$("#type").on("change",function(){
							hotCrs._getSortIndex({"type":$("#type").val(),"target":$("#sort_index"),"oper":"edit"});
						});
						//推荐类型变值绑定
						$("#add_type").on("change",function(){
							hotCrs._getSortIndex({"type":$(this).val(),"target":$("#add_sortIndex"),"oper":"add"});
						});
					},
					addSave:function(){
						//添加页面中的保存按钮,验证,提交
						$("#add-save-btn").off("click.hotCrs").on("click.hotCrs",function(){
							var add_crsId=$("#add_crsId").attr("data-value");
							var add_type=$("#add_type").val();
							var add_sortIndex=$("#add_sortIndex").val();
							//添加验证
							if(hotCrs._nownum==hotCrs._limitnum){
								yl_tips.error("该类型的推荐课程数已达上限,请先删除一些,再进行添加!");
								return false;
							}
							else if(yl_tools.isEmpty(add_crsId)){
								yl_tips.error("请先选择一门课程！");
								return false;
							}
							else{
								//验证成功,ajax保存
								yl_ajaxAction.ajax_add({
							  			addActionUrl: '/hotCrs/addHotCourse',
							  			addActionParams:{
							  				crsId:add_crsId,
											type:add_type,
											sortIndex:add_sortIndex
							  			},
							  			addReponseFun:function(data){
							  				if(data==true){
												$(hotCrs._grid_selector).jqGrid().trigger('reloadGrid');
												yl_tips.success("添加推荐课程成功！");
												$("#add-cancel-btn").trigger('click');
											}
							  			}
								});
							}
						});
					},
					crsSearch:function(){
						//课程查询
						yl_tools.course_search({
							div:"course-search-2",
							openbtn:"#add_crsId",
							title:"课程查询",
							dafvalue:"",
							placeholder:"请输入课程编号或课程名称进行查询",
							url:"/comm/getCourseList",
							onSelect:function(rowData,e){
								$(e).val(rowData.name);
								$(e).attr("data-value",rowData.id);
							}
						});
					}
			};
			hotCrs.init();
		})(jQuery);
});