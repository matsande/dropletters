import {PlaceLetter, SetWord} from '../common/commands';
import {LetterStoreUpdated, AllDone} from '../common/notifications';
import {LetterDescriptor, LetterContainer, LetterTargetDescriptor} from '../common/domain';




export class LetterStore {

    private sources: LetterContainer[];
    private targets: LetterTargetDescriptor[];
    private _done: boolean;

    constructor() {
        this._done = false;
        PlaceLetter.define({ execute: arg => this.placeLetter(arg.source, arg.target) });
        SetWord.define({ execute: word => this.setWord(word) });
    }

    get letterSources() {
        return this.sources;
    }

    get letterTargets() {
        return this.targets;
    }
    
    get done() {
        return this._done;
    }

    private setWord(word: string) {
        
        if (word === undefined || word === null) {
            throw new Error('Cannot set undefined word');
        }  
        
        const wordLength = word.length;     
        
        const letters: Array<LetterDescriptor> = 
            Array.prototype.map.call(word, char => char.toUpperCase())
            .map((char, index) => ({char, index, colorIndex: Math.floor(index * (360 / wordLength))}));
            
        // TODO: Consider handling edge-case where letters gets randomized to correct positions..            
        this.sources = this.shuffle(letters).map<LetterContainer>(letter => ({ letter }));
        this.targets = letters.map(letter => ({ expected: letter, letter: null}));       

        this._done = false;

        LetterStoreUpdated.publish({ sources: this.sources, targets: this.targets, letterPlaced: false });
    }

    private placeLetter(letter: LetterDescriptor, target: LetterTargetDescriptor) {       
        
        const validMove = !target.letter && target.expected.char === letter.char;
        
        if (validMove) {
            var sourceIndex = this.findSourceContainerIndex(letter);
            if (sourceIndex >= 0) {
                this.sources[sourceIndex] = { letter: undefined };
                this.targets[target.expected.index] = Object.assign({}, target, {letter});
                LetterStoreUpdated.publish({sources: this.sources, targets: this.targets, letterPlaced: true});
                
                if (this.targets.every(t => !!t.letter)) {
                    this._done = true;
                    AllDone.publish();
                }
                
            } else {
                console.warn(`Unable to find sourcecontainer for ${letter.char}@${letter.index}`);
            }
        }            
    }
    
    private findSourceContainerIndex(letter: LetterDescriptor) : number {
        
        let sourceIndex = -1;
        for (let i = 0; i < this.sources.length; ++i) {
            const source = this.sources[i];
            if (source.letter && source.letter.index === letter.index) {
                sourceIndex = i;
                break;
            }
        }
        
        return sourceIndex;
    }

    // TODO: Move to external module
    private shuffle<T>(array: Array<T>, inplace: boolean = false) {
        let target = [];

        if (inplace) {
            target = array;
        } else {
            array.forEach(item => target.push(item));
        }

        let remaining = array.length;

        while (remaining > 0) {
            let idx = Math.floor(Math.random() * remaining--);

            let tmp = target[remaining];
            target[remaining] = target[idx];
            target[idx] = tmp;
        }

        return target;
    }
}

