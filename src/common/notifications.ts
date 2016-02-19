
import {NotificationBroker, Notification} from './notificationbroker';
import {LetterDescriptor, LetterContainer, LetterTargetDescriptor} from './domain';

enum NotificationIdentity {
    LetterStoreUpdated,
    AllDone,
    SubjectStoreUpdated    
}

const notificationBroker = new NotificationBroker<NotificationIdentity>();

function createNotification<T>(identity: NotificationIdentity) {
    return new Notification<NotificationIdentity, T>(notificationBroker, identity);
}

function createNotificationNoArg(identity: NotificationIdentity) {
    return new Notification<NotificationIdentity, {}>(notificationBroker, identity);
}

export const LetterStoreUpdated = createNotification<{sources: LetterContainer[], targets: LetterTargetDescriptor[], letterPlaced: boolean}>(NotificationIdentity.LetterStoreUpdated);
export const AllDone = createNotificationNoArg(NotificationIdentity.AllDone);
export const SubjectStoreUpdated = createNotificationNoArg(NotificationIdentity.SubjectStoreUpdated);