
var Tween = {
    linear: function (t, b, c, d){  //匀速
        return c*t/d + b;
    },
    easeIn: function(t, b, c, d){  //加速曲线
        return c*(t/=d)*t + b;
    },
    easeOut: function(t, b, c, d){  //减速曲线
        return -c *(t/=d)*(t-2) + b;
    },
    easeBoth: function(t, b, c, d){  //加速减速曲线
        if ((t/=d/2) < 1) {
            return c/2*t*t + b;
        }
        return -c/2 * ((--t)*(t-2) - 1) + b;
    },
    easeInStrong: function(t, b, c, d){  //加加速曲线
        return c*(t/=d)*t*t*t + b;
    },
    easeOutStrong: function(t, b, c, d){  //减减速曲线
        return -c * ((t=t/d-1)*t*t*t - 1) + b;
    },
    easeBothStrong: function(t, b, c, d){  //加加速减减速曲线
        if ((t/=d/2) < 1) {
            return c/2*t*t*t*t + b;
        }
        return -c/2 * ((t-=2)*t*t*t - 2) + b;
    },
    elasticIn: function(t, b, c, d, a, p){  //正弦衰减曲线（弹动渐入）
        if (t === 0) {
            return b;
        }
        if ( (t /= d) == 1 ) {
            return b+c;
        }
        if (!p) {
            p=d*0.3;
        }
        if (!a || a < Math.abs(c)) {
            a = c;
            var s = p/4;
        } else {
            var s = p/(2*Math.PI) * Math.asin (c/a);
        }
        return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
    },
    elasticOut: function(t, b, c, d, a, p){    //*正弦增强曲线（弹动渐出）
        if (t === 0) {
            return b;
        }
        if ( (t /= d) == 1 ) {
            return b+c;
        }
        if (!p) {
            p=d*0.3;
        }
        if (!a || a < Math.abs(c)) {
            a = c;
            var s = p / 4;
        } else {
            var s = p/(2*Math.PI) * Math.asin (c/a);
        }
        return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
    },
    elasticBoth: function(t, b, c, d, a, p){
        if (t === 0) {
            return b;
        }
        if ( (t /= d/2) == 2 ) {
            return b+c;
        }
        if (!p) {
            p = d*(0.3*1.5);
        }
        if ( !a || a < Math.abs(c) ) {
            a = c;
            var s = p/4;
        }
        else {
            var s = p/(2*Math.PI) * Math.asin (c/a);
        }
        if (t < 1) {
            return - 0.5*(a*Math.pow(2,10*(t-=1)) *
                Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
        }
        return a*Math.pow(2,-10*(t-=1)) *
            Math.sin( (t*d-s)*(2*Math.PI)/p )*0.5 + c + b;
    },
    backIn: function(t, b, c, d, s){     //回退加速（回退渐入）
        if (typeof s == 'undefined') {
            s = 1.70158;
        }
        return c*(t/=d)*t*((s+1)*t - s) + b;
    },
    backOut: function(t, b, c, d, s){
        if (typeof s == 'undefined') {
            s = 3.70158;  //回缩的距离
        }
        return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
    },
    backBoth: function(t, b, c, d, s){
        if (typeof s == 'undefined') {
            s = 1.70158;
        }
        if ((t /= d/2 ) < 1) {
            return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
        }
        return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
    },
    bounceIn: function(t, b, c, d){    //弹球减振（弹球渐出）
        return c - Tween['bounceOut'](d-t, 0, c, d) + b;
    },
    bounceOut: function(t, b, c, d){//*
        if ((t/=d) < (1/2.75)) {
            return c*(7.5625*t*t) + b;
        } else if (t < (2/2.75)) {
            return c*(7.5625*(t-=(1.5/2.75))*t + 0.75) + b;
        } else if (t < (2.5/2.75)) {
            return c*(7.5625*(t-=(2.25/2.75))*t + 0.9375) + b;
        }
        return c*(7.5625*(t-=(2.625/2.75))*t + 0.984375) + b;
    },
    bounceBoth: function(t, b, c, d){
        if (t < d/2) {
            return Tween['bounceIn'](t*2, 0, c, d) * 0.5 + b;
        }
        return Tween['bounceOut'](t*2-d, 0, c, d) * 0.5 + c*0.5 + b;
    }
};


/*
* obj  ：  要运动的元素
* count:  运动的总路程
* duration: 运动的总时间
* attr ： 变化的属性
* fx: 运动的模式
* fn：运动结束后要做的事情 （回调函数）
*
* */

function MTween(obj,count,duration,attr,fx,fn){
    //清除定时器
    clearInterval(obj.timer);
    var startTime = new Date().getTime();//运动前的时间
    var begin = getCss(obj,attr);//运动前的位置
//        var count = 800; //当前事件希望元素运动的总距离
//        var duration = 1000; //800像素总共要运动的时间

    obj.timer = setInterval(function(){
        //计算已经运动过的时间
        //由于定时器执行间隔时间不稳定，受到其他程序影响，所以间隔时间要通过计算来获取
        var t = new Date().getTime()-startTime;
        if(t>=duration){
            t = duration;
            clearInterval(obj.timer);
        }
        obj.style[attr] = Tween[fx](t,begin,count,duration)+'px';

        if(t>=duration&&fn) fn();

    },30);
}

//获取元素属性
function getCss(obj,attr){
    return isNaN(parseFloat(getComputedStyle(obj)[attr]))?getComputedStyle(obj)[attr]:parseFloat(getComputedStyle(obj)[attr]);
}

//查找内容在数组中第一次出现的位置 如果不存在 返回-1
function arrIndexOf(array,par){
    for(var j=0;j<array.length;j++){
        if(array[j]==par){
            return j;
        }
    }

    return -1;

}

/*
 * 抖动函数 shake(obj,attr,s,d)
 *
 * 被抖动的元素  obj
 *
 * 改变的属性  attr
 *
 * 偏移量    s
 *
 * 衰退值    d
 *
 *
 * */

function shake(obj,attr,s,d,fn){
    //初始位置
    var currSite = getCss(obj,attr);
//      var arr = [30,-30,20,-20,10,-10,0];
    var  arr = [];
//      var d = 5;//衰退值
    while(s>=0){

        arr.push(s);
        arr.push(-s);

        //s的衰退
        s = s-d;

    }
    console.log(arr);
    arr.push(0);

    var m = 0;
    clearInterval(obj.timer);
    obj.timer = setInterval(function(){
        m++;
        obj.style[attr] = currSite+arr[m]+'px';
        if(m==arr.length-1){
            clearInterval(obj.timer);
            fn&&fn(obj);
        }
    },30)
}

//找所有的子元素
//返回值是 子元素的集合
function getChildElements(obj,nName){
    //获取一堆子节点
    var child = obj.childNodes;
    var childElements = [];
    for(var i=0;i<child.length;i++){
        //判断是元素节点类型的才push
        if(nName){
            if(child[i].nodeType==1&&child[i].nodeName.toLowerCase()==nName.toLowerCase()){
                childElements.push(child[i]);
            }
        }else{
            if(child[i].nodeType==1){
                childElements.push(child[i]);
            }
        }

    }
    return childElements;
}


//封装转把url中的search内容转成json的函数
function searchToJson(search) {
    //把search内容转成json 以便使用
    // var search = url.split('?')[1];
    // search = search.split('#')[0];


    //?page=page1&name=yinwei&age=18

    //去掉问好
    //page=page1&name=yinwei&age=18
    search = search.slice(1);

    var arr1 = search.split('&');


    var searchJson = {};

    //进一步通过 = 拆分
    for(var i=0;i<arr1.length;i++ ){

        if(arr1.length<=1&&!arr1[i]){
            continue;
        }

        arr1[i] = arr1[i].split('=');

        searchJson[arr1[i][0]] = arr1[i][1];

    }

    return searchJson;
}
