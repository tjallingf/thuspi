import React from 'react';

export interface IPageProps {
    id: string,
    children?: React.ReactNode
}

const Page: React.FunctionComponent<IPageProps> = ({
    id, children
}) => {
    return (
        <div className="Page" id={id}>
            {children}
        </div>
    )
}

export default Page;