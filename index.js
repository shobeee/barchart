const width = 800;
const height = 400;
const margin = { top: 20, right: 60, bottom: 20, left: 60 };


d3.json("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json")
  .then(data=>{
    const years = data.data.map(singleData=> {
       const dateData = singleData[0].substring(0,4)
       return new Date(dateData,0,0)
    });

    const barWidth = (width - margin.left - margin.right) / years.length*4;

    const minYear = new Date(d3.min(years));
    const maxYear =new Date(d3.max(years));
    const xScale = d3.scaleTime().domain([minYear,maxYear]).range([0,width - margin.left - margin.right]);
    const xAxis = d3.axisBottom(xScale);

    const gdp = data.data.map(gdpValue=> {
        return gdpValue[1]
    })
    const tooltip = d3
  .select("#vis")
  .append("div")
  .attr("id", "tooltip")
  .style("opacity", 0)
  .style("position", "absolute")
  .style("background-color", "#cc0d0d")
  .style("padding", "10px")
  .style("border-radius", "5px")
  .style("box-shadow", "0 0 10px rgba(0,0,0,0.5)")
  .style("pointer-events", "none");

    const maxGdp = d3.max(gdp);
    const minGdp = d3.min(gdp);
    const yScale = d3.scaleLinear().domain([0,maxGdp]).range([height - margin.top - margin.bottom, 0]);
    const yAxis = d3.axisLeft(yScale)

    const svg = d3.select("#vis")
      .append("svg")
      .attr("width",width)
      .attr('height',height)
      .style("background-color",'#87CEEB')
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("g")
      .attr("id","x-axis")
      .call(xAxis)
      .attr("transform","translate(0," + (height - margin.top - margin.bottom) + ")");

    svg.append("g")
      .attr("id","y-axis")
      .call(yAxis);

    svg.selectAll("rect")
      .data(data.data)
      .enter()
      .append("rect")
      .attr("data-date",(d,i)=>data.data[i][0])
      .attr('data-gdp',(d,i)=>data.data[i][1])
      .attr("x", (d, i) => xScale(years[i]))
      .attr("y",(d,i)=>yScale(d[1]))
      .attr("class","bar")
      .attr('width',barWidth)
      .attr("height",(d,i)=>height - margin.top - margin.bottom - yScale(d[1]))
      .on("mouseover", (event, d) => {
        tooltip
          .transition()
          .duration(500)
          .style("opacity", 0.7);
        tooltip
          .html(d[0] + "<br>" + '$'+" "+d[1])
          .attr("data-date", d[0])
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY +28 + "px");
      })
      .on("mouseout", () => {
        tooltip.transition()
          .duration(500)
          .style("opacity", 0);
      });
    
      


    svg.append("text")
      .text("Gross Domestic Product")
      .attr("x",200)
      .attr("y",100)


})
