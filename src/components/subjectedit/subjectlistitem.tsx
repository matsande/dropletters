import * as React from 'react';

import {Button} from '../button';
import {SubjectData} from '../../common/domain';

import {DeleteSubject} from '../../common/commands';

export interface SubjectListItemProps {
    subject: SubjectData;
    editItem: (editSubject: SubjectData) => void;
    key?: any;
} 

export class SubjectListItem extends React.Component<SubjectListItemProps, {}> {
    constructor(props: SubjectListItemProps) {
        super(props);
    }
    
    render() {
        
        const {word, imageUrl} = this.props.subject;
        
        return (
          <li className={'subject-list-item'}>
            <img src={imageUrl} className='subject-list-item-img'/>
            <div className='subject-list-item-word'>{word}</div>
            <div className='subject-list-item-controls'>
                <Button 
                    icon='/res/image/icon/ic_edit_black_24dp_1x.png' 
                    className='subject-list-item-control-button' 
                    onClick={this.onEditClicked.bind(this)}/>
                <Button 
                    icon='/res/image/icon/ic_delete_black_24dp_1x.png' 
                    className='subject-list-item-control-button' 
                    onClick={this.onDeleteClicked.bind(this)}/>
            </div>
          </li>  
        );
    }
    
    private onEditClicked() {
                
        this.props.editItem(this.props.subject);
    }
    
    private onDeleteClicked() {
        
        DeleteSubject.execute(this.props.subject.identity);
    }
}