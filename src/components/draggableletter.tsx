
import * as React from 'react';
import * as dnd from 'react-dnd';

import {Letter, LetterProps} from './letter';

interface LetterDragContainerProps extends LetterProps {
    connectDragSource?: dnd.DragElementWrapper<dnd.DragSourceOptions>;
}


class LetterDragContainer extends React.Component<LetterDragContainerProps, {}> {
    constructor(props: LetterDragContainerProps) {
        super(props);
    }


    render() {
        const {connectDragSource, isDragging, descriptor, size} = this.props;

        return connectDragSource(
            <div>
                <Letter size={size} descriptor={descriptor} isDragging={isDragging}/>
            </div>
        );
    }
}

const lettersSource: dnd.DragSourceSpec<LetterProps> = {    
    beginDrag: props => {

        return props.descriptor;
    }
}

function collect(connect: dnd.DragSourceConnector, monitor: dnd.DragSourceMonitor) {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    };
}

export const DraggableLetter = dnd.DragSource('LETTER', lettersSource, collect)(LetterDragContainer);