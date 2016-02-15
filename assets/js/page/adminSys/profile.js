	//@author:fangxiaohua
	//@邮箱：abc2710712@qq.com
	//@qq:1295168875
	// 2014年10月27日 下午2:03:16 
	//加载jqgrid相关依赖js包	
	ace.load_ajax_scripts([
	        ], function() {
		
			var profile_tip={
					profile:[
'					     	<div class="row">',
'							<div class="col-xs-12 col-sm-3 center">',
'								<a href="javascript:void(0);"><span class="profile-picture">',
'									<img class="editable img-responsive" alt="${account}" id="avatar" src="${avatar}" />',
'								</span></a>',
'							</div><!-- /.col -->',
'',
'							<div class="col-xs-12 col-sm-9">',
'									<h4 class="blue">',
'										<span class="middle">${account}</span>',
'',
'										<span class="label label-purple arrowed-in-right">',
'											<i class="ace-icon fa fa-circle smaller-80 align-middle"></i>',
'											online',
'										</span>',
'									</h4>',
'',
'									<!-- #section:pages/profile.info -->',
'									<div class="profile-user-info ">',
'										<div class="profile-info-row">',
'											<div class="profile-info-name"> 姓名 </div>',
'',
'											<div class="profile-info-value">',
'												<span class="editable" id="name">{@if name!=null}${name}{@/if}</span>',
'											</div>',
'										</div>',
'',											
'										<div class="profile-info-row">',
'											<div class="profile-info-name"> 性别 </div>',
'',
'											<div class="profile-info-value">',
'												<span class="editable" id=sex>{@if sex!=null}{@if sex==1}男{@/if}{@if sex==0}女{@/if}{@/if}</span>',
'											</div>',
'										</div>',
'',
'',
'										<div class="profile-info-row">',
'											<div class="profile-info-name"> 年龄 </div>',
'',
'											<div class="profile-info-value">',
'												<span class="editable" id="age">{@if age!=null}${age }{@/if}</span>',
'											</div>',
'										</div>',
'',
'										<div class="profile-info-row">',
'											<div class="profile-info-name"> 生日 </div>',
'',
'											<div class="profile-info-value">',
'												<span class="editable" id="birthday">{@if birthday!=null}${birthday }{@/if}</span>',
'											</div>',
'										</div>',
'',
'										<div class="profile-info-row">',
'											<div class="profile-info-name"> 手机 </div>',
'',
'											<div class="profile-info-value">',
'												<span class="editable" id="telephone">{@if telephone!=null}${telephone }{@/if}</span>',
'											</div>',
'										</div>',
'',
'										<div class="profile-info-row">',
'											<div class="profile-info-name"> 住址 </div>',
'',
'											<div class="profile-info-value">',
'												<i class="fa fa-map-marker light-orange bigger-110"></i>',
'												<span class="editable" id=location>{@if location!=null}${location}{@/if}</span>',
'											</div>',
'										</div>',
'										<div class="profile-info-row">',
'											<div class="profile-info-name"> 关于我 </div>',
'',
'											<div class="profile-info-value">',
'												<span class="editable" id="about">{@if about!=null}${about}{@/if}</span>',
'											</div>',
'										</div>',
'									</div>',
'									<div class="hr hr-8 dotted"></div>',
'									<!-- /section:pages/profile.info -->',
'							</div><!-- /.col -->',
'						</div><!-- /.row -->'
					         ].join("")
			};
			
			var profile={
					init:function(){
						this.getProfile();
						this.edit_password();
					},
					getProfile:function(){
						$(".profile-user-info").remove();
						$.ajax({
							type : 'GET',
							cache : false,
							url : '/profile/getProfile',
							datatype:"json",
							success : function(data) {
								$("#user-profile").empty().html(juicer(profile_tip.profile,data));
								profile.editables(data);
								profile.avatar();
							}
						});
					},
					editables:function(data){
						//editables on first profile page
						$.fn.editable.defaults.mode = 'inline';
						$.fn.editableform.loading = "<div class='editableform-loading'><i class='ace-icon fa fa-spinner fa-spin fa-2x light-blue'></i></div>";
					    $.fn.editableform.buttons = '<button type="submit" class="btn btn-info editable-submit"><i class="ace-icon fa fa-check"></i></button>'+
					                                '<button type="button" class="btn editable-cancel"><i class="ace-icon fa fa-times"></i></button>';    
						
						//editables 
						
						//text editable
					    $('#name')
					    .editable({
							type: 'text',
							name: 'name',
							pk:data.id,
							emptytext:"请点击输入本人姓名",
							url:"/profile/updateProfile",
							success: function(response, newValue) {
								if(response){
									yl_tips.success("修改成功！");
								}else{
									yl_tips.error("修改失败！");
								}
							}
					    });
					    
					    
					  //select2 editable
						var sexs = [];
					    $.each({ "0": "女", "1": "男"}, function(k, v) {
					    	sexs.push({id: k, text: v});
					    });
					    
					    $('#sex').editable({
							type: 'select2',
							value : data.sex,
							pk:data.id,
							name:"sex",
							emptytext:"请点击选择性别",
							url:"/profile/updateProfile",
					        source: sexs,
							select2: {
								'width': 140
							},		
							success: function(response, newValue) {
								if(response){
									yl_tips.success("修改成功！");
								}else{
									yl_tips.error("修改失败！");
								}
							}
					    });
					    
					    
						
					    $('#age').editable({
					        type: 'spinner',
							name : 'age',
							value:0,
							pk:data.id,
							emptytext:"请点击选择年龄",
							url:"/profile/updateProfile",
							spinner : {
								min : 16,
								max : 99,
								step: 1,
								on_sides: true
							},
							success: function(response, newValue) {
								if(response){
									yl_tips.success("修改成功！");
								}else{
									yl_tips.error("修改失败！");
								}
							}
						});
						
					    
						
						//custom date editable
						$('#birthday').editable({
							type: 'adate',
							pk:data.id,
							name:"birthday",
							emptytext:"请点击选择生日",
							url:"/profile/updateProfile",
							date: {
								 weekStart: 1,
								format: 'yyyy-mm-dd',
								viewformat: 'yyyy-mm-dd'
							},
							success: function(response, newValue) {
								if(response){
									yl_tips.success("修改成功！");
								}else{
									yl_tips.error("修改失败！");
								}
							}
						})
					
						
						//text editable
					    $('#telephone')
						.editable({
							pk:data.id,
							emptytext:"请点击输入电话",
							url:"/profile/updateProfile",
							type: 'text',
							name: 'telephone',
							success: function(response, newValue) {
								if(response){
									yl_tips.success("修改成功！");
								}else{
									yl_tips.error("修改失败！");
								}
							}
					    });
					
					
					  //text editable
					    $('#location')
						.editable({
							type: 'text',
							pk:data.id,
							emptytext:"请点击输入住址",
							url:"/profile/updateProfile",
							name: 'location',
							success: function(response, newValue) {
								if(response){
									yl_tips.success("修改成功！");
								}else{
									yl_tips.error("修改失败！");
								}
							}
					    });
					
					
						$('#about').editable({
							mode: 'inline',
							type: 'text',
							pk:data.id,
							emptytext:"请点击输入资料详情",
							url:"/profile/updateProfile",
					        type: 'wysiwyg',
					        onblur:'ignore',
							name : 'about',
							success: function(response, newValue) {
								if(response){
									yl_tips.success("修改成功！");
								}else{
									yl_tips.error("修改失败！");
								}
							}
						});
						
						$('#about').on('shown', function(e, editable) {
							$(".wysiwyg-toolbar .btn-group:last").remove();
						});
					},
					//头像处理
					avatar:function(){
						yl_avatar.avatar({
							seletor:"#avatar",
							saveBtnClick:function(path){
									console.log(path);
									if(path){
										$.ajax({
											type : 'POST',
											cache : false,
											url : '/profile/updateProfile',
											datatype:"script",
											data :{
												name:"avatar",
												value:path,
												pk:"1"
											},
											error : function(request) {
												yl_tips.error("服务器响应错误，操作失败！");
												return false;
											},
											success : function(data) {
												if(data){
													yl_tips.success("修改成功！");
													$("#avatar").attr("src",path);
													$("#nav-user-photo").attr("src",path);
												}else{
													yl_tips.error("修改失败！");
												}
											}
										});
									}else{
										yl_tips.error("请先选一个头像!");
									}
							}
						});
					},
					//修改密码是否可见
					edit_password:function(){
						$(".is-can-look").off("click.profile").on("click.profile",function(e){
								$(e.target).removeClass("fa-unlock").removeClass("fa-lock");
								var type=$(e.target).prev().attr("type");
								if(type=="password"){
									$(e.target).addClass("fa-unlock");
									$(e.target).prev().attr("type","text");
								}else{
									$(e.target).addClass("fa-lock");
									$(e.target).prev().attr("type","password");
								}
						});
						
						$("#edit-password-save").off("click.profile").on("click.profile",function(e){
							var old_password=$.trim($("#edit-old-password").val());
							var new_password=$.trim($("#edit-new-password").val());
							var confirm_password=$.trim($("#edit-confirm-password").val());
							if(yl_tools.isEmpty(old_password)){
								yl_tips.error("原密码不可为空!");
								return false;
							}else if(yl_tools.isEmpty(new_password)){
								yl_tips.error("新密码不可为空!");
								return false;
							}else if(yl_tools.isEmpty(confirm_password)){
								yl_tips.error("确认密码不可为空!");
								return false;
							}else if(new_password!=confirm_password){
								yl_tips.error("新密码,两次密码不一致!");
								return false;
							}else{
								$.ajax({
									type : 'POST',
									cache : false,
									url : '/profile/updatePassword',
									datatype:"script",
									data :{
										oldPwd:old_password,
										newPwd:new_password
									},
									error : function(request) {
										yl_tips.error("服务器响应错误，操作失败！");
										return false;
									},
									success : function(data) {
										switch(data+""){
											case "0":{yl_tips.error("修改失败！");break;}
											case "1":{yl_tips.success("密码修改成功！");break;}
											case "2":{yl_tips.error("您输入的原密码不正确,请确认后重新输入！");break;} 
										}
									}
								});
							}
						});
					}
			};
			profile.init();
});