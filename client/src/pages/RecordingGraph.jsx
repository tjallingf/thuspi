import { useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import Icon from '../components/Icon/Icon';
import RecordingGraphLegend from './components/RecordingGraphLegend';
import RecordingGraphComponent from './components/RecordingGraphComponent';
import { chartjs, exportAsFile } from '../app/recordings';
import useTranslate from '../hooks/useTranslate';
import useUser from '../hooks/useUser';

const RecordingGraph = ({from, until, limit}) => {
    const { id } = useParams();
    const [ datasets,    setDatasets ]    = useState(false);
    const [ format,      setFormat ]      = useState(false);
    const [ lineTension, setLineTension ] = useState(3);
    const user = useUser();

    from  = Date.now() - 1200000000;
    until = Date.now() + 10000;
    limit = limit || window.innerWidth / 2;

    useEffect(() => {
        // (async (from, until, limit) => 
        //     setDatasets(
        //         await useFetch(`devices/${id}/recordings`, {
        //             query: { from, until, limit }
        //         })
        //     )
        // )(from, until, limit);

        // (async () => {
        //     const deviceType = (await useFetch(`devices/${id}/`, {
        //         query: {
        //             filter: 'type'
        //         }
        //     })).type;

        //     const [extensionId, module] = deviceType.split('/');
            
        //     setFormat((await useFetch(`extensions/${extensionId}/device_types/`, {
        //         query: {
        //             filter: module
        //         }
        //     }))[deviceType]?.manifest?.reading?.format || []);
        // })();
    }, []);

    const handleLineTensionChange = ({value}) => {
        setLineTension(value);
    }

    const options = {
        lineTension: lineTension / 25
    }

    const chartConfig = chartjs.getChartConfig(datasets, format, options);

    const contextMenuItemsExport = [
        {
            id: 'recordings.exportCSV',
            icon: 'fal.file-csv',
            callback: exportAsFile,
            args: ['csv', id, from, until]
        },
        {
            id: 'recordings.exportJSON',
            icon: 'fal.brackets-curly',
            callback: exportAsFile,
            args: ['json', id, from, until]
        }
    ];

    return (
        <div className="RecordingGraph container-fluid h-100">
            <div className="row h-100">
                <div className="col h-100">
                    <div className="tile h-100">
                        <div className="tile__content h-100">
                            <RecordingGraphComponent chartConfig={chartConfig} />
                        </div>
                    </div>
                </div>
                <div className="col-12 col-lg-auto">
                    <div className="flex-row flex-lg-column h-100 w-100">
                        <div className="col">
                            <div className="tile h-100">
                                <div className="tile__content h-100">
                                    <div className="recordings-graph-sidebar container">
                                        {/* <h3>{thusPi.locale.translate('recordings.graph.sidebar.group.view.title')}</h3>
                                        <div className="recordings-graph-sidebar-group flex-row">
                                            <Icon name="wave-sine" size="md" color="blue" />
                                            <div className="px-md w-100">
                                                <InputRange min="0" value="0" max="10" onInput={handleLineTensionChange} />
                                            </div>
                                        </div> */}
                                        <h2>{useTranslate('recordings.graph.sidebar.group.data.title')}</h2>
                                        <div className="flex-row">
                                            {/* <button 
                                                    onClick={() => contextMenuExport.open()}
                                                    className={`btn active-btn-primary-dk`}>
                                                <Icon size="sm" name="download" color="blue" />
                                            </button> */}
                                            <button className={`btn active-btn-primary-dk ${!user.hasPermission(`recordings.${id}.write`) ? 'd-none' : ''}`}>
                                                <Icon size="sm" name="upload" color="blue" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-auto">
                            <div className="tile">
                                <div className="tile__content">
                                    <RecordingGraphLegend chartConfig={chartConfig} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RecordingGraph;