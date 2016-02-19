import * as React from 'react';
import * as dnd from 'react-dnd';

import {LetterDescriptor} from '../common/domain';
import {LetterSize} from './domain';

export interface LetterProps {
    key?: string;    
    isDragging?: boolean;
    size: LetterSize;
    descriptor: LetterDescriptor;
}

export class Letter extends React.Component<LetterProps, {}> {
    constructor(props: LetterProps) {
        super(props);
    }

    render() {
        const {isDragging, descriptor} = this.props;
        const style = this.createStyle(descriptor, isDragging);
        
        return <div className='letter noselect' style={style}>{descriptor.char}</div>;
    }

    private createStyle(descriptor: LetterDescriptor, isDragging: boolean) {
        let style = null;
        
        const size = this.props.size;
        
        style = {
            width: `${size.width}px`,
            height: `${size.height}px`,
            lineHeight: `${size.height}px`,
            fontSize: `${Math.round(size.height * 0.66)}px`,
            opacity: isDragging ? 0.2 : 1.0,  
            color: `hsl(${descriptor.colorIndex}, 70%, 70%)`,
            textShadow: '1px 1px 2px #444'          
        };        

        return style;
    }
}
