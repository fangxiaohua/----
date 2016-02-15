//@author:fangxiaohua
//@邮箱：abc2710712@qq.com
//@qq:1295168875
// 2014年10月27日 下午2:03:16 
//加载jqgrid相关依赖js包
	ace.load_ajax_scripts([
	               		  "/js/jquery.nestable.min.js"
	  ], function() {
		
		var yl_setting_tpl={
				img_tpl:[
				     '<div class="dd" style="max-width: 1300px;">',
						'<ol class="dd-list" id="dd-banner-list" >',
				        '{@each_ as item,key}',
						'<li class="dd-item item-orange " data-id="${item.id}">',
						'	<div class="dd-handle"> ',
						'			<i class="normal-icon ace-icon fa ${item.logo}  bigger-130" data-logo=${item.logo}></i>',
						'			<small style="padding-left: 50px;">${item.name}</small><small style="padding-left: 50px;">${item.description}</small> <small style="padding-left:50px;">${item.url}</small>',
						'			<div class="pull-right action-buttons">',
						'					<a class="blue"  href="#edit-banner-modal-form" role="button" data-toggle="modal">',
						'						<i class="ace-icon fa fa-pencil bigger-130"></i>',
						'					</a>',
						'',
						'					<a class="red" href="javascript:void(0);" >',
						'						<i class="ace-icon fa {@if item.status==1} fa-lightbulb-o {@/if}{@if item.status==0}  fa-ban {@/if} bigger-130 del-banner-model" data-flag="${item.status}"></i>',
						'					</a>',
						'			</div>',
						'	 </div>',
						'</li>',
						'{@/each}',
						'</ol>',
					  '</div>'
				      ].join("")
				   
		}
		
		
		
		
		var  yl_setting={
				//页面初始化
				init:function(){
					//获取网站原有配置信息
					this.getWebsiteInfo();
					//获取banner信息
					this.getWebBanner();
					//	点击事件初始化
					this.save();
					//选项卡初始化
					this.tabtable();
					//初始化点击事件
					this.initClickEvent();
					//banner修改弹窗回调
					this.bannerEditModelShowBefore();
					$('#logo-color').ace_colorpicker();
				},
				//初始化图片拖拽
				initDrapImg:function(){
					//图片可拖拽
					$('.dd').nestable({"maxDepth":1});
					$('.dd-handle a').on('mousedown', function(e){
						e.stopPropagation();
					});
					// $('[data-rel="tooltip"]').tooltip();
					//排序
					this.sort_banner();
				},
				sort_banner:function(){
					 $('.dd').nestable().on('change', function(){ 
				           var r = $('.dd').nestable('serialize'); 
				            yl_ajaxAction.ajax_update({
			  			 			updateActionUrl:'/wbsetting/msort',
			  			  			updateActionParams:{
			  			  				data:JSON.stringify(r)
			  			  			},
			  			 			updateReponseFun:function(data){
			  			 				if(data){
											yl_tips.success("排序成功！");
											//yl_setting.getWebBanner();
										}else{
											yl_tips.error("排序失败！");
										}
			  			 			}
				  			  });
				      });
				},
				//初始化点击事件
				initClickEvent:function(){
					//基本信息重置
					$("#edit-reset-btn").off("click.yl_setting").on("click.yl_setting",function(){
						bootbox.confirm({
							message:"重置将会清除您未保存的修改,你确定要重置吗?", 
							buttons: {
								  confirm: {
									 label: "重置",
								  },
								  cancel: {
									 label: "取消",
									 className: "btn-sm",
								  }
							},	
							callback:function(result) {
								if(result){
									yl_tips.success("重置成功!");
									yl_setting.getWebsiteInfo();
								}
							}
						});
					});
					
					//banner修改保存
					$("#edit-banner-save").off("click.yl_setting").on("click.yl_setting",function(e){
						 var name=$("#edit-url-name").val();
						 var logo=$("#edit-url-logo").val();
						 var desc=$("#edit-url-desc").val()
						  var url=$("#edit-url-url").val()
						 var id=$("#edit-banner-save").attr("data-id");
						 yl_tips.waiting("信息更新中，请稍后... ...");
						 yl_ajaxAction.ajax_update({
			  			 			updateActionUrl:'/wbsetting/medit',
			  			  			updateActionParams:{
			  			  			name:name,
				  			  		logo:logo,
				  			  		description:desc,
				  			  		url:url,
				  			  		id:id
		  			  			},
		  			 			updateReponseFun:function(data){
		  			 				if(data){
										yl_tips.success("更新成功！");
										var item=$('.dd-item[data-id="'+id+'"]');
										item.find("i:first").attr("class","normal-icon ace-icon fa "+logo+"  bigger-130").attr("data-logo",logo);
										item.find("small:first").text(name);
										item.find("small:eq(1)").text(desc);
										item.find("small:eq(2)").text(url);
										$("#edit-banner-cancel").trigger("click");
									}else{
										yl_tips.error("更新失败！");
									}
		  			 			}
			  			  });
					});
				},
				//banner修改框弹出前
				bannerEditModelShowBefore:function(){
					$('#edit-banner-modal-form').on('show.bs.modal', function (e) {
						var table=$(e.relatedTarget).closest(".dd-handle");
						var logo=table.find("i").attr("data-logo");
						var name=table.find("small:first").text();
						var desc=table.find("small:eq(1)").text();
						var url=table.find("small:eq(2)").text();
						$("#edit-url-name").val(name);
						$("#edit-url-logo").val(logo);
						$("#edit-url-desc").val(desc);
						$("#edit-url-url").val(url);
						var id=$(e.relatedTarget).closest(".dd-item").attr("data-id");
						$("#edit-banner-save").attr("data-id",id);	
					});
				},
				//选项卡初始化
				tabtable:function(){
					$('#yl-setting-tab a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
						var divId=$(e.target).attr("href");
						switch(divId){
								case "#yl-setting-tab":{break;}
								case "#yl-setting-banner":{break;}
						};
						
						
					});
					//数据列表
					$("#yl-setting-first").trigger("click");
				},
				//获取网站基本信息
				getWebBanner:function(){
					$(".dd").remove();
					 $.ajax({
							type : 'POST',
							cache : false,
							url : '/wbsetting/mlist',
							datatype:"json",
							error : function(request) {
								yl_tips.error("服务器响应错误，操作失败！");
								return false;
							},
							success : function(data) {
									$("#yl-setting-banner").html(juicer(yl_setting_tpl.img_tpl,data));
									//初始化图片拖拽
									yl_setting.initDrapImg();
									//删除操作初始化
									yl_setting.initdelBanner();
							}
						});
				},
				initdelBanner:function(){
					//初始化删除
						$(".del-banner-model").off("click.ylsetting").on("click.ylsetting",function(e){
							var target=$(e.target).closest(".dd-item");
							var flag=$(e.target).attr("data-flag");
							var info="禁用";
							var logo="fa-ban";
							var status="0";
							if(flag=="0"){
								info="启用";
								logo="fa-lightbulb-o";
								status="1";
							}
							 yl_ajaxAction.ajax_update({
			  			 			updateActionUrl:"/wbsetting/mstatus",
			  			  			updateActionParams:{
			  			  			id:target.data("id"),
									status:status
		  			  			},
		  			 			updateReponseFun:function(data){
									if(data){
										yl_tips.success(info+"成功！");
										$(e.target).removeClass("fa-ban").removeClass("fa-lightbulb-o").addClass(logo).attr("data-flag",status);
									}else{
										yl_tips.error(info+"失败！");
									}
		  			 			}
							 });
						});
				},
				//获取网站基本信息
				getWebsiteInfo:function(){
					 $.ajax({
							type : 'POST',
							cache : false,
							url : '/wbsetting/view',
							datatype:"json",
							data :{
								id:1 
							},
							error : function(request) {
								yl_tips.error("服务器响应错误，操作失败！");
								return false;
							},
							success : function(data) {
								yl_setting.initWebSit(data);
							}
						});
				},
				//原有数据初始化
				initWebSit:function(data){
					$("#edit-save-btn").attr("data-id",data.id);
					$("#edit-name").val(data.name);
					$('#logo-color').ace_colorpicker('pick',data.logo);
					$("#edit-title").val(data.title);
					$("#edit-desc").val(data.desc);
					$("#edit-keyword").val(data.keyword);
					$("#edit-comname").val(data.company_name);
					$("#edit-comaddr").val(data.company_address);
					$("#edit-comtel").val(data.company_tel);
					$("#edit-icp").val(data.icp);
					$("#edit-count-code").val(data.count_code);
					$("#edit-comwebsite").val(data.domain);
				},
				save:function(){
					//保存
					 $("#edit-save-btn").off("click.yl_setting").on("click.yl_setting",function(){
						 $.ajax({
								type : 'POST',
								cache : false,
								url : '/wbsetting/edit',
								datatype:"script",
								data :{
									id:$("#edit-save-btn").attr("data-id"),
									name:$("#edit-name").val(),
									logo:$("#logo-color").val(),
									desc:$("#edit-desc").val(),
									keyword:$("#edit-keyword").val(),
									companyName:$("#edit-comname").val(),
									companyAddress:$("#edit-comaddr").val(),
									companyTel:$("#edit-comtel").val(),
									icp:$("#edit-icp").val(),
									countCode:$("#edit-count-code").val(),
									domain:$("#edit-comwebsite").val()
								},
								error : function(request) {
									yl_tips.error("服务器响应错误，操作失败！");
									return false;
								},
								success : function(data) {
									if(data=="true"){
										//重加载
										yl_setting.getWebsiteInfo();
										yl_tips.success("保存成功！");
									}else{
										yl_tips.error("保存失败！");
									}
								}
							});
					 });
				}
		}
		
		
		yl_setting.init();
});
