import { getCSSVariable, pageX, pageY, createIconNode } from './functions';
import { Chart } from 'chart.js';
import { formatDate, translate, formatNumber, convertNumber } from './locale';
import { getSetting } from './user';
import { getConfigItem } from './config';

function formatValue(type, value, precision, unit) {
    // convert value and unit to user's preferred system of units
    const systemOfUnits = getSetting('systemOfUnits');
    [value, unit] = convertNumber(value, type, systemOfUnits, unit);

    switch(type) {
        case 'time':
            return formatDate(value, 'long', 'long');
        case 'state':
            return translate(`generic.state.${value ? 'yes' : 'no'}`) + unit;
        default:
            return formatNumber(value, precision, true) + unit;
    }
}

async function exportAsFile(filetype, id, from, until) {
    return;
    const data = await useFetch(`devices/${id}/recordings`, {
        query: { filetype, from, until }
    });

    const URI = (filetype == 'csv' ? 'data:text/csv;charset=utf-8,' : 'data:text/plain;charset=utf-8,') + data;
    const encodedURI = encodeURI(URI);

    const a = document.createElement('a');
    a.setAttribute('href', encodedURI);
    a.setAttribute('download', `${id}.${filetype}`);

    // required for Firefox
    document.body.appendChild(a);

    // download the file
    a.click();

    // remove node after 15 seconds
    setTimeout(() => {
        document.body.removeChild(a);
    }, 15000);

    return true;
}

const chartjs = {
    getChartConfig(datasets, format, {lineTension = 0}) {
        if(!datasets || !format) return;
        
        // chart.js defaults
        Chart.defaults.font.size = 16;
        Chart.defaults.font.family = getCSSVariable('ff-main');

        // chart.js cursor positioner
        Chart.Tooltip.positioners.cursor = function(chartElements, coordinates) {
            return coordinates;
        };

        // used for getting labels
        let referenceDataset = Object.values(datasets)[0];
        if(typeof referenceDataset != 'object') 
            referenceDataset = [];
        
        const labels = [...referenceDataset.keys()];

        // chart.js config
        const chartConfig = {
            type: 'line',
            data: {
                labels: labels,

                // data sets will be added to this array later
                datasets: []
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        beginAtZero: false,
                        // type: 'time',
                        ticks: {
                            callback: (value, index, values) => {
                                return formatDate(referenceDataset[index]?.x, 'long', 'long')
                            },
                            font: {
                                size: 14
                            },
                            color: getCSSVariable('clr-text-muted'),
                            source: 'data',
                            autoSkip: true
                        },
                        grid: {
                            color: getCSSVariable('clr-primary')
                        }
                    },
                    y: {
                        beginAtZero: false,
                        grid: {
                            color: getCSSVariable('clr-primary')
                        },
                        ticks: {
                            color: getCSSVariable('clr-text-muted')
                        }
                    }
                },
                elements: {
                    point: {
                        radius: 0,
                        hoverRadius: 2,
                        borderWidth: 0,
                        hoverBorderWidth: 0
                    },
                    line: {
                        borderWidth: 1
                    }
                },
                animations: false,
                events: ['mousemove', 'mouseenter', 'mouseout'],
                plugins: {
                    tooltip: {
                        enabled: false,
                        position: 'cursor',
                        external: chartjs.tooltipHandler
                    },
                    legend: {
                        display: false
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index',
                }
            }
        }

        // add datasets to Chart.js config
        Object.entries(datasets).forEach(([key, dataset]) => {
            let datasetFormat = format[key];

            // return if no format is found for this dataset
            if(typeof datasetFormat == 'undefined') return true;

            // set default dataset type to 'value'
            if(typeof datasetFormat?.type == 'undefined') datasetFormat.type = 'value';

            const { icon: defaultIcon, unit: defaultUnit } = getConfigItem('recording_axis_types')[datasetFormat?.type] || [];
            const colorValue = getCSSVariable(typeof datasetFormat?.color == 'string' ? `clr-${datasetFormat.color}` : 'red') || getCSSVariable('clr-text-primary');

            chartConfig.data.datasets.push({
                label: datasetFormat?.title || translate(`recordings.graph.axisType.${datasetFormat.type}.title`) || key || datasetFormat.type,
                data: dataset,
                borderColor: colorValue,
                lineTension: lineTension,
                elements: {
                    point: {
                        hoverBackgroundColor: colorValue
                    }
                },
                format: {
                    type: datasetFormat?.type,
                    color: datasetFormat?.color || 'red',
                    icon: datasetFormat?.icon || defaultIcon || 'fal.question-circle',
                    unit: datasetFormat?.unit || defaultUnit || '',
                    precision: typeof datasetFormat?.precision == 'undefined' ? 1 : datasetFormat.precision
                }
            })
        })

        return chartConfig;
    },

    tooltipHandler({tooltip, chart}) {
        let tooltipEl = document.getElementById('chartjs-tooltip');

        // create element on first render
        if (!tooltipEl) {
            tooltipEl           = document.createElement('div');
            tooltipEl.id        = 'chartjs-tooltip';
            tooltipEl.classList = 'tooltip';
            tooltipEl.innerHTML = '<h3 class="tile-title mb-2"></h3><ul class="tile__content flex-column gy-1"></ul>';
            chart.canvas.parentNode.appendChild(tooltipEl);
        }

        const tooltipTitleEl   = tooltipEl.firstChild;
        const tooltipContentEl = tooltipEl.lastChild;

        // hide tooltip if it should not be visible
        if (tooltip.opacity === 0) {
            tooltipEl.classList.remove('show');
            return;
        } else {
            tooltipEl.classList.add('show');
        }

        // move tooltip to mouse position
        tooltipEl.style.top  = pageY + 'px';
        tooltipEl.style.left = pageX + 'px';
        
        tooltipEl.classList.toggle('transform-x-n100', pageX >= (window.innerWidth / 2));

        // set title to time of recording
        tooltipTitleEl.innerText = formatDate(tooltip.dataPoints[0].raw.x, 'exact', 'long');

        // clear content
        tooltipContentEl.innerHTML = '';

        // add rows to content
        tooltip.dataPoints.forEach(datapoint => {
            const dataset = datapoint.dataset;
            const value   = typeof datapoint.raw?.y == 'undefined' ? datapoint.raw?.x : datapoint.raw?.y;

            const rowEl = document.createElement('li');
            rowEl.classList = 'flex-row';
            
            // create icon element
            const iconEl = createIconNode({name: dataset.format.icon, size: 'sm', color: dataset.format.color, classList: 'graph-tooltip-item-icon'});
            
            // create label element
            const labelEl     = document.createElement('span');
            labelEl.innerText = dataset.label;

            // create value element
            const valueEl     = document.createElement('span');
            valueEl.classList = 'text-muted ms-auto';
            valueEl.innerText = formatValue(dataset.format.type, value, dataset.format.precision, dataset.format.unit);
            
            // append children
            rowEl.appendChild(iconEl)
            rowEl.appendChild(labelEl);
            rowEl.appendChild(valueEl);

            // append row to content
            tooltipContentEl.appendChild(rowEl);
        })
    }
}

export { formatValue, exportAsFile, chartjs };