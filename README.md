# Flowchart Editor with JSPlumb
    用JSPlumb编写的流程图(Flowchart)绘制工具

    该程序用到相关JS技术：JqueryUI + JsPlumb
    JqueryUI主要提供dragable实现拖拽添加流程块于Jsplumb生成的画布中 ，Jsplumb用于实现画布生成，以及不同流程块之间关联连线。

### 已实现功能
    1.	通过拖拽将流程组建添加到画布中
    2.	添加到画布中的组建可以实现拖动改变位置
    3.	添加到画布中的组建默认名字为空，双击后修改名字
    4.	通过点击连接线点连接两个组件之间的关系
    5.	双击连接线可以编辑文本
    6.	可以取消连线
    7.	保存画布上的流程图信息生成Object或者Json存放到后台
    8.	读取后台发送的Json，根据Json遍历渲染成流程图

### 待扩展功能
    1.  用户编辑模块的颜色（外观，需求较大）
    2.  用户可拖放模块的大小（外观，需求小）
    3.  流程更多组件形状

### 待优化功能
    1.  通过后台获取的flowchart数据，生成connection连线label(overlay)上的值

### 相应技术
    JqueryUI ：drag & drop 实现拖拽添加流程模块  
    JSPlumb ： 实现流程模块之间的连线
    SVG ：绘制图形
