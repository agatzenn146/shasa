$(document).ready(function() {


    //--Nested Pie echarts init-->

    var dom = document.getElementById("np-Pie");
    var npChart = echarts.init(dom);

    var app = {};
    option = null;
    option = {
        color: ['#62549a','#4aa9e9', '#ff6c60','#eac459', '#25c3b2', '#6BB18C', '#EBCB94', '#EF9688', '#043D5D', '#B8959B' ],
        tooltip : {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
            orient : 'vertical',
            x : 'left',
            data:['Wimpol','Wiwic','Wimcap','Big Sister Program','Round table lunches','Individual & Corporate mentoring','Int womens day','CEO interactive series']
        },
        calculable : false,
        series : [
            {
                name:'Source',
                type:'pie',
                selectedMode: 'single',
                radius : [0, 50],

                // for funnel
                x: '20%',
                width: '40%',
                funnelAlign: 'right',
                max: 1548,

                itemStyle : {
                    normal : {
                        label : {
                            position : 'inner'
                        },
                        labelLine : {
                            show : false
                        }
                    }
                },
                data:[
                    {value:335, name:'Wimcap'},
                    {value:679, name:'Wiwic'},
                    {value:1548, name:'Wimpol', selected:true}
                ]
            },
            {
                name:'Source',
                type:'pie',
                radius : [80, 100],

                // for funnel
                x: '60%',
                width: '35%',
                funnelAlign: 'left',
                max: 1048,

                data:[
                    {value:335, name:'Wimcap'},
                    {value:310, name:'Wiwic'},
                    {value:234, name:'Wimpol'},
                    {value:135, name:'Big Sister Program'},
                    {value:1048, name:'Round Table Lunches'},
                    {value:251, name:'Corporate Mentoring'},
                    {value:147, name:'Int Womens Day'},
                    {value:102, name:'CEO Interactive series'}
                ]
            }
        ]
    };

    if (option && typeof option === "object") {
        npChart.setOption(option, false);
    }

    //--Rainfall and Evaporation echarts init-->

    var dom = document.getElementById("rainfall");
    var rainChart = echarts.init(dom);

    var app = {};
    option = null;
    option = {
        color: ['#4aa9e9','#67f3e4'],
        tooltip : {
            trigger: 'axis'
        },
        legend: {
            data:['Sale','Market']
        },
        calculable : true,
        xAxis : [
            {
                type : 'category',
                data : ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
            }
        ],
        yAxis : [
            {
                type : 'value'
            }
        ],
        series : [
            {
                name:'Sale',
                type:'bar',
                data:[2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
                markPoint : {
                    data : [
                        {type : 'max', name: 'Max'},
                        {type : 'min', name: 'Min'}
                    ]
                },
                markLine : {
                    data : [
                        {type : 'average', name: 'Average'}
                    ]
                }
            },
            {
                name:'Market',
                type:'bar',
                data:[2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3],
                markPoint : {
                    data : [
                        {name : 'Max', value : 182.2, xAxis: 7, yAxis: 183, symbolSize:18},
                        {name : 'Min', value : 2.3, xAxis: 11, yAxis: 3}
                    ]
                },
                markLine : {
                    data : [
                        {type : 'average', name : 'Average'}
                    ]
                }
            }
        ]
    };

    if (option && typeof option === "object") {
        rainChart.setOption(option, false);
    }

    /**
     * Resize chart on window resize
     * @return {void}
     */
    window.onresize = function() {
        rainChart.resize();
        npChart.resize();

    };


});
