//-----获取滚动条位置
function getScrollOffset() {
	if(window.pageXOffset) { //标准方法，ie9+以上能用
		return {
			x: window.pageXOffset,
			y: window.pageYOffset
		}
	} else { //ie8-以下，document.body和document.documnetElement兼容性混乱，一般一个能识别另一个一定为0，所有相加使用
		return {
			x: document.body.scrollLeft + document.documnetElement.scrollLeft,
			y: document.body.scrollTop + document.documentElement.scrollTop
		}
	}
}

//------获取可视区窗口尺寸
function getViewportOffset() {
	if(window.innerWidth) { //ie9+以上能用
		return {
			w: window.innerWidth,
			h: window.innerHeight
		}
	} else { //ie8--
		if(document.compatMode === 'BackCompat') { //混杂模式(为了高版本浏览器能按照低版本的方式解析页面,向下兼容)
			return {
				w: document.body.clientWidth,
				h: document.body.clientHeight
			}
		} else { //标准模式（区别在有没有DTD即文档声明）
			return {
				w: document.documentElement.clientWidth,
				h: document.documentElement.clientHeight
			}
		}

	}
}

//-----查看元素的几何尺寸
//方法1
domEle.getBoundingClientRect(); //返回一个对象，里面的left和top表示元素左上角坐标，right和bottom表示右下角坐标,在ie中没有width和height,一般求用坐标值间接获取

//方法2
domEle.offsetWidth //元素宽(包含除margin外的所有)
domEle.offsetHeight //元素高
domEle.offsetLeft //元素左上角x(相对于有定位的父级元素)
domEle.offsetTop //元素左上角y
domEle.offsetParent //最近的有定位的父级元素

//-----获取计算样式(即最后生效的样式)
function getStyle(domEle, prop) {
	if(window.getComputedStyle) { //ie9+
		return window.getComputedStyle(domEle, null)[prop]; //这个方法的第二个参数是伪元素类型，这是唯一获取伪元素的样式
	} else { //ie8-
		return domEle.currentStyle[prop];
	}
}

//-----绑定事件
//tips:addEventListener和attachEvent可以绑定多个事件，onclick不能;
//addEventListener绑定多次相同处理函数只执行一次，attachEvent可全部执行；
//如果希望能移除绑定事件，不要使用匿名函数作为绑定函数
function addEven(domEle, type, handle) {
	if(domEle.addEventListener) { //w3c标准
		domEle.addEventListener(type, handle, false);
	} else if(domEle.attachEvent) { //ie8--
		domEle.attachEvent('on' + type, function() {
			handle.call(domEle);
		})
	} else { //all
		domEle['on' + type] = handle;
	}
}

//-----移除事件绑定(匿名函数无法解除绑定)
domEle.removeEventListener(type, , false);
domEle.detachEvent('on' + type, );
domEle.onclick = false / '' / null;

//阻止冒泡
function stopBubble(event) {
	if(event.stopPropagation) { //w3c
		event.stopPropagation();
	}
} else { //ie9--
	event.cancelBubble = true;
}

//-----阻止默认事件
//oncontextmenu等默认事件 最简单是return false;
function cancleHandler(event) {
	if(event.preventDefault) { //w3c
		event.preventDefault();
	} else { //ie9--
		event.returnValue = false;
	}
}
//-----获取事件源
function getTarget() {
	var event = e || window.event; //获取鼠标事件对象
	var target = event.target || event.srcElement; //获取事件源
}

//-----判断数据类型
function type(target) {
	var str = Object.prototype.toString.call(target);
	var template = {
		'[object String]': 'object-string',
		'[object Number]': 'object-number',
		'[object Boolean]': 'object-boolean',
		'[object Array]': 'array',
		'[object Object]': 'object'
	}
	if(target == null) return 'null';
	if(typeof(target) == 'object') {
		return template[str];
	} else {
		return typeof(target);
	}
}

//------圣杯模式的对象继承
var inherit = (function(Target, Origin) {
	var F = function() {}
	return function(Target, Origin) {
		F.prototype = Origin.prototype; //这行与下行不能交换，不然已经实例了再也不可能改变原型
		Target.prototype = new F();
		Target.prototype.constructor = Target; //恢复构造函数指向
		Target.prototype.uber = Origin.prototype; //存储实际继承自哪里，超类
	}
}())

//-----深度克隆
/*  遍历对象for(var prop in obj)
	1.判断是不是原始值(typeof obj)
	2.不是原始值则判断是数组还是对象(instanceof constructor obj.prototype.toString.call(obj))
	3.建立相应的数组或对象
	4.利用回调重新进行刚才的过程*/
function deepClone(origin, target) {
	var target = target || {};
	var toStr = Object.prototype.toString;
	var arrStr = "[Object Array]";
	for(var prop in origin) {
		if(origin.hasOwnProperty(prop)) { //自有属性或方法
			if(origin[prop] !== null && typeof(origin[prop]) == 'object') {
				if(toStr.call(origin[prop]) == arrStr) {
					target[prop] = [];
				} else {
					target[prop] = {};
				}
				deepClone(origin[prop], target[prop]);
			} else {
				target[prop] = origin[prop];
			}
		}
	}
	return target;
}

//-----计算字节长度
function getByteLen(str) {
	var count = len = str.length;
	for(var i = 0; i < len; i++) {
		if(str.charCodeAt(i) > 255) {
			count++;
		}
	}
	return count;
}


//----数组去重（在原型链上编程）将数组作为对象的属性，判断是否有当前对象判断数组的数据是否重复
Array.prototype.unique=function(){
	var temp={},arr=[],len=this.length;
	for(var i=0;i<len;i++){
		if(!temp[this[i]]){
			temp[this[i]]='abc';
			arr.push(this[i]);
		}
	}
	return arr;
}

//----异步加载JavaScript外部文件
//(如果引入文件只是很多方法，不是对象集合，使用使第二参数需要是个匿名函数，在里面执行引入的方法,才能执行)
//如果不使用匿名函数，那么引入文件需写成对象集合，内部调用callBack();改为obj[callBack]();
function loadScript(url,callBack){
	var script=document.creatElement('script');
	script.type='text/javascript';
	if(script.readyState){//IE,根据状态码进行判断加载是否完成
		script.onreadystatechange=function(){
			if(script.readyState=='complete'||script.readyState=='loaded'){
				callBack();
			}
		}
	}else{//符合W3标准的浏览器
		script.onload=function(){
			callBack();
		}
	}
	script.src=url;
	document.head.appendChild(script);
}


//在目标dom节点后插入标签
Element.prototype.insertAfter(newEle,targetEle)=function(){
	 var afterNode=targetEle.nextElementSibling;
	 if(afterNode==null){
	 	this.appendChild(newEle);
	 }else{
	 	this.insertBefore(newEle,afterNode);
	 }
}
