//@author:fangxiaohua
//@邮箱：abc2710712@qq.com
//@qq:1295168875
// 2014年10月27日 下午2:03:16 
//加载jqgrid相关依赖js包
ace.load_ajax_scripts([
		"/assets/js/ajaxfileupload.js",//ajax上传
		"/assets/js/jquery-ui.min.js",
		"/assets/js/jquery.ui.touch-punch.min.js"
	], function() {
			jQuery(function($) {
				var skistr="";
				
				 initpage();
				//进入页面时初始化页面
				function initpage(){
					getKnoList({
						success:function(data){
							var kno_id=$("#kno-select").val();
							$("#kno-id").val(kno_id);
							//加载 技能列表
							getSkiList({"kno_id":kno_id});
							//加载 kno基本信息
							getKnoBaseInfo(kno_id);
							
						}
					});
				}
				
				
				
				//加载专业列表
				function getKnoList(args){
					//加载kno
					$.ajax({
						type : 'GET',
						cache : true,
						url : '/zygl/getKnoList',
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
				}
				
				$("#kno-select").off("change").on("change",function(){
					$("#kno-id").val($("#kno-select").val());
					//加载 技能列表
					getSkiList({kno_id:$("#kno-id").val()});
					//加载 kno基本信息
					getKnoBaseInfo($("#kno-id").val());
				});
				//加载技能列表
				function getSkiList(args){
					$.ajax({
						type : 'GET',
						cache : false,
						url : '/zygl/getKnoSkiList',
						datatype:"json",
						data :{
							id:args.kno_id
						},
						error : function(request) {
							alert("服务器响应错误，操作失败！");
							return false;
						},
						success : function(data) {
							if(args.kno_id!="-1"){
								skistr="";
								var skitab="";
								for(var i in data){
									skitab+='<span class="label label-info arrowed-in-right arrowed">'+data[i].ski_name+'</span>';
									////console.log(data[i].id);
									skistr+='<option value="'+data[i].id+'">'+data[i].ski_name+'</option>';
								}
								$("#kno-ski-list").empty().html(skitab);
								//加载课程列表
								initcrs();
							}else{
								args.success(data);
								
							}
						}
					});
				}
				//获取基本信息
				function getKnoBaseInfo(kno_id){
					$.ajax({
						type : 'GET',
						cache : false,
						url : '/zygl/getKno',
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
					
				}
				//初始化kno基本信息	
				function initKnoBaseInfo(data){
					//$("#kno-no").val(data.kno_no);
					$("#kno-name").val(data.kno_name);
					$("#kno-english-name").val(data.english_name);
					$("#kno-logo-show").attr("src",data.logo_url);
					$("#kno-logo-path").val(data.logo_url);
					if(data.status==1){
						$("#kno-status")[0].checked=true;
					}else{
						$("#kno-status")[0].checked=false;
					}
				}
				
				//基础信息保存
				$("#kno-base-save").off("click").on("click",function(){
					//$("#kno-no").val(data.kno_no);
					$.ajax({
						type : 'POST',
						cache : false,
						url : '/zygl/updateKno',
						datatype:"script",
						data :{
							id:$("#kno-id").val(),
							knoName:$("#kno-name").val(),
							englishName:$("#kno-english-name").val(),
							logoUrl:$("#kno-logo-path").val(),
							status:$("#kno-status")[0].checked==true?1:0
						},
						error : function(request) {
							alert("服务器响应错误，操作失败！");
							return false;
						},
						success : function(data) {
							//初始化kno基本信息
							if(data==true){
								//重新加载专业下拉框
								getKnoList({
									success:function(){
										$("#kno-select").val($("#kno-id").val());
									}
								});
								getKnoBaseInfo($("#kno-id").val());
								bootbox.dialog({
									message: "<span class='bigger-110'>修改专业基本信息成功！</span>",
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
				});
				//基础信息重置
				$("#kno-base-reset").off("click").on("click",function(){
					bootbox.confirm({
						message:"重置将会清除您未保存的修改,你确定要重置吗?", 
						buttons: {
							  confirm: {
								 label: "重置",
								 className: "btn-primary btn-sm",
							  },
							  cancel: {
								 label: "取消",
								 className: "btn-sm",
							  }
						},	
						callback:function(result) {
							getKnoBaseInfo($("#kno-id").val());
						}
					});
				});
				
				 
				 //文件上传
					yl_tools.fileupload({
						btn:"#edit-upload-btn",
						file:"kno-logo",
						preview:"kno-logo-show",
						url:"/comm/fileUpload",
						data:{
							fileType:"img",
							type:"sch",
							id:"YL",
						},
						success:function(data){
							$("#kno-logo-path").val(data);
						}
					});
				 //////////////////////////////////课程专业///////////////////////////////////
				 //第一次加载初始化课程
				 function initcrs(){
					//初始化基础课程
						getCrs({
							 knoId:$("#kno-id").val(),
							 flag:"1",
							 success:function(data){
								 console.log(data);
								 initbaseCrsVal({
									 data:data,
									 flag:"base",
								 });
								 console.log(data);
							 }
						});
						//初始化进阶课程
						getCrs({
							 knoId:$("#kno-id").val(),
							 flag:"2",
							 success:function(data){
								 console.log(data);
								 initbaseCrsVal({
									 data:data,
									 flag:"jinjie",
								 });
							 }
						});
						//初始化高级课程
						getCrs({
							 knoId:$("#kno-id").val(),
							 flag:"3",
							 success:function(data){
								 console.log(data);
								 initbaseCrsVal({
									 data:data,
									 flag:"advan",
								 });
							 }
						});
				 }
				 
				 
				 
				 
				 
				 
				 
				 //获取入门课程列表
				 function getCrs(args){
					 var flag=args.flag;
					 $.ajax({
							type : 'GET',
							cache : false,
							url : '/zygl/getKnoCrs',
							datatype:"script",
							data :{
								id:args.knoId,
								flag:flag
							},
							error : function(request) {
								alert("服务器响应错误，操作失败！");
								return false;
							},
							success : function(data) {
								args.success(data);
							}
					 });
				 }
				 
				 //初始化基础课程
				 function initbaseCrsVal(args){
					 var flag=args.flag;
					 var contain=null;
					 if(flag=="base"){
						 contain=$("#base-crs-body");
					 }
					 else if(flag=="jinjie"){
						 contain=$("#jinjie-crs-body");
					 }
					 else if(flag=="advan"){
						 contain=$("#advan-crs-body");
					 }
					 
					 contain.empty();
					 for(var i in args.data){
						 var template=$("#crs-list-tpl").clone(true);
						 //元素初始化
						 template.addClass("crs-list");
						 template.removeAttr("style");
						 template.removeAttr("id");
						 $(template).find(".crs-ski").html(skistr);
						 
						 $(template).find(".crs-name").val(args.data[i].crs_name);
						 $(template).find(".crs-name").attr("data-value",args.data[i].crs_id);
						 $(template).find(".crs-ski").val(args.data[i].ski_id);
						 contain.append(template);	 
					 }
				 }
				 
				 //课程重置课程
				 $(".kno-crs-reset-btn").off("click").on("click",function(){
							 var flag=$(this).attr("data-flag");
							bootbox.confirm({
								message:"重置将会清除您未保存的修改,你确定要重置吗?", 
								buttons: {
									  confirm: {
										 label: "重置",
										 className: "btn-primary btn-sm",
									  },
									  cancel: {
										 label: "取消",
										 className: "btn-sm",
									  }
								},	
								callback:function(result) {
								if(result) {
									 if(flag=="base"){
										 getCrs({
											 knoId:$("#kno-id").val(),
											 flag:"1",
											 success:function(data){
												 console.log(data);
												 initbaseCrsVal({
													 data:data,
													 flag:flag,
												 });
												 console.log(data);
											 }
										});
									 }
									 else if(flag=="jinjie"){
										getCrs({
											 knoId:$("#kno-id").val(),
											 flag:"2",
											 success:function(data){
												 console.log(data);
												 initbaseCrsVal({
													 data:data,
													 flag:flag,
												 });
											 }
										});
									 }
									 else if(flag="advan"){
										 getCrs({
											 knoId:$("#kno-id").val(),
											 flag:"3",
											 success:function(data){
												 console.log(data);
												 initbaseCrsVal({
													 data:data,
													 flag:flag,
												 });
											 }
										});
									 }
								}
						}
					});
				 });
				 //课程添加课程
				 $(".kno-crs-add-btn").off("click").on("click",function(){
					 var flag=$(this).attr("data-flag");
					 var template=$("#crs-list-tpl").clone(true);
					 //元素初始化
					 template.addClass("crs-list");
					 template.removeAttr("style");
					 template.removeAttr("id");
					 $(template).find(".crs-ski").html(skistr);
					 
					 //追加html
		 			 if(flag=="base"){
		 				 var contain=$("#base-crs-body");
		 				if(contain.find(".crs-list:last")[0]){
		 					contain.find(".crs-list:last").after(template);
		 				 }else{
		 					contain.empty().html(template);
		 				 }	
					 }
					 else if(flag=="jinjie"){
						 var contain=$("#jinjie-crs-body");
						 if(contain.find(".crs-list:last")[0]){
							 contain.find(".crs-list:last").after(template);
		 				 }else{
		 					 contain.empty().html(template);
		 				 }	
					 }
					 else if(flag="advan"){
						 var contain=$("#advan-crs-body");
						 if(contain.find(".crs-list:last")[0]){
							 contain.find(".crs-list:last").after(template);
		 				 }else{
		 					 contain.empty().html(template);
		 				 }	
					 }
				 });
				 
				 //课程保存课程
				 $(".kno-crs-save-btn").off("click").on("click",function(){
					 var flag=$(this).attr("data-flag");
					 var contain=null;
					 var level=0;
					 var info="";
					 if(flag=="base"){
						 contain=$("#base-crs-body");
						 level=1;
						 info="入门课程";
					 }
					 else if(flag=="jinjie"){
						 contain=$("#jinjie-crs-body");
						 level=2;
						 info="进阶课程";
					 }
					 else if(flag="advan"){
						 contain=$("#advan-crs-body"); 
						 level=3;
						 info="高级课程";
					 }
					 var crsIds="";
					 var skiIds="";
					 var crs_skis=contain.find(".crs-ski");
					 var crs_ids=contain.find(".crs-name");
					 crs_ids.each(function(i,e){
						 var crs_id=$(this).attr("data-value");
						 var ski_id=$(crs_skis[0]).val();
						 if(yl_tools.isNotEmpty(crs_id)){
							 if(i==crs_ids.length-1){
								 crsIds+=crs_id;
								 skiIds+=ski_id;
							 }else{
								 crsIds+=crs_id+",";
								 skiIds+=ski_id+",";
							 }
						 }
					 });
					 console.log("crsIds"+crsIds);
					 console.log("skiIds"+skiIds);
					 console.log("level"+level);
					 //保存
					 if(yl_tools.isEmpty(crsIds)){
						 bootbox.dialog({
								message: "<span class='bigger-110'>请至少添加一门"+info+"！</span>",
						 });
						 return false;
					 };
					 if(yl_tools.isEmpty(skiIds)){
						 bootbox.dialog({
								message: "<span class='bigger-110'>请先为课程选择所属技能！</span>",
						 });
						 return false;
					 }
					 savecrs({
						 knoId:$("#kno-id").val(),
						 level:level,
						 crsIds:crsIds,
					     skiIds:skiIds,
					     success:function(data){
					    	 if(data==true){
					    		 //重新加载
					    		 getCrs({
									 knoId:$("#kno-id").val(),
									 flag:level,
									 success:function(data){
										 console.log(data);
										 initbaseCrsVal({
											 data:data,
											 flag:flag,
										 });
										 console.log(data);
									 }
								});
					    		 bootbox.dialog({
										message: "<span class='bigger-110'>修改"+info+"成功！</span>",
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
				 });
				 
				 //课程修改保存
				 function savecrs(args){
					 $.ajax({
							type : 'POST',
							cache : false,
							url : '/zygl/addKnoSkiCourse',
							datatype:"script",
							data :{
								knoId:args.knoId,
								level:args.level,
								crsIds:args.crsIds,
								skiIds:args.skiIds
							},
							error : function(request) {
								alert("服务器响应错误，操作失败！");
								return false;
							},
							success : function(data) {
								args.success(data);
							}
					 });
				 }
				 
				 //删除课程
				 $(".kno-crs-del-btn").off("click").on("click",function(){
					 $(this).closest(".crs-list").remove();
				 });
				 
				 //课程表单绑定点击事件
				/* $(".crs-name").off("click").on('click', function(e){
					$("#crs-search-model").trigger("click");
					$("#crs-search-save-btn").off("click").on("click",function(){
						console.log("fsd");
						$(e.target).val($("#add_crsName_hide").val());
						$(e.target).attr("data-value",$("#add_crsId_hide").val());
						$("#crs-search-cancel-btn").trigger("click");
					});
				}); */
				 
				 
				 //点击课程查询课程
				 /* beforeModelshowCallback();
				 function beforeModelshowCallback(){
					$('#crs-search-modal-form').on('shown.bs.modal', function (e) {
						
						console.log(e);
						$("#add_crsId").val("");
						$("#add_crsId_hide").val("");
						//动态查询课程列表
						searchCrs();
						//添加页面按类型下拉框添加change事件
					});
				}	 */
				//动态输入框变绑定
				/* $("#add_crsId").bind('input propertychange', function() {
					searchCrs();
				}); */
				//动态加载课程列表
					/* function  searchCrs(){
							$.ajax({
								type : 'GET',
								cache : false,
								url : '/zygl/getCourseList',
								datatype:"json",
								data :{
									q:$("#add_crsId").val()
								},
								error : function(request) {
									alert("服务器响应错误，操作失败！");
									return false;
								},
								success : function(data) {
									var table="";
									for(var i=0;i<data.length;i++){
										table+="<tr><td style='display:none' data-flag='crs_id'>"+data[i].id+"</td><td data-flag='crs_no'>"+data[i].crs_no+"</td><td  data-flag='crs_name'>"+data[i].name+"</td></tr>";
									}
									$("#crs-search-table-body").empty().html(table);
								}	
							});
					} */
					/* //点击获取选中行的值
					$(document).on('click', '#crs-search-table-body tr' , function(e){
						var  result="";
						$(e.target).parent().children("td").each(function(e){
							var flag=$(this).attr("data-flag");
							if(flag=="crs_id"){
								$("#add_crsId_hide").val($(this).html());
								result+=$(this).html();
							}
							if(flag=="crs_no"){
								result+="..."+$(this).html();
							}
							if(flag=="crs_name"){
								$("#add_crsName_hide").val($(this).html());
								result+="..."+$(this).html();
							}
						});
						$("#add_crsId").val(result);
					});
					 */
					
				 //////////////////////专业添加页//////////////////////////////
				/*  var allskistr="";
				
				 
				 $('#add-modal-form').on('shown.bs.modal', function () {
					 $(".kno-ski-list").remove();
					 getSkiList({
						 kno_id:"-1",
						 success:function(data){
							 allskistr="";
							 for(var i in data){
								 allskistr+='<option value="'+data[i].id+'">'+data[i].ski_name+'</option>';
							  }
							 $("#add-kno-ski-btn").trigger("click");
						 }
					});	
					 
				 }); */
				 //添加新的专业
				/*  $("#add-kno-ski-btn").off("click").on("click",function(){
					 if($(".kno-ski-list").length>9){
						 bootbox.dialog({
								message: "<span class='bigger-110'>一个专业最多添加10个技能</span>",
						 });
						 return false;
					 }
					 console.log("==========");
					 var template= $("#add-ski-tpl").clone(true);
					 //元素初始化
					 template.addClass("add-kno-ski-list");
					 template.removeAttr("style");
					 template.removeAttr("id");
					 $(template).find(".add-ski").html(allskistr);
					 console.log(template);
					 if($(".add-kno-ski-list:last")[0]){
							$(".add-kno-ski-list:last").after(template);
					 }else{
							$("#add-ski-tpl").after(template);
					 }
				 }); */
				 
				 //删除技能
				/*  $(".del-kno-ski-btn").off("click").on("click",function(){
					 $(this).closest(".add-kno-ski-list").remove();
				 }); */
				 //添加保存验证
				 $("#add-save-btn").off("click").on("click",function(){
					 var add_kno_name=$("#add-name").val();
					 var add_kno_status=$("#add-status")[0].checked==true?1:0;
					 var add_english_name=$("#add-english-name").val();
					/*  var add_skis="";
					 var ski_list=$(".add-kno-ski-list");
					 ski_list.each(function(i,e){
						 var ski=$(this).find(".add-ski");
						 if(i<ski_list.length-1){
							 add_skis+=ski.val()+",";
						 }else{
							 add_skis+=ski.val();
						 }
					 }); */
					 if(yl_tools.isEmpty(add_kno_name)){
						 bootbox.dialog({
								message: "<span class='bigger-110'>专业名称不能为空！</span>",
						 });
						 return false;
					 }
					 if(yl_tools.isEmpty(add_english_name)){
						 bootbox.dialog({
								message: "<span class='bigger-110'>专业英文名称不能为空！</span>",
						 });
						 return false;
					 }
					 //验证通过后保存
					 add_kno_save({
						 name:add_kno_name,
					     status:add_kno_status,
					     englishName:add_english_name,
						 success:function(data){
							 if(data==true){
								 initpage();
								 bootbox.dialog({
										message: "<span class='bigger-110'>新添专业成功！</span>",
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
								 $("#add-cancel-btn").trigger("click");
							 }
							 
						 }
					 }); 
					
				 });
				 
				 //添加专业保存验证
				 function add_kno_save(args){
					 $.ajax({
							type : 'POST',
							cache : false,
							url : '/zygl/addKno',
							datatype:"script",
							data :{
								knoName:args.name,
								status:args.status,
								englishName:args.englishName
							},
							error : function(request) {
								alert("服务器响应错误，操作失败！");
								return false;
							},
							success : function(data) {
								args.success(data);
							}
					 });
					 
				 }
				//课程查询
					yl_tools.course_search({
						div:"course-search-1",
						openbtn:".crs-name",
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
				 
			 });
});
