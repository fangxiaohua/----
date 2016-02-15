//@author:fangxiaohua
//@邮箱：abc2710712@qq.com
//@qq:1295168875
// 2014年10月27日 下午2:03:16 
//加载jqgrid相关依赖js包
	ace.load_ajax_scripts([
	], function() {
		void (function($) {
			var index= {
				log_tpl:[
				         '<div  class="profile-feed" id="scroll-content">',
								'{@each_ as item,key}',
									'<div class="profile-activity clearfix">',
									'	<div>',
									'		<img class="pull-left" alt="${item.name}" src="${item.avatar}">',
									'		<a class="user">${item.name}</a>',
									'',
									'		${item.action}',
									'		${item.action_content}',
									'		<div class="time">',
									'			<i class="ace-icon fa fa-clock-o bigger-110"></i>',
									'			${item.time}',
									'		</div>',
									'	</div>',
									'</div>',
								'{@/each}',
							'</div>'
				].join(''),
				init : function() {
					this.ajax_content();
						this.recent_log();
						this.log_reload();
						this.changePageSize();
				},
				ajax_content : function() {
					if ('enable_ajax_content' in ace) {
						var options = {
							content_url : function(url) {
								//this is for Ace demo only, you should change it
								//please refer to documentation for more info

								if (!url.match(/^page\//))
									return false;

								var path = document.location.pathname;

								//for Ace HTML demo version, convert index#page/gallery to > gallery.html and load it
								if (path.match(/index/))
									return path.replace(/index/, url.replace(
											/^page\//, ''));

								//for Ace PHP demo version convert "page/dashboard" to "?page=dashboard" and load it
								return path + "?" + url.replace(/\//, "=");
							},
							default_url : ''//default url
						};
						ace.enable_ajax_content($, options);
					}
				},
				recent_log:function() {
					if($("#action-log")){
						if($("#action-log-page-size").attr("data-size")){
								yl_ajaxAction.ajax_select({
						  			selectActionUrl:"comm/getActionLogList",
						  			selectActionParams:{
						  				size:$("#action-log-page-size").attr("data-size")
						  			},
						  			selectReponseFun:function(data){
						  				$("#scroll-content").remove();
						  				$("#action-log").empty().html(juicer(index.log_tpl,data));
						  				$('#scroll-content').ace_scroll({
											height: '650px',
											mouseWheelLock: true,
											alwaysVisible : true
										});
						  			}
							});
						}
					}
				},
				log_reload:function(){
						$("#action-log-reload").off("click.index").on("click.index",function(){
							index.recent_log();
						});
				},
				changePageSize:function(){
					$(".dropdown-menu a").off("click.index").on("click.index",function(e){
						$("#action-log-page-size").attr("data-size",$(e.target).text());
						index.recent_log();
					});
				}
			};
			index.init();
		})(jQuery);
});