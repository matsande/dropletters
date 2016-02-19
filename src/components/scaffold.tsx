
import * as React from 'react';
import {GameBoardHost} from './gameboard';
import {Button} from './button';
import {Menu} from './menu';
import {Overlay} from './overlay';
import {SubjectList} from './subjectedit/subjectlist';
import {LetterContainer, LetterTargetDescriptor, SubjectData} from '../common/domain';
import {LetterSize} from './domain';

// TODO: Tidy, should not mimic the props of GameBoardHost
export interface ScaffoldProps {
    imgSource: string;    
    sources: LetterContainer[];
    targets: LetterTargetDescriptor[];
    subjects: SubjectData[];
    done: boolean;
}

interface ScaffoldState {
    menuVisible: boolean;
    subjectEditVisible: boolean;
}


export class Scaffold extends React.Component<ScaffoldProps, ScaffoldState> {
    
    constructor(props: ScaffoldProps) {
        super(props);
        
        this.state = {
            menuVisible: false,
            subjectEditVisible: false,
        };
    }    
    
    render() {      
        
        const {imgSource, sources, targets, subjects, done} = this.props;        
               
        return (
            <div className='scaffold'>
                <Overlay visible={this.state.menuVisible} onClickHandler={this.onOverlayClicked.bind(this)}/>
                <Menu visible={this.state.menuVisible}>
                    <Button icon='/res/image/icon/ic_edit_black_24dp_2x.png' label={'edit'} onClick={this.onEditButtonClicked.bind(this)}/>
                </Menu>
                
                <Button className='menu-button' icon='/res/image/icon/ic_menu_black_24dp_2x.png' onClick={this.onMenuButtonClicked.bind(this)}/>               
                
                <GameBoardHost imgSource={imgSource} lettersource={sources} lettertarget={targets} done={done}/>
                
                <Overlay visible={this.state.subjectEditVisible} onClickHandler={this.onEditOverlayClicked.bind(this)}>
                    <SubjectList subjects={subjects} done={this.subjectListHide.bind(this)}/>
                </Overlay>
            </div>
        );
    }
    
    private onMenuButtonClicked() {
                
        const menuVisible = !this.state.menuVisible;
        this.setState(Object.assign({}, this.state, {menuVisible}))
    }
    
    private onOverlayClicked() {        
        this.setState(Object.assign({}, this.state, {menuVisible: false}));
    }
    
    private onEditOverlayClicked() {        
        this.setState(Object.assign({}, this.state, {subjectEditVisible: false}));
    }
    
    private onEditButtonClicked() {        
        this.setState(Object.assign({}, this.state, {menuVisible: false, subjectEditVisible: true}));
    }
    
    private subjectListHide() {
        this.setState(Object.assign({}, this.state, {subjectEditVisible: false}));
    }
}