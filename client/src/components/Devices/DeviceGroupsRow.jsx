import { useState } from 'react';
import Icon from '../Icon/Icon';
import Repeat from '../Repeat';
import Button from '../Button';
import Show from '../Show';
import { map } from 'lodash';

const DeviceGroupsRow = ({ groups, onChange, asSkeleton = false }) => {
    const [ selected, setSelected ] = useState('__ALL__');

    return (
        <Show when={groups}>
            <div className="flex-row flex-nowrap full-bleed">
                {map(groups, (group, id) => (
                    <Button 
                            key={id}
                            onClick={() => { setSelected(id); onChange(id == '__ALL__' ? false : id); }}
                            isActive={selected == id}
                            accent={group.color}>
                        <Icon size="sm" name={group.icon} />
                        <span>{group.name || id}</span>
                    </Button>
                ))}
            </div>
        </Show>
    )
}

export default DeviceGroupsRow;