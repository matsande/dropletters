import * as React from 'react';
import * as ReactDOM from 'react-dom';

import {LetterStore} from './data/letterstore';
import {SubjectStore, LocalStorageSubjectPersistance} from './data/subjectstore';
import {LetterStoreUpdated, AllDone, SubjectStoreUpdated} from './common/notifications';
import {SetWord, MoveNext, PlaySound, SetSubjects} from './common/commands';
import {Scaffold} from './components/scaffold';
import {SoundManager, SoundIdentity} from './services/sound';
import {SubjectData} from './common/domain';

class Application {

    private subjectStore: SubjectStore;
    private selectedSubject: SubjectData;
    private selectedSubjectIndex: number;
    private letterStore: LetterStore;
    private soundManager: SoundManager;

    constructor() {
        MoveNext.define({
            execute: _ => {
                this.moveNext();
            },
            canExecute: _ => {
                return this.letterStore && this.letterStore.done;
            }
        });
    }

    start() {

        this.bootstrap()
            .then(() => this.soundManager.initialize())
            .then(() => this.render(this.letterStore, this.selectedSubject))
            .catch(err => {
                console.error('Initialization error', err);
                alert(`Initialization error: ${err}`);
            });
    }

    private render(store: LetterStore, subject: SubjectData) {

        ReactDOM.render(React.createElement(Scaffold, {
            sources: store.letterSources,
            targets: store.letterTargets,
            subjects: this.subjectStore.subjects,
            imgSource: subject.imageUrl,
            done: store.done,
        }), document.getElementById('root'));
    }

    private bootstrap() {


        window.onbeforeunload = () => {
            return 'Really leave?';
        };

        window.addEventListener('resize', () => {
            this.render(this.letterStore, this.selectedSubject);
        });

        this.soundManager = new SoundManager();
        this.letterStore = new LetterStore();
        this.subjectStore = new SubjectStore(new LocalStorageSubjectPersistance());

        return this.subjectStore.initialize()
            .then(() => {
                if (this.subjectStore.subjects.length <= 0) {
                    
                    console.log('Using default subjects');                  
                    SetSubjects.execute([
                        { word: 'cat', imageUrl: '/res/image/cat.jpg', identity: -1 },
                        { word: 'dog', imageUrl: '/res/image/dog.jpg', identity: -1 }
                    ]);
                }

                this.selectSubject(0);
                SetWord.execute(this.selectedSubject.word);
            })
            .then(() => {
                this.initializeSubscriptions();
            });
    }

    private initializeSubscriptions() {
        
        LetterStoreUpdated.subscribe(notificationData => {
            if (notificationData.letterPlaced) {
                PlaySound.execute(SoundIdentity.LetterPlaced);
            }
            this.render(this.letterStore, this.selectedSubject);
        });

        SubjectStoreUpdated.subscribe(() => {
            if (this.subjectStore.subjects.length > 0) {
                this.selectSubject(0);
                SetWord.execute(this.selectedSubject.word);
            } else {
                this.render(this.letterStore, this.selectedSubject);
            }
        });

        AllDone.subscribe(() => {
            PlaySound.execute(SoundIdentity.WordComplete);
            this.render(this.letterStore, this.selectedSubject);
        });
    }

    private selectSubject(index: number) {
        if (index < this.subjectStore.subjects.length) {
            this.selectedSubjectIndex = index;
            this.selectedSubject = this.subjectStore.subjects[index];
        } else {
            throw new Error(`Invalid subject index: ${index}`);
        }
    }

    private moveNext() {
        const next = this.selectedSubjectIndex + 1;
        if (next < this.subjectStore.subjects.length) {
            this.selectSubject(next);
        } else if (this.subjectStore.subjects.length > 0) {
            this.selectSubject(0);
        } else {
            throw new Error(`No subjects available for moveNext`);
        }

        SetWord.execute(this.selectedSubject.word);
        this.render(this.letterStore, this.selectedSubject);
    }
}

const app = new Application();
app.start();