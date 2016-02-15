//@author:fangxiaohua
//@邮箱：abc2710712@qq.com
//@qq:1295168875
// 2014年10月27日 下午2:03:16 
//加载jqgrid相关依赖js包
ace.load_ajax_scripts([
	], function() {
		void(function($){
			var profession_tpl={
					//专业基本信息 
					baseInfo:[
								'<div class="profile-info-row baseInfo">',
								'<div class="profile-info-name"> 专业编号</div>',
								'',
								'<div class="profile-info-value">',
								'	<span class="editable editable-click" id="kno-no" style="display: inline;">{@if kno_no!=null}${kno_no}{@/if}</span>',
								'</div>',
								'</div>',
								'',
								'<div class="profile-info-row baseInfo">',
								'<div class="profile-info-name"> 专业名称</div>',
								'',
								'<div class="profile-info-value">',
								'	<span class="editable editable-click" id="kno-name" style="display: inline;">{@if kno_name!=null}${kno_name}{@/if}</span>',
								'</div>',
								'</div>',
								'',
								'<div class="profile-info-row baseInfo">',
								'<div class="profile-info-name"> 英文名称</div>',
								'',
								'<div class="profile-info-value">',
								'	<span class="editable editable-click" id="kno-english-name" style="display: inline;">{@if english_name!=null}${english_name}{@/if}</span>',
								'</div>',
								'</div>',
								'',
								'<div class="profile-info-row baseInfo">',
								'<div class="profile-info-name">专业简介: </div>',
								'',
								'<div class="profile-info-value">',
								'	<span class="editable editable-click" id="kno-description" style="display: inline;">{@if description!=null}${description}{@/if}</span>',
								'</div>',
								'</div>'
					          ].join(""),
					  //阶段基本信息
					 levelInfo:[
								' <div class="profile-info-row">',
								'	<div class="profile-info-name"> 阶段名称:</div>',
								'',
								'	<div class="profile-info-value">',
								'		<span class="editable editable-click profession-level-name"  style="display: inline;" data-lvId="${id}" >{@if levelName!=null}${levelName}{@/if}</span>',
								'	</div>',
								'</div>',
								'',
								'<div class="profile-info-row">',
								'	<div class="profile-info-name">专业简介: </div>',
								'',
								'	<div class="profile-info-value">',
								'		<span class="editable editable-click profession-level-description"  style="display: inline;" data-lvId="${id}">{@if description!=null}${description}{@/if}</span>',
								'	</div>',
								'</div>'
					     ].join(""),
					     //阶段课程信息
					     crsList:[
				         		'<div class="col-xs-12 col-sm-12  crs-grid-table-space" style="width: 97%;margin: 0 auto;">',
					         		'<table id="crs-grid-table-${lvId}"></table>',
					         		'<div id="crs-grid-pager-${lvId}"></div>',
				         		'</div>'
						 ].join(""),
						  //阶段习题信息
					     testList:[
				         		'<div class="col-xs-12 col-sm-12  test-grid-table-space" style="width: 97%;margin: 0 auto;">',
					         		'<table id="test-grid-table-${lvId}"></table>',
					         		'<div id="test-grid-pager-${lvId}"></div>',
				         		'</div>'
						 ].join("")
			}
		
		
		
		
		
				var profession={
						init:function(){
							//初始化专业列表下拉框
							this.initPageInfo();
							//文件上传初始化
							this.initUpload();
							this.saveBaseInfo();
							//初始化课程查询
							this.initCrsSearch();
							//添加等级
							this.addLevel();
							this.knoChangeSearch();
							//删除专业等级
							this.delLevel();
							//阶段保存
							this.saveLevel();
							//添加技能弹窗回调
							this.addSkillModelCanback();
							//添加保存技能
							this.saveAddSkill();
							//等级状态修改
							this.levelStatusChange();
							//初始化阶段伸缩框
							this.initAccordion();
							//添加专业课程弹窗
							this.addLevelCrsModelCalback();
							//阶段课程添加保存
							this.saveLvCrs();
						},
						//文件上传初始化
						initUpload:function(){
						 	//logo文件上传
							yl_ajaxAction.ajax_upload({
								btn_selector:"#edit-upload-btn",
								fileId:"kno-logo",
								preview_selector:"#kno-logo-show",
								uploadParams:{
									fileType:"picture",
									type:"school",
									id:"YL_KNO"
								},
								uploadStart:function(){
									yl_tips.waiting("logo上传中，请稍后... ...");
								},
								succFun:function(data){
									yl_tips.success("图片上传成功!");
									$("#kno-logo-path").val(data);
								}
							});
							
							//文件上传
							yl_ajaxAction.ajax_upload({
								btn_selector:"#edit-banner-upload-btn",
								fileId:"kno-banner",
								preview_selector:"#kno-banner-show",
								uploadParams:{
									fileType:"picture",
									type:"school",
									id:"YL_KNO"
								},
								uploadStart:function(){
									yl_tips.waiting("banner上传中，请稍后... ...");
								},
								succFun:function(data){
									yl_tips.success("图片上传成功!");
									$("#kno-banner-path").val(data);
								}
							});
							
						},
						//基础信息保存
						saveBaseInfo:function(){
							//基础信息保存
							$(".kno-base-save").off("click.profession").on("click.profession",function(e){
								var target=$(e.target);
								var value="";
								var name="";
								var pk=target.attr("data-id");
								if(target.attr("data-flag")=="logo"){
									value=$("#kno-logo-path").val();
									name="logo";
								}else{
									value=$("#kno-banner-path").val();
									name="banner";
								}
								yl_tips.waiting("保存中，请稍后... ...");
								$.ajax({
									type : 'POST',
									cache : false,
									url : '/profession/updateKno',
									datatype:"script",
									data :{
										name:name,
										value:value,
										pk:pk
									},
									error : function(request) {
										yl_tips.error("服务器响应错误，操作失败！");
										return false;
									},
									success : function(data) {
										//初始化kno基本信息
										if(data==true){
											yl_tips.success("保存成功!");
										}else{
											yl_tips.error("保存失败!");
										}
									}
								});
							});
						},
						//添加等级
						addLevel:function(){
								$("#add-new-profession-level").off("click.profession").on("click.profession",function(){
									var flag=1;
									if($(".panel-list:last")[0]){
										var flag=parseInt($(".panel-list:last").attr("data-flag"))+1;
									}
									 $.ajax({
											type : 'get',
											cache : false,
											url : '/profession/addLevel',
											datatype:"script",
											data :{
												level:flag,
												knoId:$("#kno-select").val()
											},
											error : function(request) {
												yl_tips.error("服务器响应错误，操作失败！");
												return false;
											},
											success : function(data) {
												if(data){
													yl_tips.success("添加等级成功");
													var panel_tpl=$("#panel-template").clone(true);
													//元素初始化
													panel_tpl.addClass("panel-list");
													panel_tpl.removeAttr("style");
													panel_tpl.removeAttr("id");
													panel_tpl.attr("data-lvid",data);
													panel_tpl.find(".profession-level-name").attr("data-pk",data);
													panel_tpl.find(".profession-level-description").attr("data-pk",data);
													panel_tpl.find(".level-status").attr("checked","checked");
													if($(".panel-list:last")[0]){
														panel_tpl.find(".accordion-toggle").attr("href","#collapse"+flag).append("第"+flag+"阶段");
														panel_tpl.find(".panel-collapse").attr("id","collapse"+flag);
														panel_tpl.attr("data-flag",flag);
														$(".panel-list:last").after(panel_tpl);
													}else{
														panel_tpl.find(".accordion-toggle").attr("href","#collapse"+flag).append("第"+flag+"阶段");
														panel_tpl.find(".panel-collapse").attr("id","collapse"+flag);
														panel_tpl.attr("data-flag",flag);
														$("#profession-level-accordion").empty().html(panel_tpl);
													}
													
													//初始化等级基本信息编辑控件
													profession.initLevelEdit();
												}else{
													yl_tips.error("添加等级失败");
												}
											}
									 });
							});
						},
						//初始化课程查询
						initCrsSearch:function(){
							//课程查询
							yl_tools.course_search({
								div:"course-search-1",
								openbtn:"#add-profession-level-crs-name",
								title:"课程查询",
								dafvalue:"",
								placeholder:"请输入课程编号或课程名称进行查询",
								url:"/comm/getCourseList",
								onSelect:function(rowData,e){
									console.log(rowData);
									$(e).val(rowData.name);
									$(e).attr("data-value",rowData.id);
								}
							});
						},
						//加载专业列表
						initPageInfo:function(args){
							//加载专业下拉框
							profession.getKnoList({
								success:function(data){
									var kno_id=$("#kno-select").val();
									$("#kno-id").val(kno_id);
									//加载 kno基本信息
									profession.initBaseInfo(kno_id);
									//加载 技能列表
									profession.getLevel(kno_id);
								}
							});
						},
						//获取专业下拉列表
						getKnoList:function(args){
							//加载kno
							$.ajax({
								type : 'GET',
								cache : true,
								url : '/profession/getKnoList',
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
									args.success(data);
								}	
							});
						},
						knoChangeSearch:function(){
							$("#kno-select").off("change").on("change",function(){
								$("#kno-id").val($("#kno-select").val());
								
								//加载 kno基本信息
								profession.initBaseInfo($("#kno-id").val());
								profession.getLevel($("#kno-id").val());
							});
						},
						//初始化专业基本信息
						initBaseInfo:function(kno_id){
							$.ajax({
								type : 'GET',
								cache : false,
								url : '/profession/getKno',
								datatype:"json",
								data :{
									id:kno_id
								},
								error : function(request) {
									alert("服务器响应错误，操作失败！");
									return false;
								},
								success : function(data) {
									//初始化kno基本信息
									initKnoBaseInfo(data);
								}
							});
							
							//初始化kno基本信息	
							function initKnoBaseInfo(data){
								//删除节点
								$(".baseInfo").remove();
								$("#baseInfo-space").empty().html(juicer(profession_tpl.baseInfo,data));
								
								//logo
								$("#kno-logo-show").attr("src",data.logo_url);
								$("#kno-logo-path").val(data.logo_url);
								//banner
								$("#kno-banner-show").attr("src",data.big_logo_url);
								$("#kno-banner-path").val(data.big_logo_url);
								
								$(".kno-base-save").attr("data-id",data.id);
								
								//初始化基本信息编辑框
								(function(){
									//editables on first profile page
									$.fn.editable.defaults.mode = 'inline';
									$.fn.editableform.loading = "<div class='editableform-loading'><i class='ace-icon fa fa-spinner fa-spin fa-2x light-blue'></i></div>";
								    $.fn.editableform.buttons = '<button type="submit" class="btn btn-info editable-submit"><i class="ace-icon fa fa-check"></i></button>'+
								                                '<button type="button" class="btn editable-cancel"><i class="ace-icon fa fa-times"></i></button>';    
									
									
									$('#kno-no').editable({
										type: 'text',
										name: 'kno-no',
										pk:data.id,
										emptytext:"请点击输入专业编号",
										url:"#",
										validate:function(value){
										},
										success: function(response, newValue) {
												yl_tips.success("暂无该字段  ！");
										}
								    });
									
								    //text editable
								    $('#kno-name').editable({
										type: 'text',
										pk:data.id,
										emptytext:"请点击输入专业名称",
										name:'kno-name',
										url:"/profession/updateKno",
										validate:function(value){
											
										},
										success: function(response, newValue) {
											if(response){
												yl_tips.success("修改成功！");
												//重新加载专业下拉框
												$("#kno-select")[0].options[$("#kno-select")[0].selectedIndex].text= newValue;
											}else{
												yl_tips.error("修改失败！");
											}
										}
								    });
								    
								    //text editable
								    $('#kno-english-name').editable({
										type: 'text',
										emptytext:"请点击输入专业英文名称",
										pk:data.id,
										name: 'kno-english-name',
										url:"/profession/updateKno",
										validate:function(value){
											
										},
										success: function(response, newValue) {
											if(response){
												yl_tips.success("修改成功！");
											}else{
												yl_tips.error("修改失败！");
											}
										}
								    });
									$('#kno-description').editable({
										mode: 'inline',
								        type: 'wysiwyg',
								        pk:data.id,
								        onblur:'ignore',
										name : 'kno-description',
										emptytext:"请点击输入专业描述",
										url:"/profession/updateKno",
										validate:function(value){
											
										},
										success: function(response, newValue) {
											if(response){
												yl_tips.success("修改成功！");
											}else{
												yl_tips.error("修改失败！");
											}
										}
									});
									$('#kno-description').on('shown', function(e, editable) {
										$(".wysiwyg-toolbar .btn-group:last").remove();
									});
								})(); 
							}
						},
						//获取等级列表
						getLevel:function(kno_id){
							$(".panel-list").remove();
							$.ajax({
								type : 'GET',
								cache : false,
								url : '/profession/getKnoLeveListByKnoId',
								datatype:"json",
								data :{
									knoId:kno_id
								},
								error : function(request) {
									yl_tips.error("服务器响应错误，操作失败！");
									return false;
								},
								success : function(data) {
									console.log(data);
									for(var i in data){
										var flag=data[i].level;
										var panel_tpl=$("#panel-template").clone(true);
										//元素初始化
										panel_tpl.addClass("panel-list");
										panel_tpl.removeAttr("style");
										panel_tpl.removeAttr("id");
										if($(".panel-list:last")[0]){
											panel_tpl.find(".accordion-toggle").attr("href","#collapse"+flag).append("第"+flag+"阶段");
											panel_tpl.find(".panel-collapse").attr("id","collapse"+flag);
											panel_tpl.attr("data-flag",flag);
											$(".panel-list:last").after(panel_tpl);
										}else{
											panel_tpl.find(".accordion-toggle").attr("href","#collapse"+flag).append("第"+flag+"阶段");
											panel_tpl.find(".panel-collapse").attr("id","collapse"+flag);
											panel_tpl.attr("data-flag",flag);
											$("#profession-level-accordion").empty().html(panel_tpl);
										}
										console.log(juicer(profession_tpl.levelInfo,data[i]));
										panel_tpl.find(".profile-user-info").html(juicer(profession_tpl.levelInfo,data[i]));
										
										var panel_target=$(".panel-list:last");
										panel_target.find(".profession-level-name").html(data[i].levelName).attr("data-pk",data[i].id);
										panel_target.find(".profession-level-description").html(data[i].description).attr("data-pk",data[i].id);
										panel_target.attr("data-lvid",data[i].id);
										if(data[i].status){
											panel_target.find(".level-status").attr("checked","checked");
										}
										
										
										////////////////////////
										
										if(data[i].skillId){
											var skillIds=data[i].skillId.split(",");
											var skillNames=data[i].skillName.split(",");
											var jsonstr='[';
											var skitab="";
											for(var j in skillIds){
												 skitab+='<div class="level-skill" style="float: left;padding-right: 25px;"><span class="label label-success arrowed-in-right arrowed" data-skiId="'+skillIds[j]+'">'+skillNames[j]+'</span><a style="cursor: pointer;"><span class="badge" ><i class="icon-only ace-icon fa fa-times red2 operal-del-skill"></i></span></a></div>';
											}
											panel_target.find(".profession-skills-list").html(skitab);
										}
									}
									
									//等级技能删除
									profession.delLevelSki();
									//初始化等级基本信息编辑控件
									profession.initLevelEdit();
								
								}
							});
						},
						//初始化等级基本信息编辑控件
						initLevelEdit:function(){
							//专业等级编辑
							(function(){
								//editables on first profile page
								$.fn.editable.defaults.mode = 'inline';
								$.fn.editableform.loading = "<div class='editableform-loading'><i class='ace-icon fa fa-spinner fa-spin fa-2x light-blue'></i></div>";
							    $.fn.editableform.buttons = '<button type="submit" class="btn btn-info editable-submit"><i class="ace-icon fa fa-check"></i></button>'+
							                                							'<button type="button" class="btn editable-cancel"><i class="ace-icon fa fa-times"></i></button>';    
								
								
							    
							    
							    
							    
								$('.profession-level-name').editable({
									type: 'text',
									name: 'name',
									url:   '/profession/updateLevel',  
									emptytext:"请点击输入阶段名称",
									success: function(response, newValue) {
										if(response){
											yl_tips.success("修改成功！");
										}else{
											yl_tips.error("修改失败！");
										}
									}
							    });
								
								$('.profession-level-description').editable({
									mode: 'inline',
							        type: 'wysiwyg',
									name : 'desc',
									onblur:'ignore',
									emptytext:"请点击输入阶段描述",
									url: '/profession/updateLevel',
									success: function(response, newValue) {
										if(response){
											yl_tips.success("修改成功！");
										}else{
											yl_tips.error("修改失败！");
										}
									}
								});
								
								$('.profession-level-description').on('shown', function(e, editable) {
									$(".wysiwyg-toolbar .btn-group:last").remove();
								});
							})();
						},
						//初始化阶段伸缩框
						initAccordion:function(){
							$('#profession-level-accordion').on('shown.bs.collapse', function (e) {
								var scorp=$(e.target).closest(".panel-list");
								var lvId=scorp.attr("data-lvid");
								var crs_scorp=scorp.find(".kno-level-crs-list");
								var test_scorp=scorp.find(".kno-level-test-list");
								profession.getCrsList({
									lvId:lvId,
									crs_scorp:crs_scorp
								});
								profession.getTestList({
									lvId:lvId,
									test_scorp:test_scorp
								});
							});
						},
						//获取专业等级课程
						getCrsList:function(args){
							$(".crs-grid-table-space").remove();
							var lvId=args.lvId;
							var crs_scorp=args.crs_scorp;
							crs_scorp.empty().html(juicer(profession_tpl.crsList,{"lvId":lvId}));
							var grid_selector="#crs-grid-table-"+lvId;
							var pager_selector="#crs-grid-pager-"+lvId;
							//jqgrid宽度自适应//jqgrid宽度自适应
							//jqgrid相关配置
							jQuery(grid_selector).jqGrid({
								ajaxGridOptions : {
									timeout : 500000  //设置ajax加载超时时间
								},
								url : "/profession/getLvCourseList", //这是Action的请求地址   
								//重置默认 请求参数
								prmNames:{
									 page:"pageNo",    // 表示请求页码的参数名称  
									 rows:"pageSize"    // 表示请求行数的参数名称
								}, 
								postData:{//条件查询后台传值
									lvId:lvId,
									q:""
								},
								datatype : "json", //将这里改为使用JSON数据   
								mtype : "POST", //提交类型
								height: 200,
								autowidth:true,
								emptyrecords:"无匹配结果",//对查询条数为0时显示的 
								//caption:"专业阶段课程",//表格标题
								//重置默认json解析参数
								jsonReader:{ 
									root:"records", // json中代表实际模型数据的入口  
									page:"currentpage", // json中代表当前页码的数据  
									total:"totalpage", // json中代表页码总数的数据  
									records:"totalrecord",  // json中代表数据行总数的数据  
									repeatitems:false    // 如果设为false，则jqGrid在解析json时，会根据name来搜索对应的数据元素（即可以json中元素可以不按顺序）；而所使用的name是来自于colModel中的name设定。  
								},
								colNames:['课程id','等级id','课程名称','教师名称','关联技能点id','关联知识点','操作 '],
								colModel:[
								     //课程ID
									{name:'crsId',index:'crsId', width:0, sorttype:"int", 
										hidden:true,search:false,sortable:false,editable:false,align:"center",key:true
									},
									//等级id
									{name:'lvId',index:'lvId', width:0, sorttype:"int", 
										hidden:true,search:false,sortable:false,editable:false,align:"center"
									},
									//课程名称
									{name:'crsName',index:'crsName',width:90, editable:false},
									//教师名称
									{name:'usrName',index:'usrName', width:70, editable: false},
									//关联技能点id
									{name:'skiIds',index:'skiIds', width:70, editable: false,hidden:true},
									//关联知识点
									{name:'skiNames',index:'skiNames',width:70},
									//操作
									{name:'myac',index:'', width:80, fixed:true, sortable:false, resize:false,viewable:false,
								    	  formatter:function(cellvalue,options,rowObject){
								    		  var str='<div style="margin-left:8px;" class="del-crs-btn" data-crsId="'+rowObject.crsId+'" data-lvId="'+rowObject.lvId+'" >'+yl_tools.jqGrid_delbtnstr+'</div>';
									            return str;
									       },
									}
								], 
								viewrecords : true, //是否显示行数
								rownumbers:true,//添加左侧行号
								rowNum:10, //每页显示记录数  
								rowList:[10,20,50,100], //可调整每页显示的记录数
								pager : pager_selector, //分页工具栏  
								altRows: true,
								//toppager: true,
								//jqgrid加载完成后执行
								loadComplete : function() {
									var table = this;
									setTimeout(function(){
										//替换jqgrid中的分页按钮图标
										yl_tools.jqGrid_updatePagerIcons(table);
										//更换导航栏中的行为图标
										yl_tools.jqGrid_updateActionIcons(table);
										//更换选择框的样式
										//yl_tools.jqGrid_styleCheckbox(table);
										
										$('.navtable .ui-pg-button').tooltip({container:'body'});
										$(table).find('.ui-pg-div').tooltip({container:'body'});
										//删除阶段课程
										profession.delLvCrs();
									}, 0);
								}
							});
							//trigger window resize to make the grid get the correct size
							$(window).triggerHandler('resize.jqGrid');
				
							//分页工具栏设置
							$(grid_selector).jqGrid('navGrid',pager_selector,
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
								}
							);
						},
						//删除等级技能
						delLevelSki:function(){
							//删除技能标签
							$(".operal-del-skill").off("click.profession").on("click.profession",function(e){
								var skilltarget=$(e.target).closest(".level-skill").find("span.label-success");
								var skillname=skilltarget.text();
								var skillId=skilltarget.attr("data-skiid");
								var lvId=skilltarget.closest(".panel-list").attr("data-lvid");
								bootbox.confirm({
									message:'<p>您确定要将知识点"'+skillname+'"从该阶段删除?</p><p style="color:red">删除知识点将会同时清除该知识点关联的课程和题目</p>', 
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
											$.ajax({
												type : 'GET',
												cache : false,
												url : '/profession/delLvSkill',
												datatype:"json",
												data :{
													lvId:lvId,
													skiId:skillId
												},
												error : function(request) {
													yl_tips.error("服务器响应错误，操作失败！");
													return false;
												},
												success : function(data) {
													if(data){
														yl_tips.success("删除成功!");
														$(e.target).closest(".level-skill").remove();
														$("#crs-grid-table-"+lvId).jqGrid('setGridParam',{page:1}).trigger('reloadGrid');
													}else{
														yl_tips.success("删除失败!");
													}
												}
											});
										}
									}
								});
							});
						},
						//获取技能列表
						getSkiList:function(lvId){
							$.ajax({
								type : 'GET',
								cache : false,
								url : '/profession/getSkillsListByLvId',
								datatype:"json",
								data :{
									lvId:lvId
								},
								error : function(request) {
									yl_tips.error("服务器响应错误，操作失败！");
									return false;
								},
								success : function(data) {
									if(args.kno_id!="-1"){
										skistr="";
										var skitab="";
										for(var i in data){
											skitab+='<span class="label label-success arrowed-in-right arrowed">'+data[i].ski_name+'</span>';
											////console.log(data[i].id);
											skistr+='<option value="'+data[i].id+'">'+data[i].ski_name+'</option>';
										}
										$("#kno-ski-list").empty().html(skitab);
										//加载课程列表
									}else{
										args.success(data);
									}
								}
							});
						},
						//删除专业等级
						delLevel:function(){
							$(".operal-del-profession-level").off("click.profession").on("click.profession",function(e){
								$(e.target).closest(".panel-list").remove();
							});
						},
						//阶段保存
						saveLevel:function(){
							//阶段保存
							$(".operal-save-profession-level").off("click.profession").on("click.profession",function(e){
								var scrop=$(e.target).closest(".panel-list");
								var level_name=scrop.find(".profession-level-name");
								var level_description=scrop.find(".profession-level-description");
								var level_id=scrop.attr("data-lvid");
								
								var kno_id=$("#kno-select").val();
								
								yl_tips.success(level_id+"保存阶段基本信息成功信息");
							});
						},
						//添加技能弹窗回调
						addSkillModelCanback:function(){
							//添加技能弹窗
							$('#add-skill-modal-form').on('shown.bs.modal', function (e) {
								var scrop=$(e.relatedTarget).closest(".panel-list");
								$("#add-profession-level-skill-save").data("data-lvdiv-scrop",scrop);
								$("#add-profession-level-skill-name").val("");
								var skill_selector="#skill-grid-table";
								$(skill_selector).jqGrid(
										{ //jqGrid固定的写法:jQuery("#list").jqGrid({参数})
											datatype : "json", //将这里改为使用JSON数据   
											url : "/profession/getSkillList", //这是Action的请求地址   
											mtype : "GET", //提交类型
											height : 200,//表格高度   
											data:{q:""},
											//width : 1100, //表格宽度
											autowidth: true,
											//表格结构定义
											altRows: true,
											colNames:["","知识点名称"],
											colModel:[							          	
											          	{name:"id",index:"id",width:0,hidden:true,key:true},
														{name:'name',index:'name',width:136}
													],
													onSelectRow:function(id){
														    var rowData = $(skill_selector).jqGrid('getRowData',id);
														    $("#add-profession-level-skill-name").val(rowData.name);
														    $("#add-profession-level-skill-name").data("skill-id",rowData.id);
													}, 
											jsonReader:{
												root:"records",
												repeatitems:false
											},
											rowNum:100
									    });
									 setTimeout(function(){
											$("#add-profession-level-skill-name").off("input propertychange").on('input propertychange', function() {
												$(skill_selector).jqGrid('setGridParam',{postData:{q:$("#add-profession-level-skill-name").val().trim()}}).trigger('reloadGrid');
											});
									 },0);
									 $(skill_selector).jqGrid('setGridParam',{postData:{q:$("#add-profession-level-skill-name").val().trim()}}).trigger('reloadGrid');
							});
						},
						//添加技能保存
						saveAddSkill:function(){
							 //点击保存技能
							 $("#add-profession-level-skill-save").off("click.profession").on("click.profession",function(e){
								 var scrop=$("#add-profession-level-skill-save").data("data-lvdiv-scrop");
								 var skill_name=$("#add-profession-level-skill-name").val();
								 var level_id=scrop.attr("data-lvid");
								 var skill_id=$("#add-profession-level-skill-name").data("skill-id");
								 
								 if(yl_tools.isEmpty(skill_name)){
									 yl_tips.error("技能名称不能为空!");
								 }
								 $.ajax({
										type : 'POST',
										cache : false,
										url : '/profession/addSkill',
										datatype:"script",
										data :{
											lvId:level_id,
											skillName:skill_name
										},
										error : function(request) {
											yl_tips.error("服务器响应错误，操作失败！");
											return false;
										},
										success : function(data) {
											if(data.status==1){
												if(data.skilId){
													skill_id=data.skilId;
												}
												yl_tips.success(data.info);
												var  skitab = '<div class="level-skill" style="float: left;padding-right: 25px;"><span class="label label-success arrowed-in-right arrowed" data-skiId="'+skill_id+'">'+skill_name+'</span><a style="cursor: pointer;"><span class="badge" ><i class="icon-only ace-icon fa fa-times red2 operal-del-skill"></i></span></a></div>';
												scrop.find(".profession-skills-list").append(skitab);
												$("#add-profession-level-skill-cancel").trigger("click");
												//等级技能删除
												profession.delLevelSki();
												$("#crs-grid-table-"+level_id).jqGrid('setGridParam',{page:1}).trigger('reloadGrid');
											}else{
												yl_tips.error(data.info);
											}
										}
								 });
						})
					},
					//等级状态修改
					levelStatusChange:function(){
						$(".level-status").off("click.profession").on("click.profession",function(e){
								var lvId=$(e.target).closest(".panel-list").attr("data-lvid");
								var status=1;
								if(!$(e.target)[0].checked){
									status=0
								}
								 $.ajax({
										type : 'get',
										cache : false,
										url : '/profession/changeLvStatus',
										datatype:"script",
										data :{
											lvId:lvId,
											status:status
										},
										error : function(request) {
											yl_tips.error("服务器响应错误，操作失败！");
											return false;
										},
										success : function(data) {
											if(data){
												yl_tips.success("修改成功！");
											}else{
												yl_tips.error("修改失败！");
											}
										}
								 });
						})
					},
					//添加阶段课程弹窗
					addLevelCrsModelCalback:function(){
						$('#add-crs-modal-form').on('shown.bs.modal', function (e) {
							var scrop=$(e.relatedTarget).closest(".panel-body");
							var skill_scrop=scrop.find(".profession-skills-list");
							$("#level-crs-skill").remove();
							var str='<select multiple="" class="chosen-select tag-input-style " id="level-crs-skill" data-placeholder=" "></select>';
							$("#level-crs-skill-scrop").empty().html(str);
							$("#add-profession-level-crs-save").attr("data-lvId",$(e.relatedTarget).closest(".panel-list").attr("data-lvid"))
							skill_scrop.find(".level-skill span.label ").each(function(i,e){
								var skiId=$(e).attr("data-skiid");
								var skiName=$(e).text();
								var option="<option value="+skiId+">"+skiName+"</option>";
								$("#level-crs-skill").append(option);
							});
							$('.chosen-select').chosen({allow_single_deselect:true}); 
							$(window).off('resize.chosen').on('resize.chosen', function() {
								$('.chosen-select').each(function() {
									 var $this = $(this);
									 $this.next().css({'width': $this.parent().width()});
								})
							}).trigger('resize.chosen');
						});
					},
					saveLvCrs:function(){
						$("#add-profession-level-crs-save").off("click.profession").on("click.profession",function(e){
								var skillId=$("#level-crs-skill").val();
								var crsId=$("#add-profession-level-crs-name").attr("data-value");
								var lvId=$(e.target).attr("data-lvId");
							if(yl_tools.isEmpty(crsId)){
								yl_tips.error("请选择一门课程!");
								return false;
							}
							if(yl_tools.isEmpty(skillId)){
								yl_tips.error("请为该课程至少选择一项关联技能!");
								return false;
							}
							yl_ajaxAction.ajax_add({
								 		addActionUrl:'/profession/addSkillCrs',
								 			addActionParams:{
								 				crsId:crsId,
												skiIds:skillId.join(","),
												lvId:lvId
								  			},
								  			addReponseFun:function(data){
								  				if(data){
													$("#add-profession-crs-skill-cancel").trigger("click");
													$("#crs-grid-table-"+lvId).jqGrid('setGridParam',{page:1}).trigger('reloadGrid');
													yl_tips.success("添加成功！");
												}else{
													yl_tips.error("添加失败！");
												}
								  			}
							});
						});
					},
					//删除阶段课程
					delLvCrs:function(){
						$(".jqGrid_delbtnstr").off("click.profession").on("click.profession",function(e){
							var grid_table_seletor=$(e.target).closest(".crs-grid-table-space>div")[0].id.split("gbox_")[1];
							var div=$(e.target).closest(".del-crs-btn");
							var crsId=div.attr("data-crsId");
							var lvId=div.attr("data-lvId");
							var rowDatas=$("#"+grid_table_seletor).jqGrid('getRowData',crsId);
							bootbox.confirm({
								message:'<p>您确定要将课程"'+rowDatas.crsName+'"从该阶段删除?</p>', 
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
													$.ajax({
														type : 'get',
														cache : false,
														url : '/profession/delLevelCrs',
														datatype:"script",
														data :{
															crsId:crsId,
															lvId:lvId
														},
														error : function(request) {
															yl_tips.error("服务器响应错误，操作失败！");
															return false;
														},
														success : function(data) {
															if(data){
																yl_tips.success("删除阶段课程成功！");
																$("#"+grid_table_seletor).jqGrid('setGridParam',{page:1}).trigger('reloadGrid');
															}else{
																yl_tips.error("删除失败！");
															}
														}
													});
										}
								}
						});
					});
				},
				//获取阶段习题列表
				getTestList:function(args){
					$(".test-grid-table-space").remove();
					var lvId=args.lvId;
					var test_scorp=args.test_scorp;
					test_scorp.empty().html(juicer(profession_tpl.testList,{"lvId":lvId}));
					var grid_selector="#test-grid-table-"+lvId;
					//jqgrid宽度自适应//jqgrid宽度自适应
					//jqgrid相关配置
					jQuery(grid_selector).jqGrid({
						ajaxGridOptions : {
							timeout : 500000  //设置ajax加载超时时间
						},
						url : "/profession/getLvTestList", //这是Action的请求地址   
						postData:{//条件查询后台传值
							lvId:lvId,
							q:""
						},
						datatype : "json", //将这里改为使用JSON数据   
						mtype : "POST", //提交类型
						height: 200,
						autowidth:true,
						emptyrecords:"无匹配结果",//对查询条数为0时显示的 
						//caption:"专业阶段课程",//表格标题
						//重置默认json解析参数
						jsonReader:{ 
							root:"records", // json中代表实际模型数据的入口  
							page:"currentpage", // json中代表当前页码的数据  
							total:"totalpage", // json中代表页码总数的数据  
							records:"totalrecord",  // json中代表数据行总数的数据  
							repeatitems:false    // 如果设为false，则jqGrid在解析json时，会根据name来搜索对应的数据元素（即可以json中元素可以不按顺序）；而所使用的name是来自于colModel中的name设定。  
						},
						colNames:['id',' 知识点','习题数目'],
						colModel:[
						     //技能点ID
							{name:'id',index:'id', width:0, sorttype:"int", 
								hidden:true,search:false,sortable:false,editable:false,key:true
							},
							//技能点
							{name:'name',index:'name', width:100},
							//习题数量
							{name:'testNum',index:'testNum',width:90}
						], 
						viewrecords : true, //是否显示行数
						rownumbers:true,//添加左侧行号
						rowNum:10, //每页显示记录数  
						altRows: true,
						//jqgrid加载完成后执行
						loadComplete : function() {
							var table = this;
							setTimeout(function(){
								$('.navtable .ui-pg-button').tooltip({container:'body'});
								$(table).find('.ui-pg-div').tooltip({container:'body'});
								//删除阶段课程
								profession.delLvCrs();
							}, 0);
						}
					});
					//trigger window resize to make the grid get the correct size
					$(window).triggerHandler('resize.jqGrid');
				},
				//添加新的专业
			};
			profession.init();
		})(jQuery);
	 });
