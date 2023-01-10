import { useState, useEffect } from 'react';
import Icon from '../Icon/Icon';
import InputSwitch from '../Input/InputSwitch';
import InputColorPicker from '../Input/InputColorPicker';
import Tile from '../Tile/Tile';
import InputSlider from '../Input/InputSlider';
import InputSearch from '../Input/InputSearch';
import useUser from '../../hooks/useUser';
import useTranslate from '../../hooks/useTranslate';
import useExtensionManifest from '../../hooks/useExtensionManifest';
import Button from '../Button';
import axios from 'axios';
import '../../styles/components/Device.scss';
import { useDebouncedCallback } from 'use-debounce';
import { get, find, map, set } from 'lodash';

const Device = ({ id, name, icon, driver, group, data }) => {
    const [ driverExtId, driverItemName ] = driver.type.split('/'); 
    const [ manifest, setManifest ] = useState(useExtensionManifest(driverExtId, `device_drivers/${driverItemName}`));
    const user = useUser();

    group = group || {
        color: 'primary'
    }
    
    useEffect(() => {
        (async () => {
            if(manifest?.writing?.dynamicInputs) {
                const dynamicManifest = (await axios.get(`api/devices/${id}/driver-manifest`)).data;
                setManifest(dynamicManifest);
            }
        })();
    }, []);

    const callInputEndpoint = (name, value) => {
        axios.patch(`api/devices/${id}/input`, {
            name: name,
            value: value
        }).then(({ status, data }) => {
            if(status != 200) return console.error('An error occured.');
            setManifest(data.driverManifest);
        })
    }

    const callSearchEndpoint = async keyword => {
        return (await axios.get(`api/devices/${id}/search`, {
            params: {
                keyword: keyword
            }
        })).data?.results || [];
    }

    const callInputEndpointDebounced = useDebouncedCallback(callInputEndpoint, manifest?.writing?.debounce || 500);
    const callButtonEndpoint = (name) => callInputEndpoint(name, Date.now());

    let numberOfSearchInputs = 0;
    const renderInput = input => {
        if(!input?.type || !input?.name) return;

        const value = get(data?.values, input.name);

        switch(input.type) {
            case 'switch':
                return (
                    <InputSwitch 
                        onChange={e => callInputEndpoint(input.name, e.value)} 
                        accent={group.color}
                        value={value} />
                );
            case 'color':
                return (
                    <InputColorPicker 
                        accent={group.color}
                        value={value}
                        onChange={e => callInputEndpointDebounced(input.name, e.value)} />
                );
            case 'range':
                const symbol = manifest?.writing?.input?.symbol 
                    ? useTranslate(`device_drivers.${driverItemName}.input.symbol`, null, driverExtId) 
                    : '';

                return (
                    <InputSlider 
                        onChange={e => callInputEndpoint(input.name, e.value)} 
                        accent={group.color}
                        min={manifest?.writing?.input?.min}
                        max={manifest?.writing?.input?.max}
                        step={manifest?.writing?.input?.step}
                        symbol={symbol} />
                );
            case 'search':
                if(numberOfSearchInputs === 1)
                    return console.warn(`A device cannot have more than one search input, found multiple search inputs in <Device ${name}:${id}>.`);
                numberOfSearchInputs++;

                return (
                    <InputSearch 
                        onChange={e => callInputEndpoint(input.name, e.result.value)} 
                        handleSearch={callSearchEndpoint}
                        accent={group.color}
                        icon={input.icon}
                        debounceDelay={1000} />
                );
            case 'button':
                return renderButton(input);
            default:
                return;
        }
    }

    console.log(name, manifest.writing);

    const renderInputs = () => {
        // Return if the device doesn't have any writing inputs
        if(!manifest?.writing?.inputs?.length || typeof manifest?.writing?.inputs != 'object') return;

        // console.log(manifest.writing.inputs, manifest.writing.displayInputs);
        // Display writing inputs in order if no custom display is defined
        if(!manifest?.writing?.displayInputs?.length) {
            return (
                <div className="flex-row w-100">
                    {manifest.writing.inputs.map(input => renderInput(input))}
                </div>
            );
        }

        return map(manifest.writing.displayInputs, row => (
            <div className="flex-row w-100">
                {map(row, inputName => {
                    const input = find(manifest.writing.inputs, ['name', inputName]);
                    return renderInput(input);
                })}
            </div>
        ))
    }

    const renderButton = (input) => {
        return (
            <Button 
                    size={input.text ? 'md' : 'sm'} 
                    accent={input.background || ['primary', 700]} 
                    color={input.color || 'text-secondary'}
                    onClick={() => callButtonEndpoint(input.name)}>
                {input.icon && <Icon name={input.icon} size="sm" />}
                {input.text && useTranslate(`device_drivers.${driverItemName}.input.${input.name}.text`, null, driverExtId) || input.text}
            </Button>
        )
    }

    return (
        <div className={`Device col-6 col-md-4 col-lg-3 col-xl-2`}>
            <Tile title={name} iconName={icon || 'question-circle'} iconColor={group.color}>
                <div className="flex-column h-100">
                    <div className="Device__input-container mb-auto flex-column">
                        {user.hasPermission(`devices.write.${id}`) && 
                         manifest?.writing?.supported === true && 
                            renderInputs()}
                    </div>
                    <div className="flex-row mt-auto ms-auto">
                        <Button variant="chip" accent={['primary', 700]} color="text-primary">
                            <Icon name="list" size="xs"></Icon>
                        </Button>
                        {user.hasPermission(`devices.manage.${id}`) && (
                            <Button to={`/admin/devices/${id}`} variant="chip" accent={['primary', 700]} color="text-primary">
                                <Icon name="cog" size="xs"></Icon>
                            </Button>
                        )}
                    </div>
                </div>
            </Tile>
        </div>
    )
}

export default Device;