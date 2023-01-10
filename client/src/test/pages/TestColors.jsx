import Button from '../../components/Button';
import Icon from '../../components/Icon/Icon';
import { capitalize } from 'lodash';

const Colors = () => {
    const colors = [
        'red',
        'orange',
        'yellow',
        'green',
        'blue',
        'cyan',
        'purple',
        'violet',
        'magenta',
        'brown',
        'gray'
    ];

    return (
        <div className="container-fluid p-5">
            <div className="col-3 col-md-2 col-xl-1"><h2>Color</h2></div>
            {
                colors.map(name => {
                    return (
                        <div className="row">
                            <div className="col-3 col-md-2 col-xl-1">{capitalize(name)}</div>
                            <div className="col-7 col-sm-5 col-md-4 flex-row">
                                <Button variant="primary" color={name}><Icon name="circle-1" />Primary</Button>
                                <Button variant="secondary" color={name}><Icon name="circle-2" />Secondary</Button>
                            </div>
                            <div className="col flex-row gx-0">
                                {[...Array(9)].map((e, i) => (
                                    <div style={{
                                        background: `var(--${name}-${(i+1)*100})`,
                                        width: 'calc(100%/9)',
                                        height: '100%'
                                    }}></div>
                                ))}
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default Colors;