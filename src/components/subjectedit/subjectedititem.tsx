import * as React from 'react';

import {Button} from '../button';
import {SubjectData} from '../../common/domain';


export interface SubjectEditProps {
    subject: SubjectData;
    save: (identity: number, subject: SubjectData) => void;
    cancel: () => void;
}

export class SubjectEditItem extends React.Component<SubjectEditProps, {}> {
    
    private word: string;
    private url: string;
    
    constructor(props: SubjectEditProps) {
        super(props);
    } 
    
    render() {
        
        const subject = this.props.subject;
        this.word = subject.word;
        this.url = subject.imageUrl;
        
        return (
            <div className='subject-list-edit-container'>
                <div className='subject-list-edit-inputs'>
                    <div className='subject-list-edit-label'>WORD</div>
                    <input 
                        className='subject-list-edit-input' 
                        type='text' 
                        defaultValue={subject.word} 
                        onChange={ev => this.word = ev.target['value']}/>
                    <div className='subject-list-edit-label'>IMAGE URL</div>
                    <input 
                        className='subject-list-edit-input' 
                        type='text' 
                        defaultValue={subject.imageUrl} 
                        onChange={ev => this.url = ev.target['value']}/>
                </div>
                <div className='subject-list-edit-controls'>
                    <Button 
                        icon='/res/image/icon/ic_cancel_black_24dp_2x.png' 
                        label='cancel'
                        className='subject-list-edit-controls-button' 
                        onClick={this.onEditCancelClick.bind(this)}/>
                    <Button 
                        icon='/res/image/icon/ic_save_black_24dp_2x.png' 
                        label='save'
                        className='subject-list-edit-controls-button'
                        onClick={this.onEditSaveClick.bind(this)}/>
                </div>
              </div>  
        );
    }
    
    private onEditCancelClick() {
        this.props.cancel();
    }
    
    private onEditSaveClick() {        
        const identity = this.props.subject.identity;
        const data : SubjectData = {identity: 0, word: this.word, imageUrl: this.url};
               
        this.props.save(identity, data);
    }    
}