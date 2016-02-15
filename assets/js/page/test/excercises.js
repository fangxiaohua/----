//@author:fangxiaohua
//@邮箱：abc2710712@qq.com
//@qq:1295168875
// 2014年10月27日 下午2:03:16 
ace.load_ajax_scripts([
	 "/assets/js/jquery.inputlimiter.1.3.1.min.js"
	 ], function() {
			void(function($){
				var exercises_tpl={
						skill_tpl:['<div class="checkbox">',
			               				'{@each_ as item,key}',
			                    						'<label>',
			                    							'<input name="form-field-checkbox" class="ace skill-checkbox" type="checkbox"  data-skiId=${item.id}>',
			                    							'<span class="lbl">${item.name}</span>',
			                    						'</label>',
			                    		'{@/each}',
		                    		'</div>'].join('')
				};
				
				
				var excercises={
						init:function(){
							this.init_add_exercise_toggle();
							this.exercises_search_toggle();
							this.selectChange();
							this.list();
							this.beforeEditModelshowCallback();
							this.exercises_edit_save();
							this.add_exercises_save();
							this.del_ans();
							this.add_ans();
							this.delQues();
							this.addQues();
							this.addExerciseModelShowCalback();
							this.textFile();
						},
						grid_selector :"#grid-table",
						pager_selector : "#grid-pager",
						//习题列表
						list:function(){
							//jqgrid宽度自适应//jqgrid宽度自适应
							yl_tools.jqGrid_autowidth(excercises.grid_selector);
							//jqgrid相关配置
							jQuery(excercises.grid_selector).jqGrid({
								ajaxGridOptions : {
									timeout : 500000  //设置ajax加载超时时间
								},
								url : "/exercises/getExercisesList", //这是Action的请求地址   
								//重置默认 请求参数
								prmNames:{
									 page:"pageNo",    // 表示请求页码的参数名称  
									 rows:"pageSize"    // 表示请求行数的参数名称
								}, 
								postData:{//条件查询后台传值
									q:"",
									knoId:0,
									levelId:0,
									skillId:0
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
									{name:'skills',index:'skills', width:50,editable:false},
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
									{name:'sort',index:'sort', width:50,editable:false,align:"center",viewable:false,
										formatter:function(cellvalue,options,rowObject){
											var records=$(excercises.grid_selector).getGridParam('records');
											console.log(($.trim($("#search").val())&&$("#exercises-common-search").hasClass("active")));
											
											if(records==1||($.trim($("#search").val())&&$("#exercises-common-search").hasClass("active"))||($("#kno-select").val()&&$("#kno-select").val()!=0&&$("#exercises-advanced-search").hasClass("active"))){
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
											return '<div style="margin-left:8px;">'+yl_tools.jqGrid_editbtnstr+'</div>';
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
								pager : excercises.pager_selector, //分页工具栏  
								altRows: true,
								rownumbers:true,//添加左侧行号
								//jqgrid加载完成后执行
								loadComplete : function() {
									var table = this;
									setTimeout(function(){
										//绑定习题排序功能
										excercises.excerciseSort(".jqGrid_sortbtnstr"+"grid-table");
										//替换jqgrid中的分页按钮图标
										yl_tools.jqGrid_updatePagerIcons(table);
										//更换导航栏中的行为图标
										yl_tools.jqGrid_updateActionIcons(table);
										$('.navtable .ui-pg-button').tooltip({container:'body'});
										$(table).find('.ui-pg-div').tooltip({container:'body'});
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
									var rowDatas = jQuery(excercises.grid_selector).jqGrid('getRowData', row_id);
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
										   colNames: ['ID',' ','答案项'],
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
													}
										    ],
											rowNum:10, //每页显示记录数  
										    height: 600,
										    altRows: true,
											//jqgrid加载完成后执行
											loadComplete : function() {
											},
											//编辑保存路径
											//editurl: "/zdgl/dataOperal"
										  }); 
									}
							});
							//trigger window resize to make the grid get the correct size
							$(window).triggerHandler('resize.jqGrid');
				
							//分页工具栏设置
							jQuery(excercises.grid_selector).jqGrid('navGrid',excercises.pager_selector,
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
								$(excercises.grid_selector).jqGrid('GridUnload');
								$('.ui-jqdialog').remove();
							});
							//条件查询
							$("#search_btn").off("click.exercises").on("click.exercises",function(){
								$(excercises.grid_selector).jqGrid('setGridParam',{page:1,	postData:{knoId:0,levelId:0,skillId:0,q:$("#search").val().trim()}}).trigger('reloadGrid');
							});
							//回车条件查询
							 $('#search').bind('keypress',function(event){
						            if(event.keyCode == "13")    
						            {
						            	$(excercises.grid_selector).jqGrid('setGridParam',{page:1,	postData:{knoId:0,levelId:0,skillId:0,q:$("#search").val().trim()}}).trigger('reloadGrid');
						            }
						      });
						},
						//添加阶段习题方式选择
						init_add_exercise_toggle:function(){
							$('#add-excercise-tab a[data-toggle="tab"]').on('show.bs.tab', function (e) {
								var divId=$(e.target).attr("href");
								switch(divId){
									/*case:{
										break;
									}
									case:{
										break;
									}*/
								}
								//技能处理
								var data=$("#add-exercises-model-btn").data("skills");
								
								var skillstr=juicer(exercises_tpl.skill_tpl,data);
								$("#exercises-add-skills").html(skillstr);
							});
						},
						//习题查询方式切换
						exercises_search_toggle:function(){
							$('#exercises-tab a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
								var divId=$(e.target).attr("href");
								if("#exercises-advanced-search"==divId){
									$("#level-select-div").hide();
									$("#skill-select-div").hide();
									$("#exercises-btn").hide();
									excercises.getknoList();
									$(excercises.grid_selector).jqGrid('setGridParam',{page:1,	postData:{knoId:0,levelId:0,skillId:0,q:""}}).trigger('reloadGrid');
								}else{
									$(excercises.grid_selector).jqGrid('setGridParam',{page:1,	postData:{knoId:0,levelId:0,skillId:0,q:$("#search").val().trim()}}).trigger('reloadGrid');
								}
								
							});
						},
						//获取专业列表
						getknoList:function(){
							console.log("=====");
							yl_ajaxAction.ajax_select({
						  			selectActionUrl:'/exercises/getKnoList',
						  			selectReponseFun:function(data){
						  				var kno_select='<option value="0">所有</option>';
										
										for(var i in data) {
											kno_select+='<option value="'+data[i].id+'">'+data[i].kno_name+'</option>';
										}
										$("#kno-select").html(kno_select);
										var kno_id=$("#kno-select").val();
						  			}
							});
						},
						//下拉框选择查询
						selectChange:function(){
							//kno条件查询
							$("#kno-select").on("change",function(){
								$(excercises.grid_selector).jqGrid('setGridParam',{page:1,	postData:{knoId:$(this).val(),levelId:0,skillId:0,q:""}}).trigger('reloadGrid');
								//重新等级列表
									excercises.getLevel($(this).val());
							});
							
							//kno条件查询
							$("#level-select").on("change",function(){
								$(excercises.grid_selector).jqGrid('setGridParam',{page:1,	postData:{knoId:0,levelId:$(this).val(),skillId:0,q:""}}).trigger('reloadGrid');
								//重新等级列表
								excercises.getSkill($(this).val());
							});
							
							//skill条件查询
							$("#skill-select").on("change",function(){
								$(excercises.grid_selector).jqGrid('setGridParam',{page:1,	postData:{knoId:0,levelId:0,skillId:$(this).val(),q:""}}).trigger('reloadGrid');
							});
							
						},
						//加载等级列表
						getLevel:function(knoId){
							yl_ajaxAction.ajax_select({
					 			selectActionUrl:'/exercises/getLevelByKnoId',
					  			selectActionParams:{
					  				knoId:knoId
					  			},
					  			selectReponseFun:function(data){
									if(data.length>0){
										var level_select='<option value="0">所有</option>';
										for(var i in data){
											level_select+='<option value="'+data[i].id+'">'+data[i].level+'</option>';
										}
										$("#level-select").html(level_select);
										$("#level-select-div").show();
										$("#skill-select-div").hide();
										$("#exercises-btn").hide();
									}else{
										$("#level-select-div").hide();
										$("#skill-select-div").hide();
										$("#exercises-btn").hide();
									}
					  			}
							});
						},
						//加载技能列表
						getSkill:function(lvId){
							 yl_ajaxAction.ajax_select({
							 		selectActionUrl:'/exercises/getKnoSkiList',
							  			selectActionParams:{
							  				lvId:lvId
							  			},
							  			selectReponseFun:function(data){
											if(data.length>0){
												var skill_select='<option value="0">所有</option>';
												for(var i in data){
													skill_select+='<option value="'+data[i].id+'">'+data[i].name+'</option>';
												}
												$("#skill-select").html(skill_select);
												$("#skill-select-div").show();
												$("#exercises-btn").show();
												$("#add-exercises-model-btn").data("skills",data);
											}else{
												$("#skill-select-div").hide();
												$("#exercises-btn").hide();
											}
							  			}
							  });
						},
						//修改习题弹出页
						beforeEditModelshowCallback:function(){
							/*modal-form 弹出时所执行*/
							$('#edit-modal-form').on('show.bs.modal', function (e) {
									var scrop=$("#edit-modal-form");
								   //设置用户 原有信息
									var id = $(excercises.grid_selector).jqGrid('getGridParam','selrow');
								   	//初始习题信息
									var rowData = $(excercises.grid_selector).jqGrid('getRowData',id);
									//习题
									scrop.find(".exercises-edit-quesetion").val(rowData.question).attr("data-queId",rowData.id);
									//是否可用
									if(rowData.status=="可用"){
										scrop.find(".edit-status")[0].checked=true;
									}else{
										scrop.find(".edit-status")[0].checked=false;
									}
									//技能点
									if(rowData.skills){
										var arrskills=rowData.skills.split(",");
										scrop.find(".edit-skill-div").empty();
										for(var i in arrskills){
											var skillTpl='<span class="label label-info arrowed-in-right arrowed">'+arrskills[i]+'</span>';
											scrop.find(".edit-skill-div").append(skillTpl);
										}
									}
									//答案项
									scrop.find(".ans-list").remove();
									if(rowData.option_a){
										initans({ansLv:"A",ansTx:rowData.option_a,scrop:scrop});
									}
								  if(rowData.option_b){
										initans({ansLv:"B",ansTx:rowData.option_b,scrop:scrop});
								  }
								  if(rowData.option_c){
									  initans({ansLv:"C",ansTx:rowData.option_c,scrop:scrop});
								  }
								  if(rowData.option_d){
									  initans({ansLv:"D",ansTx:rowData.option_d,scrop:scrop});
									}
								  if(rowData.option_e){
									  initans({ansLv:"E",ansTx:rowData.option_e,scrop:scrop});
								 }
								  if(rowData.option_f){
									  initans({ansLv:"F",ansTx:rowData.option_f,scrop:scrop});
								  }
								  
								  function initans(args){
										var ansLv=args.ansLv;
										var ansTx=args.ansTx;
										var scrop=args.scrop;
										scrop.find(".add-one-ans").trigger("click");
										var xx=0;
										switch(ansLv){
										case "A" :xx=0; break;
										case "B" :xx=1; break;
										case "C" :xx=2; break;
										case "D" :xx=3; break;
										case "E" :xx=4; break;
										case "F" :xx=5; break;}
										var ans_list=$(scrop.find(".ans-list")[xx]);
										ans_list.find(".ans-text").val(ansTx);
										ans_list.find(".ans-label").attr("data-flag",ansLv).html("答案"+ansLv);
										//判断答案是否勾选
										  if(rowData.answers){
											  var ans_list_temp=ans_list_temp=ans_list.find(".ans-is-right")[0];
											  if(rowData.answers.indexOf(ansLv)!=-1){
												  if(ans_list_temp){
													  ans_list_temp .checked=true;
												  }
											  }else{
												  if(ans_list_temp){
													  ans_list_temp .checked=false;
												  }
											  }
										  }
									}
							});
						},
						//修改页面保存按钮,验证
						exercises_edit_save:function(){
							//修改页面保存按钮,验证
							 $("#edit-save-btn").off("click.excercises").on("click.excercises",function(e){
								 var scrop=$("#edit-modal-form");
								 var questionTarget=scrop.find(".exercises-edit-quesetion");
								 var questionId=questionTarget.attr("data-queid");
								 var question=questionTarget.val();
								 var status=scrop.find(".edit-status")[0].checked?1:0;
								var optionA="";
								var optionB="";
								var optionC="";
								var optionD="";
								var optionE="";
								var optionF="";
								var ans_is_right="";
								//问题不为空
								if(yl_tools.isEmpty(question)){
									yl_tips.error("习题问题不能为空!");
									questionTarget.focus();
									return false;
								}
								var flag=false;
								// 验证答案不为空
								scrop.find(".ans-text").each(function(i,e){
												var ans=$(e).val();
												if(yl_tools.isNotEmpty(ans)){
													var lv =$(e).closest(".ans-list").find(".ans-label").attr("data-flag");
													switch(lv){
														case "A" : optionA=ans;break;
														case "B" :optionB=ans; break;
														case "C" :optionC=ans; break;
														case "D" :optionD=ans; break;
														case "E" :optionE=ans; break;
														case "F" :optionF=ans; break;
													}
												}else{
													flag=true;
													$(e).focus();
													return false;
												}
								});
								if(flag){
									yl_tips.error("答案内容不能为空!");
								}
								//正确答案验证
								scrop.find(".ans-is-right").each(function(i,e){
										if($(e)[0].checked){
											var as=$(e).closest(".ans-list").find(".ans-label").attr("data-flag");
											ans_is_right+=as+" "
										}
										
								});
								ans_is_right=$.trim(ans_is_right);
								if(yl_tools.isEmpty(ans_is_right)){
									yl_tips.error("请至少选择一个答案为正确答案!");
									return false;
								}
								
								yl_ajaxAction.ajax_update({
							  			updateActionUrl:'/exercises/updateKnoSkiTest',
							  			updateActionParams:{
							  				id:questionId,
											question:question,
											optionA:optionA,
											optionB:optionB,
											optionC:optionC,
											optionD:optionD,
											optionE:optionE,
											optionF:optionF,
											answers:ans_is_right,
											status:status
							  			},
							  			updateReponseFun:function(data){
							  				if(data==true){
												$(excercises.grid_selector).jqGrid().trigger('reloadGrid');
												yl_tips.success("修改成功!");
												$("#edit-cancel-btn").trigger('click');
											}else{
												yl_tips.error("修改失败!");
											}
							 			}
								});
							}); 
						},
						//习题排序
						excerciseSort:function(sort_selector){
							$(sort_selector).off("click.exercises").on("click.exercises",function(e){
								setTimeout(function(){
									var id = $(excercises.grid_selector).jqGrid('getGridParam','selrow');
									var sortType=$(e.target).attr("data-oper");
									//验证成功,ajax保存
									 yl_ajaxAction.ajax_update({
								  			updateActionUrl:'/exercises/sortTest',
								  			updateActionParams:{
								  				sortType:sortType,
												id:id
								  			},
								  			updateReponseFun:function(data){
								  				if(data==true){
													yl_tips.success("移动成功!");
													$(excercises.grid_selector).jqGrid().trigger('reloadGrid');
												}else{
													yl_tips.success("移动失败!");
												}
								  			}
									 	});
								},0);
							});
						},
						//添加问题保存按钮
						add_exercises_save:function(){
							$("#add-question-save-btn").off("'click.exercises").on("click.exercises",function(){
								 var scrop=$("#add-question-modal-form");
								 var  panel_list=scrop.find(".panel-list");
								 var question="";
								 var skillsId="";
								 var status="";
								var optionA="";
								var optionB="";
								var optionC="";
								var optionD="";
								var optionE="";
								var optionF="";
								var ans_is_right="";
								if(panel_list.length<1){
									yl_tips.error("请至少添加一道习题!");
									return false;
								}
								var flag=false;
								 panel_list.each(function(i,e){
									 	var panel=$(e);
									 	//question
									 	var question_target=panel.find(".exercises-edit-quesetion");
									 	var question_temp=panel.find(".exercises-edit-quesetion").val();
										//问题不为空
									 	var question_temp=$.trim(question_temp);
										if(yl_tools.isEmpty(question_temp)){
											yl_tips.error("第"+(i+1)+"道题,问题题目不能为空!");
											question_target.focus();
											flag=true;
											return false;
										}
										question+=question_temp+"!@#|||1#-@!";
										
										
										//skill
										var skills_target=panel.find(".skill-checkbox");
										//问题不为空
										var skills_temp="";
										skills_target.each(function(i,e){
											var skill=$(e);
											if(skill[0].checked){
													skills_temp+=skill.attr("data-skiid")+" ";
											}
										});
										var skills_temp=$.trim(skills_temp);
										if(yl_tools.isEmpty(skills_temp)){
											yl_tips.error("第"+(i+1)+"道题,请至少选择一个考察的技能!");
											flag=true;
											return false;
										}else{
											skillsId+=skills_temp+"!@#|||1#-@!";
										}
										
										//status
										var status_target=panel.find(".edit-status");
									 	var status_temp=panel.find(".edit-status")[0].checked?1:0;
									
									 	status+=status_temp+"!@#|||1#-@!";
									 	
										//optionA-F
									 	var option_target=panel.find(".ans-text");
									 	var optionA_temp="";
									 	var optionB_temp="";
									 	var optionC_temp="";
									 	var optionD_temp="";
									 	var optionE_temp="";
									 	var optionF_temp="";
									 	option_target.each(function(i,e){
														var ans=$(e).val();
														var ans=$.trim(ans);
														if(yl_tools.isNotEmpty(ans)){
															var lv =$(e).closest(".ans-list").find(".ans-label").attr("data-flag");
															switch(lv){
																case "A"  :optionA_temp=ans;break;
																case "B" :optionB_temp=ans; break;
																case "C" :optionC_temp=ans; break;
																case "D" :optionD_temp=ans; break;
																case "E"  :optionE_temp=ans; break;
																case "F"  :optionF_temp=ans; break;
															}
														}else{
															flag=true;
															$(e).focus();
															return false;
														}
										});
									 	if(flag){
									 		yl_tips.error("第"+(i+1)+"道题,答案内容不能为空!");
									 		return false;
									 	}else{
										 	optionA+=optionA_temp+"!@#|||1#-@!";
									 		optionB+=optionB_temp+"!@#|||1#-@!";
									 		optionC+=optionC_temp+"!@#|||1#-@!";
									 		optionD+=optionD_temp+"!@#|||1#-@!";
									 		optionE+=optionE_temp+"!@#|||1#-@!";
									 		optionF+=optionF_temp+"!@#|||1#-@!";
									 	}
									 	
									 	//ans-is-right
									 	var ans_isRight_target=panel.find(".ans-is-right");
									 	var ans_isRight_temp="";
									 	ans_isRight_target.each(function(i,e){
												if($(e)[0].checked){
													var as=$(e).closest(".ans-list").find(".ans-label").attr("data-flag");
													ans_isRight_temp+=as+" ";
												}
										});
									 	ans_isRight_temp=$.trim(ans_isRight_temp);
										if(yl_tools.isEmpty(ans_isRight_temp)){
											yl_tips.error("请为第"+(i+1)+"道题,至少选择一个答案为正确答案!");
											flag=true;
											return false;
										}else{
											ans_is_right+=ans_isRight_temp+"!@#|||1#-@!";
										}
								 });
									//总体验证
									if(flag){
										return false;
									}
									yl_ajaxAction.ajax_add({
								 		addActionUrl:'/exercises/addKnoSkiTest',
								  			addActionParams:{
								  				question:question,
												optionA:optionA,
												optionB:optionB,
												optionC:optionC,
												optionD:optionD,
												optionE:optionE,
												optionF:optionF,
												answers:ans_is_right,
												statuses:status,
												skiIds:skillsId
								  			},
								  			addReponseFun:function(data){
								  				if(data==true){
													$(excercises.grid_selector).jqGrid().trigger('reloadGrid');
													yl_tips.success("	添加成功!");
													$("#edit-cancel-btn").trigger('click');
												}else{
													yl_tips.error("添加失败!");
												}
								  			}
									});
							});
						},
						//答案选项删除
						del_ans:function(){
							//答案选项删除
							$(".delete-one-ans").off("click.exercises").on("click.exercises",function(e){
								var rmans=$(e.target).closest(".ans-list");
								var scrop=$(e.target).closest("form");
								$(e.target).closest(".ans-list").remove();
								scrop.find(".ans-label").each(function(i,e){
									var ansLv="A";
									switch(i){
										case 0 : ansLv="A";  break;
										case 1 : ansLv="B"; break;
										case 2 : ansLv="C"; break;
										case 3 : ansLv="D"; break;
										case 4 : ansLv="E"; break;
										case 5 : ansLv="F"; break;
									}
									$(e).html("答案"+ansLv).attr("data-flag",ansLv);
								});
							}); 
						},
						//习题答案添加页面点击添加答案按钮
						add_ans:function(){
							//习题答案添加页面点击添加答案按钮
							$(".add-one-ans").off("click.exercises").on("click.exercises",function(e){
								var scrop=$(e.target).closest("form");
								var ans_num=scrop.find(".ans-list").length;
								if(ans_num>5){
									yl_tips.error("<span class='bigger-110'>同一题的答案上限为6个!</span>");
									return false;
								}
								ans_list_add(scrop);
								//答案选项添加
								function ans_list_add(scrop){
									var template=$("#ans-list-template").clone(true);
									//元素初始化
									template.addClass("ans-list");
									template.removeAttr("style");
									template.removeAttr("id");
									var xx="A";
									var ans_list_last=scrop.find(".ans-list:last");
									if(ans_list_last[0]){
										var lastansLv=ans_list_last.find(".ans-label").attr("data-flag");
										switch(lastansLv){
										case "A" :xx="B"; break;
										case "B" :xx="C"; break;
										case "C" :xx="D"; break;
										case "D" :xx="E"; break;
										case "E" :xx="F"; break;}
										template.find(".ans-label").attr("data-flag",xx).html("答案"+xx);
										ans_list_last.after(template);
									}else{
										template.find(".ans-label").attr("data-flag",xx).html("答案"+xx);
										scrop.append(template);
									}
								}
							});
						},
						//删除习题
						delQues:function(){
							//删除习题
							$(".operal-del-exercises").off("click.exercises").on("click.exercises",function(e){
								$(e.target).closest(".panel-list").remove();
							})
						},
						//习题添加
						addQues:function(){
							//习题添加
							$("#add-new-exercises-edit").off("click.exercises").on("click.exercises",function(){
									var panel_tpl=$("#panel-template").clone(true);
											//元素初始化
											panel_tpl.addClass("panel-list");
											panel_tpl.removeAttr("style");
											panel_tpl.removeAttr("id");
											//技能处理
											var data=$("#add-exercises-model-btn").data("skills");
											var skillstr=juicer(exercises_tpl.skill_tpl,data);
											panel_tpl.find(".edit-skill-div").empty().html(skillstr);;
									if($(".panel-list:last")[0]){
										var flag=parseInt($(".panel-list:last").attr("data-flag"))+1;
										panel_tpl.find(".accordion-toggle").attr("href","#collapse"+flag).append("第"+flag+"道题");
										panel_tpl.find(".panel-collapse").attr("id","collapse"+flag);
										panel_tpl.attr("data-flag",flag);
										$(".panel-list:last").after(panel_tpl);
									}else{
										var flag=parseInt($("#panel-template").attr("data-flag"))+1;
										panel_tpl.find(".accordion-toggle").attr("href","#collapse"+flag).append("第"+flag+"道题");
										panel_tpl.find(".panel-collapse").attr("id","collapse"+flag);
										panel_tpl.attr("data-flag",flag);
										$("#exercises-accordion").empty().html(panel_tpl);
									}
									panel_tpl.find(".add-one-ans").trigger("click");
									panel_tpl.find(".accordion-toggle").trigger('click');
							});
						},
						addExerciseModelShowCalback:function(){
							//进入添加习题页 回调
							/*modal-form 弹出时所执行*/
							$('#add-question-modal-form').on('show.bs.modal', function () {
								$(".panel-list").remove();
								$("#add-new-exercises-edit").trigger("click");
							});
						},
						textFile:function(){
							$('textarea.limited').inputlimiter({
								remText: '%n 字符 %s 剩余...',
								limitText: '最大允许字符数 : %n.'
							});
						}
				};	
				excercises.init();
			})(jQuery);
});

