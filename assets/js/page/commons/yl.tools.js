//@author:fangxiaohua
//@邮箱：abc2710712@qq.com
//@qq:1295168875
// 2014年10月27日 下午2:03:16 
/**
 * 云路的基本 工具类
 * 引包要求1. jquery.js  
 */
void (function($,window){
	
	var yl_tools={
			//获取url中的参数
			getQueryString:function(name) {
			    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
			    var r = window.location.search.substr(1).match(reg);
			    r=decodeURIComponent(r);
			    if (r != null) return unescape(r.split(",")[2]); return null;
			},
			//获取当前日期
			nowDay:function(){     
				  var date = new Date();     
				  var year = date.getFullYear();     
				  var month = date.getMonth()+1;    
				  var day = date.getDate();     
				  return year + "年" + month + "月" + day+ "日   ";
			},
			//获取当前时间
			nowTime:function(){
				  var date = new Date();     
				  var year = date.getFullYear();     
				  var month = date.getMonth()+1;    
				  var day = date.getDate();     
				  //var week = date.getDay();
				  var hours = date.getHours();     
				  var minutes = date.getMinutes();    
				  var seconds = date.getSeconds();     
				  //var milliseconds = date.getMilliseconds();  
				  return year + "年" + month + "月" + day+ "日   " + hours + ":" + minutes + ":" + seconds;
			},
			//判断值是否为空
			isEmpty:function(str){
				if(str === undefined||str == "undefined"||str==null||$.trim(str)=="")return true;
				return false;
			},
			//判断值是否不为空
			isNotEmpty:function(str){
				if(str === undefined||str == "undefined"||str==null||$.trim(str)=="")return false;
				return true;
			},
			//字符串转数组
			stringToArray:function(str){
				return str.split(",");
			},
			//数组转字符串
			arrayToString:function(str){
				return str.join('');
			},
			//将1-26数字转为字母
			intToChar:function(n){
				return String.fromCharCode(64 + parseInt(n));
			},
			//判断字符串是否在数组里
			isInArray:function(str,arr){
				for(var i=0;i<arr.length;i++){
					if(arr[i]==str){
						return true;
					}
				}
				return false;
			},
			//jqgrid宽度自适应
			jqGrid_autowidth:function(grid_selector){
				$(window).on('resize.jqGrid', function () {
					$(grid_selector).jqGrid( 'setGridWidth', $(".page-content").width() );
					$(grid_selector).jqGrid( 'setGridHeight', $(window).height()*0.5 );
					
			    });
				//resize on sidebar collapse/expand
				var parent_column = $(grid_selector).closest('[class*="col-"]');
				$(document).on('settings.ace.jqGrid' , function(ev, event_name, collapsed) {
					if( event_name === 'sidebar_collapsed' || event_name === 'main_container_fixed' ) {
						//setTimeout is for webkit only to give time for DOM changes and then redraw!!!
						setTimeout(function() {
							$(grid_selector).jqGrid( 'setGridWidth', parent_column.width() );
						}, 0);
					}
			    });
			},
			//替换jqgrid中的分页按钮图标
			jqGrid_updatePagerIcons:function(table) {
				var replacement = 
				{
					'ui-icon-seek-first' : 'ace-icon fa fa-angle-double-left bigger-140',
					'ui-icon-seek-prev' : 'ace-icon fa fa-angle-left bigger-140',
					'ui-icon-seek-next' : 'ace-icon fa fa-angle-right bigger-140',
					'ui-icon-seek-end' : 'ace-icon fa fa-angle-double-right bigger-140'
				};
				$('.ui-pg-table:not(.navtable) > tbody > tr > .ui-pg-button > .ui-icon').each(function(){
					var icon = $(this);
					var $class = $.trim(icon.attr('class').replace('ui-icon', ''));
					
					if($class in replacement) icon.attr('class', 'ui-icon '+replacement[$class]);
				});
			},
			//更换导航栏中的行为图标
			jqGrid_updateActionIcons:function(table) {
				
				var replacement = 
				{
					'ui-ace-icon fa fa-pencil' : 'ace-icon fa fa-pencil blue',
					'ui-ace-icon fa fa-trash-o' : 'ace-icon fa fa-trash-o red',
					'ui-icon-disk' : 'ace-icon fa fa-check green',
					'ui-icon-cancel' : 'ace-icon fa fa-times red'
				};
				$(table).find('.ui-pg-div span.ui-icon').each(function(){
					var icon = $(this);
					var $class = $.trim(icon.attr('class').replace('ui-icon', ''));
					if($class in replacement) icon.attr('class', 'ui-icon '+replacement[$class]);
				});
				
			},
			//更换选择框的样式
			jqGrid_styleCheckbox:function(table) {
				
				$(table).find('input:checkbox').addClass('ace')
				.wrap('<label />')
				.after('<span class="lbl align-top" />');
		
		
				$('.ui-jqgrid-labels th[id*="_cb"]:first-child')
				.find('input.cbox[type=checkbox]').addClass('ace')
				.wrap('<label />').after('<span class="lbl align-top" />');
			
			},
			//jqGrid编辑框样式
			jqGrid_style_edit_form:function(form){
				form.closest('.ui-jqdialog').find('.ui-jqdialog-titlebar').wrapInner('<div class="widget-header" />');
				//enable datepicker on "sdate" field and switches for "stock" field
				form.find('input[name=status]').addClass('ace ace-switch ace-switch-5').after('<span class="lbl"></span>');
				console.log($('#sData')+"============================0");
				form.find('#sData').text("保存");
				//update buttons classes
				var buttons = form.next().find('.EditButton .fm-button');
				buttons.addClass('btn btn-sm').find('[class*="-icon"]').hide();//ui-icon, s-icon
				buttons.eq(0).addClass('btn-primary').prepend('<i class="ace-icon fa fa-check"></i>');
				buttons.eq(1).prepend('<i class="ace-icon fa fa-times"></i>');
				
				buttons = form.next().find('.navButton a');
				buttons.find('.ui-icon').hide();
				buttons.eq(0).append('<i class="ace-icon fa fa-chevron-left"></i>');
				buttons.eq(1).append('<i class="ace-icon fa fa-chevron-right"></i>');	
			},
			//jqGrid删除弹框样式
			jqGrid_style_delete_form:function(form){
				if(form.data('styled')) return false;
				form.closest('.ui-jqdialog').find('.ui-jqdialog-titlebar').wrapInner('<div class="widget-header" />');
				var buttons = form.next().find('.EditButton .fm-button');
				buttons.addClass('btn btn-sm btn-white btn-round').find('[class*="-icon"]').hide();//ui-icon, s-icon
				buttons.eq(0).addClass('btn-danger').prepend('<i class="ace-icon fa fa-trash-o"></i>');
				buttons.eq(1).addClass('btn-default').prepend('<i class="ace-icon fa fa-times"></i>');
				form.data('styled', true);
			},
			//jqGrid过滤框样式
			jqGrid_style_search_filters:function(form){
				form.find('.delete-rule').val('X');
				form.find('.add-rule').addClass('btn btn-xs btn-primary');
				form.find('.add-group').addClass('btn btn-xs btn-success');
				form.find('.delete-group').addClass('btn btn-xs btn-danger');
			},
			//jqGrid查询弹框样式
			jqGrid_style_search_form:function(form){
				var dialog = form.closest('.ui-jqdialog');
				var buttons = dialog.find('.EditTable');
				buttons.find('.EditButton a[id*="_reset"]').addClass('btn btn-sm btn-info').find('.ui-icon').attr('class', 'ace-icon fa fa-retweet');
				buttons.find('.EditButton a[id*="_query"]').addClass('btn btn-sm btn-inverse').find('.ui-icon').attr('class', 'ace-icon fa fa-comment-o');
				buttons.find('.EditButton a[id*="_search"]').addClass('btn btn-sm btn-purple').find('.ui-icon').attr('class', 'ace-icon fa fa-search');
			},
			//jqGrid查看弹框样式
			jqGrid_style_view_form:function(form){
				form.closest('.ui-jqdialog').find('.ui-jqdialog-title').wrap('<div class="widget-header" />');
			},
			//chosen宽度自适应
			chosen_autoResize:function(){
				$(window)
				.off('resize.chosen')
				.on('resize.chosen', function() {
					$('.chosen-select').each(function() {
						 var $this = $(this);
						 $this.next().css({'width': $this.parent().width()});
					});
				}).trigger('resize.chosen');
			},
			//修改按钮动态样式，指向id为edit-modal-form 
			jqGrid_editbtnstr:['<div title="" style="float:left;cursor:pointer;margin-left:5px;" name="jqGrid_editbtnstr" href="#edit-modal-form" role="button" data-toggle="modal" class="ui-pg-div ui-inline-edit"  onmouseover="jQuery(this).addClass('+"'ui-state-hover'"+');" onmouseout="jQuery(this).removeClass('+"'ui-state-hover'"+')" data-original-title="编辑所选记录">',
														'<span class="ui-icon ui-icon-pencil"></span>',
												  '</div>'].join(""),
		    //添加按钮动态样式
		    jqGrid_addbtnstr:['<div title="" style="float:left;cursor:pointer;margin-left:5px;padding-top: 4px;  padding-right: 6px;" name="jqGrid_addbtnstr" href="#add-modal-form" role="button" data-toggle="modal" class="ui-pg-div ui-inline-add" onmouseover="jQuery(this).addClass('+"'ui-state-hover'"+');" onmouseout="jQuery(this).removeClass('+"'ui-state-hover'"+');" data-original-title="添加新记录">',
							    							 '<span class="ui-icon ace-icon fa fa-plus-circle purple "></span>',
									 			 '</div>'].join(""),
			//申请信息查看按钮  		    
			jqGrid_majorbtnstr:['<div title="" style="float:left;cursor:pointer;margin-left:5px;" class="ui-pg-div ui-inline-save" name="jqGrid_verifybtnstr" href="#add-child-major-modal-form" role="button" data-toggle="modal"  onmouseover="jQuery(this).addClass('+"'ui-state-hover'"+');" onmouseout="jQuery(this).removeClass('+"'ui-state-hover'"+');" data-original-title="添加子级菜单">',
				 				 								'<span class="ui-icon ace-icon fa fa-search-plus blue"></span>',
				 				 					'</div>'].join(""),	 			
			//删除按钮动态样式 
			jqGrid_delbtnstr:[ '<div title="" style="float:left;cursor:pointer;margin-left:5px;"  class="ui-pg-div ui-inline-del"  onmouseover="jQuery(this).addClass('+"'ui-state-hover'"+');" onmouseout="jQuery(this).removeClass('+"'ui-state-hover'"+');" data-original-title="删除所选记录">',
																'<span class="ui-icon ui-icon-trash jqGrid_delbtnstr" ></span>',
												  '</div>'].join(""),
			//submit按钮动态样式 
			jqGrid_savebtnstr:['<div title="" style="float:left;cursor:pointer;margin-left:5px;" class="ui-pg-div ui-inline-save" name="jqGrid_savebtnstr" onmouseover="jQuery(this).addClass('+"'ui-state-hover'"+');" onmouseout="jQuery(this).removeClass('+"'ui-state-hover'"+');" data-original-title="提交">',
																'<span class="ui-icon ace-icon fa fa-check green"></span>',
												  '</div>'].join(""),
			//cancel按钮动态样式			 
			jqGrid_cancelbtnstr:['<div title="" style="float:left;cursor:pointer;margin-left:5px;" class="ui-icon ace-icon fa fa-search-plus grey" name="jqGrid_cancelbtnstr"  onmouseover="jQuery(this).addClass('+"'ui-state-hover'"+');" onmouseout="jQuery(this).removeClass('+"'ui-state-hover'"+');" data-original-title="取消">',
										  						'<span class="ui-icon ace-icon fa fa-times red"></span>',
										  		    '</div>'].join(""),
			//view按钮动态样式，指向id为view-modal-form 	  		    
			jqGrid_viewbtnstr:function(flag){
									return ['<div title="" style="float: left; cursor: pointer; margin-left: 5px; display: block;" class="ui-pg-div ui-inline-del" name="jqGrid_viewbtnstr" href="#view-modal-form" role="button" data-toggle="modal"  onmouseover="jQuery(this).addClass('+"'ui-state-hover'"+');" onmouseout="jQuery(this).removeClass('+"'ui-state-hover'"+');" data-original-title="查看所选记录">',
												  			 	'<span class="ui-icon ace-icon fa fa-search-plus grey  jqGrid_viewbtnstr'+flag+'"></span>',
												  	  '</div>'].join("");
			},
			//reflash按钮动态样式		  	  
			jqGrid_reflashbtnstr:['<div title="" style="float:left;cursor:pointer;margin-left:5px;" class="ui-pg-div ui-inline-del" name="jqGrid_reflashbtnstr"  onmouseover="jQuery(this).addClass('+"'ui-state-hover'"+');" onmouseout="jQuery(this).removeClass('+"'ui-state-hover'"+');" data-original-title="刷新表格">',
			                      								'<span class="ui-icon ace-icon fa fa-refresh green"></span>',
												     '</div>'].join(""),
			//上排按钮动态样式		  	  
			jqGrid_uphbtnstr:function(flag){
									return   ['<div title="" style="float:left;margin-left:5px;" class="ui-pg-div ui-inline-save" onmouseover="jQuery(this).addClass('+"'ui-state-hover'"+');" onmouseout="jQuery(this).removeClass('+"'ui-state-hover'"+');" data-original-title="">',
																  '<span class="ui-icon fa fa-chevron-up jqGrid_sortbtnstr'+flag+'" data-oper="up"></span>',
													    '</div>'].join("");
			},
			//下排排按钮动态样式							  
		    jqGrid_downbtnstr:function(flag){
						    		return ['<div title="" style="float:left;margin-left:5px;" class="ui-pg-div ui-inline-del" onmouseover="jQuery(this).addClass('+"'ui-state-hover'"+');" onmouseout="jQuery(this).removeClass('+"'ui-state-hover'"+');" data-original-title="">',
								    							 '<span class="ui-icon fa fa-chevron-down jqGrid_sortbtnstr'+flag+'" data-oper="down"></span>',
								  					'</div>'].join("");
		    },
		    //禁用按钮动态样式
		  	jqGrid_banbtnstr:['<div title="" style="float:left;margin-left:5px;" class="ui-pg-div ui-inline-del" onmouseover="jQuery(this).addClass('+"'ui-state-hover'"+');" onmouseout="jQuery(this).removeClass('+"'ui-state-hover'"+');" data-original-title="">',
							  								 '<span class="ui-icon fa-ban " data-oper="down"></span>',
								  			     '</div>'].join(""),
			//override dialog's title function to allow for HTML titles		     
			jqUI_dialog_title:function(){
				$.widget("ui.dialog", $.extend({}, $.ui.dialog.prototype, {
					_title: function(title) {
						var $title = this.options.title || '&nbsp;';
						if( ("title_html" in this.options) && this.options.title_html == true )
							title.html($title);
						else title.text($title);
					}
				}));
			},
			//机构查询
			//该插件使用请引入 jqgrid 和jqeryui 相关js和css
			group_search:function(args){
					var str='<div id="'+args.div+'dialog-group-search" class="hide">'+
					'<div class=row>'+
						'<div class="col-xs-12 col-sm-12">'+
							'<input type="text" class="col-xs-12 col-sm-12" data-placeholder="'+args.placeholder+'" id="'+args.div+'group-search-text" />'+
						'</div>'+
						'<div class="col-xs-12 col-sm-12">'+
							'<table id="'+args.div+'grid-group-search"></table>'+
						'</div>'+
					'</div>'+
				    '</div>';
				    $("#"+args.div).html(str);
					setTimeout(function(){
						yl_tools.jqUI_dialog_title();
							$(args.openbtn).off("click.yl_tools").on('click.yl_tools', function(e) {
								if( $('#'+args.div+'group-search-text').val()!=""){
									 $('#'+args.div+'group-search-text').val("");
									 $("#"+args.div+"grid-group-search").jqGrid('setGridParam',{postData:{q:$("#"+args.div+"group-search-text").val().trim()}}).trigger('reloadGrid');
								}
								e.preventDefault();
								$( "#"+args.div+"dialog-group-search" ).removeClass('hide').dialog({
									modal: true,
									zIndex:1001,
									resizable: false,
									maxWidth:500,
									maxHeight:500,
									minHeight:200,
									minWidth:200,
									title:"<div class='widget-header widget-header-small'><h4 class='smaller'><i class='ace-icon fa fa-search'></i>"+args.title+"</h4></div>",
									title_html: true,
								});
							});
		
							 $("#"+args.div+"grid-group-search").jqGrid(
										{ //jqGrid固定的写法:jQuery("#list").jqGrid({参数})
											datatype : "json", //将这里改为使用JSON数据   
											url : args.url, //这是Action的请求地址   
											mtype : "POST", //提交类型
											height : 200,//表格高度
											altRows: true,
											data:{q:""},
											//width : 1100, //表格宽度
											autowidth: true,
											//表格结构定义
											colNames:["","用户账号"],
											colModel:[							          	
											          	{name:"id",index:"id",width:0,hidden:true,key:true},
														{name:'name',index:'name',width:272}
													],
													onSelectRow: function(id){
														    var rowData = $("#"+args.div+"grid-group-search").jqGrid('getRowData',id);
														    $("#"+args.div+"group-search-text").val(rowData.name);
														    $("#"+args.div+"dialog-group-search").dialog( "close" );
														    args.onSelect(rowData);
													},
											jsonReader:{
												root:"records",
												repeatitems:false
											},
											rowNum:100
									    });
									 setTimeout(function(){
											$("#"+args.div+"group-search-text").off("input propertychange").on('input propertychange', function() {
												$("#"+args.div+"grid-group-search").jqGrid('setGridParam',{postData:{q:$("#"+args.div+"group-search-text").val().trim()}}).trigger('reloadGrid');
											});
										 if(args.dafvalue){
										    	$("#"+args.div+"group-search-text").val(args.dafvalue);
										    }
									 },0);
							},0);
				},
				//机构查询
				//该插件使用请引入 jqgrid 和jqeryui 相关js和css
				course_search:function(args){
					var beclicktarget=null;
					var str='<div id="'+args.div+'dialog-course-search" class="hide">'+
					'<div class=row>'+
						'<div class="col-xs-12 col-sm-12">'+
							'<input type="text" class="col-xs-12 col-sm-12" data-placeholder="'+args.placeholder+'" id="'+args.div+'course-search-text" />'+
						'</div>'+
						'<div class="col-xs-12 col-sm-12">'+
							'<table id="'+args.div+'grid-course-search"></table>'+
						'</div>'+
					'</div>'+
				    '</div>';
				    $("#"+args.div).empty().html(str);
					setTimeout(function(){
						yl_tools.jqUI_dialog_title();
							$(args.openbtn).off("click.yl_tools").on('click.yl_tools', function(e) {
								beclicktarget=$(this);
								if($('#'+args.div+'course-search-text').val()!=""){
									 $('#'+args.div+'course-search-text').val("");
									 $("#"+args.div+"grid-course-search").jqGrid('setGridParam',{postData:{q:$("#"+args.div+"course-search-text").val().trim()}}).trigger('reloadGrid');
								}
								e.preventDefault();
								$( "#"+args.div+"dialog-course-search" ).removeClass('hide').dialog({
									modal: true,
									zIndex:1001,
									resizable: false,
									maxWidth:500,
									maxHeight:500,
									minHeight:200,
									minWidth:200,
									title:"<div class='widget-header widget-header-small'><h4 class='smaller'><i class='ace-icon fa fa-search'></i>"+args.title+"</h4></div>",
									title_html: true,
								});
							});
		
							 $("#"+args.div+"grid-course-search").jqGrid(
										{ //jqGrid固定的写法:jQuery("#list").jqGrid({参数})
											datatype : "json", //将这里改为使用JSON数据   
											url : args.url, //这是Action的请求地址   
											mtype : "POST", //提交类型
											height : 200,//表格高度   
											data:{q:""},
											//width : 1100, //表格宽度
											autowidth: true,
											//表格结构定义
											altRows: true,
											colNames:["","课程编号","课程名称"],
											colModel:[							          	
											          	{name:"id",index:"id",width:0,hidden:true,key:true},
														{name:'crs_no',index:'crs_no',width:136},
														{name:'name',index:'name',width:136}
													],
													onSelectRow:function(id){
														    var rowData = $("#"+args.div+"grid-course-search").jqGrid('getRowData',id);
														    $("#"+args.div+"course-search-text").val(rowData.sch_name);
														    $("#"+args.div+"dialog-course-search").dialog( "close" );
														    args.onSelect(rowData,beclicktarget);
													}, 
											jsonReader:{
												root:"records",
												repeatitems:false
											},
											rowNum:100
									    });
									 setTimeout(function(){
											$("#"+args.div+"course-search-text").off("input propertychange").on('input propertychange', function() {
												$("#"+args.div+"grid-course-search").jqGrid('setGridParam',{postData:{q:$("#"+args.div+"course-search-text").val().trim()}}).trigger('reloadGrid');
											});
											 if(args.dafvalue){
											    	$("#"+args.div+"course-search-text").val(args.dafvalue);
											    }
									 },0);
							},0);
				},
				/**
				 * 菜单树 ，使用该功能请导jquery.easyui 的相应包
				 * @param args
				 * @returns
				 * 
				 */
				/**用法 example
				 *    "/assets/js/jquery-ui.min.js",
	                    "/assets/third/easyui/jquery.easyui.min.js"
				 //课程查询
					yl_tools.menutree({
						div:"menu-tree-div",
						openbtn:".distributemenu",
						title:"分配菜单",
						paramName:"data-roleId",
						saveURL:
					});
				 **/
					menutree:function(args){
						var beclicktarget=null;
						var str='<div id="'+args.div+'dialog-menu-tree" class="hide">'+
												'<div class=row>'+
													'<div class="col-xs-12 col-sm-12">'+
														'<div data-options="region:'+'"west"'+',split:true,title:'+'"菜单"' +'style="width:250px;padding:10px;">'+
															'<ul id="'+args.div+'menulist"></ul>'+
														'</div>'+
													'</div>'+
													'<div class="col-xs-12 col-sm-12">'+
														'<div align="center"><button class="btn btn-xs btn-success" id="'+args.div+'menu-tree-save">'+
																											'<i class="ace-icon fa fa-check"></i>分配'+
																													
																								'</button>'+
														'</div>'+
													'</div>'+
												'</div>'+
										'</div>';
					    $("#"+args.div).empty().html(str);
						setTimeout(function(){
							yl_tools.jqUI_dialog_title();
								//dialog
								$(args.openbtn).off("click.yl_tools").on('click.yl_tools', function(e) {
									beclicktarget=$(this);
									e.preventDefault();
										setTimeout(function(){
										//菜单数遍历
										$('#'+args.div+'menulist').tree({
								  			 url:"/adminMenu/getAllMenuTree",
								  			animate:false,
								  			lines:true,
								  			dnd:false,
								  			 checkbox:true,
								  			 //菜单便利后获取选中
								  			 onLoadSuccess:function(data){
							  				 			$('#'+args.div+'menulist').tree("expandAll");
							  				 			//去除树菜单的滚动条
								  				 		$('#'+args.div+'menulist').attr("style","overflow: hidden;");
										  				$.ajax({
										  					url:"/adminMenu/getCheckMenu",
										  					type:"POST", 
										  					data:{
										  						roleId:$(e.target).attr(args.paramName)
										  					},
										  					datatype:"json",
										  					success:function(data){
										  						for(var i = 0; i < data.length; i++){
										  							var node = $('#'+args.div+'menulist').tree('find',data[i].menu_id);
										  							if(node){
											  							if($('#'+args.div+'menulist').tree('isLeaf', node.target)){
											  								$('#'+args.div+'menulist').tree('check', node.target);
											  							}
										  							}
										  						}
										  						setTimeout(function(){
												  						$( "#"+args.div+"dialog-menu-tree" ).removeClass('hide').dialog({
																			modal: true,
																			zIndex:1001,
																			resizable: false,
																			maxWidth:400,
																			maxHeight:650,
																			minHeight:200,
																			minWidth:200,
																			title:"<div class='widget-header widget-header-small'><h4 class='smaller'><i class='ace-icon fa fa-search'></i>"+args.title+"</h4></div>",
																			title_html: true,
																		});
										  						},0);
										  					},
										  					error:function(request) {
										  						yl_tips.error("服务器相应失败，请稍后再试!");
										  						return false;
										  					}
										  				});
								  			 }
										});
										//递归获取父节点
										function getparentid(ids,target){
											var parentid=$('#'+args.div+'menulist').tree('getParent',target);
											if(parentid){
												var flag=true;
												for(var j=0;parentid!=null&&j<ids.length;j++){
													if(ids[j]==parentid.id){
														flag=false;
													}
												};
												if(parentid!=null&&flag){
													ids.push(parentid.id);
												}
												getparentid(ids,parentid.target)
											}
										}
										
										//保存
										$("#"+args.div+"menu-tree-save").off("click.yl_tools").on("click.yl_tools",function(){
											var ids = [];
											var rows = $('#'+args.div+'menulist').tree('getChecked');
											for(var i=0; i<rows.length; i++){
												ids.push(rows[i].id);
												if($('#'+args.div+'menulist').tree('isLeaf', rows[i].target)){
													//递归获取爹的id
													getparentid(ids,rows[i].target);
												}
											}
											$.ajax({
												url:args.saveURL,
												data:{
													roleId:$(e.target).attr(args.paramName),
													menuIds:ids+""
												},
												type:"post", 
												datatype:"text",
												success:function(data){
													if(data==true){
														yl_tips.success("分配菜单成功!");
														$("#"+args.div+"dialog-menu-tree").dialog( "close" );
																
													}
													else{
														yl_tips.error("分配菜单失败!");
													}
												},
												error:function(request) {
													yl_tips.error("服务器相应失败，请稍后再试!");
													return false;
												}
											});
										})
									},0);
								});
						},0);
					}
		}; 
	window['yl_tools']=yl_tools;
})(jQuery,window);



