//@author:fangxiaohua
//@邮箱：abc2710712@qq.com
//@qq:1295168875
// 2014年10月27日 下午2:03:16 
//加载jqgrid相关依赖js包
	ace.load_ajax_scripts([
	                       "/assets/js/ajaxfileupload.js",   //ajax上传           
	               		  "/assets/js/jquery.nestable.min.js"
	  ], function() {
		
		var yl_setting_tpl={
				img_tpl:[
				     '<div class="dd" style="max-width: 1300px;">',
						'<ol class="dd-list" id="dd-banner-list" >',
				        '{@each_ as item,key}',
						'<li class="dd-item item-orange " data-id="${item.id}">',
						'	<div class="dd-handle"> ',
						'			<img alt="" src="${item.url}" style="heigth:380px;width:1200px;">',
						'			<div class="pull-right action-buttons">',
						'					<a class="blue"  href="#edit-banner-modal-form" role="button" data-toggle="modal">',
						'						<i class="ace-icon fa fa-pencil bigger-130"></i>',
						'					</a>',
						'',
						'					<a class="red" href="javascript:void(0);" >',
						'						<i class="ace-icon fa fa-trash-o bigger-130 del-banner-model"></i>',
						'					</a>',
						'				</div>',
						'			<div class="row">',		
						'				<div class="profile-user-info profile-user-info-striped" style="width: 1200px; float: left; margin-left: 12px;">',
						'					<div class="profile-info-row">',
						'						<div class="profile-info-name"> 序号</div>',
						'',	
						'						<div class="profile-info-value">',
						'							<span class="img-number" style="display: inline;">${item.sort_index}</span>',
						'						</div>',
						'					</div>',
						'',				
						'					<div class="profile-info-row">',
						'						<div class="profile-info-name"> 焦点说明</div>',
						'',	
						'						<div class="profile-info-value">',
						'							<span class="img-desc" style="display: inline;"> {@if item.focus_desc!=null}${item.focus_desc}{@/if} </span>',
						'						</div>',
						'					</div>',
						'',					
						'					<div class="profile-info-row">',
						'						<div class="profile-info-name"> 外链</div>',
						'',	
						'						<div class="profile-info-value">',
						'							<span  class="link-url" style="display: inline;"> {@if item.url_link!=null}${item.url_link}{@/if}</span>',
						'						</div>',
						'					</div>',
						'				</div>',
						'			</div>',
						'	 </div>',
						'</li>',
						'{@/each}',
						'</ol>',
					  '</div>'
				      ].join("")
				   
		}
		
		
		
		
		var  yl_setting={
				//最大banner图数量
				maxBannerNum:$("#add-new-banner-btn").attr("data-bannerMax-num"),
				//页面初始化
				init:function(){
					//获取网站原有配置信息
					this.getWebsiteInfo();
					//获取banner信息
					this.getWebBanner();
					//	点击事件初始化
					this.save();
					 //文件上传
					this.initupload();
					//选项卡初始化
					this.tabtable();
					//初始化点击事件
					this.initClickEvent();
					//banner修改弹窗回调
					this.bannerEditModelShowBefore();
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
			  			 			updateActionUrl:'/ylsetting/sortBanner',
			  			  			updateActionParams:{
			  			  				data:JSON.stringify(r)
			  			  			},
			  			 			updateReponseFun:function(data){
			  			 				if(data){
											yl_tips.success("排序成功！");
											yl_setting.getWebBanner();
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
								yl_tips.success("重置成功!");
								yl_setting.getWebsiteInfo();
							}
						});
					});
					
					//banner修改保存
					$("#edit-banner-save").off("click.yl_setting").on("click.yl_setting",function(e){
						 var url=$("#edit-banner-path").val();
						 var imgDesc=$("#edit-focus-desc").val().trim();
						 var link=$("#edit-focus-link").val().trim();
						 var id=$("#edit-banner-save").attr("data-id");
						 yl_tips.waiting("信息更新中，请稍后... ...");
						 yl_ajaxAction.ajax_update({
		  			 			updateActionUrl:'/ylsetting/updateBannerInfo',
		  			  			updateActionParams:{
			  			  			url:url,
									imgDesc:imgDesc,
									link:link,
									id:id
		  			  			},
		  			 			updateReponseFun:function(data){
		  			 				if(data){
										yl_tips.success("更新成功！");
										var item=$('.dd-item[data-id="'+id+'"]');
										item.find("img")[0].src=url;
										item.find(".img-desc").html(imgDesc);
										item.find(".link-url").html(link);
										$("#edit-banner-cancel").trigger("click");
									}else{
										yl_tips.error("更新失败！");
									}
		  			 			}
			  			  });
					});
					//添加新的banner
					$("#add-new-banner-btn").off("click.yl_setting").on("click.yl_setting",function(e){
						$.ajax({
								type : 'POST',
								cache : false,
								url : '/ylsetting/addBanner',
								datatype:"script",
								error : function(request) {
									yl_tips.error("服务器响应错误，操作失败！");
									return false;
								},
								success : function(data) {
									if(data){
										yl_tips.success("新添成功！");
										var tpl=$("#dd-banner-list li:last").clone(true);
										var sort_index=tpl.find(".img-number").html();
										tpl.attr("data-id",data);
										tpl.find(".img-number").html(parseInt(sort_index)+1);
										tpl.find("img")[0].src="";
										tpl.find(".img-desc").html("");
										tpl.find(".link-url").html("");
										$("#dd-banner-list").append(tpl);
										yl_setting.judgeBannerAddBtn();
										$("#add-new-banner-btn").focus();
									}else{
										yl_tips.error("新添失败！");
									}
								}
							});
					});
				},
				//banner修改框弹出前
				bannerEditModelShowBefore:function(){
					$('#edit-banner-modal-form').on('show.bs.modal', function (e) {
						var table=$(e.relatedTarget).closest(".dd-handle");
						var info_table=table.find(".profile-user-info");
						var img_desc=info_table.find(".img-desc").html();
						var link_url=info_table.find(".link-url").html();
						var url=table.find("img")[0].src;
						$("#edit-focus-desc").val(img_desc);
						$("#edit-focus-link").val(link_url);
						$("#kno-logo-show").attr("src",url);
						$("#edit-banner-path").val(url);
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
				//初始化文件上传
				initupload:function(){
					//初始化logo文件上传
					yl_ajaxAction.ajax_upload({
						btn_selector:"#edit-upload-btn",
						fileId:"edit-logo",
						preview_selector:"#logo-show",
						uploadStart:function(){
							yl_tips.waiting("图片上传中，请稍后... ...");
						},
						succFun:function(data){
							yl_tips.success("图片上传成功!");
							$("#edit-logo-path").val(data);
						}
					});
					
					//初始化banner文件上传
					yl_ajaxAction.ajax_upload({
						btn_selector:"#edit-banner-upload-btn",
						fileId:"edit-banner-file",
						preview_selector:"#kno-logo-show",
						uploadStart:function(){
							yl_tips.waiting("图片上传中，请稍后... ...");
						},
						succFun:function(data){
							yl_tips.success("图片上传成功!");
							$("#edit-banner-path").val(data);
						}
					});
				},
				//获取网站基本信息
				getWebBanner:function(){
					$(".dd").remove();
					 $.ajax({
							type : 'POST',
							cache : false,
							url : '/ylsetting/getBannerList',
							datatype:"json",
							error : function(request) {
								yl_tips.error("服务器响应错误，操作失败！");
								return false;
							},
							success : function(data) {
									$("#add-new-banner-btn").before(juicer(yl_setting_tpl.img_tpl,data));
									yl_setting.judgeBannerAddBtn();
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
							yl_ajaxAction.ajax_del({
								delConfirmMsgHtml:"<p>您确定删除该banner图吗？</p>",
								delActionUrl:"/ylsetting/delBannerById",
								delActionParams:{
									id:target.data("id")
								},
								delReponseFun:function(data){
									if(data){
										yl_tips.success("删除成功！");
										target.remove();
										yl_setting.judgeBannerAddBtn();
										$(".dd-item").find(".img-number").each(function(i,e){
											$(e).html((i+1));	
										});
									}else{
										yl_tips.error("删除失败！");
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
							url : '/ylsetting/getWebsiteInfo',
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
					$("#edit-logo-path").val(data.logo);
					$("#logo-show").attr("src",data.logo);
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
						 yl_tips.waiting("保存中，请稍后... ...");
						 $.ajax({
								type : 'POST',
								cache : false,
								url : '/ylsetting/websiteSetting',
								datatype:"script",
								data :{
									id:$("#edit-save-btn").attr("data-id"),
									name:$("#edit-name").val(),
									logo:$("#edit-logo-path").val(),
									title:$("#edit-title").val(),
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
									if(data==true){
										//重加载
										yl_setting.getWebsiteInfo();
										yl_tips.success("保存成功！");
									}else{
										yl_tips.error("保存失败！");
									}
								}
							});
					 });
				},
				//判断是否显示banner添加按钮
				judgeBannerAddBtn:function(){
					var length=$(".dd-list li").length;
					if(length>=yl_setting.maxBannerNum){
						$("#add-new-banner-btn").addClass("hide");
					}else{
						$("#add-new-banner-btn").removeClass("hide");
					}
				}
		}
		
		
		yl_setting.init();
});
