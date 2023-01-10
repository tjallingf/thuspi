const Repeat = ({ amount = 2, children }) => {
    return (
        [...Array(parseFloat(amount))].map(() => (
            children
        ))
    );
}

export default Repeat;