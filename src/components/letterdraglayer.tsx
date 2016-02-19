import * as React from 'react';
import * as dnd from 'react-dnd';

import {Letter} from './letter';
import {LetterDescriptor} from '../common/domain';
import {LetterSize} from './domain';


interface LetterDragLayerProps {
    isDragging?: boolean;
    currentOffset?: dnd.ClientOffset;
    initialOffset?: dnd.ClientOffset;
    descriptor?: LetterDescriptor;
    size: LetterSize;
}

class LetterDragLayerComponent extends React.Component<LetterDragLayerProps, {}> {

    private static containerStyle = {
        position: 'fixed',
        pointerEvents: 'none',
        left: 0,
        top: 0,
        zIndex: 100,
        width: '100%',
        height: '100%',
    };


    constructor(props: LetterDragLayerProps) {
        super(props);
    }

    render() {

        const {isDragging, initialOffset, currentOffset, descriptor, size} = this.props;

        const drag = isDragging && (initialOffset !== null);

        if (!drag) {
            return null;
        }

        const {x, y} = currentOffset;

        const itemStyle = {
            transform: `translate(${x}px, ${y}px)`,
        };

        return (
            <div style={LetterDragLayerComponent.containerStyle}>
                <div style={itemStyle}>
                    <Letter descriptor={descriptor} size={size}/>
                    </div>
                </div>
        );
    }
}


function dragLayerCollect(monitor: dnd.DragLayerMonitor) {
    return {
        descriptor: monitor.getItem(),
        initialOffset: monitor.getInitialSourceClientOffset(),
        currentOffset: monitor.getSourceClientOffset(),
        isDragging: monitor.isDragging()
    };
}

export const LetterDragLayer = dnd.DragLayer<LetterDragLayerProps>(dragLayerCollect)(LetterDragLayerComponent);