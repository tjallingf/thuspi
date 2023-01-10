import { emitEvent } from '../app/functions';

const SilentForm = ({ children, onSubmit }) => {
    const handleSubmit = e => {
        e.preventDefault();
        emitEvent(onSubmit, e);
        return false;
    }

    return (
        <form 
                className="w-100 h-100" 
                onSubmit={handleSubmit}>
            {children}</form>
    )
}

export default SilentForm;