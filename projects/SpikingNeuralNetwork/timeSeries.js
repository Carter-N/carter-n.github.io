class TimeSeries{

    constructor(width, height, axisMargin, threshold, limit){
        this.width = width;
        this.height = height;
        this.axisMargin = axisMargin;
        this.threshold = threshold;
        this.limit = limit;

        this.data = [];
        this.time = 0;

        this.setup();
    }

    setup(){

        //SVG canvas
        this.svg = d3.select(".graph").append("svg")
            .attr("width", this.width)
            .attr("height", this.height);

        //Scales
        this.x = d3.scaleLinear()
            .domain([-this.limit, 0])
            .range([0, this.width - this.axisMargin * 2]);

        this.y = d3.scaleLinear()
            .domain([0, 1])
            .range([this.height - this.axisMargin * 2, 0]);

        //Line and axis
        this.line = d3.line()
            .x(function(d){return this.x(d.time);}.bind(this))
            .y(function(d){return this.y(d.energy);}.bind(this));

        this.XAxis = this.svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(" + this.axisMargin + "," + (this.height - this.axisMargin) + ")")
            .call(d3.axisBottom(this.x));

        this.YAxis = this.svg.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(" + this.axisMargin + "," + this.axisMargin + ")")
            .call(d3.axisLeft(this.y));

        //Line path
        this.svg.append("path")
            .data([this.data])
            .attr("class", "line")
            .attr("transform", "translate(" + this.axisMargin + "," + this.axisMargin + ")")
            .attr("d", this.line);

        //Threshold indicator
        this.thresholdIndicator = this.svg.append("rect")
            .attr("x", this.axisMargin)
            .attr("y", this.axisMargin + this.y(this.threshold))
            .attr("width", this.width - this.axisMargin * 2)
            .attr("height", 1);
    }

    tick(d){
        this.time++;

        if(this.data.length > this.limit - 1){
            this.data.shift();
        }

        this.data.push({
            "time": this.time,
            "energy": d
        });

        this.x = d3.scaleLinear()
            .domain([-this.limit + this.time, this.time])
            .range([0, this.width - this.axisMargin * 2]);

        this.XAxis
            .attr("transform", "translate(" + this.axisMargin + "," + (this.height - this.axisMargin) + ")")
            .call(d3.axisBottom(this.x));

        this.svg.select(".line")
            .data([this.data])
            .attr("class", "line")
            .attr("transform", "translate(" + (this.axisMargin - this.width / this.limit) + "," + this.axisMargin + ")")
            .attr("d", this.line);
    }
}