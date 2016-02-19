import * as React from 'react';

import * as dnd from 'react-dnd';

import { LetterDescriptor, LetterTargetDescriptor } from '../common/domain';
import { PlaceLetter } from '../common/commands';
import { Letter } from './letter';
import { LetterSize } from './domain';

export interface WordTargetProps {
    target: LetterTargetDescriptor[];
    size: LetterSize;
    done: boolean;
}

export class WordTarget extends React.Component<WordTargetProps, {}> {
    constructor(props: WordTargetProps) {
        super(props);
    }
    
    
    render() {
        const {target, size, done} = this.props;        
        const letterTargets = target.map(desc => <LetterTargetDrop size={size} target={desc} key={desc.expected.index.toString()}/>);
        const className = 'word-target'  + (done ? ' word-target-done' : ''); 
        
        return (
            <div className={className}>
                {letterTargets}
            </div>
        );       
    }
}


const letterTarget: dnd.DropTargetSpec<LetterTargetProps> = {
    drop(props: LetterTargetProps, monitor: dnd.DropTargetMonitor) {
                
        const source = monitor.getItem() as LetterDescriptor;
        const target = props.target; 
        
        PlaceLetter.execute({source, target});
    }
};

function collect(connect: dnd.DropTargetConnector, monitor: dnd.DropTargetMonitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver(),
        dropData: monitor.getItem()
    }
}


interface LetterTargetProps {
    key?: string;
    connectDropTarget?: dnd.ConnectDropTarget,
    isOver?:boolean;
    dropData?: LetterDescriptor;
    target: LetterTargetDescriptor;
    size: LetterSize;
}

class LetterTarget extends React.Component<LetterTargetProps, {}> {
    constructor(props: LetterTargetProps) {
        super(props);
    }
    
    render() {
        const {key, connectDropTarget, isOver, target, size, dropData} = this.props;
        
        const backgroundColorClass = this.getBackgroundColor(isOver, target, dropData);
        
        const outerSize = size.width + 10;
        const style = {            
            width: `${outerSize}px`,
            height: `${outerSize}px`   
        };     
                
        const letter = !!target.letter  
            ? <Letter size={size} descriptor={target.letter}/>
            : null;
            
        return connectDropTarget(
            <div className={`letter-target ${backgroundColorClass}`} style={style}>
                {letter}
            </div>
        );
    }
    
    private getBackgroundColor(isOver: boolean, target: LetterTargetDescriptor, dropData: LetterDescriptor) {
        let colorClass = 'letter-unknown-bg';
        
        if (isOver) {
            colorClass = (target.expected.char === dropData.char && !target.letter) ? 'letter-valid-bg' : 'letter-invalid-bg';
        } else if (target.letter) {
            colorClass = 'letter-valid-bg';
        }
        
        return colorClass;
    }
}

const LetterTargetDrop = dnd.DropTarget('LETTER', letterTarget, collect)(LetterTarget);




