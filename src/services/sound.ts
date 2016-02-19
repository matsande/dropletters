
import {Howl} from 'howler';
import {PlaySound} from '../common/commands';

export enum SoundIdentity {
    LetterPlaced,
    WordComplete,
};

interface SoundDescriptor {
    identity: SoundIdentity;
    urls: Array<string>;
}

interface Sound {
    identity: SoundIdentity;
    howl: Howl;
}

export class SoundManager {
    
    private soundDescriptors: Array<SoundDescriptor>;
    private sounds: {[identity: number]: Sound};
    
    constructor() {
                
        this.soundDescriptors = [
            { identity: SoundIdentity.LetterPlaced, urls: ['/res/audio/letter_placed.mp3']},
            { identity: SoundIdentity.WordComplete, urls: ['/res/audio/word_complete.mp3']},
        ];       
        
        PlaySound.define({
           execute: id => {
               this.sounds[id].howl.play();
           },
           canExecute: id => {
               return !!this.sounds[id];
           } 
        });
    }
    
    initialize() {
        this.sounds = {};
        return new Promise<any>((res, rej) => {
            const soundsLoading = this.soundDescriptors.map(descr => this.createSound(descr));
            Promise.all(soundsLoading).then(sounds => {               
                
                sounds.forEach(sound => {
                    this.sounds[sound.identity] = sound;                    
                });
            })
            .then(() => res())
            .catch(err => rej(err));            
        });
    }
    
    
    private createSound(descriptor: SoundDescriptor): Promise<Sound> {
        return new Promise<Sound>((res, rej) => {
            try {                
                const identity = descriptor.identity;
                const howl = new Howl({ 
                    autoplay: false, 
                    urls: descriptor.urls,
                    onload: () => {
                        res({identity, howl});                        
                    },
                    onloaderror: () => {
                        rej(new Error(`Unable to load sound from ${descriptor.urls}`));
                    },                   
                });
                
            } catch (err) {
                rej(err);
            }
        });
    }
}


