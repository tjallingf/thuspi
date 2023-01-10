import '../../styles/components/LoadingIcon.scss';
import { createIconNode } from '../../app/functions';

/** 
 * Please update the client/index.html file accordingly when
 * making changes to the return statement of this component. 
 */ 

const LoadingIcon = ({ size, center, className, label, delay }) => {
    const el = createIconNode({ library: 'app', name: 'LoadingIcon', size, classList: className });

    const styles = {};
    if(delay != undefined) styles['--LoadingIcon-fade-animation-delay'] = `${delay}ms`;

    return (
        <div 
            className={`${el.classList} LoadingIcon ${center ? 'LoadingIcon--center' : ''}`}
            style={styles}>
            <svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M480 256C480 379.712 379.712 480 256 480C132.288 480 32 379.712 32 256C32 132.288 132.288 32 256 32C379.712 32 480 132.288 480 256Z" stroke="none" strokeWidth="64"/>
            </svg>
            <div className="LoadingIcon__label">
                {label}
            </div>
        </div>
    )
}

export default LoadingIcon;