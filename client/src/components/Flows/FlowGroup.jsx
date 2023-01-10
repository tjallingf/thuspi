import FlowBlockAdd from './FlowBlockAdd';

const FlowGroup = ({ children }) => {
    return (
        <div className="flow-group flex-row">
            {children}
            <FlowBlockAdd />
        </div>
    )
}

export default FlowGroup;