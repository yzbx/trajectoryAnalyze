//global var
//SVGMouseModel  0="normal", 1="drawRect(MenuSearch)", 2="drawTrjectory(MenuMatch)"
window.SVGMouseModel = 1;
window.SVGrectpoints = new Array();
window.SVGstartrect = new Array();
window.SVGendrect = new Array();
window.SVGdata = null;

window.SVGx = null;
window.SVGy = null;
//global function

function SVGmousemove() {
    var point = d3.mouse(this);

    // if(window.SVGMouseModel==0){    
    //     console.log(point);
    //     console.log("-->");
    //     console.log(window.SVGx.invert(point[0])+","+window.SVGy.invert(point[1]));
    //     console.log("-->margin");
    //     console.log(window.SVGx.invert(point[0]-window.margin.left)+","+window.SVGy.invert(point[1]-window.margin.top));
    // }
    // else 

    if (window.SVGMouseModel == 1) {
        if (window.SVGrectpoints.length != 1) return;
        var svg = d3.select("svg");
        d3.select(".SVGrect").remove();
        // svg.remove(".SVGrect");
        var rect = svg.append("rect")
            .attr("x", Math.min(point[0], window.SVGrectpoints[0][0]))
            .attr("y", Math.min(point[1], window.SVGrectpoints[0][1]))
            .attr("width", Math.abs(point[0] - window.SVGrectpoints[0][0]))
            .attr("height", Math.abs(point[1] - window.SVGrectpoints[0][1]))
            .attr("class", "SVGrect");

        // console.log("mousemove"+d3.mouse(this));
    } else if (window.SVGMouseModel == 2) {
        mouseMoveEvent(point[0], point[1]);
    }

}

function SVGmousedown() {
    var point = d3.mouse(this);

    if (window.SVGMouseModel == 1) {
        document.onselectstart = function() { return false; } // disable drag-select
        document.onmousedown = function() { return false; } // disable drag-select

        window.SVGrectpoints = new Array();
        // point[0]=window.SVGx.invert(point[0]);
        // point[1]=window.SVGx.invert(point[1]);
        window.SVGrectpoints[0] = point;
        console.log("mousedown" + point);

        d3.selectAll(".dot").attr("opacity",1);
    } else if (window.SVGMouseModel == 2) {
        mouseDownEvent(point[0], point[1]);
    }
}

function SVGmouseup() {
    var point = d3.mouse(this);
    if (window.SVGMouseModel == 1) {
        document.onselectstart = function() { return true; } // enable drag-select
        document.onmousedown = function() { return true; } // enable drag-select

        // point[0]=window.SVGx(point[0]);
        // point[1]=window.SVGx(point[1]);
        window.SVGrectpoints[1] = point;
        if (window.SVGstartrect.length==0) {
            window.SVGstartrect = window.SVGrectpoints;
            window.SVGstartrect[0][0] = window.SVGx.invert(window.SVGstartrect[0][0] - window.margin.left);
            window.SVGstartrect[0][1] = window.SVGy.invert(window.SVGstartrect[0][1] - window.margin.top);
            window.SVGstartrect[1][0] = window.SVGx.invert(window.SVGstartrect[1][0] - window.margin.left);
            window.SVGstartrect[1][1] = window.SVGy.invert(window.SVGstartrect[1][1] - window.margin.top);
        } else {
            window.SVGendrect = window.SVGrectpoints;
            window.SVGendrect[0][0] = window.SVGx.invert(window.SVGendrect[0][0] - window.margin.left);
            window.SVGendrect[0][1] = window.SVGy.invert(window.SVGendrect[0][1] - window.margin.top);
            window.SVGendrect[1][0] = window.SVGx.invert(window.SVGendrect[1][0] - window.margin.left);
            window.SVGendrect[1][1] = window.SVGy.invert(window.SVGendrect[1][1] - window.margin.top);

            var startpoints = new Array();
            var endpoints = new Array();
            var status = new Array();
            for (var i = 0; i < window.SVGdata.length; i++) {
                var len = startpoints.length;
                if (startpoints.length <= window.SVGdata[i].object_id) {
                    startpoints[len] = i;
                    if (i != 0) {
                        endpoints[len - 1] = i - 1;
                    }
                }
            }
            endpoints[startpoints.length - 1] = window.SVGdata.length - 1;

            for (var i = 0; i < startpoints.length; i++) {
                var start = window.SVGdata[startpoints[i]];
                // if (i > startpoints.length - 10) console.log(endpoints[i]);
                var endp = window.SVGdata[endpoints[i]];

                if ((start.x_center < Math.max(SVGstartrect[0][0], SVGstartrect[1][0]) &&
                        start.x_center > Math.min(SVGstartrect[0][0], SVGstartrect[1][0]) &&
                        start.y_center < Math.max(SVGstartrect[0][1], SVGstartrect[1][1]) &&
                        start.y_center > Math.min(SVGstartrect[0][1], SVGstartrect[1][1])) &&
                    (endp.x_center < Math.max(SVGendrect[0][0], SVGendrect[1][0]) &&
                        endp.x_center > Math.min(SVGendrect[0][0], SVGendrect[1][0]) &&
                        endp.y_center < Math.max(SVGendrect[0][1], SVGendrect[1][1]) &&
                        endp.y_center > Math.min(SVGendrect[0][1], SVGendrect[1][1]))) {
                    status[i] = true;
                } else {
                    status[i] = false;
                }
            }

            // console.log("rect"+Math.max(SVGstartrect[0][0],SVGstartrect[1][0])+","+
            //     Math.min(SVGstartrect[0][0],SVGstartrect[1][0])+","+
            //     Math.max(SVGstartrect[0][1],SVGstartrect[1][1])+","+
            //     Math.min(SVGstartrect[0][1],SVGstartrect[1][1]));

            d3.selectAll(".dot").attr("opacity", function(d, i) {
                if (status[window.SVGdata[i].object_id]) return 1;
                else return 0;
                // if(startpoints[SVGdata[i].object_id]==i||endpoints[SVGdata[i].object_id]==i)    return 1;
                // else return 0;
            });

            window.SVGstartrect=new Array();
            window.SVGendrect=new Array();
            window.SVGrectpoints=new Array();
        }
        console.log("mouseup" + point);
    } else if (window.SVGMouseModel == 2) {
        mouseUpEvent(point[0], point[1]);
        d3.selectAll("path.gesture").remove();
    }


}

