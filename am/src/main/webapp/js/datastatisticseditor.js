/**
 *
 */
;
(function ($, window, document, undefined) {
    var pluginName = "dataStatisticsEditor";
    var defaults = {
        id: "",
        cid: "",
        basicpropsheet: "",
        propsheet: "",
        width: "",
        height: "",
        parent: "",
    };

    var Editor = function (element, options) {
        this.element = element;
        this.options = $.extend({
            id: "",
            cid: "",
            basicpropsheet: "",
            propsheet: "",
            width: "",
            height: "",
            parent: "",
        }, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.stack = options.parent.stack;
        this.basicpropsheet = options.basicpropsheet;
        this.propsheet = options.propsheet;
        this.init(options);
    };

    Editor.prototype.init = function (options) {
        this.color = new Array('#FF7F24', '#FF0000', '#66CDAC', '#808080', '#87CEFA', '#2F4F4F')

        var editorPanel = document.createElement("DIV");
        this.element.appendChild(editorPanel);
        editorPanel.id = "visitingEditingPanel" + options.cid;
        // options.width is initial width
        editorPanel.style.width = options.width + "px";
        editorPanel.className = "row";
        editorPanel.style.margin = "0px";
        editorPanel.style.padding = "0px";
        editorPanel.style.overflow = "auto";

        var canvasPanel = document.createElement("DIV");
        editorPanel.appendChild(canvasPanel);
        canvasPanel.className = "col";
        canvasPanel.id = "visitcount" + options.cid;
        canvasPanel.style.height = (options.height) + "px";
        canvasPanel.style.margin = "0px";
        canvasPanel.style.marginLeft = "0px";
        canvasPanel.style.padding = "0px";

        this.div1 = document.createElement("DIV");
        canvasPanel.appendChild(this.div1);
    };

    Editor.prototype.initChart = function (parent, data, xArrayData, color, yArrayData, id) {
        var myChart = echarts.init(parent);
        var option = {
            title: {
                text: ''
            },
            tooltip: {},
            // legend: {
            //     data: ['存储量']
            // },
            xAxis: {
                data: xArrayData
            },
            yAxis: {},
            series: [{
                // name: '存储量',
                type: 'line',
                label: {
                    show: true,
                    position: 'top',
                    formatter: '{c}'
                },
                data: yArrayData
            }]
        };
        var that = this;
        myChart.setOption(option);
        myChart.id = id;
        myChart.on('click', function (params) {
            that.doMyChartClick(params);
        });
    };

    Editor.prototype.doMyChartClick = function (params) {
        if (params != null) {
        }
    };

    Editor.prototype.loading = function (type) {
        $("#progressbar").show();
        var that = this;
        var xArray = new Array();
        var yArray = new Array();
        $.post(service.api(29), {
            cid: this.options.cid,
            oid: this.options.ownerId,
            type: type
        }).complete(function (data) {
            data = JSON.parse(data.responseText);
            if (data != null && data != undefined) {
                for (key in data) {
                    xArray.push(key);
                    yArray.push(data[key])
                }
                that.loadData(xArray, yArray);
            }
            $("#progressbar").hide();
        });
    };

    Editor.prototype.loadData = function (xArrayData, yArrayData) {
        this.initDiv1(this.div1, "服务器访问量", xArrayData, this.color, yArrayData, 1);
    };

    Editor.prototype.initDiv1 = function (parent, title, xArrayData, color, yArrayData, id) {
        $(parent).children().remove();
        var div1 = document.createElement("DIV");
        parent.appendChild(div1);
        div1.style.width = "1300px";
        div1.style.height = "300px";
        this.initChart(div1, "", xArrayData, color, yArrayData, id);
    };

    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, pluginName)) {
                $.data(this, pluginName, new Editor(this, options));
            } else if ($.isFunction(Plugin.prototype[options])) {
                $.data(this, pluginName)[options]();
            }
        });
    };
})(jQuery, window, document);