import { createIconNode } from '../../app/functions';
import '../../styles/components/Icon.scss';

const Icon = ({name, src, color, size, rotate, className, inline, alt = '', library }) => {
    const el = createIconNode({ name, src, color, size, rotate, classList: className, inline, library });

    if(el.nodeName.toLowerCase() === 'img') {
        return (
            <img alt={alt} className={el.classList} src={el.src} style={{transform: el.style.transform}} />
        );
    } else {
        return (
            <span className={el.classList} style={{transform: el.style.transform, color: el.style.color}}>{el.text}</span>
        );
    }
}

export default Icon;