function MenuSearch() {
    window.SVGMouseModel = 1;
}

function MenuMatch() {
    window.SVGMouseModel = 2;
}

function MenuShowHotmap() {

}

function MenuAnalyzeAbnormality() {

}

function MenuReset() {
    window.SVGMouseModel = 0;
    window.SVGrectpoints = new Array();
    window.SVGstartrect = null;
    window.SVGendrect = null;

    d3.selectAll(".dot").attr("opacity", 1);
    d3.select(".SVGrect").remove();
}

function SVGmatch(points){
    for(var i=0;i<points.length;i++){
        points[i].X=window.SVGx.invert(points[i].X-window.margin.left);
        points[i].Y=window.SVGy.invert(points[i].Y-window.margin.top);
    }

    var trajectories=new Array();
    var object=new Array();
    var currentObjectId=0;
    var p;
    for(var i=0;i<window.SVGdata.length;i++){
        if(window.SVGdata[i].object_id==currentObjectId){
            p=new Point(window.SVGdata[i].x_center,window.SVGdata[i].y_center);
            object.push(p);
        }
        else{
            currentObjectId+=1;
            trajectories.push(object);
            object=new Array();

            p=new Point(window.SVGdata[i].x_center,window.SVGdata[i].y_center);
            object.push(p);
        }
    }

    var result=new Array();
    console.log("before resample ");
    console.log(points);
    points=Resample(points,NumPoints);
    console.log("after resample");
    console.log(points);
    for(var i=0;i<trajectories.length;i++){
        trajectories[i]=Resample(trajectories[i],NumPoints);

        var distance=PathDistance(points,trajectories[i]);
        var radian1 = IndicativeAngle(points);
        var radian2 = IndicativeAngle(trajectories[i]);
        var len1=PathLength(points);
        var len2=PathLength(trajectories[i]);

        distance=distance/200+Math.abs(radian1-radian2)+(len1/len2+len2/len1)/2;
        result.push(distance);
    }

    var cloneArray=new Array();
    for(var i=0;i<result.length;i++){
        cloneArray.push(result[i]);
    }
    var sortResult=quickSort(cloneArray);

    var returnNum=Math.min(5,sortResult.length);
    var threshold=Math.min(sortResult[returnNum],500);
    for(var i=0;i<returnNum;i++){
        console.log("sort distance ...." + sortResult[i]);
        console.log("distance ... "+result[i]);
    }

    var ret=new Array();
    for(var i=0;i<result.length;i++){
        if(result[i]<threshold) ret.push(true);
        else ret.push(false);
    }
    return ret;
}

function quickSort(array) {
    //var array = [8,4,6,2,7,9,3,5,74,5];
    //var array = [0,1,2,44,4,324,5,65,6,6,34,4,5,6,2,43,5,6,62,43,5,1,4,51,56,76,7,7,2,1,45,4,6,7];
    var i = 0;
    var j = array.length - 1;
    var Sort = function(i, j) {

        // 结束条件
        if (i == j) {
            return
        };

        var key = array[i];
        var stepi = i; // 记录开始位置
        var stepj = j; // 记录结束位置
        while (j > i) {
            // j <<-------------- 向前查找
            if (array[j] >= key) {
                j--;
            } else {
                array[i] = array[j]
                //i++ ------------>>向后查找
                while (j > ++i) {
                    if (array[i] > key) {
                        array[j] = array[i];
                        break;
                    }
                }
            }
        }

        // 如果第一个取出的 key 是最小的数
        if (stepi == i) {
            Sort(++i, stepj);
            return;
        }

        // 最后一个空位留给 key
        array[i] = key;

        // 递归
        Sort(stepi, i);
        Sort(j, stepj);
    }

    Sort(i, j);

    return array;
}