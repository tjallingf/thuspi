const Show = ({ when, fallback = '', children }) => {
    return when ? children : fallback;
}

export default Show;