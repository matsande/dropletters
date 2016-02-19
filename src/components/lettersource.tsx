import * as React from 'react';

import {DraggableLetter} from './draggableletter';
import {LetterDescriptor, LetterContainer} from '../common/domain';
import {LetterSize} from './domain';

export interface LetterSourceProps {
    containers: LetterContainer[];
    size: LetterSize;
}

export class LetterSource extends React.Component<LetterSourceProps, {}> {
    constructor(props: LetterSourceProps) {
        super(props);
    }
    
    render() {
                
        const size = this.props.size;
        const letterContainers = this.props.containers            
            .map((container, idx) => {
                
                const letter = container.letter 
                    ? <DraggableLetter size={size} descriptor={container.letter} key={`${container.letter.char}:${idx}`} />
                    : <div style={{width: `${size.width}px`, height: `${size.height}px`}}/>
                    
                return <div className='letter-source-container' key={idx}>{letter}</div>;
                    
            }); 
                
        return (
            <div className='letter-source'>
                {letterContainers}
            </div>
        );
    }
}