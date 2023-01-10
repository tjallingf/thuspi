import { useState, useRef, cloneElement } from 'react';
import InputText from './InputText';
import Icon from '../Icon/Icon';
import Input from './Input';
import useOutsideListener from '../../hooks/useOutsideListener';
import ContextMenu from '../Modal/ContextMenu';
import { emitEvent, isVisible } from '../../app/functions';
import useTranslate from '../../hooks/useTranslate';
import Button from '../Button';
import '../../styles/components/inputs/InputSearch.scss';

const InputSearch = ({ handleSearch, onChange, placeholder, className, icon = 'search', accent, debounceDelay = 100 }) => {
    const inputRef = useRef(null);
    const inputGhostRef = useRef(null);
    const triggerRef = useRef(null);
    const wrapperRef = useRef(null);
    const [ results, setResults ] = useState([]);
    let [ lastResultTitle ] = useState('');

    // Use a default placeholder
    placeholder = placeholder || useTranslate('generic.action.search');

    const renderHeader = () => {
        return (
            <div className="InputSearchHeader">
                <Input type="search" accent={accent} className={className}>
                    <div className="input-group">
                        <InputText 
                            ref={inputGhostRef}
                            placeholder={placeholder} />
                        <Button 
                                variant="primary-invert"
                                accent={['primary', 800]}
                                color="blue"
                                colorHover="text-secondary"
                                onClick={onSearch}>
                            <Icon name={icon} size="xs" />
                        </Button>
                    </div>
                </Input>
            </div>
        )
    }

    const updateDisplayValue = newValue => {
        inputRef.current.value = newValue;
        inputGhostRef.current.value = newValue;
    }

    const handleResultsShow = () => {
        inputGhostRef.current?.focus();
        inputGhostRef.current.value = inputRef.current?.value;
        wrapperRef.current.classList.add('InputSearch--active');
        updateDisplayValue('');
    }

    const handleResultsHide = () => {
        wrapperRef.current.classList.remove('InputSearch--active');
        console.log({ lastResultTitle });
        updateDisplayValue(lastResultTitle);
    }

    const handleChange = result => {
        updateDisplayValue(result.title);
        lastResultTitle = result.title;
        emitEvent(onChange, { result });
    }

    const onSearch = async () => {
        const results = (await handleSearch(inputRef.current?.value || inputGhostRef.current?.value));

        return setResults(results.map(result => {
            return {
                ...result,
                callback: () => handleChange(result)
            }
        }))
    }
    
    // useOutsideListener(inputRef, e => {
    //     if(wrapperRef.current && wrapperRef.current.contains(e.target))
    //         return;

    //     if(inputGhostRef.current && inputGhostRef.current.contains(e.target))
    //         return;

    //     handleInputFocusOut();
    // })

    return (
        <>
            <Input type="search" accent={accent} className={className} ref={wrapperRef}>
                <div className="input-group" ref={triggerRef}>
                    <InputText 
                        ref={inputRef}
                        placeholder={placeholder} />
                    <Button 
                            variant="primary-invert" 
                            accent={['primary', 900]}
                            color="blue"
                            colorHover="text-secondary"
                            onClick={onSearch}>
                        <Icon name={icon} size="xs" />
                    </Button>
                </div>
                <ContextMenu 
                    items={results}
                    triggerRef={triggerRef}
                    position={[100,0]}
                    header={renderHeader()}
                    onShow={handleResultsShow}
                    onHide={handleResultsHide}
                    className="InputSearch__results" />
            </Input>
        </>
    )   
}

// const InputSearch = ({ handleSearch, onChange, placeholder, className, accent, debounceDelay = 100 }) => {
//     const [ items, setItems ] = useState([]);
//     const [ hasFocus, setHasFocus ] = useState(false);
    
//     const inputRef = useRef(null);

//     if(placeholder == undefined)
//         placeholder = useTranslate('generic.action.search');

//     const renderGhost = () => {
//         return (
//             <Inert className="input-group input-search-ghost">
//                 <InputText placeholder={placeholder} />
//                 <Button>
                    
//                 </Button>
//             </Inert>
//         );
//     }

//     useOutsideListener(inputRef, () => {
//         setHasFocus(false);
//     });

//     const renderInput = () => {
//         return (
//             <>
//                 <InputText 
//                     ref={inputRef}
//                     onInput={handleInput}
//                     onClick={() => setHasFocus(true)}
//                     placeholder={placeholder}
//                     className={`input-group ${hasFocus ? 'focus' : ''}`}
//                     icon="fal.search"
//                     accent={accent} />
//                 {hasFocus ? renderGhost() : null}
//             </>
//         )
//     }

//     const handleInput = debounce(e => {
//         updateResults(e);
//     }, debounceDelay);

//     const updateResults = async e => {
//         const results = await handleSearch(e.target.value);

//         const newItems = results.map(result => {
//             return {
//                 ...result,
//                 callback: () => emitEvent(onChange, {target: { value: result.value }})
//             }
//         })

//         return setItems(newItems);
//     };

//     const noResultsItem = {
//         id: 'inputSearch.noResults'
//     }

//     return (
//         <Input type="search" accent={accent} className={className}>
//             <ContextMenu
//                 trigger={renderInput()} 
//                 items={items.length == 0 ? [noResultsItem] : items} 
//                 position={[100, 0]} 
//                 variant="input-search-results" />
//         </Input>
//     )
// }

export default InputSearch;