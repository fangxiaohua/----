/**
 * @author:fangxiaohua
*  @邮箱：abc2710712@qq.com
*  @qq:1295168875
*   用户管理
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
		
			
		
			var publicM={
					//页面初始化
					init:function(){
						//创建jqgrid
						this.jqgrid_userList();
						
						this.beforeAddModelshowCallback();
						
						this.initwysiwyg();
					},
					public_grid_table : "#public-grid-table",
					public_grid_pager :"#public-grid-pager",
					jqgrid_userList:function(){
						//jqgrid宽度自适应//jqgrid宽度自适应
						yl_tools.jqGrid_autowidth(this.public_grid_table);
						//jqgrid相关配置
						jQuery(this.public_grid_table).jqGrid({
							ajaxGridOptions : {
								timeout : 500000  //设置ajax加载超时时间
							},
							url : "/publicM/list", //这是Action的请求地址   
							//重置默认 请求参数
							prmNames:{
								 page:"pageNo",    // 表示请求页码的参数名称  
								 rows:"pageSize"    // 表示请求行数的参数名称
							}, 
							postData:{//条件查询后台传值
								q:""
							},
							datatype : "json", //将这里改为使用JSON数据   
							mtype : "POST", //提交类型
							caption:"公告管理",//表格标题
							emptyrecords:"无匹配结果",//对查询条数为0时显示的 
							//重置默认json解析参数
							jsonReader:{ 
								root:"records", // json中代表实际模型数据的入口  
								page:"currentpage", // json中代表当前页码的数据  
								total:"totalpage", // json中代表页码总数的数据  
								records:"totalrecord",  // json中代表数据行总数的数据  
								repeatitems:false    // 如果设为false，则jqGrid在解析json时，会根据name来搜索对应的数据元素（即可以json中元素可以不按顺序）；而所使用的name是来自于colModel中的name设定。  
							},
							colNames:['ID','公告标题','发布时间','发布人','公告状态','操作'],
							colModel:[
							     //主键ID
								{name:'id',index:'id', sorttype:"int", 
									hidden:true,search:false,sortable:false,editable:false,align:"center",key:true
								},
								//公告标题
								{name:'title',index:'title',sortable:false, editable:false},
								//发布时间
								{name:'time',index:'name', editable:false,sortable:false,viewable:false},
								//发布人
								{name:'account',index:'account', sortable:false,editable:false,viewable:false},
								//公告状态
								{name:'status',index:'status', sortable:false,editable: true,edittype:"checkbox",
										editoptions: {value:"公告发布:公告关闭"},unformat: aceSwitch
								},
								//操作
								{name:'myac',index:'',  fixed:true, sortable:false, resize:false,editable:false,viewable:false,
									formatter:'actions', 
									formatoptions:{ 
										keys:true,
										delbutton: false,//disable delete button
										delOptions:{recreateForm: true, beforeShowForm:function(e){
											var form = $(e[0]);user_grid_pager
											yl_tools.jqGrid_style_delete_form(form);
										}}
									}
								}
							], 
							viewrecords : true, //是否显示行数
							rowNum:10, //每页显示记录数  
							rowList:[10,20,50,100], //可调整每页显示的记录数
							pager :publicM.public_grid_pager, //分页工具栏  
							altRows: true,
							rownumbers:true,//添加左侧行号
							//jqgrid加载完成后执行
							loadComplete : function(data) {
								var table = this;
								setTimeout(function(){
									//替换jqgrid中的分页按钮图标
									yl_tools.jqGrid_updatePagerIcons(table);
									//更换导航栏中的行为图标
									yl_tools.jqGrid_updateActionIcons(table);
									//更换选择框的样式
									yl_tools.jqGrid_styleCheckbox(table);
									
									$('.navtable .ui-pg-button').tooltip({container:'body'});
									$(table).find('.ui-pg-div').tooltip({container:'body'});
									
									//添加按钮动态样式
								    jqGrid_addbtnstr=['<div title="公告详情" style="float:left;cursor:pointer;margin-left:5px;padding-right: 6px;"  href="#view-modal-form" role="button" data-toggle="modal" class="ui-pg-div ui-inline-add" onmouseover="jQuery(this).addClass('+"'ui-state-hover'"+');" onmouseout="jQuery(this).removeClass('+"'ui-state-hover'"+');"   data-original-title="公告详情">',
													    							 '<span class="ui-icon ace-icon fa-eye purple"></span>',
															 			 '</div>'].join("");
									var datalist = data.records;
									for(var i in datalist){
										$("#jEditButton_"+datalist[i].id+"").before(juicer(jqGrid_addbtnstr,{}));
									}
								}, 0);
							},
							//编辑保存路径
							editurl: "/publicM/edit",
						});
						//trigger window resize to make the grid get the correct size
						$(window).triggerHandler('resize.jqGrid');
						//分页工具栏设置
						jQuery(this.public_grid_table).jqGrid('navGrid',this.public_grid_pager,
							{ 	//navbar options
								edit: true,
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
								viewicon : 'ace-icon fa fa-search-plus grey'
							},
							{
								closeAfterEdit: true,//操作完成后窗口自动关闭
								top : 100,  //位置
			 					left: 600, //位置
								recreateForm: true,
								beforeShowForm : function(e) {
									var form = $(e[0]);
									yl_tools.jqGrid_style_edit_form(form);
								}
							}
						);
						$(document).on('ajaxloadstart', function(e) {
							$(publicM.public_grid_table).jqGrid('GridUnload');
							$('.ui-jqdialog').remove();
						});
						
						//条件查询
						$("#public_search_btn").off("click.userM'").on("click.userM",function(){
							$(publicM.public_grid_table).jqGrid('setGridParam',{page:1,	postData:{q:$("#public_search").val().trim()}}).trigger('reloadGrid');
						});
						//回车条件查询
						 $('#public_search').bind('keypress',function(event){
					            if(event.keyCode == 13)    
					            {
					            	$("#admin_search_btn").trigger('click');
					            }
					      });
						//将编辑复选框格式化
						function aceSwitch( cellvalue, options, cell ) {
							setTimeout(function(){
								$(cell).find('input[type=checkbox]')
									.addClass('ace ace-switch ace-switch-5')
									.after('<span class="lbl"></span>');
							}, 0);
						}
					},
					//添加弹窗回调函数
					beforeAddModelshowCallback:function(){
						$('#add-modal-form').on('show.bs.modal', function () {
								$("#add-public-title").val("");
								$("#add-public-input").html("公告内容");
						});
						
						$('#view-modal-form').on('show.bs.modal', function () {
							$("#view-content").empty();
							var id=$(publicM.public_grid_table).jqGrid("getGridParam","selrow");
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
					//发布公告,富文本编辑器
					initwysiwyg:function(){
						$('#add-public-input').ace_wysiwyg({
							toolbar:
							[
								'font',
								null,
								'fontSize',
								null,
								{name:'bold', className:'btn-info'},
								{name:'italic', className:'btn-info'},
								{name:'strikethrough', className:'btn-info'},
								{name:'underline', className:'btn-info'},
								null,
								{name:'insertunorderedlist', className:'btn-success'},
								{name:'insertorderedlist', className:'btn-success'},
								{name:'outdent', className:'btn-purple'},
								{name:'indent', className:'btn-purple'},
								null,
								{name:'justifyleft', className:'btn-primary'},
								{name:'justifycenter', className:'btn-primary'},
								{name:'justifyright', className:'btn-primary'},
								{name:'justifyfull', className:'btn-inverse'},
								null,
								{name:'createLink', className:'btn-pink'},
								{name:'unlink', className:'btn-pink'},
								null,
								null,
								null,
								'foreColor',
								null,
								{name:'undo', className:'btn-grey'},
								{name:'redo', className:'btn-grey'}
							],
							'wysiwyg': {
								fileUploadError: showErrorAlert
							}
						}).prev().addClass('wysiwyg-style2');
						var toolbar = $('#add-public-input').prev().get(0);
						toolbar.className = toolbar.className.replace(/wysiwyg\-style(1|2)/g , '');
						$(toolbar).find('.btn-group > .btn').addClass('btn-white btn-round');
						function showErrorAlert (reason, detail) {
							var msg='';
							if (reason==='unsupported-file-type') { msg = "Unsupported format " +detail; }
							else {
								//console.log("error uploading file", reason, detail);
							}
							$('<div class="alert"> <button type="button" class="close" data-dismiss="alert">&times;</button>'+ 
							 '<strong>File upload error</strong> '+msg+' </div>').prependTo('#alerts');
						}
						//吐槽提交
						$("#add-public-save-btn").off("click.publicM").on("click.publicM",function(){
							yl_ajaxAction.ajax_add({
						  			addActionUrl:"/public/add",
						  			addActionParams:{
						  					title:$("#add-public-title").val(),
						  					content:$("#add-public-input").html(),
						  					status:$("#add-public-status")[0].checked?1:0
						  			},
						  			addReponseFun:function(data){
						  				if(data){
						  					yl_tips.success("公告发布成功!");
						  					$("#add-public-cancel-btn").trigger("click");
						  					$(publicM.public_grid_table).jqGrid().trigger('reloadGrid');
						  				}else{
						  					yl_tips.error("公告发布失败!");
						  				}	
						  			}
								});
						});
					}
			};
			
			publicM.init();
});