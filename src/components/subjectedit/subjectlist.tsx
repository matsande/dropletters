
import * as React from 'react';

import {Button} from '../button';
import {SubjectData} from '../../common/domain';

import {EditSubject, AddSubject, SaveSubjects} from '../../common/commands';

import {SubjectListItem} from './subjectlistitem';
import {SubjectEditItem} from './subjectedititem';


export interface SubjectListProps {
    subjects: SubjectData[];
    done?: () => void;
}

export interface SubjectListState {
    editSubject?: SubjectData;
}


export class SubjectList extends React.Component<SubjectListProps, SubjectListState> {
    constructor(props: SubjectListProps) {
        super(props);
        
        this.state = {
            editSubject: null
        };        
    }
    
    render() {
        
        let contents = null;
        
        const editSubject = this.state.editSubject;
        
        if (editSubject) {
            contents = <SubjectEditItem subject={editSubject} cancel={this.editCancel.bind(this)} save={this.editSave.bind(this)}/>;
        } else {
            const listItems = this.props.subjects.map(subject => {
                return <SubjectListItem key={subject.identity} subject={subject} editItem={this.editItem.bind(this)}/>
            });
            
            contents = (
                <ul className='subject-list'>
                    {listItems}
                </ul>
            );
        }       
        
        return (
          <div className='subject-list-container'>
            <div className='subject-list-inner'>
                {contents}    
            </div>
            <div className='subject-list-controls'>
                <Button 
                    icon='res/image/icon/ic_add_box_black_24dp_2x.png' 
                    label={'add'} 
                    className='subject-list-control-button'
                    enabled={!editSubject}
                    onClick={this.onAddClicked.bind(this)}/>
                <Button 
                    icon='res/image/icon/ic_save_black_24dp_2x.png' 
                    label={'save'}
                    className='subject-list-control-button'
                    enabled={!editSubject} 
                    onClick={this.onSaveClicked.bind(this)}/>
            </div>
          </div>  
        );
    }
    
    
    private onAddClicked() {
        
        AddSubject.execute({});
    }
    
    private onSaveClicked() {
        
        SaveSubjects.execute({})
            .then(() => {
                if (this.props.done) {
                    this.props.done();
                }
            });
    }
    
    private editItem(editSubject: SubjectData) {
        this.setState(Object.assign({}, this.state, {editSubject}));
    }
    
    private editCancel() {
        this.setState(Object.assign({}, this.state, {editSubject: null}));
    }
    
    private editSave(identity: number, data: SubjectData) {
        EditSubject.execute({identity, data})
            .then(() => this.editCancel());     
    }   
}
