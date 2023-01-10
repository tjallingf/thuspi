const Inert = (props) => {
    return <div inert="" tabIndex="-1" {...props}>{props.children}</div>
}

export default Inert;