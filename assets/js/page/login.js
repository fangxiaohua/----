/**
 * @author:fangxiaohua
*  @邮箱：abc2710712@qq.com
*  @qq:1295168875
*   login
*/
void(function($){
				var login={
					//初始化
					init:function(){
						
						this.login();
						this.swLoginBox();
						this.skins();
						this.pwd_view();
						this.pwd_search();
						this.register();
						this.swAvatar();
					},
					login_info_tpl:'<i class="ace-icon fa fa-coffee green"></i><font color="${color}">${info}</font>',
					login:function(){
						$("#login").off("click.login").on("click.login",function(e){
								e.preventDefault();
								var account=$.trim($("#account").val());
								var password=$.trim($("#password").val());
								if(yl_tools.isEmpty(account)){
									$("#tip").html(juicer(login.login_info_tpl,{info:"登陆账号不可为空!",color:"red"}));
									return  false;
								}
								if(yl_tools.isEmpty(password)){
									$("#tip").html(juicer(login.login_info_tpl,{info:"登陆密码不可为空!",color:"red"}));
									return  false;
								}
								yl_ajaxAction.ajax_select({
						 			selectActionUrl:"/ulogin",
						  			selectActionParams:{
						  				account:account,
						  				password:password
						  			},
						  			selectRequestType:"POST",
						  			selectReponseFun:function(data){
						  					if(data.status==1){
						  						$("#tip").html(juicer(login.login_info_tpl,{info:data.info,color:"greed"}));
						  						window.location.href="/index";
						  					}else if(data.status==2){
						  						$("#tip").html(juicer(login.login_info_tpl,{info:data.info,color:"red"}));
						  					}else if(data.status==3){
						  						$.gritter.add({
						  							title: "该账号已被禁用!",
						  							text: "<span class='bigger-110'>禁用原因:<font color='greed'>"+data.info+"</font></span>",
						  							class_name: 'gritter-error gritter-center '
						  						});
						  					}else{
						  						yl_tips.error(data.info);
						  					}
					 				}
								});
						});
						//回车登陆
						$("#password").bind('keypress',function(event){
					            if(event.keyCode == "13"){
					            	 $("#login").trigger("click");
					            }
					      });
					},
					//密码框可见性
					pwd_view:function(){
						$("#password-view").off('click.login').on('click.login', function(e){
						 	if($("#password-view").hasClass("fa-lock")){
						 		$("#password-view").removeClass("fa-lock").addClass("fa-unlock");
						 		$("#password").attr("type","text");
						 	}else{
						 		$("#password-view").removeClass("fa-unlock").addClass("fa-lock");
						 		$("#password").attr("type","password");
						 	}
							e.preventDefault();
						});
					},
					//密码找回
					pwd_search:function(){
						$("#pwd-search").off('click.login').on('click.login', function(e){
							e.preventDefault();
							var account=$.trim($("#find-pwd-account").val());
							var telephone=$.trim($("#find-pwd-telephone").val());
							if(yl_tools.isEmpty(account)){
								yl_tips.error("请输入要找回密码的账号!");
								return  false;
							}
							if(yl_tools.isEmpty(telephone)){
								yl_tips.error("请输入手机号验证身份!");
								return  false;
							}
							yl_ajaxAction.ajax_select({
					 			selectActionUrl:"/findpwd",
					  			selectActionParams:{
					  				account:account,
					  				telephone:telephone
					  			},
					  			selectRequestType:"POST",
					  			selectReponseFun:function(data){
					  					if(data.infos.status==1){
					  						$.gritter.add({
					  							title: data.infos.info,
					  							text: "<span class='bigger-110'>请妥善保管好密码：<font color='red'>"+data.pwd+"</font></span>",
					  							class_name: 'gritter-info gritter-center gritter-light'
					  						});
					  						return ;
					  					}
				  						yl_tips.error(data.infos.info);
				  						return ;
				 				}
							});
						});
					},
					//注册
					register:function(){
						$("#register").off("click.login").on("click.login",function(e){
							e.preventDefault();
							var avatar=$("#avatar").attr("src");
							var account=$.trim($("#register-account").val());
							var nick=$.trim($("#register-nick").val());
							var telephone=$.trim($("#register-telephone").val());
							var password=$.trim($("#register-password").val());
							var password2=$.trim($("#register-password2").val());
							var checkbox=$("#register-checkbox")[0].checked;
							var sex= $(":radio[checked='checked']").val();
							if(yl_tools.isEmpty(account)){
								yl_tips.error("账号不可为空!");
								$("#register-account").focus();
								return false;
							}
							if(yl_tools.isEmpty(nick)){
								yl_tips.error("用户名不可为空!");
								$("#register-nick").focus();
								return false;
							}
							if(yl_tools.isEmpty(telephone)){
								yl_tips.error("手机不可为空!");
								$("#register-telephone").focus();
								return false;
							}
							if(yl_tools.isEmpty(password)){
								yl_tips.error("密码不可为空!");
								$("#register-password").focus();
								return false;
							}
							if(password2!=password){
								yl_tips.error("两次密码不一致!");
								$("#register-password2").focus();
								return false;
							}
							if(!checkbox){
								yl_tips.error("请接受使用条款!");
								return false;
							}
							  yl_ajaxAction.ajax_add({
							 			addActionUrl:"/register",
							  			addActionParams:{
							  				avatar:avatar,
							  				account:account,
							  				nick:nick,
							  				telephone:telephone,
							  				password:password,
							  				sex:sex
							  			},
							  			addReponseFun:function(data){
							  				if(data.status==1){
							  					yl_tips.success(data.info);
							  					setTimeout(function(){
							  						window.location.href="/index";
							  					},2000);
							  					return ;
							  				}
							  				yl_tips.error(data.info);
							  				if(data.status==2){
							  					$("#register-account").focus();
							  				}
					  						return ;
							  			}
							  });
						});
					},
					//选择头像
					swAvatar:function(){
						yl_avatar.avatar({
		 					seletor:"#avatar",//调用avatar控件的元素
		  					saveBtnClick:function(path){//头像选择后调用
		  						$("#avatar").attr("src",path);
		  						$("button[data-dismiss='modal']").trigger("click");
		  					}
		  				});
					},
					//登陆注册框来回切换
					swLoginBox:function(){
						$(document).off('click.login').on('click.login', '.toolbar a[data-target]', function(e) {
							e.preventDefault();
							var target = $(this).data('target');
							$('.widget-box.visible').removeClass('visible');//hide others
							$(target).addClass('visible');//show target
						 });
					},
					//登录页面皮肤切换
					skins:function(){
						 $('#btn-login-dark').on('click', function(e) {
								$('body').attr('class', 'login-layout');
								$('#id-text2').attr('class', 'white');
								$('#id-company-text').attr('class', 'blue');
								e.preventDefault();
							 });
							 $('#btn-login-light').on('click', function(e) {
								$('body').attr('class', 'login-layout light-login');
								$('#id-text2').attr('class', 'grey');
								$('#id-company-text').attr('class', 'blue');
								e.preventDefault();
							 });
							 $('#btn-login-blur').on('click', function(e) {
								$('body').attr('class', 'login-layout blur-login');
								$('#id-text2').attr('class', 'white');
								$('#id-company-text').attr('class', 'light-blue');
								e.preventDefault();
							 });
					}	
				};
				login.init();
})(jQuery);
