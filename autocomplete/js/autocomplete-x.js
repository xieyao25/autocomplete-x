/* 
 * @auhor xieyao
 * @version 1.0
 * @param
 */
(function($){
	$.fn.autocomplete = function(params){
		var autoparams = {
			pageSize:params.size ,/* 设置返回的条数 默认全部*/
			pageNo:params.pageNo||1,/* 设置页面 翻页时可用 */
			data:params.data,/* 静态数据 */
			ajax:params.ajax,/* 请求服务器数据，发送ajax 请求 */
			
			templete:params.templete,/* 生成的模板 */
		};
		var $this = this;
		$this.parent().append('<div class="autoCompleteList"></div>')
		if(autoparams.ajax){
			completeAjax()
		};
		/* 默认模板 */
		function templete(data){
			let str='';
			let len = data.length;
			if(autoparams.pageSize!=undefined) len = autoparams.pageSize;
			for (var i = 0; i < len; i++) {
				str+='<li>'+data[i]+'</li>'
			}
			$this.next().html('<ul>'+str+'</ul>')
		};
		
		/* 数据请求 */
		function completeAjax(){
			autoparams.ajax.data['pageSize']=autoparams.pageSize;/* 加入pagesize参数 */
			autoparams.ajax.data['pageNo']=autoparams.pageNo;/* 加入pagesize参数 */
			$.ajax({
				
				success:function(data){
					if(data.length>0){
						templete(data)
					}else{
						console.error("data is null")
					}
				},
				error:function(error){
					console.error(error)
				}
			})
		};
		/* 监听事件 如果选择服务器数据则本地数据不起作用*/
		this.keyup(function(e){
			isSever($(this).val())
		});
		$(document).click(function(e){
			/* 判断点击的是否是 input 输入框 */
			if('.'+e.target.className != $this.selector){ 
				$this.next().hide();
			}
		});
		this.focus(function(e){
			$this.next().show();
			isSever($(this).val())
		});
		/* 判断是否启用服务器端数据 */
		function isSever(str){
			if(autoparams.ajax!=undefined){
				completeAjax()
			}else{
				dataComplete(str)
			};
		}
		/* 输入值与数据比对（静态数据情况下） */
		function dataComplete(str){
			let data=[];
			for (var i = 0; i < autoparams.data.length; i++) {
				if(autoparams.data[i].indexOf(str)!=-1){
					data.push(autoparams.data[i])
				}
			}
			templete(data)
		};
		/* 搜索到的结果点击进入输入框 */
		$('.autoCompleteList').off('click').on('click','li',function(){
			$this.val($(this).text())
		})
	};
})(jQuery)