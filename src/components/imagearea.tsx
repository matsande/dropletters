import * as React from 'react';

export interface ImageAreaProps {
    src: string;
}

export class ImageArea extends React.Component<ImageAreaProps, {}> {
    constructor(props: ImageAreaProps) {
        super(props);
    }
    
    
    render() {
        return (
            <div className='image-area-container'>
                <div style={{backgroundImage: `url(${this.props.src})`}}/>
            </div>
        );
    }
}