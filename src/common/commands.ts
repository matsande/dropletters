
import {CommandBroker, Command} from './commandbroker';
import {LetterDescriptor, LetterTargetDescriptor, SubjectData} from './domain';
import {SoundIdentity} from '../services/sound';

enum CommandIdentity {
    PlaceLetter,
    SetWord,
    EditSubject,
    AddSubject,
    SetSubjects,
    DeleteSubject,
    SaveSubjects,
    MoveNext,
    PlaySound,
}

const commandBroker = new CommandBroker<CommandIdentity>(identity => CommandIdentity[identity]);

function createCommand<T, R>(identity: CommandIdentity) {
    return new Command<CommandIdentity, T, R>(commandBroker, identity);
}

export const PlaceLetter = createCommand<{source: LetterDescriptor, target: LetterTargetDescriptor}, void>(CommandIdentity.PlaceLetter);
export const SetWord = createCommand<string, void>(CommandIdentity.SetWord);

// TODO: Figure out how to create more flexible with regards to optional arg/result type
// I'd say wait for https://github.com/Microsoft/TypeScript/issues/2175 to be solved, then make the arg optional and res = void <T, R = void>
export const EditSubject = createCommand<{ identity: number, data: SubjectData}, void>(CommandIdentity.EditSubject);
export const AddSubject = createCommand<{}, void>(CommandIdentity.AddSubject);
export const SetSubjects = createCommand<Array<SubjectData>, void>(CommandIdentity.SetSubjects);
export const DeleteSubject = createCommand<number, void>(CommandIdentity.DeleteSubject);
export const SaveSubjects = createCommand<{}, {}>(CommandIdentity.SaveSubjects);
export const MoveNext = createCommand<{}, {}>(CommandIdentity.MoveNext);
export const PlaySound = createCommand<SoundIdentity, {}>(CommandIdentity.PlaySound);


