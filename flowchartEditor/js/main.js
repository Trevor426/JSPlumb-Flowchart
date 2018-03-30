/**
*@Author: Cui
*@Date: 2018-3-19 9:00:00
*@Last Modified by: Cui
*@Last Modified time: 2018-3-29 16:11:00
*/
(function(){
    var $pop_mask = $('.pop-mask');
    var $edit_pop = $(".edit-pop");
    /**
     * JSPlumb实例化
     */
    jsPlumb.ready(function () {
        var instance = window.jsp = jsPlumb.getInstance({
            // 拖拽选项初始化啊
            DragOptions: { cursor: 'pointer', zIndex: 2000 },
            /**
             * 给每一个连线设置overlays(箭头和标签)
             * location 位置 0～1按照连线比例
             */
            ConnectionOverlays: [
                [ "Arrow", {
                    location: 1,//箭头位置0为开始1为结束
                    visible:true,//隐藏显示
                    width:15,//箭头宽度
                    length:11,//箭头长度
                    id:"ARROW"
                } ],
                [ "Label", {
                    location: 0.5,
                    id: "label",
                    cssClass: "aLabel",
                    editable:true,
                }]
            ],
            Container: "canvas"
        });
        /**
         * connector和Endpoint的样式设置
         */
        var connectorPaintStyle = {
                strokeWidth: 1.2,
                stroke: "#000",
                // joinstyle: "round",
                outlineStroke: "transparent",
                outlineWidth: 0
            },
            connectorHoverStyle = {
                strokeWidth: 3,
                stroke: "#37b374",
                outlineWidth: 5,
                outlineStroke: "white"
            },
            endpointHoverStyle = {
                fill: "#37b374",
                stroke: "#37b374"
            },
            sourceEndpoint = {
                endpoint: "Dot",
                paintStyle: {
                    stroke: "transparent",
                    fill: "grey",
                    radius: 4,
                    strokeWidth: 1
                },
                isSource: true,
                isTarget: true,
                maxConnections: 6,
                connector: [ "Flowchart", { stub: [10, 30], gap: 5, cornerRadius: 5, alwaysRespectStubs: true } ],//设置折线 线和点之间的距离
                connectorStyle: connectorPaintStyle,
                hoverPaintStyle: endpointHoverStyle,
                connectorHoverStyle: connectorHoverStyle,
                dragOptions: {},
            };

        /**
         * 添加连接点
         * @method instance.addEndpoint
         * @param {String} id 模块id.
         */
        var addEndpoints = function(id){
            instance.addEndpoint(id, { anchors: "TopCenter",uuid:id+"TopCenter"},sourceEndpoint);
            instance.addEndpoint(id, { anchors: "BottomCenter",uuid:id+"BottomCenter"},sourceEndpoint);
            instance.addEndpoint(id, { anchors: "LeftMiddle",uuid:id+"LeftMiddle"},sourceEndpoint);
            instance.addEndpoint(id, { anchors: "RightMiddle",uuid:id+"RightMiddle"},sourceEndpoint);
        }

        /**
         * 绑定事件
         * @method instance.addEndpoint
         * @param {String} newId 模块id.
         */
        var bindClickEvent = function(newId){
            $("#"+newId).dblclick(function(){
                $(".text-editor").hide();
                $(".edit-label").hide();
                $(this).find('.edit-label').show();
                $(this).find('.choose-edit').show();
            });

            //添加component文本
            $("#"+newId+" .add-text-button").click(function () {
                //隐藏按钮
                $(this).parent().hide();
                $('#'+newId+' input.add-text').val('');
                $(this).parent().siblings('.text-editor').show();
                //显示输入框
            });
            $("#"+newId+" .confirm-add-text").click(function () {
                //获取输入框里的文本
                var newText = $('#'+newId+' input.add-text').val();
                $("#"+newId+ " .component-text").text(newText);
                //添加到newId中
                $(".edit-label").hide();
            });

            $("#"+newId+" .delete-component-button").click(function () {
                //删除组件节点
                instance.removeAllEndpoints(newId);
                //删除组件
                $("#"+newId).remove();
            });
            $("#"+newId+" .cancle-edit-button").click(function () {
                $(".edit-label").hide();
            });
        }

        /**
         * 图形库
         */

        var shapeMap = {
            "rectangle": "<svg width='100' height='50' version='1.1'><rect x='0' y='0' width='100' height='50' style='fill:#fff;stroke:black;stroke-width:2;'></rect></svg>",
            "ellipse":"<svg width='100' height='50' version='1.1'><rect x='2' y='2' rx='50  ' ry='100' width='96' height='46' style='fill:#fff;stroke:black;stroke-width:1;'></rect></svg>",
            "rhombus":"<svg width='100' height='50' version='1.1'><polygon points='0,25 50,0 100,25 50,50' style='fill:#fff;stroke:#000000;stroke-width:1'/></svg>",
            "rhomboid":"<svg width='100' height='50' version='1.1'><polygon points='20,1 100,1 80,49 0,49' style='fill:#fff;stroke:#000000;stroke-width:1'/></svg>",
            "right_trapezoid":"<svg width='100' height='50' version='1.1'><polygon points='10,20 90,1 90,49 10,49' style='fill:#fff;stroke:#000000;stroke-width:1'/></svg>",
            "isosceles_right_pentagon":"<svg width='100' height='50' version='1.1'><polygon points='1,1 99,1 99,40 50,49 1,40' style='fill:#fff;stroke:#000000;stroke-width:1'/></svg>",
            "isosceles_trapezoid":"<svg width='100' height='50' version='1.1'><polygon points='1,1 99,1 80,49 20,49' style='fill:#fff;stroke:#000000;stroke-width:1'/></svg>",
            "isosceles_sexangle":"<svg width='100' height='50' version='1.1'><polygon points='20,1 80,1 99,25 80,49 20,49 1,25' style='fill:#fff;stroke:#000000;stroke-width:1'/></svg>"
        }

        /**
         * 添加连接点
         * @method instance.addEndpoint
         * @param {String} shapeId 模块id.
         * @param {String} shapeTemplate 模块类型(形状).
         * @param {String} shapeText 模块的文本.
         * @param {String} result 根据shapeTemplate生成的对应形状dom
         */
        var checkTemplate = function(shapeId,shapeTemplate,shapeText){
            var commonFirstPart = "<div id=" + shapeId + " class='shape' data-shape= " + shapeTemplate + ">" +
                "                       <div class='component-text'>"+ shapeText +"</div> ";
            var commonLastPart =  " <div class='edit-label' style='display: none'>" +
                "                       <div class='choose-edit'>" +
                "                           <button class='add-text-button'>编辑文字</button>" +
                "                           <button class='delete-component-button'>删除组件</button>" +
                "                           <button class='cancle-edit-button'>取消</button>" +
                "                       </div>" +
                "                       <div class='text-editor' style='display: none'> " +
                "                           <input class='add-text' type='text' placeholder='编辑文字'>" +
                "                           <button class='confirm-add-text'>确认</button>" +
                "                           <button class='cancle-edit-button'>取消</button>" +
                "                       </div>" +
                "                   </div>" +
                "                </div>";
            var result = commonFirstPart +  shapeMap[shapeTemplate] + commonLastPart;
            return result;
        }


        /**
         * create shapes
         * @method addEndpoints 添加节点
         * @method bindClickEvent 添加点击事件，是元素能通过点击能够出现编辑的模态框
         * @method instance.draggable jsPlumb 生成的instance实例对象中实现元素在画布中拖动的方法
         * @param {Object} shapes 待生成组件的id style 形状 以及文本.
         */
        var createShapes = function(shapes){
            var shape_id,
                shape_style,
                shape_template,
                shape_text;

            $(shapes).each(function (index,element) {
                shape_id = element.id;
                shape_style = element.style;
                shape_template = element.template;
                shape_text = element.text;
            var newShape = checkTemplate(shape_id,shape_template,shape_text);
            $('.edit-space').append(newShape);
                $("#"+shape_id).css({
                    'top':element.style.top,
                    'left':element.style.left
                });
            addEndpoints(shape_id);
            bindClickEvent(shape_id);
            instance.draggable(shape_id);
            });
        }

        /**
         * create connections
         * @method instance.addEndpoint
         * @param {Object} connections 待生成连线的信息.
         */
        var createConnections = function(connections){
            // console.log(instance);
            var sourceId,targetId,sourceUUID,targetUUID,labelText;
            var conns = connections;
            $(conns).each(function (index,element) {
                sourceId = element.rel.sourceId;
                targetId = element.rel.targetId;
                sourceUUID = element.rel.sourceUUID;
                targetUUID = element.rel.targetUUID;
                labelText = element.label;
                instance.bind("connection", function (info) {
                    info.connection.getOverlay("label").setLabel(labelText);
                });
                instance.connect({uuids: [sourceUUID,targetUUID], editable: true});     //不知道为什么instance.bind要放在instance.connect前面，否则回调一次bind的回调函数。因为bind是添加默认事件，如果写在connect后的话第一次就无法初始化
            });
            instance.bind("connection", function (info) {
                info.connection.getOverlay("label").setLabel("");                       //重新绑定默认添加label事件
            });
        }
        /**
         * 后台数据生成流程
         * @param {String} info 待生成流程信息对象.
         * @method createShapes 生成图形
         * @method createConnections 生成连线
         * @method instance.deleteConnection 删除连线
         */
        var initGenerate = function (info) {
            var conns = info.conns_info;
            var shapes = info.shapes_info;
            createShapes(shapes);
            createConnections(conns);
        }

        var editCon;
        /**
         * 取消编辑(可将此按钮做成icon或者取消图片)
         */
        $(".edit-pop-cancel").click(function () {
            $pop_mask.hide();
            $edit_pop.hide();
        });
        /**
         * 点击确认按钮添加标签文本
         * @method instance.deleteConnection 删除连线
         * @method {connection}.getOverlay("label").setLabel(String);
         */
        $(".edit-pop-confirm").click(function () {
            editCon.getOverlay("label").setLabel($('.add-label-text').val());
            $pop_mask.hide();
            $edit_pop.hide();
        });
        /**
         * 点击删除按钮
         * @method instance.deleteConnection 删除连线
         */
        $(".edit-pop-delcon").click(function () {
            instance.deleteConnection(editCon);
            $pop_mask.hide();
            $edit_pop.hide();
        });

        /**
         * save
         * @method instance.getAllConnections() 获取所有连线信息
         * 通过点击触发保存事件
         * 该事件将分别储存shape信息和connection信息
         * shape信息通过获取编辑范围(画布)中类名为shape的元素
         * 通过其DOM操作遍历出其id，文本信息，形状，在画布上得到坐标
         * connection信息获取是通过实例对象instance的getAllConnections()方法得到所有连线信息组成的一个数组
         * 提取每个connection对象中的sourceId和targetId，并且通过其中的endpoints属性得到端点是shape上的哪个位置
         * 然后将sourceId、targetId分别同端点位置做字符串拼接，拼接成连线时需要的uuid（通过2个uuid可以确定一个连线）
         */
        $('button.flowchart-save-button').click(function () {
            var toSaveInfo = {};
            //组件信息
            var shapes_info = [];
            //遍历所有的shape并且收集遍历需要得到数据
            $('.edit-space .shape').each(function (index,element) {
                var shape_info = {};
                shape_info.id = element.getAttribute('id');
                shape_info.text = $(element).find('.component-text').html();
                shape_info.template = element.getAttribute('data-shape');
                shape_info.style = {
                    left:element.style.left,
                    top:element.style.top
                };
                shapes_info.push(shape_info);
            })

            //连接信息
            var conns_info = [];
            var connList = instance.getAllConnections();
            $(connList).each(function (index,element) {
                var conn_info = {};
                conn_info.label = connList[index].getOverlay('label').canvas.innerHTML;
                conn_info.rel = {
                    sourceId:element.sourceId,
                    targetId:element.targetId,
                    sourceUUID:element.sourceId+element.endpoints[0].anchor.type,
                    targetUUID:element.targetId+element.endpoints[1].anchor.type
                }
                conns_info.push(conn_info);
            });
            toSaveInfo.shapes_info = shapes_info;
            toSaveInfo.conns_info = conns_info;
            console.log(toSaveInfo);
        });

        instance.batch(function () {
            // 监听新添加的connection
            instance.draggable(jsPlumb.getSelector(".edit-space .shape"), { grid: [20, 20] });
            instance.bind("dblclick", function (conn, originalEvent) {
                $('.add-label-text').val('');
                $pop_mask.show();
                $edit_pop.show();
                editCon = conn;
            });
        });

        /**
         * 拖拽动组件
         **/
        $('.component-box .shape').draggable({
            helper:'clone',
            scope:'editor'
        });
        /**
         *释放组件，生成当前由时间戳的生成的唯一id
         * 判断组件类型生成相应的组件于editor
         * 并且绑定节点
         **/
        $('.edit-space').droppable({
            scope:'editor',
            drop:function(event,ui){
                /**
                 * 获取时间戳，利用时间戳产生唯一的id
                 **/
                var timestamp=new Date().getTime(),
                rand = Math.round(Math.random()*10),
                newId = "component_" + (timestamp+rand).toString(36);

                var shape_template = ui.draggable[0].dataset['shape'],
                    shape_text = "";

                // console.log(newId);
                var newShape = checkTemplate(newId,shape_template,shape_text);
                /**
                 * 添加新点的组件于画布
                 **/
                $(this).append(newShape);
                $("#"+newId).css({
                    'top':event.offsetY-30,
                    'left':event.offsetX-50
                });
                /**
                 * 添加拖拽
                 **/
                instance.draggable(newId);
                /**
                 * 添加endpoint
                 **/
                addEndpoints(newId);
                /**
                 * 双击编辑点击事件
                 **/
               bindClickEvent(newId);
            }
        });

        /**
         * ajax请求后台流程图数据
         */
        $.get("json/construction.json",function(data){
            if(data){
                initGenerate(data);
            }
        });

    });
})();
