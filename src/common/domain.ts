
export interface LetterDescriptor {
    char: string;
    index: number;
    colorIndex: number;   
}

export interface LetterContainer {
    letter?: LetterDescriptor;
}

export interface LetterTargetDescriptor extends LetterContainer {
    expected: LetterDescriptor;    
}

export interface SubjectData {
    word: string;
    imageUrl: string;
    identity: number;
}

