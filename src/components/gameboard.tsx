import * as React from 'react';
import * as dnd from 'react-dnd';
import dndbackend from 'react-dnd-touch-backend';

import {WordTarget} from './wordtarget';
import {LetterSource} from './lettersource';
import {ImageArea} from './imagearea';

import {LetterContainer, LetterTargetDescriptor} from '../common/domain';
import {MoveNext} from '../common/commands';
import {LetterDragLayer} from './letterdraglayer';
import {Button} from './button';
import {LetterSize} from './domain';

export interface GameBoardProps {
    imgSource: string;
    lettersource: LetterContainer[];
    lettertarget: LetterTargetDescriptor[];    
    done: boolean;
}

class GameBoard extends React.Component<GameBoardProps, {}> {
    constructor(props: GameBoardProps) {
        super(props);
    }


    render() {

        const {lettersource, lettertarget, imgSource, done} = this.props;
        const letterSize = this.calculateLetterSize(lettersource.length, 10);
        const imageArea = imgSource ? <ImageArea src={imgSource}/> : null;
        const sourceOrNext = done
            ? <NextButtonArea onClick={this.onNextClicked.bind(this)}/>
            : <LetterSource containers={lettersource} size={letterSize}/>;

        return (
            <div className='gameboard-container'>
                <div className='gameboard-top-area' style={{flexDirection: imageArea ? 'column' : 'column-reverse'}}>
                    {imageArea}
                    {sourceOrNext}
                </div>
                <div className='gameboard-bottom-area'>
                    <WordTarget target={lettertarget} size={letterSize} done={done}/>
                </div>
                <LetterDragLayer size={letterSize} />
            </div>
        );
    }

    private calculateLetterSize(wordLength: number, margin: number): LetterSize {

        const width = Math.round((window.innerWidth / (wordLength + 4)) + margin);
        const height = width;

        return { width, height };
    }
    
    private onNextClicked() {
        MoveNext.execute({});        
    }
}

class NextButtonArea extends React.Component<{onClick: () => void}, {}> {
    
    private nextArea: HTMLElement;
    
    constructor(props: {onClick: () => void}) {
        super(props);
    }
    
    componentDidMount() {
        
        window.requestAnimationFrame(() => {
            this.nextArea.classList.add('gameboard-next-area-reveal');    
        });           
    }
    
    render() {       
        
        return (            
            <div className='gameboard-next-area' ref={nextArea => this.nextArea = nextArea}> 
                <Button
                    className='gameboard-next-area-button' 
                    icon='res/image/icon/ic_skip_next_black_48dp_2x.png' 
                    onClick={this.props.onClick}/>
            </div>   
        );        
    }
}


// TODO: Make less of a hack
var tmp: any = dndbackend;
const backend = tmp({ enableMouseEvents: true });

export const GameBoardHost = dnd.DragDropContext<GameBoardProps>(backend)(GameBoard);