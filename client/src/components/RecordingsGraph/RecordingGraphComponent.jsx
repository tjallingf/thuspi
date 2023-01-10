import { useRef, useEffect } from 'react';
import LoadingIcon from '../Icon/LoadingIcon';
import { Chart } from 'chart.js';

const RecordingGraphComponent = ({chartConfig}) => {
    const canvasRef = useRef(null);    

    useEffect(() => {
        if(typeof chartConfig == 'undefined') return;

        // get canvas context
        const ctx = canvasRef.current.getContext('2d');

        // initialize chart
        const chartInstance = new Chart(ctx, chartConfig);

        // destroy chart on component unmount
        return () => {
            chartInstance.destroy();
        }
    }, [chartConfig]);

    if(typeof chartConfig == 'undefined')
        return (
            <div className="recordings-graph">
                <LoadingIcon center="true" />
            </div>
        );

    return (
        <div className="recordings-graph h-100">
            <canvas className="recordings-graph-canvas" ref={canvasRef}></canvas>
        </div>
    )
}

export default RecordingGraphComponent;