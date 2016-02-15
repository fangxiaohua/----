//@author:fangxiaohua
//@邮箱：abc2710712@qq.com
//@qq:1295168875
// 2014年10月27日 下午2:03:16 
/**
 * 头像选择
 *  需要引包 1.jquery.js 2.juicer.js
 * 	使用方式yl_avatar.avatar({
 * 					seletor:"#aaa",//调用avatar控件的元素
 * 					saveBtnClick:function(path){//头像选择后调用
 * 						alert(path);
 * 					}
 * 				});
 **/
void (function($,window){
	yl_avatar={
			_avatar_data:[
			     {
			    	 avatar_url:"/avatars/avatar-1.jpg",
			    	 avatar_title:"213",
			    	 avatar_desc:"帅帅的头像"
			     }, 
			     {
			    	 avatar_url:"/avatars/avatar-2.jpg",
			    	 avatar_title:"213",
			    	 avatar_desc:"帅帅的头像"
			     }, 
			     {
			    	 avatar_url:"/avatars/avatar-3.jpg",
			    	 avatar_title:"213",
			    	 avatar_desc:"帅帅的头像"
			     }, 
			     {
			    	 avatar_url:"/avatars/avatar-4.jpg",
			    	 avatar_title:"213",
			    	 avatar_desc:"帅帅的头像"
			     }, 
			     {
			    	 avatar_url:"/avatars/avatar-5.jpg",
			    	 avatar_title:"213",
			    	 avatar_desc:"帅帅的头像"
			     }, 
			     {
			    	 avatar_url:"/avatars/avatar-6.jpg",
			    	 avatar_title:"213",
			    	 avatar_desc:"帅帅的头像"
			     }, 
			     {
			    	 avatar_url:"/avatars/avatar-7.jpg",
			    	 avatar_title:"213",
			    	 avatar_desc:"帅帅的头像"
			     }, 
			     {
			    	 avatar_url:"/avatars/avatar-8.jpg",
			    	 avatar_title:"213",
			    	 avatar_desc:"帅帅的头像"
			     }, 
			     {
			    	 avatar_url:"/avatars/avatar-9.jpg",
			    	 avatar_title:"213",
			    	 avatar_desc:"帅帅的头像"
			     }, 
			     {
			    	 avatar_url:"/avatars/avatar-10.jpg",
			    	 avatar_title:"213",
			    	 avatar_desc:"帅帅的头像"
			     }, 
			     {
			    	 avatar_url:"/avatars/avatar-11.jpg",
			    	 avatar_title:"213",
			    	 avatar_desc:"帅帅的头像"
			     }, 
			     {
			    	 avatar_url:"/avatars/avatar-12.jpg",
			    	 avatar_title:"213",
			    	 avatar_desc:"帅帅的头像"
			     }, 
			     {
			    	 avatar_url:"/avatars/avatar-13.jpg",
			    	 avatar_title:"213",
			    	 avatar_desc:"帅帅的头像"
			     }, 
			     {
			    	 avatar_url:"/avatars/avatar-14.jpg",
			    	 avatar_title:"213",
			    	 avatar_desc:"帅帅的头像"
			     }, 
			     {
			    	 avatar_url:"/avatars/avatar-15.jpg",
			    	 avatar_title:"213",
			    	 avatar_desc:"帅帅的头像"
			     }, 
			     {
			    	 avatar_url:"/avatars/avatar-16.jpg",
			    	 avatar_title:"213",
			    	 avatar_desc:"帅帅的头像"
			     }, 
			     {
			    	 avatar_url:"/avatars/avatar-17.jpg",
			    	 avatar_alt:"23",
			    	 avatar_title:"213",
			    	 avatar_desc:"帅帅的头像"
			     },
			     {
			    	 avatar_url:"/avatars/avatar-18.jpg",
			    	 avatar_alt:"23",
			    	 avatar_title:"213",
			    	 avatar_desc:"帅帅的头像"
			     },
			     {
			    	 avatar_url:"/avatars/avatar-19.jpg",
			    	 avatar_alt:"23",
			    	 avatar_title:"213",
			    	 avatar_desc:"帅帅的头像"
			     },         
			     {
			    	 avatar_url:"/avatars/avatar-20.jpg",
			    	 avatar_alt:"23",
			    	 avatar_title:"213",
			    	 avatar_desc:"帅帅的头像"
			     } ,        
			     {
			    	 avatar_url:"/avatars/avatar-21.jpg",
			    	 avatar_alt:"23",
			    	 avatar_title:"213",
			    	 avatar_desc:"帅帅的头像"
			     }    ,     
			     {
			    	 avatar_url:"/avatars/avatar-22.jpg",
			    	 avatar_alt:"23",
			    	 avatar_title:"213",
			    	 avatar_desc:"帅帅的头像"
			     } ,
			     {
			    	 avatar_url:"/avatars/avatar-23.jpg",
			    	 avatar_alt:"23",
			    	 avatar_title:"213",
			    	 avatar_desc:"帅帅的头像"
			     } ,
			     {
			    	 avatar_url:"/avatars/avatar-24.jpg",
			    	 avatar_alt:"23",
			    	 avatar_title:"213",
			    	 avatar_desc:"帅帅的头像"
			     } ,
			     {
			    	 avatar_url:"/avatars/avatar-def.png",
			    	 avatar_alt:"23",
			    	 avatar_title:"213",
			    	 avatar_desc:"帅帅的头像"
			     } 
			],
			_model_tpl:[
						'<div class="modal fade"  data-backdrop="true">',
						'<div class="modal-dialog" style="width: 615px;">',
						'<div class="modal-content">',
						'	<div class="modal-header">',
						'		<button type="button" class="close" data-dismiss="modal">&times;</button>',
						'		<h4 class="blue">选择头像</h4>',
						'	</div>',
						'	',
						'	<div class="no-margin">',
						'	 <div class="modal-body">',
						'		<div class="space-4"></div>',
						'<div class="profile-users clearfix">',
								'{@each_ as item,key}',
										'<div class="itemdiv memberdiv">',
										'<div class="inline pos-rel">',
										'	<div class="user">',
										'		<a href="#">',
										'			<img src="${item.avatar_url}" alt="${item.avatar_alt}"  class="select-avatar"/>',
										'		</a>',
										'	</div>',
										'',
										'	<div class="body">',
										'		<div class="name">',
										'			<a href="#">',
										'				<span class="user-status"></span>',
										'			</a>',
										'				${item.avatar_title}',
										'		</div>',
										'	</div>',
										'',
										'	<div class="popover">',
										'		<div class="arrow"></div>',
										'',
										'		<div class="popover-content">',
										'			<div class="bolder">${item.avatar_title}</div>',
										'',
										'			<div class="time">',
										'				<i class="ace-icon fa fa-pencil-square-o middle bigger-120 grey"></i>',
										'				<span class="grey"> ${item.avatar_desc} </span>',
										'			</div>',
										'',
										'			<div class="hr dotted hr-8"></div>',
										'',
										'		</div>',
										'	</div>',
										'</div>',
									'</div>',
							'{@/each}',
						'</div>',
						'	  </div>',
						'	',
						'	 <div class="modal-footer center">',
						'		<button type="button" class="btn btn-sm btn-success" id="advatar-change-save" data-avatar-path=""><i class="ace-icon fa fa-check"></i> 保存</button>',
						'		<button type="button" class="btn btn-sm" data-dismiss="modal"><i class="ace-icon fa fa-times"></i> 取消</button>',
						'	 </div>',
						'	</div>',
						'</div>',
						'</div>',
						'</div>'
			].join(""),
			_initAvatarModel:function(modal,saveBtnClick){
				$(modal).find(".memberdiv").on('mouseenter touchstart', function(){
					var $this = $(this);
					var $parent = $this.closest('.modal-body');
			
					var off1 = $parent.offset();
					var w1 = $parent.width();
			
					var off2 = $this.offset();
					var w2 = $this.width();
			
					var place = 'left';
					if( parseInt(off2.left) < parseInt(off1.left) + parseInt(w1 / 2) ) place = 'right';
					
					$this.find('.popover').removeClass('right left').addClass(place);
				}).on('click', function(e) {
					e.preventDefault();
				});
				
				$(modal).find(".user-status").off("click.avatar").on("click.avatar",function(e){
						$(".user-status").each(function(i,e){
								$(e).removeClass("status-online");
						});
						
						$(".select-avatar").each(function(i,e){
							$(e).attr("style","");
						});
						
						var path=$(e.target).closest(".memberdiv").find("img").attr("src");
						$("#advatar-change-save").attr("data-avatar-path",path);
						if(path){
							$(e.target).addClass("status-online");
							$(e.target).closest(".memberdiv").find("img").attr("style","border:2px solid rgb(138, 193, 108);");
						}
				})
				
				$(modal).find(".select-avatar").off("click.avatar").on("click.avatar",function(e){
					$(".user-status").each(function(i,e){
							$(e).removeClass("status-online");
					});
					$(".select-avatar").each(function(i,e){
							$(e).attr("style","");
					});
					
					var path=$(e.target).attr("src");
					$("#advatar-change-save").attr("data-avatar-path",path);
					if(path){
						$(e.target).closest(".memberdiv").find(".user-status").addClass("status-online");
						$(e.target).attr("style","border:2px solid rgb(138, 193, 108);");
					}
			})
			
			
				$(modal).find("#advatar-change-save").off("click.avatar").on("click.avatar",function(e){
					var path=$(e.target).attr("data-avatar-path");
					saveBtnClick(path);
				})
			},
			avatar:function(args){
				var seletor=args.seletor,
				saveBtnClick=function(){};
				if(typeof(args.saveBtnClick)=="function"){
					saveBtnClick=args.saveBtnClick;
				}
				$(seletor).off("click.avatar").on('click.avatar', function(e){
					e.preventDefault();
					$(".modal").remove();
					var modal = $(juicer(yl_avatar._model_tpl,yl_avatar._avatar_data));
					yl_avatar._initAvatarModel(modal,saveBtnClick);
					modal.modal("show").on("hidden", function(){
						modal.remove();
					});
				});
			}
	}
	window['yl_avatar']=yl_avatar;
})(jQuery,window);
	
	
	

