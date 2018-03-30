BUG:

点击穿透

待解决：
1.添加label
为了明确下次进入页面时能加载上次连接的两个点一致，使用了uuid
uuid动态生成 在添加endpoints的时候 由id和anchertype 拼凑其字符串
保存的时候由于dom上获取不到uuid 因此也采用拼凑的形式存放到数据库中

一、	开发分析

1.关于该程序对浏览器兼容性
该H5程序主要是为PC端用户使用，因此不考虑移动端版本，所以在开发过程中需要注意PC端浏览器的兼容问题，主要是chrome和firefox，由于ie对h5尤其是其新属性的支持较差而该项目中主要是用到了canvas。因此主力浏览器定位为chrome。
2.该程序用到相关JS技术：JqueryUI + JsPlumb
JqueryUI主要提供dragable实现拖拽添加流程块于Jsplumb生成的画布中 ，Jsplumb用于实现画布生成，以及不同流程块之间关联连线。
Fontawsome实现图标

二、	需求分析

1.	通过拖拽将流程组建添加到画布中
2.	添加到画布中的组建可以实现拖动改变位置
3.	添加到画布中的组建默认名字为空，双击后修改名字
4.	通过点击连接线点连接两个组件之间的关系
5.	双击连接线可以编辑文本
6.	可以取消连线
a)	保存画布上的流程图信息生成Object或者Json存放到后台
7.	读取后台发送的Json，根据Json遍历渲染成流程图

三、	详细设计
1.	拖拽添加使用
使用clone和revert
当用户释放时获取当前鼠标的坐标？
渲染？
简单点，每次拖拽进去的div都append在画布的同一位置，后期已进行优化会获取drop时的坐标
用switch语句判断拖拽的是哪一个图形 图形可以用自定义属性(data-shape)或者class来确定个人认为用data-shape比较好因为可以直接取值用于封装保存
给添加到画布中的div在添加时绑定相同的class使其可拖拽
2.	双击选择删除或者修改文本show/hide
点击删除，点击时绑定事件 显示选择模态框
修改文本只有用jquery获取dom然后修改text或者html
3.	保存和渲染
保存和渲染是一个互逆过程，根据渲染所需的参数，在保存时从dom或者instance[obj]中获取，然后将数据进行封装，封装json格式参考如下：
node:
{
(toId):””,//唯一标识 唯一性通过时间戳+随机数生成anchors:{targetAchors:””,sourceAchors:””},//链接点类型
template:””,//类型，方形、棱形或者椭圆形，形状参考perimeterAnchors
position:{x:””,y:””}坐标用于确定css的x和y
text:””,//文本
}

connector:
instance.connect({uuids: ["Window2BottomCenter", "Window3TopCenter"], editable: true});



如何获取 label？
获取就是生成的逆向过程，生成时是通过调用需要添加的connection对象上的方法实现，获取那么也就需要匆匆connection对象上找相应的方法
[{
uuids:[“source”,”target”],
text:””,
:
}，{
uuids:[“source”,”target”],
text:””,
editable:
}]
data-shape="Circle"
[data-shape=Circle]
生成：
1.	ajax请求数据
2.	遍历response中的component信息生成节点，并且节点带位置
3.	遍历connection信息生成连线，并且生成相应的label

开发用时8天
主要参考了 官网的栗子 🌰 https://jsplumbtoolkit.com/community/demo/flowchart/index.html
