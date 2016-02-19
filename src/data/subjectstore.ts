
import {SubjectStoreUpdated} from '../common/notifications';
import {EditSubject, AddSubject, DeleteSubject, SaveSubjects} from '../common/commands';
import {SubjectData} from '../common/domain';


class Subject implements SubjectData {

    constructor(private _word: string, private _imageUrl: string, private _identity: number) {
    }

    get word() {
        return this._word;
    }

    get imageUrl() {
        return this._imageUrl;
    }

    get identity() {
        return this._identity;
    }
}

export interface SubjectPersistance {
    save(subjects: SubjectData[]): Promise<{}>;
    load(): Promise<SubjectData[]>;
}

export class LocalStorageSubjectPersistance implements SubjectPersistance {

    private static key = '_subject_persistance_';

    save(subjects: SubjectData[]) {
        
        return new Promise((res, rej) => {
            
            try {
                const storeSubjects = subjects.map(subj => ({
                    word: subj.word,
                    identity: subj.identity,
                    imageUrl: subj.imageUrl
                }));

                window.localStorage.setItem(LocalStorageSubjectPersistance.key, JSON.stringify(storeSubjects));
                res();
            }
            catch (err) {
                rej(err);
            }
        });
    }

    load() {
        
        return new Promise((res, rej) => {
            
            try {
                const source = <string>window.localStorage.getItem(LocalStorageSubjectPersistance.key);
                const subjects = source ? JSON.parse(source) : [];
                res(subjects);
            }
            catch (err) {
                rej(err);
            }
        });
    }
}


export class SubjectStore {
    private _subjects: Subject[];
    private nextIdentity: number;

    constructor(private persistance: SubjectPersistance) {
        
        this.nextIdentity = 0;

        AddSubject.define({
            execute: _ => this.addSubject()
        });

        EditSubject.define({
            execute: args => this.editSubject(args.identity, args.data)
        });

        DeleteSubject.define({
            execute: identity => this.deleteSubject(identity)
        });

        SaveSubjects.define({
            execute: _ => {
                return this.persistance.save(this.subjects);
            }
        });
    }

    get subjects() {
        
        return this._subjects;
    }

    initialize(): Promise<any> {
        
        this.nextIdentity = 0;
        return this.persistance.load().then(subjects => {
            if (subjects && subjects.length > 0) {
                
                this._subjects = subjects.map(subj => new Subject(subj.word, subj.imageUrl, this.getNextIdentity()));
            } else {
                console.log('Initialize with defaults');
                
                // defaults
                this._subjects = [
                    new Subject('viktor', '/res/image/test_image.png', this.getNextIdentity()),
                    new Subject('mats', '', this.getNextIdentity())
                ];
            }
        });
    }

    private addSubject() {
        
        this._subjects.push(new Subject('', '', this.getNextIdentity()));
        SubjectStoreUpdated.publish();
    }

    private deleteSubject(identity: number) {
        
        const index = this.findSubjectIndex(subj => subj.identity === identity);
        if (index >= 0) {
            this._subjects.splice(index, 1);
            SubjectStoreUpdated.publish();
        } else {
            console.warn(`[DELETE] Unable to find subject with identity: ${identity}`);
        }
    }

    private editSubject(identity: number, subject: SubjectData) {
        
        const index = this.findSubjectIndex(subj => subj.identity === identity);
        if (index >= 0) {
            this._subjects[index] = new Subject(subject.word, subject.imageUrl, identity);
            SubjectStoreUpdated.publish();
        } else {
            console.warn(`[EDIT] Unable to find subject with identity: ${identity}`);
        }

    }

    private getNextIdentity() {
        
        // Yup, pretty naive atm
        return this.nextIdentity++;
    }

    private findSubjectIndex(predicate: (subject: Subject) => boolean) {
        
        let index = -1;
        for (let i = 0; i < this.subjects.length; ++i) {
            if (predicate(this._subjects[i])) {
                index = i;
                break;
            }
        }

        return index;
    }
}