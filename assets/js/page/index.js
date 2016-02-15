/**
 * @author:fangxiaohua
*  @邮箱：abc2710712@qq.com
*  @qq:1295168875
*   index
*/
	ace.load_ajax_scripts([
	                       null
	], function() {
		
		var public_tpl={
				view:[
							'<div class="widget-box">',
							'	<div class="widget-header widget-header-flat">',
							'		<h4 class="widget-title smaller">',
							'			<i class="ace-icon fa fa-quote-left smaller-80"></i>',
							'			${title}',
							'		</h4>',
							'	</div>',
							'',	
							'	<div class="widget-body">',
							'		<div class="widget-main">',
							'',		
							'			<div class="row" style="min-height:480px; overflow-x:auto;overflow-y:hidden;">',
							'				<div class="col-xs-12">',
							'					<blockquote>',
							'						<p class="lighter line-height-125">',
							'							$${content}',
							'						</p>',
							'					</blockquote>',
							'				</div>',
							'			</div>',
							'',	
							'			<hr>',
							'			<address>',
							'				<strong>附录:</strong>',
							'				<br/>',
							'				<abbr title="发布该公告的人员">发布人:</abbr>',
							'				${account}', 
							'				<br/>',
							'				<abbr title="发布该公告的时间">时间:</abbr>',
							'				${time}',
							'				<br/>',
							'				<abbr title="该公告的状态">状态:</abbr>',
							'				${status}',
							'				<br/>',
							'			</address>',
							'		</div>',
							'	</div>',
							'</div>'
				      ].join("")	
			};
		
		
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
									'		发布了',
									'		<a href="#view-modal-form" role="button" data-toggle="modal" data-id="${item.id}" id="view-public-btn">${item.title}</a>',
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
					console.log("----------");
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
						  			selectActionUrl:"/public/plist",
						  			selectRequestType:"POST",
						  			selectActionParams:{
						  				size:$("#action-log-page-size").attr("data-size")
						  			},
						  			selectReponseFun:function(data){
						  				$("#scroll-content").remove();
						  				$("#action-log").empty().html(juicer(index.log_tpl,data));
						  				$('#scroll-content').ace_scroll({
											size: 600,
											mouseWheelLock: true,
											alwaysVisible : true
										});
						  			}
							});
						}
					}
					$('#view-modal-form').on('show.bs.modal', function (e) {
						$("#view-content").empty();
						console.log();
						var id=$(e.relatedTarget).attr("data-id");
						yl_ajaxAction.ajax_select({
						  			selectActionUrl:"/public/view",
						  			selectActionParams:{
						  				id:id
						  			},
						  			selectRequestType:"POST",
						  			selectReponseFun:function(data){
						  				$("#view-content").html(juicer(public_tpl.view,data));
						 			}
						});
					});
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